import { combineReducers } from '@reduxjs/toolkit';
import levels from './levelsSlice';
import level from './levelSlice';

const reducer = combineReducers({
  level,
  levels,
});

export default reducer;
