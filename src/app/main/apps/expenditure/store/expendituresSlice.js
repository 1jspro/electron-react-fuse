import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'axios';

export const getAllExpenditures = createAsyncThunk('expendituresApp/expenditures/getAllExpenditures', async (postData, { dispatch, getState }) => {
  const response = await axios.get('expenditures');

  const data = await response.data.data.expenditureData;

  return data;
});

export const getExpenditures = createAsyncThunk('expendituresApp/expenditures/getExpenditures', async (postData) => {
  postData = postData ? postData : {page:0, rowsPerPage:100, searchText: ''}
  const response = await axios.get('expenditures?page='+(postData.page+1)+'&limit='+postData.rowsPerPage+'&search='+postData.searchText);

  const data = await response.data.data;
  data.expenditureData = data.expenditureData.map((a) => {
    a.totalRecords = Number(data.Count);
    return a;
  });

  return data.expenditureData;
});

export const removeExpenditures = createAsyncThunk(
  'expendituresApp/expenditures/removeExpenditures',
  async (expenditureIds, { dispatch, getState }) => {
    let created_by = getState().auth.user.uuid;
    let Idstr = expenditureIds.encryptedIds;
    const response = await axios.delete('expenditures/'+Idstr);
    let data = response.data;
    data.expenditureIds = [expenditureIds.ids];
    return data;
  }
);

const expenditureAdapter = createEntityAdapter({});

export const { selectAll: selectExpenditures, selectById: selectExpenditureById } =
  expenditureAdapter.getSelectors((state) => state.expendituresApp.expenditures);

const expendituresSlice = createSlice({
  name: 'expendituresApp/expenditures',
  initialState: expenditureAdapter.getInitialState({
    searchText: '',
  }),
  reducers: {
    setExpendituresSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || '' }),
    },
  },
  extraReducers: {
    [getExpenditures.fulfilled]: expenditureAdapter.setAll,
    [getAllExpenditures.fulfilled]: (state, action) => {},
    [removeExpenditures.fulfilled]: (state, action) =>
      expenditureAdapter.removeMany(state, action.payload.expenditureIds),
  },
});

export const { setExpendituresSearchText } = expendituresSlice.actions;

export default expendituresSlice.reducer;
