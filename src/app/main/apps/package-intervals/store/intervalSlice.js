import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import FuseUtils from '@fuse/utils';

export const getInterval = createAsyncThunk('packageIntervalsApp/interval/getInterval', async (params) => {
  console.log(params);
  const response = await axios.get('package_intervals/'+params.intervalId);

  const data = await response.data.data;

  return data === undefined ? null : data;
});

export const removeInterval = createAsyncThunk(
  'packageIntervalsApp/interval/removeInterval',
  async (val, { dispatch, getState }) => {
    const { id } = getState().packageIntervalsApp.interval;
    await axios.delete('package_intervals/'+id);

    return id;
  }
);

export const saveInterval = createAsyncThunk(
  'packageIntervalsApp/interval/saveInterval',
  async (postData, { dispatch, getState }) => {
    const { interval } = getState().packageIntervalsApp;
    let url = "";
    let response = "";
    if (postData.encryption_id) {
      url = 'package_intervals/'+postData.encryption_id;
      response = await axios.put(url, postData);
    } else {
      url = 'package_intervals';
      response = await axios.post(url, postData);
    }
    
    const data = await response.data;

    console.log(data)
    return data;
  }
);

const intervalSlice = createSlice({
  name: 'packageIntervalsApp/interval',
  initialState: null,
  reducers: {
    resetInterval: () => null,
    newInterval: {
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
    [getInterval.fulfilled]: (state, action) => action.payload,
    [saveInterval.fulfilled]: (state, action) => action.payload,
    [removeInterval.fulfilled]: (state, action) => null,
  },
});

export const { newInterval, resetInterval } = intervalSlice.actions;

export default intervalSlice.reducer;
