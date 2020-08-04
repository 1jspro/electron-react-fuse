import { combineReducers } from '@reduxjs/toolkit';
import expenditures from './expendituresSlice';
import expenditure from './expenditureSlice';

const reducer = combineReducers({
  expenditure,
  expenditures,
});

export default reducer;
