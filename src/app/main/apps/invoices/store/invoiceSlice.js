import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const getLevels = createAsyncThunk(
  'invoicesApp/invoice/getLevels',
  async (postData, { dispatch, getState }) => {
    const { user } = getState().auth;
    const response = await axios.get(`levelResponse/${user.data.level_id}`, {});

    const data = await response.data.data;

    return data;
  }
);

export const getAllParentLevels = createAsyncThunk(
  'invoicesApp/parent_levels/getAllParentLevels',
  async (postData, { dispatch, getState }) => {
    const response = await axios.get(`levelDataUpdate/${postData.parent_id}`, {});

    const data = await response.data.data;

    const parents = await data.parents;

    const dataList = {};
    for (const key in parents) {
      const parent = parents[key];
      dataList[parent.level_id] = [];
      let end_url = parent.level_id;

      if (parent.parent_id) {
        end_url += `/${parent.parent_id}`;
      }
      const response = await axios.get(`levelDataResponse/${end_url}`, {});
      dataList[parent.level_id] = response.data.data;
    }

    return { data, dataList };
  }
);

export const getLevelsData = createAsyncThunk(
  'invoicesApp/invoice/getLevelsData',
  async (postData, { dispatch, getState }) => {
    const { user } = getState().auth;

    let end_url = postData.level_id;

    if (postData.parent_id) {
      end_url += `/${postData.parent_id}`;
    }

    const response = await axios.get(`levelDataResponse/${end_url}`, {});

    const data = await response.data.data;

    return data;
  }
);

export const getMembers = createAsyncThunk('invoicesApp/invoice/getMembers', async (params) => {
  let url = 'members';
  if (params && params.level_data_id) {
    url += `?levelDataId=${params.level_data_id}`;
  }
  const response = await axios.get(url, {});
  const data = await response.data.data.members;
  return data;
});

export const getMembersL = createAsyncThunk('invoicesApp/invoice/getMembersL', async (params) => {
  let url = 'members-for-level';
  if (params && params.level_data_id) {
    url += `?level_data_id=${params.level_data_id}`;
  }
  const response = await axios.post(url, {});
  const data = await response.data.data;
  return data;
});

export const getMembersPosition = createAsyncThunk(
  'invoicesApp/invoice/getMembersPosition',
  async (params) => {
    let url = 'positionMembers';
    if (params && params.positionId) {
      url += `?id=${params.positionId}`;
    }
    const response = await axios.get(url, {});
    const data = await response.data.data.members;
    return data;
  }
);

export const getGroup = createAsyncThunk('invoicesApp/invoice/getGroup', async (params) => {
  const url = 'groups';
  const response = await axios.get(url, {});
  const data = await response.data.data.groupData;
  return data;
});

export const getMembersGroup = createAsyncThunk(
  'invoicesApp/invoice/getMembersGroup',
  async (params) => {
    let url = 'groupMembers';
    if (params && (params.GroupId || params.searchText)) {
      url += `?id=${params.GroupId}&search=${params.searchText}`;
    }
    const response = await axios.get(url, {});
    const data = await response.data.data.members;
    return data;
  }
);

export const getInvoice = createAsyncThunk('invoicesApp/invoice/getInvoice', async (params) => {
  const response = await axios.get(`invoices/${params.invoiceId}`);

  const data = await response.data.data;

  if (data.Invoice && data.Invoice.InvoiceDetail) {
    data.Invoice.members = data.Invoice.InvoiceDetail.map((m) => {
      return m.member_id;
    });
    data.Invoice.items = data.Invoice.InvoiceDetail[0].invoice_item;
    data.Invoice.level_data_id = data.Invoice.InvoiceDetail[0].levelData.id;
  }

  return data === undefined ? null : data.Invoice;
});

export const removeInvoice = createAsyncThunk(
  'invoicesApp/invoice/removeInvoice',
  async (val, { dispatch, getState }) => {
    const { id } = getState().invoicesApp.invoice;
    await axios.delete(`invoices/${id}`);

    return id;
  }
);

export const saveInvoice = createAsyncThunk(
  'invoicesApp/invoice/saveInvoice',
  async (postData, { dispatch, getState }) => {
    const { invoice } = getState().invoicesApp;
    const { user } = getState().auth;

    if (postData.invoice_type === 'general') {
      postData.items.map((e, i) => {
        postData.items[i].cost = '0';
      });
    }
    const fdata = {
      invoice_type: postData.invoice_type ? postData.invoice_type : '',
      name: postData.name ? postData.name : '',
      level_id: postData.level_id ? postData.level_id : '',
      // level_data_id: postData['level_data_id'] ? postData['level_data_id'] : "",
      member_id: postData.members ? postData.members.join(',') : '',
      invoice_item: postData.items ? postData.items : '',
    };

    console.log(postData);
    console.log(fdata);
    let response = null;

    if (postData.encryption_id) {
      response = await axios.put(`invoices/${postData.encryption_id}`, fdata);
    } else {
      response = await axios.post('invoices', fdata);
    }
    const data = await response.data;

    return data;
  }
);

const invoiceSlice = createSlice({
  name: 'invoicesApp/invoice',
  initialState: null,
  reducers: {
    getLevels: (state, action) => action.payload,
    getLevelsData: (state, action) => action.payload,
    getAllParentLevels: (state, action) => action.payload,
    getMembers: (state, action) => action.payload,
    getMembersL: (state, action) => action.payload,
    getMembersPosition: (state, action) => action.payload,
    getGroup: (state, action) => action.payload,
    getMembersGroup: (state, action) => action.payload,
    resetInvoice: () => null,
    newInvoice: {
      reducer: (state, action) => action.payload,
      prepare: (event) => ({
        payload: {
          id: '',
          name: '',
          level_id: '',
          level_data_id: '',
          invoices: '',
          items: [],
        },
      }),
    },
  },
  extraReducers: {
    [getInvoice.fulfilled]: (state, action) => action.payload,
    [saveInvoice.fulfilled]: (state, action) => action.payload,
    [removeInvoice.fulfilled]: (state, action) => null,
  },
});

export const { newInvoice, resetInvoice } = invoiceSlice.actions;

export default invoiceSlice.reducer;
