import { combineReducers } from '@reduxjs/toolkit';
import idCards from './idCardsSlice';
import idCard from './idCardSlice';

const reducer = combineReducers({
  idCard,
  idCards,
});

export default reducer;
