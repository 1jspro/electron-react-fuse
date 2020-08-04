import { combineReducers } from '@reduxjs/toolkit';
import incomes from './incomesSlice';
import income from './incomeSlice';

const reducer = combineReducers({
  income,
  incomes,
});

export default reducer;
