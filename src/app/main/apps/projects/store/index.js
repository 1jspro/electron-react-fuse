import { combineReducers } from '@reduxjs/toolkit';
import projects from './projectsSlice';
import project from './projectslice';

const reducer = combineReducers({
  project,
  projects,
});

export default reducer;
