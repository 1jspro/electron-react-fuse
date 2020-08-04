import { combineReducers } from '@reduxjs/toolkit';
import groupListSlice from './GroupDataListSlice';
import groupSlice from './groupDataSlice';

const reducer = combineReducers({
  groupSlice,
  groupListSlice,
});

export default reducer;
