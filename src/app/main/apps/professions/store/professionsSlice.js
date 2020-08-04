import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'axios';

export const getAllProfessions = createAsyncThunk('professionsApp/professions/getAllProfessions', async (postData, { dispatch, getState }) => {
  const response = await axios.get('professions');

  const data = await response.data.data.professionData;

  return data;
});


export const getProfessions = createAsyncThunk('professionsApp/professions/getProfessions', async (postData) => {
  postData = postData ? postData : {page:0, rowsPerPage:100, searchText: ''}
  const response = await axios.get('professions?page='+(postData.page+1)+'&limit='+postData.rowsPerPage+'&search='+postData.searchText);

  const data = await response.data.data;
  data.professionData = data.professionData.map((a) => {
    a.totalRecords = Number(data.Count);
    return a;
  });

  return data.professionData;

});

export const removeProfessions = createAsyncThunk(
  'professionsApp/professions/removeProfessions',
  async (professionIds, { dispatch, getState }) => {
    let created_by = getState().auth.user.uuid;
    let Idstr = professionIds.encryptedIds;
    const response = await axios.delete('professions/'+Idstr);
    let data = response.data;
    data.professionIds = [professionIds.ids];
    return data;
  }
);

const professionAdapter = createEntityAdapter({});

export const { selectAll: selectProfessions, selectById: selectProfessionById } =
  professionAdapter.getSelectors((state) => state.professionsApp.professions);

const professionsSlice = createSlice({
  name: 'professionsApp/professions',
  initialState: professionAdapter.getInitialState({
    searchText: '',
  }),
  reducers: {
    setProfessionsSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || '' }),
    },
  },
  extraReducers: {
    [getAllProfessions.fulfilled]: (state, action) => {},
    [getProfessions.fulfilled]: professionAdapter.setAll,
    [removeProfessions.fulfilled]: (state, action) =>
      professionAdapter.removeMany(state, action.payload.professionIds),
  },
});

export const { setProfessionsSearchText } = professionsSlice.actions;

export default professionsSlice.reducer;
