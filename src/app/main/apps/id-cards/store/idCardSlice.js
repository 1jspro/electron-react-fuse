import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { ipcRenderer } from "electron";

export const getMembers = createAsyncThunk(
  "idCardsApp/members/getMembers",
  async (postData, { dispatch, getState }) => {
    const { user } = getState().auth;
    if (user.role.length === 0) {
      ipcRenderer.send("get-members", postData);
      return await new Promise((res) =>
        ipcRenderer.on("return-members", (event, members) => {
          res(members);
        })
      );
    } else {
      const response = await axios.get("members-all", {});
      const data = await response.data.data.members;
      return data;
    }
  }
);

export const getMembersidcard = createAsyncThunk(
  "idCardsApp/members/getMembersidcard",
  async (postData, { dispatch, getState }) => {
    const { user } = getState().auth;
    if (user.role.length === 0) {
      ipcRenderer.send("get-database", "getMembersidcard");
      return await new Promise((res) =>
        ipcRenderer.on("return-getMembersidcard", (event, members) => {
          res(members);
        })
      );
    } else {
      const response = await axios.get("members-for-idcard", {});
      const data = await response.data.data.members;
      return data;
    }
  }
);

export const getIdCard = createAsyncThunk(
  "idCardsApp/idCard/getIdCard",
  async (params) => {
    const response = await axios.get("id-cards/" + params.cardId);
    const data = await response.data.data;
    return data === undefined ? null : data;
  }
);

export const removeIdCard = createAsyncThunk(
  "idCardsApp/idCard/removeIdCard",
  async (val, { dispatch, getState }) => {
    const { id } = getState().idCardsApp.idCard;
    await axios.delete("id-cards/" + id);
    return id;
  }
);

export const saveIdCard = createAsyncThunk(
  "idCardsApp/idCard/saveIdCard",
  async (postData, { dispatch, getState }) => {
    const { user } = getState().auth;
    const { idCard } = getState().idCardsApp;

    const fdata = {
      member_id: postData.encryption_id
        ? [postData.member_id]
        : postData.members
        ? postData.members
        : "",
      valid_to: postData.valid_to ? postData.valid_to : "",
    };

    let url = "";
    let response = "";

    url = "id-cards";
    if (user.role.length === 0) {
      ipcRenderer.send("generate-card", fdata);
      return fdata;
    } else {
      response = await axios.post(url, fdata);
      return await response.data;
    }
  }
);

const idCardSlice = createSlice({
  name: "idCardsApp/idCard",
  initialState: null,
  reducers: {
    getMembers: (state, action) => action.payload,
    getMembersidcard: (state, action) => action.payload,
    resetIdCard: () => null,
    newIdCard: {
      reducer: (state, action) => action.payload,
      prepare: (event) => ({
        payload: {
          member_id: "",
          valid_to: "",
        },
      }),
    },
  },
  extraReducers: {
    [getIdCard.fulfilled]: (state, action) => action.payload,
    [saveIdCard.fulfilled]: (state, action) => action.payload,
    [removeIdCard.fulfilled]: (state, action) => null,
  },
});

export const { newIdCard, resetIdCard } = idCardSlice.actions;

export default idCardSlice.reducer;
