import { combineReducers } from '@reduxjs/toolkit';
import levelDataList from './levelDataListSlice';
import levelData from './levelDataSlice';

const reducer = combineReducers({
  levelData,
  levelDataList,
});

export default reducer;
