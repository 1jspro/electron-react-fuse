import FuseSplashScreen from "@fuse/core/FuseSplashScreen";
import auth0Service from "app/services/auth0Service";
import firebaseService from "app/services/firebaseService";
import jwtService from "app/services/jwtService";
import { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "@reduxjs/toolkit";
import { hideMessage, showMessage } from "app/store/fuse/messageSlice";
import {
  setUserDataFirebase,
  setUserDataAuth0,
  setUserData,
  logoutUser,
} from "./store/userSlice";
const ipcRenderer = require("electron").ipcRenderer;

class Auth extends Component {
  state = {
    waitSync: false,
    waitAuthCheck: true,
  };

  componentDidMount() {
    ipcRenderer.on("error", (data) => {
      this.props.showMessage(data);
    });
    ipcRenderer.on("token", () => {
      this.setState({ waitSync: false });
    });
    return Promise.all([
      // Comment the lines which you do not use
      // this.firebaseCheck(),
      // this.auth0Check(),
      this.jwtCheck(),
      // this.download(),
    ]).then(() => {
      this.setState({ waitAuthCheck: false });
    });
  }

  jwtCheck = () =>
    new Promise((resolve) => {
      jwtService.on("onAutoLogin", () => {
        // this.props.showMessage({ message: 'Logging in with JWT' });

        /**
         * Sign in and retrieve user data from Api
         */
        jwtService
          .signInWithToken()
          .then((res) => {
            let user = {
              muid: res.user_data.muid ? res.user_data.muid : "",
              role: res.user_data.roles, // guest
              data: {
                displayName: res.user_data.first_name
                  ? res.user_data.first_name + " " + res.user_data.last_name
                  : "",
                photoURL: res.user_data.profile_pic,
                email: res.user_data.email,
                permissions: res.user_data.permissions,
                level_id: res.user_data.level_id ? res.user_data.level_id : "",
              },
            };
            this.props.setUserData(user);

            resolve();

            // this.props.showMessage({ message: 'Logged in with JWT' });
          })
          .catch((error) => {
            console.log(error);
            this.props.showMessage({ message: error.message });

            resolve();
          });
      });

      jwtService.on("onAutoLogout", (message) => {
        if (message) {
          this.props.showMessage({ message });
        }

        this.props.logout();

        resolve();
      });

      jwtService.on("onNoAccessToken", () => {
        resolve();
      });

      jwtService.on("sync", (token, level_id) => {
        this.setState({ waitSync: true });
        const wholeToken = "Bearer " + token;
        ipcRenderer.send("token", wholeToken, level_id);
      });

      jwtService.init();

      return Promise.resolve();
    });

  auth0Check = () =>
    new Promise((resolve) => {
      auth0Service.init((success) => {
        if (!success) {
          resolve();
        }
      });

      if (auth0Service.isAuthenticated()) {
        this.props.showMessage({ message: "Logging in with Auth0" });

        /**
         * Retrieve user data from Auth0
         */
        auth0Service.getUserData().then((tokenData) => {
          this.props.setUserDataAuth0(tokenData);

          resolve();

          this.props.showMessage({ message: "Logged in with Auth0" });
        });
      } else {
        resolve();
      }

      return Promise.resolve();
    });

  firebaseCheck = () =>
    new Promise((resolve) => {
      firebaseService.init((success) => {
        if (!success) {
          resolve();
        }
      });

      firebaseService.onAuthStateChanged((authUser) => {
        if (authUser) {
          this.props.showMessage({ message: "Logging in with Firebase" });

          /**
           * Retrieve user data from Firebase
           */
          firebaseService.getUserData(authUser.uid).then(
            (user) => {
              this.props.setUserDataFirebase(user, authUser);

              resolve();

              this.props.showMessage({ message: "Logged in with Firebase" });
            },
            (error) => {
              resolve();
            }
          );
        } else {
          resolve();
        }
      });

      return Promise.resolve();
    });

  render() {
    return this.state.waitSync || this.state.waitAuthCheck ? (
      <FuseSplashScreen />
    ) : (
      <>{this.props.children}</>
    );
  }
}

function mapStateToProps(store) {
  return { user: store.auth.user };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      logout: logoutUser,
      setUserData,
      setUserDataAuth0,
      setUserDataFirebase,
      showMessage,
      hideMessage,
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
