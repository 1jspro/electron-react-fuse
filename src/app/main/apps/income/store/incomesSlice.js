import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'axios';

export const getAllIncomes = createAsyncThunk('incomesApp/incomes/getAllIncomes', async (postData, { dispatch, getState }) => {
  const response = await axios.get('incomes');

  const data = await response.data.data.incomeData;

  return data;
});

export const getIncomes = createAsyncThunk('incomesApp/incomes/getIncomes', async (postData) => {
  postData = postData ? postData : {page:0, rowsPerPage:100, searchText: ''}
  const response = await axios.get('incomes?page='+(postData.page+1)+'&limit='+postData.rowsPerPage+'&search='+postData.searchText);

  const data = await response.data.data;
  data.incomeData = data.incomeData.map((a) => {
    a.totalRecords = Number(data.Count);
    return a;
  });

  return data.incomeData;
});

export const removeIncomes = createAsyncThunk(
  'incomesApp/incomes/removeIncomes',
  async (incomeIds, { dispatch, getState }) => {
    let created_by = getState().auth.user.uuid;
    let Idstr = incomeIds.encryptedIds;
    const response = await axios.delete('incomes/'+Idstr);
    let data = response.data;
    data.incomeIds = [incomeIds.ids];
    return data;
  }
);

const incomeAdapter = createEntityAdapter({});

export const { selectAll: selectIncomes, selectById: selectIncomeById } =
  incomeAdapter.getSelectors((state) => state.incomesApp.incomes);

const incomesSlice = createSlice({
  name: 'incomesApp/incomes',
  initialState: incomeAdapter.getInitialState({
    searchText: '',
  }),
  reducers: {
    setIncomesSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || '' }),
    },
  },
  extraReducers: {
    [getIncomes.fulfilled]: incomeAdapter.setAll,
    [getAllIncomes.fulfilled]: (state, action) => {},
    [removeIncomes.fulfilled]: (state, action) =>
      incomeAdapter.removeMany(state, action.payload.incomeIds),
  },
});

export const { setIncomesSearchText } = incomesSlice.actions;

export default incomesSlice.reducer;
