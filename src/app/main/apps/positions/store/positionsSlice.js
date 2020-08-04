import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'axios';

export const getAllPositions = createAsyncThunk('positionsApp/positions/getAllPositions', async (postData, { dispatch, getState }) => {
  const response = await axios.get('positions');

  const data = await response.data.data.positionData;

  return data;
});


export const getPositions = createAsyncThunk('positionsApp/positions/getPositions', async (postData) => {
  postData = postData ? postData : {page:0, rowsPerPage:100, searchText: ''}
  const response = await axios.get('positions?page='+(postData.page+1)+'&limit='+postData.rowsPerPage+'&search='+postData.searchText);

  const data = await response.data.data;
  data.positionData = data.positionData.map((a) => {
    a.totalRecords = Number(data.Count);
    return a;
  });

  return data.positionData;

});

export const removePositions = createAsyncThunk(
  'positionsApp/positions/removePositions',
  async (positionIds, { dispatch, getState }) => {
    let created_by = getState().auth.user.uuid;
    let Idstr = positionIds.encryptedIds;
    const response = await axios.delete('positions/'+Idstr);
    let data = response.data;
    data.positionIds = [positionIds.ids];
    return data;
  }
);

const positionAdapter = createEntityAdapter({});

export const { selectAll: selectPositions, selectById: selectPositionById } =
  positionAdapter.getSelectors((state) => state.positionsApp.positions);

const positionsSlice = createSlice({
  name: 'positionsApp/positions',
  initialState: positionAdapter.getInitialState({
    searchText: '',
  }),
  reducers: {
    setPositionsSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || '' }),
    },
  },
  extraReducers: {
    [getAllPositions.fulfilled]: (state, action) => {},
    [getPositions.fulfilled]: positionAdapter.setAll,
    [removePositions.fulfilled]: (state, action) =>
      positionAdapter.removeMany(state, action.payload.positionIds),
  },
});

export const { setPositionsSearchText } = positionsSlice.actions;

export default positionsSlice.reducer;
