import { combineReducers } from '@reduxjs/toolkit';
import categories from './categoriesSlice';
import category from './categorySlice';

const reducer = combineReducers({
  category,
  categories,
});

export default reducer;
