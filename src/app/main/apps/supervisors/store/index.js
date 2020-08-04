import { combineReducers } from '@reduxjs/toolkit';
import supervisors from './supervisorsSlice';
import supervisor from './supervisorSlice';

const reducer = combineReducers({
  supervisor,
  supervisors,
});

export default reducer;
