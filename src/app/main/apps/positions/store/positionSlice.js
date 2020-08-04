import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import FuseUtils from '@fuse/utils';

export const getPosition = createAsyncThunk('positionsApp/position/getPosition', async (params) => {
  console.log(params);
  const response = await axios.get('positions/'+params.positionId);

  const data = await response.data.data;

  return data === undefined ? null : data;
});

export const removePosition = createAsyncThunk(
  'positionsApp/position/removePosition',
  async (val, { dispatch, getState }) => {
    const { id } = getState().positionsApp.position;
    await axios.delete('positions/'+id);

    return id;
  }
);

export const savePosition = createAsyncThunk(
  'positionsApp/position/savePosition',
  async (postData, { dispatch, getState }) => {
    const { position } = getState().positionsApp;
    let url = "";
    let response = "";
    if (postData.encryption_id) {
      url = 'positions/'+postData.encryption_id;
      response = await axios.put(url, postData);
    } else {
      url = 'positions';
      response = await axios.post(url, postData);
    }
    
    const data = await response.data;

    console.log(data)
    return data;
  }
);

const positionSlice = createSlice({
  name: 'positionsApp/position',
  initialState: null,
  reducers: {
    resetPosition: () => null,
    newPosition: {
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
    [getPosition.fulfilled]: (state, action) => action.payload,
    [savePosition.fulfilled]: (state, action) => action.payload,
    [removePosition.fulfilled]: (state, action) => null,
  },
});

export const { newPosition, resetPosition } = positionSlice.actions;

export default positionSlice.reducer;
