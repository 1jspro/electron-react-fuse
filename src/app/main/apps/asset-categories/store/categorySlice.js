import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import FuseUtils from '@fuse/utils';

export const getCategory = createAsyncThunk('assetCategoriesApp/category/getCategory', async (params) => {
  console.log(params);
  const response = await axios.get('asset-categories/'+params.categoryId);

  const data = await response.data.data;

  return data === undefined ? null : data;
});

export const removeCategory = createAsyncThunk(
  'assetCategoriesApp/category/removeCategory',
  async (val, { dispatch, getState }) => {
    const { id } = getState().assetCategoriesApp.category;
    await axios.delete('asset-categories/'+id);

    return id;
  }
);

export const saveCategory = createAsyncThunk(
  'assetCategoriesApp/category/saveCategory',
  async (postData, { dispatch, getState }) => {
    const { category } = getState().assetCategoriesApp;
    let url = "";
    let response = "";
    if (postData.encryption_id) {
      url = 'asset-categories/'+postData.encryption_id;
      response = await axios.put(url, postData);
    } else {
      url = 'asset-categories';
      response = await axios.post(url, postData);
    }
    
    const data = await response.data;

    console.log(data)
    return data;
  }
);

const categorySlice = createSlice({
  name: 'assetCategoriesApp/category',
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
