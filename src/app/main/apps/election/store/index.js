import { combineReducers } from '@reduxjs/toolkit';
import elections from './electionsSlice';
import election from './electionslice';

const reducer = combineReducers({
  election,
  elections,
});

export default reducer;
