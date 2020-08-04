import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import FuseUtils from '@fuse/utils';

export const getField = createAsyncThunk('fieldsApp/field/getField', async (params) => {
  console.log(params);
  const response = await axios.get('input-fields/'+params.fieldId);

  const data = await response.data.data;

  return data === undefined ? null : data;
});

export const removeField = createAsyncThunk(
  'fieldsApp/field/removeField',
  async (val, { dispatch, getState }) => {
    const { id } = getState().fieldsApp.field;
    await axios.delete('input-fields/'+id);

    return id;
  }
);

export const saveField = createAsyncThunk(
  'fieldsApp/field/saveField',
  async (postData, { dispatch, getState }) => {
    const { field } = getState().fieldsApp;
    let url = "";
    let response = "";
    if (postData.encryption_id) {
      url = 'input-fields/'+postData.encryption_id;
      response = await axios.put(url, postData);
    } else {
      url = 'input-fields';
      response = await axios.post(url, postData);
    }
    
    const data = await response.data;

    console.log(data)
    return data;
  }
);

const fieldSlice = createSlice({
  name: 'fieldsApp/field',
  initialState: null,
  reducers: {
    resetField: () => null,
    newField: {
      reducer: (state, action) => action.payload,
      prepare: (event) => ({
        payload: {
          id: '',
          name: '',
          is_active: true,
        },
      }),
    },
  },
  extraReducers: {
    [getField.fulfilled]: (state, action) => action.payload,
    [saveField.fulfilled]: (state, action) => action.payload,
    [removeField.fulfilled]: (state, action) => null,
  },
});

export const { newField, resetField } = fieldSlice.actions;

export default fieldSlice.reducer;
