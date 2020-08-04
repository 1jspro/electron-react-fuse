import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from "@reduxjs/toolkit";
import axios from "axios";
import { ipcRenderer } from "electron";

export const getLevels = createAsyncThunk(
  "membersApp/levels/getLevels",
  async (postData, { dispatch, getState }) => {
    const { user } = getState().auth;
    if (user.role.length === 0) {
      ipcRenderer.send("get-database", "levelResponse");
      return await new Promise((res) =>
        ipcRenderer.on("return-levelResponse", (event, members) => {
          res(members);
        })
      );
    } else {
      const response = await axios.get(
        `levelResponse/${user.data.level_id}`,
        {}
      );
      const data = await response.data.data;
      return data;
    }
  }
);

export const customExcel = createAsyncThunk(
  "membersApp/levels/customExcel",
  async (postData, { dispatch, getState }) => {
    let user = getState().auth.user;
    const response = await axios.get("customExcel", {});

    const data = await response.data;

    return data;
  }
);

export const getLevelsData = createAsyncThunk(
  "membersApp/levelDataList/getLevelsData",
  async (postData, { dispatch, getState }) => {
    const { user } = getState().auth;

    let end_url = postData.level_id;

    if (postData.parent_id) {
      end_url += `/${postData.parent_id}`;
    }
    const url = `levelDataResponse/${end_url}`;
    if (user.role.length === 0) {
      ipcRenderer.send("get-data", url);
      return await new Promise((res) =>
        ipcRenderer.on(`return-${url}`, (event, members) => {
          res(members);
        })
      );
    } else {
      const response = await axios.get(url, {});

      const data = await response.data.data;

      return data;
    }
  }
);

export const getAllMembers = createAsyncThunk(
  "membersApp/members/getAllMembers",
  async (postData, { dispatch, getState }) => {
    let loggedInUser = getState().auth.user.uuid;
    const response = await axios.get("members");
    const data = await response.data.data.members;
    return data;
  }
);

export const importMembers = createAsyncThunk(
  "membersApp/members/importMembers",
  async (postData, { dispatch, getState }) => {
    let loggedInUser = getState().auth.user.uuid;

    postData.file = postData.file
      ? postData.file.replace(
          "data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;",
          "data:file/xlsx;"
        )
      : "";

    const response = await axios.post("member-import", postData);
    const { data } = response;
    return data;
  }
);

export const exportMembers = createAsyncThunk(
  "membersApp/members/exportMembers",
  async (postData, { dispatch, getState }) => {
    let loggedInUser = getState().auth.user.uuid;

    const response = await axios.post("member-export", postData);

    const data = await response.data;

    return data;
  }
);

export const getMembers = createAsyncThunk(
  "membersApp/members/getMembers",
  async (postData, { dispatch, getState }) => {
    postData = postData
      ? postData
      : { page: 0, rowsPerPage: 100, searchText: "" };
    const { user } = getState().auth;
    if (user.role.length === 0) {
      ipcRenderer.send("get-members", postData);
      return await new Promise((res) =>
        ipcRenderer.on("return-members", (event, members) => {
          res(members);
        })
      );
    } else {
      const response = await axios.get(
        "members?page=" +
          (postData.page + 1) +
          "&limit=" +
          postData.rowsPerPage +
          "&search=" +
          postData.searchText
      );

      let data = await response.data.data;

      data.members = data.members.map((a) => {
        a.totalPage = Number(data.memberCount);
        return a;
      });

      return data.members;
    }
  }
);

export const removeMembers = createAsyncThunk(
  "membersApp/members/removeMembers",
  async (memberIds, { dispatch, getState }) => {
    let created_by = getState().auth.user.uuid;
    let Idstr = memberIds.encryptedIds;
    const response = await axios.delete("members/" + Idstr);
    let data = response.data;
    data.memberIds = [memberIds.ids];

    return data;
  }
);

const membersAdapter = createEntityAdapter({});

export const { selectAll: selectMembers, selectById: selectMemberById } =
  membersAdapter.getSelectors((state) => state.membersApp.members);

const membersSlice = createSlice({
  name: "membersApp/members",
  initialState: membersAdapter.getInitialState({
    searchText: "",
  }),
  reducers: {
    getLevels: (state, action) => action.payload,
    getLevelsData: (state, action) => action.payload,
    customExcel: (state, action) => action.payload,
    setMembersSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
        // console.log(action);
      },
      prepare: (event) => ({ payload: event.target.value || "" }),
    },
  },
  extraReducers: {
    [getMembers.fulfilled]: membersAdapter.setAll,
    [importMembers.fulfilled]: (state, action) => {},
    [exportMembers.fulfilled]: (state, action) => {},
    [getAllMembers.fulfilled]: (state, action) => {},
    [removeMembers.fulfilled]: (state, action) => {
      membersAdapter.removeMany(state, action.payload.memberIds);
    },
  },
});

export const { setMembersSearchText } = membersSlice.actions;

export default membersSlice.reducer;
