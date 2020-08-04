import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';



export const getProfileData = createAsyncThunk('advertisersApp/advertisers/getProfileData', async (postData) => {
  const response = await axios.post('user/getProfileData', postData);

  const data = await response.data;

  return data;
});

const navbarSlice = createSlice({
  name: 'navbar',
  initialState: {
    open: true,
    mobileOpen: false,
  },
  reducers: {
    navbarToggleFolded: (state, action) => {
      state.foldedOpen = !state.foldedOpen;
    },
    navbarOpenFolded: (state, action) => {
      state.foldedOpen = true;
    },
    navbarCloseFolded: (state, action) => {
      state.foldedOpen = false;
    },
    navbarToggleMobile: (state, action) => {
      state.mobileOpen = !state.mobileOpen;
    },
    navbarOpenMobile: (state, action) => {
      state.mobileOpen = true;
    },
    navbarCloseMobile: (state, action) => {
      state.mobileOpen = false;
    },
    navbarClose: (state, action) => {
      state.open = false;
    },
    navbarOpen: (state, action) => {
      state.open = true;
    },
    navbarToggle: (state, action) => {
      state.open = !state.open;
    },
  },
  extraReducers: {
    [getProfileData.fulfilled]: (state, action) => {},
  },
});

export const {
  navbarToggleFolded,
  navbarOpenFolded,
  navbarCloseFolded,
  navbarOpen,
  navbarClose,
  navbarToggle,
  navbarOpenMobile,
  navbarCloseMobile,
  navbarToggleMobile,
} = navbarSlice.actions;

export default navbarSlice.reducer;
