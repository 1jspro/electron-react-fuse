import { combineReducers } from '@reduxjs/toolkit';
import executives from './executivesSlice';

const reducer = combineReducers({
  executives,
});

export default reducer;
