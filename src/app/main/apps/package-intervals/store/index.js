import { combineReducers } from '@reduxjs/toolkit';
import intervals from './intervalsSlice';
import interval from './intervalSlice';

const reducer = combineReducers({
  interval,
  intervals,
});

export default reducer;
