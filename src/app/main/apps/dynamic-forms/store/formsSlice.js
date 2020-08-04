import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'axios';

export const getAllForms = createAsyncThunk('formsApp/forms/getAllForms', async (postData, { dispatch, getState }) => {
  const response = await axios.get('dynamic-forms');

  const data = await response.data.data.dynamicFormsData;

  return data;
});


export const getForms = createAsyncThunk('formsApp/forms/getForms', async (postData) => {
  postData = postData ? postData : {page:0, rowsPerPage:100, searchText: ''}
  const response = await axios.get('dynamic-forms?page='+(postData.page+1)+'&limit='+postData.rowsPerPage+'&search='+postData.searchText);

  const data = await response.data.data;
  data.dynamicFormsData = data.dynamicFormsData.map((a) => {
    a.totalRecords = Number(data.Count);
    return a;
  });

  return data.dynamicFormsData;
});

export const removeForms = createAsyncThunk(
  'formsApp/forms/removeForms',
  async (formIds, { dispatch, getState }) => {
    let created_by = getState().auth.user.uuid;
    let Idstr = formIds.encryptedIds;
    const response = await axios.delete('dynamic-forms/'+Idstr);
    let data = response.data;
    data.formIds = [formIds.ids];
    return data;
  }
);

const formAdapter = createEntityAdapter({});

export const { selectAll: selectForms, selectById: selectFormById } =
  formAdapter.getSelectors((state) => state.formsApp.forms);

const formsSlice = createSlice({
  name: 'formsApp/forms',
  initialState: formAdapter.getInitialState({
    searchText: '',
  }),
  reducers: {
    setFormsSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || '' }),
    },
  },
  extraReducers: {
    [getAllForms.fulfilled]: (state, action) => {},
    [getForms.fulfilled]: formAdapter.setAll,
    [removeForms.fulfilled]: (state, action) =>
      formAdapter.removeMany(state, action.payload.formIds),
  },
});

export const { setFormsSearchText } = formsSlice.actions;

export default formsSlice.reducer;
