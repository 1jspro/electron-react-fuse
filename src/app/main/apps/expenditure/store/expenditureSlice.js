import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import FuseUtils from '@fuse/utils';

export const getCategories = createAsyncThunk('expendituresApp/expenditure/getCategories', async () => {
  const response = await axios.get('expenditure-categories', {});

  const data = await response.data.data.expenditureCategoryData;

  return data;
});

export const getExpenditure = createAsyncThunk('expendituresApp/expenditure/getExpenditure', async (params) => {
  console.log(params);
  const response = await axios.get('expenditures/'+params.expenditureId);

  const data = await response.data.data;

  return data === undefined ? null : data;
});

export const removeExpenditure = createAsyncThunk(
  'expendituresApp/expenditure/removeExpenditure',
  async (val, { dispatch, getState }) => {
    const { id } = getState().expendituresApp.expenditure;
    await axios.delete('expenditures/'+id);

    return id;
  }
);

export const saveExpenditure = createAsyncThunk(
  'expendituresApp/expenditure/saveExpenditure',
  async (postData, { dispatch, getState }) => {
    const { expenditure } = getState().expendituresApp;
    let url = "";
    let response = "";
    if (postData.encryption_id) {
      url = 'expenditures/'+postData.encryption_id;
      response = await axios.put(url, postData);
    } else {
      url = 'expenditures';
      response = await axios.post(url, postData);
    }
    
    const data = await response.data;

    console.log(data)
    return data;
  }
);

const expenditureSlice = createSlice({
  name: 'expendituresApp/expenditure',
  initialState: null,
  reducers: {
    getCategories: (state, action) => action.payload,
    resetExpenditure: () => null,
    newExpenditure: {
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
    [getExpenditure.fulfilled]: (state, action) => action.payload,
    [saveExpenditure.fulfilled]: (state, action) => action.payload,
    [removeExpenditure.fulfilled]: (state, action) => null,
  },
});

export const { newExpenditure, resetExpenditure } = expenditureSlice.actions;

export default expenditureSlice.reducer;
