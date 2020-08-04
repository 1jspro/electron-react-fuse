import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { showMessage } from 'app/store/fuse/messageSlice';
import jwtService from 'app/services/jwtService';
import {useLocation} from 'react-router-dom';


export const submitResetPassword =
  (data) =>
  async (dispatch) => {
    return jwtService
      .resetPassword(data)
      .then((message) => {
        
        dispatch(showMessage({ message: message }));
        return dispatch(resetPasswordSuccess(message));
      })
      .catch((errors) => {
        return dispatch(resetPasswordError(errors));
      });
  };


const initialState = {
  success: false,
  success_message: "",
  errors: [],
};

const resetPasswordSlice = createSlice({
  name: 'auth/reset_password',
  initialState,
  reducers: {
    resetPasswordSuccess: (state, action) => {
      state.success = true;
      state.errors = [];
      state.success_message = action.payload;


    },
    resetPasswordError: (state, action) => {
      state.success = false;
      state.errors = action.payload;
      state.success_message = "";
    },
  },
  extraReducers: {},
});

export const { resetPasswordSuccess, resetPasswordError } = resetPasswordSlice.actions;

export default resetPasswordSlice.reducer;
