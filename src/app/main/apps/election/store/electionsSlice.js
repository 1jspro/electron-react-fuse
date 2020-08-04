import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'axios';

export const getAllElections = createAsyncThunk('electionsApp/elections/getAllElections', async (postData, { dispatch, getState }) => {
  const response = await axios.get('election');

  const data = await response.data.data.electionData;

  return data;
});


export const getElections = createAsyncThunk('electionsApp/elections/getElections', async (postData) => {
  postData = postData ? postData : { page: 0, rowsPerPage: 100, searchText: '' }
  const response = await axios.get('election?page=' + (postData.page + 1) + '&limit=' + postData.rowsPerPage + '&search=' + postData.searchText);

  const data = await response.data.data;
  data.electionData = data.electionData.map((a) => {
    a.totalRecords = Number(data.Count);
    return a;
  });

  return data.electionData;

});

export const removeElections = createAsyncThunk(
  'electionsApp/elections/removeElections',
  async (electionIds, { dispatch, getState }) => {
    let created_by = getState().auth.user.uuid;
    let Idstr = electionIds.encryptedIds;
    const response = await axios.delete('election/' + Idstr);
    let data = response.data;
    data.electionIds = [electionIds.ids];
    return data;
  }
);

const electionsAdapter = createEntityAdapter({});

export const { selectAll: selectElections, selectById: selectPositionById } =
  electionsAdapter.getSelectors((state) => state.electionsApp.elections);

const electionsSlice = createSlice({
  name: 'electionsApp/elections',
  initialState: electionsAdapter.getInitialState({
    searchText: '',
  }),
  reducers: {
    setElectionsSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || '' }),
    },
  },
  extraReducers: {
    [getAllElections.fulfilled]: (state, action) => { },
    [getElections.fulfilled]: electionsAdapter.setAll,
    [removeElections.fulfilled]: (state, action) =>
      electionsAdapter.removeMany(state, action.payload.electionIds),
  },
});

export const { setElectionsSearchText } = electionsSlice.actions;

export default electionsSlice.reducer;
