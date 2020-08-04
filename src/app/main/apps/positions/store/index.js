import { combineReducers } from '@reduxjs/toolkit';
import positions from './positionsSlice';
import position from './positionSlice';

const reducer = combineReducers({
  position,
  positions,
});

export default reducer;
