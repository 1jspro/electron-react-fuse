import { combineReducers } from '@reduxjs/toolkit';
import communication from './communicationSlice';

const reducer = combineReducers({
  communication,
});

export default reducer;
