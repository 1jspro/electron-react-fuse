import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'axios';

export const getAllIntervals = createAsyncThunk('packageIntervalsApp/intervals/getAllIntervals', async (postData, { dispatch, getState }) => {
  const response = await axios.get('package_intervals');

  const data = await response.data.data.intervalData;

  return data;
});


export const getIntervals = createAsyncThunk('packageIntervalsApp/intervals/getIntervals', async (postData) => {
  postData = postData ? postData : {page:0, rowsPerPage:100, searchText: ''}
  const response = await axios.get('package_intervals?page='+(postData.page+1)+'&limit='+postData.rowsPerPage+'&search='+postData.searchText);

  const data = await response.data.data;
  data.intervalData = data.intervalData.map((a) => {
    a.totalRecords = Number(data.Count);
    return a;
  });

  return data.intervalData;

});

export const removeIntervals = createAsyncThunk(
  'packageIntervalsApp/intervals/removeIntervals',
  async (intervalIds, { dispatch, getState }) => {
    let created_by = getState().auth.user.uuid;
    let Idstr = intervalIds.encryptedIds;
    const response = await axios.delete('package_intervals/'+Idstr);
    let data = response.data;
    data.intervalIds = [intervalIds.ids];
    return data;
  }
);

const intervalAdapter = createEntityAdapter({});

export const { selectAll: selectIntervals, selectById: selectIntervalById } =
  intervalAdapter.getSelectors((state) => state.packageIntervalsApp.intervals);

const intervalsSlice = createSlice({
  name: 'packageIntervalsApp/intervals',
  initialState: intervalAdapter.getInitialState({
    searchText: '',
  }),
  reducers: {
    setIntervalsSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || '' }),
    },
  },
  extraReducers: {
    [getAllIntervals.fulfilled]: (state, action) => {},
    [getIntervals.fulfilled]: intervalAdapter.setAll,
    [removeIntervals.fulfilled]: (state, action) =>
      intervalAdapter.removeMany(state, action.payload.intervalIds),
  },
});

export const { setIntervalsSearchText } = intervalsSlice.actions;

export default intervalsSlice.reducer;
