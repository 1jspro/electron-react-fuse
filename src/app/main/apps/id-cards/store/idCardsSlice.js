import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from "@reduxjs/toolkit";
import axios from "axios";
import { ipcRenderer } from "electron";

export const getIdCardData = createAsyncThunk(
  "idCardsApp/idCardPreview/getIdCardData",
  async (postData, { dispatch, getState }) => {
    const response = await axios.post("create-id-card", {
      member_ids: postData.member_ids,
    });
    const data = await response.data;
    return data;
  }
);
export const getAllIdCards = createAsyncThunk(
  "idCardsApp/idCards/getAllIdCards",
  async (postData, { dispatch, getState }) => {
    const response = await axios.get("id-cards");
    const data = await response.data.data.idCards;
    return data;
  }
);

export const getIdCards = createAsyncThunk(
  "idCardsApp/idCards/getIdCards",
  async (postData, { dispatch, getState }) => {
    postData = postData
      ? postData
      : { page: 0, rowsPerPage: 100, searchText: "" };
    const { user } = getState().auth;
    if (user.role.length === 0) {
      ipcRenderer.send("get-id-cards", postData);
      return await new Promise((res) =>
        ipcRenderer.on("return-id-cards", (event, cards) => {
          res(cards);
        })
      );
    } else {
      const response = await axios.get(
        "id-cards?page=" +
          (postData.page + 1) +
          "&limit=" +
          postData.rowsPerPage +
          "&search=" +
          postData.searchText
      );

      const data = await response.data.data;
      data.idCards = data.idCards.map((a) => {
        a.totalRecords = Number(data.Count);
        return a;
      });
      return data.idCards;
    }
  }
);

export const removeIdCards = createAsyncThunk(
  "idCardsApp/idCards/removeIdCards",
  async (cardIds, { dispatch, getState }) => {
    let created_by = getState().auth.user.uuid;
    let Idstr = cardIds.encryptedIds;
    const response = await axios.delete("id-cards/" + Idstr);
    let data = response.data;
    data.cardIds = [cardIds.ids];
    return data;
  }
);

const idCardAdapter = createEntityAdapter({});

export const { selectAll: selectIdCards, selectById: selectIdCardById } =
  idCardAdapter.getSelectors((state) => state.idCardsApp.idCards);

const idCardsSlice = createSlice({
  name: "idCardsApp/idCards",
  initialState: idCardAdapter.getInitialState({
    searchText: "",
  }),
  reducers: {
    setIdCardsSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || "" }),
    },
  },
  extraReducers: {
    [getAllIdCards.fulfilled]: (state, action) => {},
    [getIdCards.fulfilled]: idCardAdapter.setAll,
    [removeIdCards.fulfilled]: (state, action) =>
      idCardAdapter.removeMany(state, action.payload.cardIds),
  },
});

export const { setIdCardsSearchText } = idCardsSlice.actions;

export default idCardsSlice.reducer;
