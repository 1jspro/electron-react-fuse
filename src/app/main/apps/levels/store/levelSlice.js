import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import FuseUtils from '@fuse/utils';

export const getAllLevels = createAsyncThunk('levelsApp/parent_levels/getAllLevels', async (postData, { dispatch, getState }) => {
  const response = await axios.post('all-levels');

  const data = await response.data.data.levelData;

  return data;
});

export const getLevel = createAsyncThunk('levelsApp/level/getLevel', async (params) => {
  console.log(params);
  const response = await axios.get('levels/'+params.levelId);

  const data = await response.data.data;

  return data === undefined ? null : data;
});

export const removeLevel = createAsyncThunk(
  'levelsApp/level/removeLevel',
  async (val, { dispatch, getState }) => {
    const { id } = getState().levelsApp.level;
    await axios.delete('levels/'+id);

    return id;
  }
);

export const saveLevel = createAsyncThunk(
  'levelsApp/level/saveLevel',
  async (postData, { dispatch, getState }) => {
    const { level } = getState().levelsApp;
    let url = "";
    let response = "";
    if (postData.encryption_id) {
      url = 'levels/'+postData.encryption_id;
      response = await axios.put(url, postData);
    } else {
      url = 'levels';
      response = await axios.post(url, postData);
    }
    
    const data = await response.data;

    console.log(data)
    return data;
  }
);

const levelSlice = createSlice({
  name: 'levelsApp/level',
  initialState: null,
  reducers: {
    getAllLevels: (state, action) => action.payload,
    resetLevel: () => null,
    newLevel: {
      reducer: (state, action) => action.payload,
      prepare: (event) => ({
        payload: {
          id: '',
          name: '',
          is_active: true,
        },
      }),
    },
  },
  extraReducers: {
    [getLevel.fulfilled]: (state, action) => action.payload,
    [saveLevel.fulfilled]: (state, action) => action.payload,
    [removeLevel.fulfilled]: (state, action) => null,
  },
});

export const { newLevel, resetLevel } = levelSlice.actions;

export default levelSlice.reducer;
