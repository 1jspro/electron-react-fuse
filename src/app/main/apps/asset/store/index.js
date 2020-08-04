import { combineReducers } from '@reduxjs/toolkit';
import assets from './assetsSlice';
import asset from './assetSlice';

const reducer = combineReducers({
  asset,
  assets,
});

export default reducer;
