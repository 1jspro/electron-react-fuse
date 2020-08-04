import { combineReducers } from '@reduxjs/toolkit';
import industries from './industriesSlice';
import industry from './industrySlice';

const reducer = combineReducers({
  industry,
  industries,
});

export default reducer;
