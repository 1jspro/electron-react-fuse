import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'axios';

export const getAllLevelData = createAsyncThunk('levelDataListApp/levelDataList/getAllLevelData', async (postData, { dispatch, getState }) => {
  const response = await axios.get('levels-data');

  const data = await response.data.data.levelData;

  return data;
});

export const getMembers = createAsyncThunk('levelDataListApp/members/getMembers', async (postData, { dispatch, getState }) => {
  const response = await axios.post('members-for-admin', postData);

  const data = await response.data.data;

  return data;
});

export const assignAdmin = createAsyncThunk('levelDataListApp/admin/assignAdmin', async (postData, { dispatch, getState }) => {
  const response = await axios.post('member-admin', postData);

  const data = await response.data;

  return data;
});


export const getLevelDataList = createAsyncThunk('levelDataListApp/levelDataList/getLevelDataList', async (postData) => {
  postData = postData ? postData : {page:0, rowsPerPage:100, searchText: ''}
  const response = await axios.get('levels-data?page='+(postData.page+1)+'&limit='+postData.rowsPerPage+'&search='+postData.searchText);

  const data = await response.data.data;
  data.levelData = data.levelData.map((a) => {
    a.totalRecords = Number(data.Count);
    return a;
  });

  return data.levelData;

});

export const removeLevelDataList = createAsyncThunk(
  'levelDataListApp/levelDataList/removeLevelDataList',
  async (dataIds, { dispatch, getState }) => {
    let created_by = getState().auth.user.uuid;
    let Idstr = dataIds.encryptedIds;
    const response = await axios.delete('levels-data/'+Idstr);
    let data = response.data;
    data.dataIds = [dataIds.ids];
    return data;
  }
);

const leveldataAdapter = createEntityAdapter({});

export const { selectAll: selectLevelDataList, selectById: selectLevelDataById } =
  leveldataAdapter.getSelectors((state) => state.levelDataListApp.levelDataList);

const levelDataListSlice = createSlice({
  name: 'levelDataListApp/levelDataList',
  initialState: leveldataAdapter.getInitialState({
    searchText: '',
  }),
  reducers: {
    setLevelDataListSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || '' }),
    },
  },
  extraReducers: {
    [getAllLevelData.fulfilled]: (state, action) => {},
    [getMembers.fulfilled]: (state, action) => {},
    [assignAdmin.fulfilled]: (state, action) => {},
    [getLevelDataList.fulfilled]: leveldataAdapter.setAll,
    [removeLevelDataList.fulfilled]: (state, action) =>
      leveldataAdapter.removeMany(state, action.payload.dataIds),
  },
});

export const { setLevelDataListSearchText } = levelDataListSlice.actions;

export default levelDataListSlice.reducer;
