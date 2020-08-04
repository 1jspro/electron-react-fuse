import { combineReducers } from '@reduxjs/toolkit';
import events from './eventsSlice';
import event from './eventslice';

const reducer = combineReducers({
  event,
  events,
});

export default reducer;
