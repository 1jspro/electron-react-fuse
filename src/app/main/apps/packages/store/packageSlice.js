import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import FuseUtils from '@fuse/utils';

export const getIntervals = createAsyncThunk('packagesApp/packageData/getIntervals', async () => {
  const response = await axios.get('package_intervals', {});

  const data = await response.data.data.intervalData;

  return data;
});

export const getPackage = createAsyncThunk('packagesApp/packageData/getPackage', async (params) => {
  console.log(params);
  const response = await axios.get('packages/'+params.packageId);

  const data = await response.data.data;

  return data === undefined ? null : data;
});

export const removePackage = createAsyncThunk(
  'packagesApp/packageData/removePackage',
  async (val, { dispatch, getState }) => {
    const { id } = getState().packagesApp.packageData;
    await axios.delete('packages/'+id);

    return id;
  }
);

export const savePackage = createAsyncThunk(
  'packagesApp/packageData/savePackage',
  async (postData, { dispatch, getState }) => {
    const { packageData } = getState().packagesApp;
    let url = "";
    let response = "";
    if (postData.encryption_id) {
      url = 'packages/'+postData.encryption_id;
      response = await axios.put(url, postData);
    } else {
      url = 'packages';
      response = await axios.post(url, postData);
    }
    
    const data = await response.data;

    console.log(data)
    return data;
  }
);

const packageSlice = createSlice({
  name: 'packagesApp/packageData',
  initialState: null,
  reducers: {
    getIntervals: (state, action) => action.payload,
    resetPackage: () => null,
    newPackage: {
      reducer: (state, action) => action.payload,
      prepare: (event) => ({
        payload: {
          id: '',
          name: '',
          status: 'active',
        },
      }),
    },
  },
  extraReducers: {
    [getPackage.fulfilled]: (state, action) => action.payload,
    [savePackage.fulfilled]: (state, action) => action.payload,
    [removePackage.fulfilled]: (state, action) => null,
  },
});

export const { newPackage, resetPackage } = packageSlice.actions;

export default packageSlice.reducer;
