import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import FuseUtils from '@fuse/utils';

export const getAllLevels = createAsyncThunk('levelDataListApp/levels/getAllLevels', async (postData, { dispatch, getState }) => {
  let user = getState().auth.user;
  const permissions = (user && user.data && user.data.permissions) ? user.data.permissions : [];

  let response;
  let data;
  if (permissions.indexOf("levels:create") > -1) {
    response = await axios.post('all-levels');
    data = await response.data.data.levelData;
  } else {
    response = await axios.get('levelResponse/'+user.data.level_id);
    data = await response.data.data;
  }


  return data;
});

export const getAllParentLevels = createAsyncThunk('levelDataListApp/parent_levels/getAllParentLevels', async (postData, { dispatch, getState }) => {
  const response = await axios.get('levelDataUpdate/'+postData.parent_id, {});

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
    const response = await axios.get('levelDataResponse/'+end_url, {});
    dataList[parent.level_id] = response.data.data;
  }

  return {data, dataList};
});

export const getFlowLevels = createAsyncThunk('levelDataListApp/flow_levels/getFlowLevels', async (postData, { dispatch, getState }) => {
  const response = await axios.get('levelResponse/'+postData.level_id, {});

  const data = await response.data.data;

  return data;
});

export const getFlowLevelsData = createAsyncThunk('levelDataListApp/flow_levels_data/getFlowLevelsData', async (postData, { dispatch, getState }) => {
  let end_url = postData.level_id;

  if (postData.parent_id) {
    end_url += "/"+postData.parent_id;
  }

  const response = await axios.get('levelDataResponse/'+end_url, {});

  const data = await response.data.data;

  return data;
});

export const getLevelData = createAsyncThunk('levelDataListApp/levelData/getLevelData', async (params) => {
  const response = await axios.get('levels-data/'+params.dataId);

  const data = await response.data.data;

  return data === undefined ? null : data;
});

export const removeLevelData = createAsyncThunk(
  'levelDataListApp/levelData/removeLevelData',
  async (val, { dispatch, getState }) => {
    const { id } = getState().levelDataListApp.levelData;
    await axios.delete('levels-data/'+id);

    return id;
  }
);

export const saveLevelData = createAsyncThunk(
  'levelDataListApp/levelData/saveLevelData',
  async (postData, { dispatch, getState }) => {
    const { levelData } = getState().levelDataListApp;
    let url = "";
    let response = "";
    if (postData.encryption_id) {
      url = 'levels-data/'+postData.encryption_id;
      response = await axios.put(url, postData);
    } else {
      url = 'levels-data';
      response = await axios.post(url, postData);
    }
    
    const data = await response.data;

    console.log(data)
    return data;
  }
);

const levelDataSlice = createSlice({
  name: 'levelDataListApp/levelData',
  initialState: null,
  reducers: {
    getAllParentLevels: (state, action) => action.payload,
    getAllLevels: (state, action) => action.payload,
    getFlowLevels: (state, action) => action.payload,
    resetLevelData: () => null,
    newLevelData: {
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
    [getLevelData.fulfilled]: (state, action) => action.payload,
    [saveLevelData.fulfilled]: (state, action) => action.payload,
    [removeLevelData.fulfilled]: (state, action) => null,
  },
});

export const { newLevelData, resetLevelData } = levelDataSlice.actions;

export default levelDataSlice.reducer;
