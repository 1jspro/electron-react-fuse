import { combineReducers } from '@reduxjs/toolkit';
import subscription from './subscriptionSlice';

const reducer = combineReducers({
  subscription,
});

export default reducer;
