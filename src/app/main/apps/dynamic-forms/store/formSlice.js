import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import FuseUtils from '@fuse/utils';

export const getFields = createAsyncThunk('formsApp/fields/getFields', async () => {
  const response = await axios.get('input-fields', {});

  const data = await response.data.data.inputFieldsData;

  return data;
});

export const getForm = createAsyncThunk('formsApp/form/getForm', async (params) => {
  console.log(params);
  const response = await axios.get('dynamic-forms/'+params.formId);

  const data = await response.data.data;

  return data === undefined ? null : data;
});

export const removeForm = createAsyncThunk(
  'formsApp/form/removeForm',
  async (val, { dispatch, getState }) => {
    const { id } = getState().formsApp.form;
    await axios.delete('dynamic-forms/'+id);

    return id;
  }
);

export const saveForm = createAsyncThunk(
  'formsApp/form/saveForm',
  async (postData, { dispatch, getState }) => {
    const { form } = getState().formsApp;

    let pData = {
      name: postData['name'] ? postData['name'] : "",
      label: postData['label'] ? postData['label'] : "",
      input_id: postData['input_id'] ? postData['input_id'] : "",
      is_active: postData['is_active'] ? 1 : 0,
      option: (postData.options && postData.options.length > 0) ? (postData.options) : "",
    }


    let url = "";
    let response = "";
    if (postData.encryption_id) {
      url = 'dynamic-forms/'+postData.encryption_id;
      response = await axios.put(url, pData);
    } else {
      url = 'dynamic-forms';
      response = await axios.post(url, pData);
    }
    
    const data = await response.data;

    console.log(data)
    return data;
  }
);

const formSlice = createSlice({
  name: 'formsApp/form',
  initialState: null,
  reducers: {
    getFields: (state, action) => action.payload,
    resetForm: () => null,
    newForm: {
      reducer: (state, action) => action.payload,
      prepare: (event) => ({
        payload: {
          id: '',
          name: '',
          is_active: "1",
        },
      }),
    },
  },
  extraReducers: {
    [getForm.fulfilled]: (state, action) => action.payload,
    [saveForm.fulfilled]: (state, action) => action.payload,
    [removeForm.fulfilled]: (state, action) => null,
  },
});

export const { newForm, resetForm } = formSlice.actions;

export default formSlice.reducer;
