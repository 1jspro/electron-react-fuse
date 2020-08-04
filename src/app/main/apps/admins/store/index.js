import { combineReducers } from '@reduxjs/toolkit';
import admins from './adminsSlice';
import admin from './adminSlice';

const reducer = combineReducers({
  admin,
  admins,
});

export default reducer;
