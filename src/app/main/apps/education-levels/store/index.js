import { combineReducers } from '@reduxjs/toolkit';
import educationLevels from './educationLevelsSlice';
import educationLevel from './educationLevelSlice';

const reducer = combineReducers({
  educationLevel,
  educationLevels,
});

export default reducer;
