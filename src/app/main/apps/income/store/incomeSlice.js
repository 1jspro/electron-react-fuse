import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import FuseUtils from '@fuse/utils';

export const getCategories = createAsyncThunk('incomesApp/income/getCategories', async () => {
  const response = await axios.get('income-categories', {});

  const data = await response.data.data.categoryData;

  return data;
});

export const getIncome = createAsyncThunk('incomesApp/income/getIncome', async (params) => {
  console.log(params);
  const response = await axios.get('incomes/'+params.incomeId);

  const data = await response.data.data;

  return data === undefined ? null : data;
});

export const removeIncome = createAsyncThunk(
  'incomesApp/income/removeIncome',
  async (val, { dispatch, getState }) => {
    const { id } = getState().incomesApp.income;
    await axios.delete('incomes/'+id);

    return id;
  }
);

export const saveIncome = createAsyncThunk(
  'incomesApp/income/saveIncome',
  async (postData, { dispatch, getState }) => {
    const { income } = getState().incomesApp;
    let url = "";
    let response = "";
    if (postData.encryption_id) {
      url = 'incomes/'+postData.encryption_id;
      response = await axios.put(url, postData);
    } else {
      url = 'incomes';
      response = await axios.post(url, postData);
    }
    
    const data = await response.data;

    console.log(data)
    return data;
  }
);

const incomeSlice = createSlice({
  name: 'incomesApp/income',
  initialState: null,
  reducers: {
    getCategories: (state, action) => action.payload,
    resetIncome: () => null,
    newIncome: {
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
    [getIncome.fulfilled]: (state, action) => action.payload,
    [saveIncome.fulfilled]: (state, action) => action.payload,
    [removeIncome.fulfilled]: (state, action) => null,
  },
});

export const { newIncome, resetIncome } = incomeSlice.actions;

export default incomeSlice.reducer;
