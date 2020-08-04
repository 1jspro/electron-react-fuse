import { combineReducers } from '@reduxjs/toolkit';
import login from './loginSlice';
import register from './registerSlice';
import user from './userSlice';
import forgot_password from './forgotPasswordSlice';
import reset_password from './resetPasswordSlice';
import profile from './profileSlice';
import member from './memberSlice';
import settings from './settingsSlice';
import customizePage from './customizePageSlice';


const authReducers = combineReducers({
  user,
  login,
  register,
  forgot_password,
  reset_password,
  profile,
  member,
  settings,
  customizePage,
});

export default authReducers;
