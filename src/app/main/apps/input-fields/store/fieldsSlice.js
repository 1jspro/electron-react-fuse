import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'axios';

export const getAllFields = createAsyncThunk('fieldsApp/fields/getAllFields', async (postData, { dispatch, getState }) => {
  const response = await axios.get('input-fields');

  const data = await response.data.data.inputFieldsData;

  return data;
});


export const getFields = createAsyncThunk('fieldsApp/fields/getFields', async (postData) => {
  postData = postData ? postData : {page:0, rowsPerPage:100, searchText: ''}
  const response = await axios.get('input-fields?page='+(postData.page+1)+'&limit='+postData.rowsPerPage+'&search='+postData.searchText);

  const data = await response.data.data;
  data.inputFieldsData = data.inputFieldsData.map((a) => {
    a.totalRecords = Number(data.Count);
    return a;
  });

  return data.inputFieldsData;
});

export const removeFields = createAsyncThunk(
  'fieldsApp/fields/removeFields',
  async (fieldIds, { dispatch, getState }) => {
    let created_by = getState().auth.user.uuid;
    let Idstr = fieldIds.encryptedIds;
    const response = await axios.delete('input-fields/'+Idstr);
    let data = response.data;
    data.fieldIds = [fieldIds.ids];
    return data;
  }
);

const fieldAdapter = createEntityAdapter({});

export const { selectAll: selectFields, selectById: selectFieldById } =
  fieldAdapter.getSelectors((state) => state.fieldsApp.fields);

const fieldsSlice = createSlice({
  name: 'fieldsApp/fields',
  initialState: fieldAdapter.getInitialState({
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
    [getAllFields.fulfilled]: (state, action) => {},
    [getFields.fulfilled]: fieldAdapter.setAll,
    [removeFields.fulfilled]: (state, action) =>
      fieldAdapter.removeMany(state, action.payload.fieldIds),
  },
});

export const { setFieldsSearchText } = fieldsSlice.actions;

export default fieldsSlice.reducer;
