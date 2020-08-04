import { combineReducers } from '@reduxjs/toolkit';
import packages from './packagesSlice';
import packageData from './packageSlice';

const reducer = combineReducers({
  packageData,
  packages,
});

export default reducer;
