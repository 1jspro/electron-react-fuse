import { combineReducers } from '@reduxjs/toolkit';
import professions from './professionsSlice';
import profession from './professionSlice';

const reducer = combineReducers({
  profession,
  professions,
});

export default reducer;
