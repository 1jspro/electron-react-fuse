import { createEntityAdapter, createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const getSummaryData = createAsyncThunk('SummaryApp/summary/getSummaryData', async (postData, { dispatch, getState }) => {
  let user = getState().auth.user;
  let apiUrl = `summary${(postData.levelId) ? `/${postData.levelId}` : ``}`;

  const response = await axios.get(apiUrl);
  const data = await response.data.data;

  return data;
});

export const getDynamicFields = createAsyncThunk('SummaryApp/summary/getDynamicFields', async (postData, { dispatch, getState }) => {
  let user = getState().auth.user;
  let apiUrl = `dynamic_field_details?record_id=${(postData.record_id) ? `${postData.record_id}` : ``}`;

  const response = await axios.get(apiUrl);
  const data = await response.data;

  return data;
});

export const getLevelSummaryData = createAsyncThunk('SummaryApp/summary/getLevelSummaryData', async (postData, { dispatch, getState }) => {
  let user = getState().auth.user;
  let apiUrl = "level_summary";

  const response = await axios.get(apiUrl);
  const data = await response.data.data;

  return data;
});

export const getIncomeSummary = createAsyncThunk('SummaryApp/summary/getIncomeSummary', async (postData) => {
  postData = postData ? postData : {start_date:'', end_date:''}
  const response = await axios.get('income-summary?start_date='+(postData.start_date)+'&end_date='+postData.end_date);
  const data = await response.data.data;
  return data;
});

export const getExpenditureSummary = createAsyncThunk('SummaryApp/summary/getExpenditureSummary', async (postData) => {
  postData = postData ? postData : {start_date:'', end_date:''}
  const response = await axios.get('expenditure-summary?start_date='+(postData.start_date)+'&end_date='+postData.end_date);
  const data = await response.data.data;
  return data;
});

const summaryMembersAdapter = createEntityAdapter({});

export const { selectEntities: selectMembers, selectById: selectMemberById } =
  summaryMembersAdapter.getSelectors((state) => state.SummaryApp.summary);

const summarySlice = createSlice({
  name: 'SummaryApp/summary',
  initialState: summaryMembersAdapter.getInitialState({
    searchText: '',
  }),
  reducers: {
    setFieldsSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || '' }),
    },
  },

  extraReducers: {
    [getSummaryData.fulfilled]: summaryMembersAdapter.setAll,
    [getLevelSummaryData.fulfilled]: summaryMembersAdapter.setAll,
    [getIncomeSummary.fulfilled]: summaryMembersAdapter.setAll,
    [getExpenditureSummary.fulfilled]: summaryMembersAdapter.setAll,
    [getDynamicFields.fulfilled]: summaryMembersAdapter.setAll,
  },
});

export const { setFieldsSearchText } = summarySlice.actions

export default summarySlice.reducer;
