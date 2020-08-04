import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'axios';

export const getAllAdmins = createAsyncThunk(
  'adminsApp/admins/getAllAdmins',
  async (postData, { dispatch, getState }) => {
    const loggedInUser = getState().auth.user.uuid;
    const response = await axios.get('admins');

    const data = await response.data.data.admins;

    return data;
  }
);

export const getAdmins = createAsyncThunk(
  'adminsApp/admins/getAdmins',
  async (postData, { dispatch, getState }) => {
    const loggedInUser = getState().auth.user.uuid;
    postData = postData || { page: 0, rowsPerPage: 100, searchText: '' };
    const response = await axios.get(
      `admins?page=${postData.page + 1}&limit=${postData.rowsPerPage}&search=${postData.searchText}`
    );

    const data = await response.data.data;

    data.admins = data.admins.map((a) => {
      a.totalPage = Number(data.adminCount);
      return a;
    });

    return data.admins;
  }
);

export const getAdminProfile = createAsyncThunk(
  'adminsApp/adminProfile/getAdminProfile',
  async (postData, { dispatch, getState }) => {
    const response = await axios.get('user-data');

    const data = await response.data;

    return data;
  }
);

export const getAdminToken = createAsyncThunk(
  'adminsApp/adminToken/getAdminToken',
  async (postData, { dispatch, getState }) => {
    const response = await axios.post('user-token', postData);

    const data = await response.data;

    return data;
  }
);

export const setActivation = createAsyncThunk(
  'adminsApp/setActivation',
  async (postData, { dispatch, getState }) => {
    const response = await axios.put(`add_member_access/${postData.queryId}`, postData);

    if (response?.data?.data === '') {
      return { message: response?.data?.message };
    }
    const data = await response.data;
    return data;
  }
);

export const removeAdmins = createAsyncThunk(
  'adminsApp/admins/removeAdmins',
  async (adminIds, { dispatch, getState }) => {
    const created_by = getState().auth.user.uuid;
    const Idstr = adminIds.encryptedIds;
    const response = await axios.delete(`admins/${Idstr}`);
    const { data } = response;
    data.adminIds = [adminIds.ids];

    return data;
  }
);

const adminsAdapter = createEntityAdapter({});

export const { selectAll: selectAdmins, selectById: selectAdminById } = adminsAdapter.getSelectors(
  (state) => state.adminsApp.admins
);

const adminsSlice = createSlice({
  name: 'adminsApp/admins',
  initialState: adminsAdapter.getInitialState({
    searchText: '',
  }),
  reducers: {
    setAdminsSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
        // console.log(action);
      },
      prepare: (event) => ({ payload: event.target.value || '' }),
    },
  },
  extraReducers: {
    [getAdmins.fulfilled]: adminsAdapter.setAll,
    [getAllAdmins.fulfilled]: (state, action) => {},
    [getAdminToken.fulfilled]: (state, action) => {},
    [getAdminProfile.fulfilled]: (state, action) => {},
    [getAllAdmins.fulfilled]: (state, action) => {},
    [removeAdmins.fulfilled]: (state, action) => {
      adminsAdapter.removeMany(state, action.payload.adminIds);
    },
  },
});

export const { setAdminsSearchText } = adminsSlice.actions;

export default adminsSlice.reducer;
