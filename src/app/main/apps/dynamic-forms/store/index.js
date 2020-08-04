import { combineReducers } from '@reduxjs/toolkit';
import forms from './formsSlice';
import form from './formSlice';

const reducer = combineReducers({
  form,
  forms,
});

export default reducer;
