import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import FuseUtils from '@fuse/utils';

export const getAllGroup = createAsyncThunk('groupDataListApp/levels/getAllGroup', async (postData, { dispatch, getState }) => {
  let user = getState().auth.user;
  const permissions = (user && user.data && user.data.permissions) ? user.data.permissions : [];

  let response;
  let data;
  if (permissions.indexOf("groups:create") > -1) {
    response = await axios.post('groups');
    data = await response.data.data.group;
  } else {
    response = await axios.get('levelResponse/'+user.data.level_id);
    data = await response.data.data;
  }


  return data;
});

export const getAllParentGroup = createAsyncThunk('groupDataListApp/parent_levels/getAllParentGroup', async (postData, { dispatch, getState }) => {
  const response = await axios.get('groupUpdate/'+postData.parent_id, {});

  const data = await response.data.data;

  const parents = await data.parents;

  let dataList = {};
  for (const key in parents) {
    let parent = parents[key];
    dataList[parent.level_id] = [];
    let end_url = parent.level_id;

    if (parent.parent_id) {
      end_url += "/"+parent.parent_id;
    }
    const response = await axios.get('groupResponse/'+end_url, {});
    dataList[parent.level_id] = response.data.data;
  }

  return {data, dataList};
});

export const getFlowGroup = createAsyncThunk('groupDataListApp/flow_levels/getFlowGroup', async (postData, { dispatch, getState }) => {
  const response = await axios.get('levelResponse/'+postData.level_id, {});

  const data = await response.data.data;

  return data;
});

export const getFlowGroupData = createAsyncThunk('groupDataListApp/flow_levels_data/getFlowGroupData', async (postData, { dispatch, getState }) => {
  let end_url = postData.level_id;

  if (postData.parent_id) {
    end_url += "/"+postData.parent_id;
  }

  const response = await axios.get('groupResponse/'+end_url, {});

  const data = await response.data.data;

  return data;
});

export const getGroup = createAsyncThunk('groupDataListApp/group/getGroup', async (params) => {
  const response = await axios.get('groups/'+params.dataId);

  const data = await response.data.data;

  return data === undefined ? null : data;
});

export const removeGroup = createAsyncThunk(
  'groupDataListApp/group/removeGroup',
  async (val, { dispatch, getState }) => {
    const { id } = getState().groupDataListApp.group;
    await axios.delete('groups/'+id);

    return id;
  }
);

export const saveGroup = createAsyncThunk(
  'groupDataListApp/group/saveGroup',
  async (postData, { dispatch, getState }) => {
    const { group } = getState().groupDataListApp;
    let url = "";
    let response = "";
    if (postData?.encryption_id) {
      url = 'groups/'+postData.encryption_id;
      response = await axios.put(url, postData);
    } else {
      url = 'groups';
      response = await axios.post(url, postData);
    }
    const data = await response.data;
    return data;
  }
);

const groupSlice = createSlice({
  name: 'groupDataListApp/group',
  initialState: null,
  reducers: {
    getAllParentGroup: (state, action) => action.payload,
    getAllGroup: (state, action) => action.payload,
    getFlowGroup: (state, action) => action.payload,
    resetGroup: () => null,
    newGroup: {
      reducer: (state, action) => action.payload,
      prepare: (event) => ({
        payload: {
          id: '',
          name: '',
        },
      }),
    },
  },
  extraReducers: {
    [getGroup.fulfilled]: (state, action) => action.payload,
    [saveGroup.fulfilled]: (state, action) => action.payload,
    [removeGroup.fulfilled]: (state, action) => null,
  },
});

export const { newGroup, resetGroup } = groupSlice.actions;

export default groupSlice.reducer;
