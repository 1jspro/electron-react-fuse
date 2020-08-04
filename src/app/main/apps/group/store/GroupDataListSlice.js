import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from "@reduxjs/toolkit";
import axios from "axios";
import { ipcRenderer } from "electron";

export const getAllGroup = createAsyncThunk(
  "groupListApp/groupList/getAllGroup",
  async (postData, { dispatch, getState }) => {
    // const options = postData
    //   ? {
    //       headers: {
    //         Authorization: `Bearer ${postData.adminId}`,
    //       },
    //     }
    //   : {};
    // const response = await axios.get('groups', options);
    // const data = await response.data.data.groupData;
    // return data;
    ipcRenderer.send("get-database", "groups");
    return await new Promise((res) =>
      ipcRenderer.on("return-groups", (event, members) => {
        res(members);
      })
    );
  }
);

export const getGroupList = createAsyncThunk(
  "groupListApp/groupList/getGroupList",
  async (postData) => {
    postData = postData || { page: 0, rowsPerPage: 100, searchText: "" };
    /* const response = await axios.get('groups?page='+(postData.page+1)+'&limit='+postData.rowsPerPage+'&search='+postData.searchText); */
    const response = await axios.get(`groups?search=${postData.searchText}`);
    const data = await response.data.data;
    data.groupData = data.groupData.map((a) => {
      a.totalRecords = Number(data.Count);
      return a;
    });
    return data.groupData;
  }
);

export const removeGroupList = createAsyncThunk(
  "groupListApp/groupList/removeGroupList",
  async (dataIds, { dispatch, getState }) => {
    const created_by = getState().auth.user.uuid;
    const Idstr = dataIds.encryptedIds;
    const response = await axios.delete(`groups/${Idstr}`);
    const { data } = response;
    data.dataIds = [dataIds.ids];
    return data;
  }
);

const groupAdapter = createEntityAdapter({});

export const { selectAll: selectGroupList, selectById: selectGroupById } =
  groupAdapter.getSelectors((state) => state.GroupListApp.groupListSlice);

const groupListSlice = createSlice({
  name: "groupListApp/groupList",
  initialState: groupAdapter.getInitialState({
    searchText: "",
  }),
  reducers: {
    setGroupListSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || "" }),
    },
  },
  extraReducers: {
    [getAllGroup.fulfilled]: (state, action) => {},
    [getGroupList.fulfilled]: groupAdapter.setAll,
    [removeGroupList.fulfilled]: (state, action) =>
      groupAdapter.removeMany(state, action.payload.dataIds),
  },
});

export const { setGroupListSearchText } = groupListSlice.actions;

export default groupListSlice.reducer;
