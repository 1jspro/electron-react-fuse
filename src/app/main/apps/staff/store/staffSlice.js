import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import moment from 'moment';
import FuseUtils from '@fuse/utils';

export const getPermissions = createAsyncThunk('staffApp/staff/getPermissions', async (postData, { dispatch, getState }) => {
  let user = getState().auth.user;
  const response = await axios.get('staff-permissions', {});

  const data = await response.data.data;

  return data;
});

export const getStaff = createAsyncThunk('staffApp/staff/getStaff', async (params) => {
  const response = await axios.get('staffs/'+params.staffId);

  const data = await response.data.data;

  return data === undefined ? null : data;
});

export const removeStaff = createAsyncThunk(
  'staffApp/staff/removeStaff',
  async (val, { dispatch, getState }) => {
    const { id } = getState().staffApp.staff;
    await axios.delete('staffs/'+id);

    return id;
  }
);

export const saveStaff = createAsyncThunk(
  'staffApp/staff/saveStaff',
  async (postData, { dispatch, getState }) => {
    const { staff } = getState().staffApp;
    let user = getState().auth.user;


    const fdata  = {
      "first_name": postData['first_name'] ? postData['first_name'] : "",
      "last_name": postData['last_name'] ? postData['last_name'] : "",
      "email": postData['email'] ? postData['email'] : "",
      "phone_no": postData['phone_no'] ? postData['phone_no'] : "",
      "country": postData['country'] ? postData['country'] : "",
      "region": postData['region'] ? postData['region'] : "",
      "city": postData['city'] ? postData['city'] : "",
      "address": postData['address'] ? postData['address'] : "",
      "permissions": postData['permissions'] ? postData['permissions'] : "",
    }


    let response = null;

    if (postData['encryption_id']) {
      response = await axios.put('staffs/'+postData['encryption_id'], fdata);
    } else {
      fdata['password'] = postData["password"] ? postData["password"] : "";
      response = await axios.post('staffs', fdata);
    }
    const data = await response.data;

    return data;
  }
);

const staffSlice = createSlice({
  name: 'staffApp/staff',
  initialState: null,
  reducers: {
    getPermissions: (state, action) => action.payload,
    resetStaff: () => null,
    newStaff: {
      reducer: (state, action) => action.payload,
      prepare: (event) => ({
        payload: {
          id: "",
          first_name: "",
          last_name: "",
          email: "",
          phone_no: "",
          level_id: "",
          education_level: "",
          industry: "",
          profession: "",
          employment_status: "",
          id_type: "",
          id_number: "",
          gender: "",
          date_year_of_joining: "",
          dob: "",
          profession_status: "",
          self_employed: "",
          position: "",
          status: "",
        },
      }),
    },
  },
  extraReducers: {
    [getStaff.fulfilled]: (state, action) => action.payload,
    [saveStaff.fulfilled]: (state, action) => action.payload,
    [removeStaff.fulfilled]: (state, action) => null,
  },
});

export const { newStaff, resetStaff } = staffSlice.actions;

export default staffSlice.reducer;
