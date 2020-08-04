import { combineReducers } from '@reduxjs/toolkit';
import invoiceDetails from './invoiceDetailsSlice';
import invoices from './invoicesSlice';
import invoice from './invoiceSlice';

const reducer = combineReducers({
  invoice,
  invoices,
  invoiceDetails,
});

export default reducer;
