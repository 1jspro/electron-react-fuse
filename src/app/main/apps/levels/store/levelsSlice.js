import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'axios';

export const getAllLevels = createAsyncThunk('levelsApp/levels/getAllLevels', async (postData, { dispatch, getState }) => {
  const response = await axios.get('levels');

  const data = await response.data.data.levelData;

  return data;
});


export const getLevels = createAsyncThunk('levelsApp/levels/getLevels', async (postData, { dispatch, getState }) => {
  postData = postData ? postData : {page:0, rowsPerPage:100, searchText: ''}
  /*const response = await axios.get('levels?page='+(postData.page+1)+'&limit='+postData.rowsPerPage+'&search='+postData.searchText);

  const data = await response.data.data;
  data.levelData = data.levelData.map((a) => {
    a.totalRecords = Number(data.Count);
    return a;
  });

  return data.levelData;*/

  let user = getState().auth.user;
  const permissions = (user && user.data && user.data.permissions) ? user.data.permissions : [];

  let response;
  let data;
  if (permissions.indexOf("levels:create") > -1) {
    response = await axios.get('levels?page='+(postData.page+1)+'&limit='+postData.rowsPerPage+'&search='+postData.searchText);
    data = await response.data.data;
    data.levelData = data.levelData.map((a) => {
      a.totalRecords = Number(data.Count);
      return a;
    });

    return data.levelData;
  } else {
    response = await axios.get('levelResponse/'+user.data.level_id);
    data = await response.data.data;
    data = data.map((a) => {
      a.totalRecords = data.length;
      return a;
    });
    return data;
  }


});

export const removeLevels = createAsyncThunk(
  'levelsApp/levels/removeLevels',
  async (levelIds, { dispatch, getState }) => {
    let created_by = getState().auth.user.uuid;
    let Idstr = levelIds.encryptedIds;
    const response = await axios.delete('levels/'+Idstr);
    let data = response.data;
    data.levelIds = [levelIds.ids];
    return data;
  }
);

const levelAdapter = createEntityAdapter({});

export const { selectAll: selectLevels, selectById: selectLevelById } =
  levelAdapter.getSelectors((state) => state.levelsApp.levels);

const levelsSlice = createSlice({
  name: 'levelsApp/levels',
  initialState: levelAdapter.getInitialState({
    searchText: '',
  }),
  reducers: {
    setLevelsSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || '' }),
    },
  },
  extraReducers: {
    [getAllLevels.fulfilled]: (state, action) => {},
    [getLevels.fulfilled]: levelAdapter.setAll,
    [removeLevels.fulfilled]: (state, action) =>
      levelAdapter.removeMany(state, action.payload.levelIds),
  },
});

export const { setLevelsSearchText } = levelsSlice.actions;

export default levelsSlice.reducer;
