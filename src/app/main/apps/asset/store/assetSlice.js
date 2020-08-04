import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import FuseUtils from '@fuse/utils';

export const getCategories = createAsyncThunk('assetsApp/asset/getCategories', async () => {
  const response = await axios.get('asset-categories', {});

  const data = await response.data.data.categoryData;

  return data;
});

export const getAsset = createAsyncThunk('assetsApp/asset/getAsset', async (params) => {
  console.log(params);
  const response = await axios.get('assets/'+params.assetId);

  const data = await response.data.data;

  return data === undefined ? null : data;
});

export const removeAsset = createAsyncThunk(
  'assetsApp/asset/removeAsset',
  async (val, { dispatch, getState }) => {
    const { id } = getState().assetsApp.asset;
    await axios.delete('assets/'+id);

    return id;
  }
);

export const saveAsset = createAsyncThunk(
  'assetsApp/asset/saveAsset',
  async (postData, { dispatch, getState }) => {
    const { asset } = getState().assetsApp;
    let url = "";
    let response = "";
    if (postData.encryption_id) {
      url = 'assets/'+postData.encryption_id;
      response = await axios.put(url, postData);
    } else {
      url = 'assets';
      response = await axios.post(url, postData);
    }
    
    const data = await response.data;

    console.log(data)
    return data;
  }
);

const assetSlice = createSlice({
  name: 'assetsApp/asset',
  initialState: null,
  reducers: {
    getCategories: (state, action) => action.payload,
    resetAsset: () => null,
    newAsset: {
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
    [getAsset.fulfilled]: (state, action) => action.payload,
    [saveAsset.fulfilled]: (state, action) => action.payload,
    [removeAsset.fulfilled]: (state, action) => null,
  },
});

export const { newAsset, resetAsset } = assetSlice.actions;

export default assetSlice.reducer;
