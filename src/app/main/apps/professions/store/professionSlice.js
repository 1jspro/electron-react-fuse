import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import FuseUtils from '@fuse/utils';

export const getProfession = createAsyncThunk('professionsApp/profession/getProfession', async (params) => {
  console.log(params);
  const response = await axios.get('professions/'+params.professionId);

  const data = await response.data.data;

  return data === undefined ? null : data;
});

export const removeProfession = createAsyncThunk(
  'professionsApp/profession/removeProfession',
  async (val, { dispatch, getState }) => {
    const { id } = getState().professionsApp.profession;
    await axios.delete('professions/'+id);

    return id;
  }
);

export const saveProfession = createAsyncThunk(
  'professionsApp/profession/saveProfession',
  async (postData, { dispatch, getState }) => {
    const { profession } = getState().professionsApp;
    let url = "";
    let response = "";
    if (postData.encryption_id) {
      url = 'professions/'+postData.encryption_id;
      response = await axios.put(url, postData);
    } else {
      url = 'professions';
      response = await axios.post(url, postData);
    }
    
    const data = await response.data;

    console.log(data)
    return data;
  }
);

const professionSlice = createSlice({
  name: 'professionsApp/profession',
  initialState: null,
  reducers: {
    resetProfession: () => null,
    newProfession: {
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
    [getProfession.fulfilled]: (state, action) => action.payload,
    [saveProfession.fulfilled]: (state, action) => action.payload,
    [removeProfession.fulfilled]: (state, action) => null,
  },
});

export const { newProfession, resetProfession } = professionSlice.actions;

export default professionSlice.reducer;
