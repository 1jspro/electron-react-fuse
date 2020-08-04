import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import FuseUtils from '@fuse/utils';

export const getCategory = createAsyncThunk('expenditureCategoriesApp/category/getCategory', async (params) => {
  console.log(params);
  const response = await axios.get('expenditure-categories/'+params.categoryId);

  const data = await response.data.data;

  return data === undefined ? null : data;
});

export const removeCategory = createAsyncThunk(
  'expenditureCategoriesApp/category/removeCategory',
  async (val, { dispatch, getState }) => {
    const { id } = getState().expenditureCategoriesApp.category;
    await axios.delete('expenditure-categories/'+id);

    return id;
  }
);

export const saveCategory = createAsyncThunk(
  'expenditureCategoriesApp/category/saveCategory',
  async (postData, { dispatch, getState }) => {
    const { category } = getState().expenditureCategoriesApp;
    let url = "";
    let response = "";
    if (postData.encryption_id) {
      url = 'expenditure-categories/'+postData.encryption_id;
      response = await axios.put(url, postData);
    } else {
      url = 'expenditure-categories';
      response = await axios.post(url, postData);
    }
    
    const data = await response.data;

    console.log(data)
    return data;
  }
);

const categorySlice = createSlice({
  name: 'expenditureCategoriesApp/category',
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
