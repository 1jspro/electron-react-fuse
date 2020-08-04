import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'axios';


export const getAllEducationLevels = createAsyncThunk('educationLevelsApp/educationLevels/getAllEducationLevels', async (postData, { dispatch, getState }) => {
  const response = await axios.get('education-levels');

  const data = await response.data.data.educationLevelData;

  return data;
});
export const getEducationLevels = createAsyncThunk('educationLevelsApp/educationLevels/getEducationLevels', async (postData) => {
  postData = postData ? postData : {page:0, rowsPerPage:100, searchText: ''}
  const response = await axios.get('education-levels?page='+(postData.page+1)+'&limit='+postData.rowsPerPage+'&search='+postData.searchText);

  let data = await response.data.data;

  data.educationLevelData = data.educationLevelData.map((a) => {
    a.totalRecords = Number(data.Count);
    return a;
  });

  return data.educationLevelData;

});

export const removeEducationLevels = createAsyncThunk(
  'educationLevelsApp/educationLevels/removeEducationLevels',
  async (levelIds, { dispatch, getState }) => {
    let created_by = getState().auth.user.uuid;
    let Idstr = levelIds.encryptedIds;
    const response = await axios.delete('education-levels/'+Idstr);
    let data = response.data;
    data.levelIds = [levelIds.ids];
    return data;
  }
);

const educationLevelAdapter = createEntityAdapter({});

export const { selectAll: selectLevels, selectById: selectLevelById } =
  educationLevelAdapter.getSelectors((state) => state.educationLevelsApp.educationLevels);

const educationLevelsSlice = createSlice({
  name: 'educationLevelsApp/educationLevels',
  initialState: educationLevelAdapter.getInitialState({
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
    [getAllEducationLevels.fulfilled]: (state, action) => {},
    [getEducationLevels.fulfilled]: educationLevelAdapter.setAll,
    [removeEducationLevels.fulfilled]: (state, action) =>
      educationLevelAdapter.removeMany(state, action.payload.levelIds),
  },
});

export const { setLevelsSearchText } = educationLevelsSlice.actions;

export default educationLevelsSlice.reducer;
