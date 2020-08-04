import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'axios';


export const getAllInvoices = createAsyncThunk('invoicesApp/invoices/getAllInvoices', async (postData, { dispatch, getState }) => {
  let loggedInUser = getState().auth.user.uuid;
  const response = await axios.get('invoices');

  const data = await response.data.data.invoiceData;

  return data;
});

export const getInvoices = createAsyncThunk('invoicesApp/invoices/getInvoices', async (postData, { dispatch, getState }) => {
  let loggedInUser = getState().auth.user.uuid;
  postData = postData ? postData : {page:0, rowsPerPage:100, searchText: ''}
  const response = await axios.get('invoices?page='+(postData.page+1)+'&limit='+postData.rowsPerPage+'&search='+postData.searchText);

  let data = await response.data.data;

  data.invoiceData = data.invoiceData.map((a) => {
    a.totalRecords = Number(data.Count);
    return a;
  });

  return data.invoiceData;
});

export const removeInvoices = createAsyncThunk(
  'invoicesApp/invoices/removeInvoices',
  async (invoiceIds, { dispatch, getState }) => {
    let created_by = getState().auth.user.uuid;
    let Idstr = invoiceIds.encryptedIds;
    const response = await axios.delete('invoices/'+Idstr);
    let data = response.data;
    data.invoiceIds = [invoiceIds.ids];

    return data;
  }
);


const invoicesAdapter = createEntityAdapter({});


export const { selectAll: selectInvoices, selectById: selectInvoiceById } =
  invoicesAdapter.getSelectors((state) => state.invoicesApp.invoices);

const invoicesSlice = createSlice({
  name: 'invoicesApp/invoices',
  initialState: invoicesAdapter.getInitialState({
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
    [getInvoices.fulfilled]: invoicesAdapter.setAll,
    [getAllInvoices.fulfilled]: (state, action) => {},
    [removeInvoices.fulfilled]: (state, action) => {
      invoicesAdapter.removeMany(state, action.payload.invoiceIds);
    },
  },
});

export const { setInvoicesSearchText } = invoicesSlice.actions;

export default invoicesSlice.reducer;
