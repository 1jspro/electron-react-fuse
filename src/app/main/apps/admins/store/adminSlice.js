import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import moment from 'moment';
import FuseUtils from '@fuse/utils';

export const getLevels = createAsyncThunk('adminsApp/admin/getLevels', async () => {
  const response = await axios.get('levels', {});

  const data = await response.data.data.levelData;

  return data;
});

export const getallLevels = createAsyncThunk('adminsApp/admin/getallLevels', async () => {
  const response = await axios.post('all-levels', {});

  const data = await response.data.data.levelData;

  return data;
});

export const getFinalallLevels = createAsyncThunk('adminsApp/admin/getFinalallLevels', async () => {
  const response = await axios.get('final-levels');

  const data = await response.data.data.levelData;

  return data;
});

export const getAdmin = createAsyncThunk('adminsApp/admin/getAdmin', async (params) => {
  console.log(params);
  const response = await axios.get('admins/'+params.adminId);

  const data = await response.data.data;
  data.package_id = data.package_id+''
  return data === undefined ? null : data;
});

export const removeAdmin = createAsyncThunk(
  'adminsApp/admin/removeAdmin',
  async (val, { dispatch, getState }) => {
    const { id } = getState().adminsApp.admin;
    await axios.delete('admins/'+id);

    return id;
  }
);

export const saveAdmin = createAsyncThunk(
  'adminsApp/admin/saveAdmin',
  async (postData, { dispatch, getState }) => {
    const { admin } = getState().adminsApp;
    let user = getState().auth.user;

    const formData = new FormData();

    const fdata  = {
        "first_name": postData['first_name'] ? postData['first_name'] : "",
        "last_name": postData['last_name'] ? postData['last_name'] : "",
        "email": postData['email'] ? postData['email'] : "",
        "phone_no": postData['phone_no'] ? postData['phone_no'] : "",
        "org_name": postData['org_name'] ? postData['org_name'] : "",
        "org_address": postData['org_address'] ? postData['org_address'] : "",
        "org_meta_description": postData['org_meta_description'] ? postData['org_meta_description'] : "",
        "meta_keyword": postData['meta_keyword'] ? postData['meta_keyword'] : "",
        "meta_tag": postData['meta_tag'] ? postData['meta_tag'] : "",
        "country": postData['country'] ? postData['country'] : "",
        "region": postData['region'] ? postData['region'] : "",
        "city": postData['city'] ? postData['city'] : "",
        "address": postData['address'] ? postData['address'] : "",
        "level_id": postData['level_id'] ? postData['level_id'] : "",
        "org_image": (postData['org_image_uploaded'] && postData['org_image']) ? postData['org_image'] : "",
        "show_id_card" : postData['show_id_card'] ? postData['show_id_card'] : 0,
        "print_exp_date_on_id" : postData['print_exp_date_on_id'] ? postData['print_exp_date_on_id'] : 0,
        "package_id" : postData['package_id'] ? parseInt(postData['package_id']) : 0
    }

    Object.keys(fdata).forEach(function(key) {
      formData.append(key, postData[key] ? postData[key] : "");
    });

    let response = null;

    if (postData['encryption_id']) {
      fdata['password'] = postData["password"] ? postData["password"] : "";
      response = await axios.put('admins/'+postData['encryption_id'], fdata);
    } else {
      fdata['password'] = postData["password"] ? postData["password"] : "";
      formData.append('password', postData["password"] ? postData["password"] : "");
      response = await axios.post('admins', fdata);
    }
    const data = await response.data;

    return data;
  }
);

const adminSlice = createSlice({
  name: 'adminsApp/admin',
  initialState: null,
  reducers: {
    getLevels: (state, action) => action.payload,
    getallLevels: (state, action) => action.payload,
    getFinalallLevels: (state, action) => action.payload,
    resetAdmin: () => null,
    newAdmin: {
      reducer: (state, action) => action.payload,
      prepare: (event) => ({
        payload: {
          id: '',
        },
      }),
    },
  },
  extraReducers: {
    [getAdmin.fulfilled]: (state, action) => action.payload,
    [saveAdmin.fulfilled]: (state, action) => action.payload,
    [removeAdmin.fulfilled]: (state, action) => null,
  },
});

export const { newAdmin, resetAdmin } = adminSlice.actions;

export default adminSlice.reducer;
