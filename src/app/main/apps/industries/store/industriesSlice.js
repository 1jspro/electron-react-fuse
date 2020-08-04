import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'axios';


export const getAllIndustries = createAsyncThunk('industriesApp/industries/getAllIndustries', async (postData, { dispatch, getState }) => {
  const response = await axios.get('industries');

  const data = await response.data.data.industryData;

  return data;
});

export const getIndustries = createAsyncThunk('industriesApp/industries/getIndustries', async (postData) => {
  postData = postData ? postData : {page:0, rowsPerPage:100, searchText: ''}
  const response = await axios.get('industries?page='+(postData.page+1)+'&limit='+postData.rowsPerPage+'&search='+postData.searchText);

  const data = await response.data.data;
  data.industryData = data.industryData.map((a) => {
    a.totalRecords = Number(data.Count);
    return a;
  });

  return data.industryData;
});

export const removeIndustries = createAsyncThunk(
  'industriesApp/industries/removeIndustries',
  async (industryIds, { dispatch, getState }) => {
    let created_by = getState().auth.user.uuid;
    let Idstr = industryIds.encryptedIds;
    const response = await axios.delete('industries/'+Idstr);
    let data = response.data;
    data.industryIds = [industryIds.ids];
    return data;
  }
);

const industryAdapter = createEntityAdapter({});

export const { selectAll: selectIndustries, selectById: selectIndustryById } =
  industryAdapter.getSelectors((state) => state.industriesApp.industries);

const industriesSlice = createSlice({
  name: 'industriesApp/industries',
  initialState: industryAdapter.getInitialState({
    searchText: '',
  }),
  reducers: {
    setIndustriesSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || '' }),
    },
  },
  extraReducers: {
    [getIndustries.fulfilled]: industryAdapter.setAll,
    [getAllIndustries.fulfilled]: (state, action) => {},
    [removeIndustries.fulfilled]: (state, action) =>
      industryAdapter.removeMany(state, action.payload.industryIds),
  },
});

export const { setIndustriesSearchText } = industriesSlice.actions;

export default industriesSlice.reducer;
