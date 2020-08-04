import { combineReducers } from '@reduxjs/toolkit';
import members from './membersSlice';
import member from './memberSlice';

const reducer = combineReducers({
  member,
  members,
});

export default reducer;
