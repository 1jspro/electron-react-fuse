import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'axios';

export const getInvoices = createAsyncThunk('invoicesApp/invoiceDetails/getInvoices', async (postData, { dispatch, getState }) => {
  let loggedInUser = getState().auth.user.uuid;
  postData = postData ? postData : {page:0, rowsPerPage:100, searchText: '', invoiceId: ''}
  const response = await axios.get('invoices/'+postData.invoiceId+'?page='+(postData.page+1)+'&limit='+postData.rowsPerPage+'&search='+postData.searchText);

  let data = await response.data.data;

  data.Invoice.InvoiceDetail = data.Invoice.InvoiceDetail.map((a) => {
    a.totalRecords = Number(data.Invoice.InvoiceDetail.length);
    a.payable_amount = a.amount_pending;
    a.invoice_name = data.Invoice.name;
    a.total_invoice_cost = data.Invoice.total_invoice_cost;
    return a;
  });

  return data.Invoice.InvoiceDetail;
});

export const payInvoices = createAsyncThunk(
  'invoicesApp/invoiceDetails/payInvoices',
  async (postData, { dispatch, getState }) => {
    const response = await axios.post('pay_invoice', {id: postData.id, amount_to_pay: postData.amount_to_pay});
    let data = response.data;
    if (data.status === true) {
      data.amount_pending = Number(postData.amount_pending) - Number(postData.amount_to_pay);
      data.amount_paid = Number(postData.amount_paid) + Number(postData.amount_to_pay);
      data.payable_amount = Number(postData.amount_pending) - Number(postData.amount_to_pay);
      data.invoiceId = postData.id;
    }
    return data;
  }
);

const invoiceDetailsAdapter = createEntityAdapter({});

export const { selectAll: selectInvoiceDetails, selectById: selectInvoiceDetailById } =
  invoiceDetailsAdapter.getSelectors((state) => state.invoicesApp.invoiceDetails);

const invoiceDetailsSlice = createSlice({
  name: 'invoicesApp/invoiceDetails',
  initialState: invoiceDetailsAdapter.getInitialState({
    searchText: '',
  }),
  reducers: {
    setInvoicesSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
        // console.log(action);
      },
      prepare: (event) => ({ payload: event.target.value || '' }),
    },
  },
  extraReducers: {
    [getInvoices.fulfilled]: invoiceDetailsAdapter.setAll,
    [payInvoices.fulfilled]: (state, action) => {
      let changesObj = {};
      if (action.payload.status === true) {
        changesObj["amount_pending"] = action.payload.amount_pending;
        changesObj["amount_paid"] = action.payload.amount_paid;
        changesObj["payable_amount"] = action.payload.payable_amount;

        if (action.payload.amount_pending == 0) {
          changesObj["is_paid"] = 1;
        }
        
      }
      invoiceDetailsAdapter.updateOne(state, {id: action.payload.invoiceId, changes:changesObj}); 
    },
  },
});

export const { setInvoicesSearchText } = invoiceDetailsSlice.actions;

export default invoiceDetailsSlice.reducer;
