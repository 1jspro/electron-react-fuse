import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import FuseUtils from '@fuse/utils';

export const getCategory = createAsyncThunk('incomeCategoriesApp/category/getCategory', async (params) => {
  console.log(params);
  const response = await axios.get('income-categories/'+params.categoryId);

  const data = await response.data.data;

  return data === undefined ? null : data;
});

export const removeCategory = createAsyncThunk(
  'incomeCategoriesApp/category/removeCategory',
  async (val, { dispatch, getState }) => {
    const { id } = getState().incomeCategoriesApp.category;
    await axios.delete('income-categories/'+id);

    return id;
  }
);

export const saveCategory = createAsyncThunk(
  'incomeCategoriesApp/category/saveCategory',
  async (postData, { dispatch, getState }) => {
    const { category } = getState().incomeCategoriesApp;
    let url = "";
    let response = "";
    if (postData.encryption_id) {
      url = 'income-categories/'+postData.encryption_id;
      response = await axios.put(url, postData);
    } else {
      url = 'income-categories';
      response = await axios.post(url, postData);
    }
    
    const data = await response.data;

    console.log(data)
    return data;
  }
);

const categorySlice = createSlice({
  name: 'incomeCategoriesApp/category',
  initialState: null,
  reducers: {
    resetCategory: () => null,
    newCategory: {
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
    [getCategory.fulfilled]: (state, action) => action.payload,
    [saveCategory.fulfilled]: (state, action) => action.payload,
    [removeCategory.fulfilled]: (state, action) => null,
  },
});

export const { newCategory, resetCategory } = categorySlice.actions;

export default categorySlice.reducer;
