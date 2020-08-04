import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import moment from 'moment';
import FuseUtils from '@fuse/utils';

export const getAdmins = createAsyncThunk('supervisorsApp/admins/getAdmins', async (postData, { dispatch, getState }) => {
  let loggedInUser = getState().auth.user.uuid;
  const response = await axios.get('admins');

  const data = await response.data.data.admins;

  return data;
});

export const getSupervisor = createAsyncThunk('supervisorsApp/supervisor/getSupervisor', async (params) => {
  console.log(params);
  const response = await axios.get('supervisor/'+params.supervisorId);

  const data = await response.data.data;

  return data === undefined ? null : data;
});

export const removeSupervisor = createAsyncThunk(
  'supervisorsApp/supervisor/removeSupervisor',
  async (val, { dispatch, getState }) => {
    const { id } = getState().supervisorsApp.admin;
    await axios.delete('supervisor/'+id);

    return id;
  }
);

export const saveSupervisor = createAsyncThunk(
  'supervisorsApp/supervisor/saveSupervisor',
  async (postData, { dispatch, getState }) => {
    const { admin } = getState().supervisorsApp;
    let user = getState().auth.user;

    const formData = new FormData();
    

    const fdata  = {
        "first_name": postData['first_name'] ? postData['first_name'] : "",
        "last_name": postData['last_name'] ? postData['last_name'] : "",
        "email": postData['email'] ? postData['email'] : "",
        "phone_no": postData['phone_no'] ? postData['phone_no'] : "",
        "country": postData['country'] ? postData['country'] : "",
        "region": postData['region'] ? postData['region'] : "",
        "city": postData['city'] ? postData['city'] : "",
        "address": postData['address'] ? postData['address'] : "",
        "supervisor_for": postData.admins ? postData.admins : "",
        "profile_pic": (postData['profile_pic_uploaded'] && postData['profile_pic']) ? postData['profile_pic'] : "",
    }

    Object.keys(fdata).forEach(function(key) {
      formData.append(key, postData[key] ? postData[key] : "");
    });

    let response = null;

    if (postData['encryption_id']) {
      fdata['password'] = postData["password"] ? postData["password"] : "";
      response = await axios.put('supervisor/'+postData['encryption_id'], fdata);
    } else {
      fdata['password'] = postData["password"] ? postData["password"] : "";
      response = await axios.post('supervisor', fdata);
    }
    const data = await response.data;

    return data;
  }
);

const supervisorSlice = createSlice({
  name: 'supervisorsApp/supervisor',
  initialState: null,
  reducers: {
    getAdmins: (state, action) => action.payload,
    resetSupervisor: () => null,
    newSupervisor: {
      reducer: (state, action) => action.payload,
      prepare: (event) => ({
        payload: {
          id: '',
        },
      }),
    },
  },
  extraReducers: {
    [getSupervisor.fulfilled]: (state, action) => action.payload,
    [saveSupervisor.fulfilled]: (state, action) => action.payload,
    [removeSupervisor.fulfilled]: (state, action) => null,
  },
});

export const { newSupervisor, resetSupervisor } = supervisorSlice.actions;

export default supervisorSlice.reducer;
