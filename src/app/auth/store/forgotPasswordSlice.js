import { createSlice } from '@reduxjs/toolkit';
import { showMessage } from 'app/store/fuse/messageSlice';
import { setUserData } from './userSlice';
import jwtService from 'app/services/jwtService';


export const submitForgotPassword =
  ({ email }) =>
  async (dispatch) => {
    return jwtService
      .forgotPassword(email)
      .then((message) => {
        return dispatch(forgotPasswordSuccess(message));
      })
      .catch((errors) => {
        // dispatch(showMessage({ message: 'User data saved to firebase' }));
        return dispatch(forgotPasswordError(errors));
      });
  };

const initialState = {
  success: false,
  success_message: "",
  errors: [],
};

const forgotPasswordSlice = createSlice({
  name: 'auth/forgot_password',
  initialState,
  reducers: {
    forgotPasswordSuccess: (state, action) => {
      state.success = true;
      state.errors = [];
      state.success_message = action.payload;
    },
    forgotPasswordError: (state, action) => {
      state.success = false;
      state.errors = action.payload;
      state.success_message = "";
    },
  },
  extraReducers: {},
});

export const { forgotPasswordSuccess, forgotPasswordError } = forgotPasswordSlice.actions;

export default forgotPasswordSlice.reducer;
