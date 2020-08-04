import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'axios';

export const getAllCategories = createAsyncThunk('incomeCategoriesApp/categories/getAllCategories', async (postData, { dispatch, getState }) => {
  const response = await axios.get('income-categories');

  const data = await response.data.data.categoryData;

  return data;
});


export const getCategories = createAsyncThunk('incomeCategoriesApp/categories/getCategories', async (postData) => {
  postData = postData ? postData : {page:0, rowsPerPage:100, searchText: ''}
  const response = await axios.get('income-categories?page='+(postData.page+1)+'&limit='+postData.rowsPerPage+'&search='+postData.searchText);

  const data = await response.data.data;
  data.categoryData = data.categoryData.map((a) => {
    a.totalRecords = Number(data.Count);
    return a;
  });

  return data.categoryData;
});

export const removeCategories = createAsyncThunk(
  'incomeCategoriesApp/categories/removeCategories',
  async (categoryIds, { dispatch, getState }) => {
    let created_by = getState().auth.user.uuid;
    let Idstr = categoryIds.encryptedIds;
    const response = await axios.delete('income-categories/'+Idstr);
    let data = response.data;
    data.categoryIds = [categoryIds.ids];
    return data;
  }
);

const categoryAdapter = createEntityAdapter({});

export const { selectAll: selectCategories, selectById: selectCategoryById } =
  categoryAdapter.getSelectors((state) => state.incomeCategoriesApp.categories);

const categoriesSlice = createSlice({
  name: 'incomeCategoriesApp/categories',
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
