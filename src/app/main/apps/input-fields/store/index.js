import { combineReducers } from '@reduxjs/toolkit';
import fields from './fieldsSlice';
import field from './fieldSlice';

const reducer = combineReducers({
  field,
  fields,
});

export default reducer;
