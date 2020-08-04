import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import FuseUtils from '@fuse/utils';

export const getIndustry = createAsyncThunk('industriesApp/industry/getIndustry', async (params) => {
  console.log(params);
  const response = await axios.get('industries/'+params.industryId);

  const data = await response.data.data;

  return data === undefined ? null : data;
});

export const removeIndustry = createAsyncThunk(
  'industriesApp/industry/removeIndustry',
  async (val, { dispatch, getState }) => {
    const { id } = getState().industriesApp.industry;
    await axios.delete('industries/'+id);

    return id;
  }
);

export const saveIndustry = createAsyncThunk(
  'industriesApp/industry/saveIndustry',
  async (postData, { dispatch, getState }) => {
    const { industry } = getState().industriesApp;
    let url = "";
    let response = "";
    if (postData.encryption_id) {
      url = 'industries/'+postData.encryption_id;
      response = await axios.put(url, postData);
    } else {
      url = 'industries';
      response = await axios.post(url, postData);
    }
    
    const data = await response.data;

    console.log(data)
    return data;
  }
);

const industrySlice = createSlice({
  name: 'industriesApp/industry',
  initialState: null,
  reducers: {
    resetIndustry: () => null,
    newIndustry: {
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
    [getIndustry.fulfilled]: (state, action) => action.payload,
    [saveIndustry.fulfilled]: (state, action) => action.payload,
    [removeIndustry.fulfilled]: (state, action) => null,
  },
});

export const { newIndustry, resetIndustry } = industrySlice.actions;

export default industrySlice.reducer;
