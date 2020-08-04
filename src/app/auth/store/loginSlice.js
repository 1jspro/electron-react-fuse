import { createSlice } from "@reduxjs/toolkit";
import { showMessage } from "app/store/fuse/messageSlice";
import firebaseService from "app/services/firebaseService";
import jwtService from "app/services/jwtService";
import { setUserData } from "./userSlice";

export const submitLogin =
  ({ email, password }) =>
  async (dispatch) => {
    return jwtService
      .signInWithEmailAndPassword(email, password)
      .then((res) => {
        console.log(res);
        let user = {
          muid: res.user_data.muid ? res.user_data.muid : "",
          role: res.roles, // guest
          data: {
            displayName: res.user_data.first_name
              ? res.user_data.first_name + " " + res.user_data.last_name
              : "",
            photoURL: res.user_data.profile_pic,
            email: res.user_data.email,
            permissions: res.permissions,
            level_id: res.user_data.level_id ? res.user_data.level_id : "",
          },
        };
        //
        //
        dispatch(setUserData(user));

        return dispatch(loginSuccess());
      })
      .catch((errors) => {
        return dispatch(loginError(errors));
      });
  };

export const submitLoginWithFireBase =
  ({ email, password }) =>
  async (dispatch) => {
    if (!firebaseService.auth) {
      console.warn(
        "Firebase Service didn't initialize, check your configuration"
      );

      return () => false;
    }
    return firebaseService.auth
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        return dispatch(loginSuccess());
      })
      .catch((error) => {
        const emailErrorCodes = [
          "auth/email-already-in-use",
          "auth/invalid-email",
          "auth/operation-not-allowed",
          "auth/user-not-found",
          "auth/user-disabled",
        ];
        const passwordErrorCodes = [
          "auth/weak-password",
          "auth/wrong-password",
        ];
        const response = [];

        if (emailErrorCodes.includes(error.code)) {
          response.push({
            type: "email",
            message: error.message,
          });
        }

        if (passwordErrorCodes.includes(error.code)) {
          response.push({
            type: "password",
            message: error.message,
          });
        }

        if (error.code === "auth/invalid-api-key") {
          dispatch(showMessage({ message: error.message }));
        }

        return dispatch(loginError(response));
      });
  };

const initialState = {
  success: false,
  errors: [],
};

const loginSlice = createSlice({
  name: "auth/login",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.success = true;
      state.errors = [];
    },
    loginError: (state, action) => {
      state.success = false;
      state.errors = [{ type: "other", message: action.payload.message }];
    },
  },
  extraReducers: {},
});

export const { loginSuccess, loginError } = loginSlice.actions;

export default loginSlice.reducer;
