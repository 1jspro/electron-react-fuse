import { combineReducers } from '@reduxjs/toolkit';
import staffList from './staffListSlice';
import staff from './staffSlice';

const reducer = combineReducers({
  staff,
  staffList,
});

export default reducer;
