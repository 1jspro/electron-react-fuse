import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'axios';

export const getAllCategories = createAsyncThunk('expenditureCategoriesApp/categories/getAllCategories', async (postData, { dispatch, getState }) => {
  const response = await axios.get('expenditure-categories');

  const data = await response.data.data.expenditureCategoryData;

  return data;
});

export const getCategories = createAsyncThunk('expenditureCategoriesApp/categories/getCategories', async (postData) => {
  postData = postData ? postData : {page:0, rowsPerPage:100, searchText: ''}
  const response = await axios.get('expenditure-categories?page='+(postData.page+1)+'&limit='+postData.rowsPerPage+'&search='+postData.searchText);

  const data = await response.data.data;
  data.expenditureCategoryData = data.expenditureCategoryData.map((a) => {
    a.totalRecords = Number(data.Count);
    return a;
  });

  return data.expenditureCategoryData;
});

export const removeCategories = createAsyncThunk(
  'expenditureCategoriesApp/categories/removeCategories',
  async (categoryIds, { dispatch, getState }) => {
    let created_by = getState().auth.user.uuid;
    let Idstr = categoryIds.encryptedIds;
    const response = await axios.delete('expenditure-categories/'+Idstr);
    let data = response.data;
    data.categoryIds = [categoryIds.ids];
    return data;
  }
);

const categoryAdapter = createEntityAdapter({});

export const { selectAll: selectCategories, selectById: selectCategoryById } =
  categoryAdapter.getSelectors((state) => state.expenditureCategoriesApp.categories);

const categoriesSlice = createSlice({
  name: 'expenditureCategoriesApp/categories',
  initialState: categoryAdapter.getInitialState({
    searchText: '',
  }),
  reducers: {
    setCategoriesSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || '' }),
    },
  },
  extraReducers: {
    [getAllCategories.fulfilled]: (state, action) => {},
    [getCategories.fulfilled]: categoryAdapter.setAll,
    [removeCategories.fulfilled]: (state, action) =>
      categoryAdapter.removeMany(state, action.payload.categoryIds),
  },
});

export const { setCategoriesSearchText } = categoriesSlice.actions;

export default categoriesSlice.reducer;
