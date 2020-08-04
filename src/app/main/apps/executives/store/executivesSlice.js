import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from "@reduxjs/toolkit";
import axios from "axios";

export const getExecutives = createAsyncThunk(
  "executivesApp/executives/getExecutives",
  async (postData, { dispatch, getState }) => {
    let loggedInUser = getState().auth.user.uuid;
    postData = postData ? postData : { searchText: "" };
    const response = await axios.get(
      "executives?search=" + postData.searchText
    );

    let data = await response.data.data;

    data = data.map((d, k) => {
      d.id = k + 0;
      return d;
    });
    return data;
  }
);

const executivesAdapter = createEntityAdapter({});

export const { selectAll: selectExecutives, selectById: selectExecutiveById } =
  executivesAdapter.getSelectors((state) => state.executivesApp.executives);

const executivesSlice = createSlice({
  name: "executivesApp/executives",
  initialState: executivesAdapter.getInitialState({
    searchText: "",
  }),
  reducers: {
    setExecutivesSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
        // console.log(action);
      },
      prepare: (event) => ({ payload: event.target.value || "" }),
    },
  },
  extraReducers: {
    [getExecutives.fulfilled]: executivesAdapter.setAll,
  },
});

export const { setExecutivesSearchText } = executivesSlice.actions;

export default executivesSlice.reducer;
