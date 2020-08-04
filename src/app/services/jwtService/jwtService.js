import FuseUtils from "@fuse/utils/FuseUtils";
import axios from "axios";
import jwtDecode from "jwt-decode";
/* eslint-disable camelcase */

class JwtService extends FuseUtils.EventEmitter {
  init() {
    this.setInterceptors();
    this.handleAuthentication();
  }

  setInterceptors = () => {
    // ** Request Interceptor
    axios.interceptors.request.use(
      (config) => {
        // ** Get token from localStorage
        const accessToken = this.getAccessToken();

        // ** If token is present add it to request's Authorization Header
        if (accessToken) {
          // ** eslint-disable-next-line no-param-reassign
          config.headers.Authorization = "Bearer " + accessToken;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // ** Add request/response interceptor
    axios.interceptors.response.use(
      (response) => {
        return response;
      },
      (err) => {
        return new Promise((resolve, reject) => {
          // if (err.response.status === 401 && err.config && !err.config.__isRetryRequest) {
          //   // if you ever get an unauthorized response, logout the user
          //   this.emit('onAutoLogout', 'Invalid access_token');
          //   this.setSession(null);
          // }
          throw err;
        });
      }
    );
  };

  handleAuthentication = () => {
    const access_token = this.getAccessToken();

    if (!access_token) {
      this.emit("onNoAccessToken");

      return;
    }

    if (this.isAuthTokenValid(access_token)) {
      this.setSession(access_token);
      this.emit("onAutoLogin", true);
    } else {
      this.setSession(null);
      this.emit("onAutoLogout", "access_token expired");
    }
  };

  createUser = (data) => {
    return new Promise((resolve, reject) => {
      axios.post("/api/auth/register", data).then((response) => {
        if (response.data.user) {
          this.setSession(response.data.access_token);
          resolve(response.data.user);
        } else {
          reject(response.data.error);
        }
      });
    });
  };

  signInWithEmailAndPassword = (email, password) => {
    return new Promise((resolve, reject) => {
      let data = {
        username: email,
        password,
      };

      axios
        .post("login", data)
        .then((response) => {
          if (response.data.user_data) {
            let permissions = response.data.permissions;
            let read_only_permissions = response.data.user_data["read-only"]
              ? response.data.user_data["read-only"]
              : [];
            if (read_only_permissions.length > 0) {
              permissions = permissions.filter((p) => {
                if (read_only_permissions.indexOf(p) === -1) {
                  return p;
                }
              });
            }
            if (response.data.user_data["show_id_card"] === 0) {
              var arr = [
                "id-cards:create",
                "id-cards:edit",
                "id-cards:delete",
                "id-cards:read",
              ];
              permissions = permissions.filter((p) => {
                if (arr.indexOf(p) === -1) {
                  return p;
                }
              });
            }
            localStorage.setItem(
              "sessionDatas",
              JSON.stringify({
                roles: response.data.roles,
                encryption_id: response.data.user_data.encryption_id,
              })
            );
            this.setPermissions(
              permissions.length > 0 ? permissions : response.data.permissions
            );
            window.location.reload();
            this.setSession(response.data.token);
            response.data.permissions = permissions;
            resolve(response.data);
          } else {
            reject(response.data.error);
          }
        })
        .catch((err) => {
          if (err.response) {
            reject(err.response?.data);
          } else {
            console.log(err);
            reject({ message: "Couldn't connect server!" });
          }
        });
    });
  };

  forgotPassword = (email) => {
    return new Promise((resolve, reject) => {
      let data = {
        email,
      };

      axios.post("forgot_password", data).then((response) => {
        if (response.data.success) {
          resolve(response.data.message);
        } else {
          reject(response.data.error);
        }
      });
    });
  };

  resetPassword = (model) => {
    return new Promise((resolve, reject) => {
      let data = {
        token: model.token,
        password: model.password,
      };

      axios.post("reset_password", data).then((response) => {
        if (response.data.success) {
          resolve(response.data.message);
        } else {
          reject(response.data.error);
        }
      });
    });
  };

  signInWithToken = () => {
    return new Promise((resolve, reject) => {
      // let data = {
      //   token: this.getAccessToken()
      // };

      axios
        .get("user-data")
        .then((response) => {
          if (response.data.user_data) {
            this.emit(
              "sync",
              this.getAccessToken(),
              response.data.user_data.level_id
            );

            let muid = window.localStorage.getItem("muid");
            let storagePermissions = window.localStorage.getItem("permissions");
            // this.setSession(response.data.token);

            if (muid) {
              response.data.user_data.muid = muid;
            } else {
              response.data.user_data.muid = "";
            }

            let permissions = response.data.user_data.permissions;
            let read_only_permissions = response.data.user_data["read-only"]
              ? response.data.user_data["read-only"]
              : [];
            if (read_only_permissions.length > 0) {
              permissions = permissions.filter((p) => {
                if (read_only_permissions.indexOf(p) === -1) {
                  return p;
                }
              });
            }

            if (response.data.user_data["show_id_card"] === 0) {
              var arr = [
                "id-cards:create",
                "id-cards:edit",
                "id-cards:delete",
                "id-cards:read",
              ];
              permissions = permissions.filter((p) => {
                if (arr.indexOf(p) === -1) {
                  return p;
                }
              });
            }

            if (muid) {
              response.data.user_data.permissions = storagePermissions
                ? storagePermissions.split(",")
                : [];
            } else {
              this.setPermissions(permissions);
              response.data.user_data.permissions = permissions;
            }
            resolve(response.data);
          } else {
            this.logout();
            reject(new Error("Failed to login with token."));
          }
        })
        .catch((error) => {
          this.logout();
          reject(new Error("Failed to login with token."));
        });
    });
  };

  updateUserData = (user) => {
    return axios.post("/api/auth/user/update", {
      user,
    });
  };

  setSession = (access_token) => {
    if (access_token) {
      localStorage.setItem("jwt_access_token", access_token);
      axios.defaults.headers.common.Authorization = `Bearer ${access_token}`;
    } else {
      localStorage.removeItem("jwt_access_token");
      localStorage.removeItem("muid");
      delete axios.defaults.headers.common.Authorization;
    }
  };

  setPermissions = (permissions) => {
    if (permissions) {
      localStorage.setItem("permissions", permissions);
    } else {
      localStorage.removeItem("permissions");
    }
  };

  setMuid = (muid) => {
    if (muid) {
      localStorage.setItem("muid", muid);
    } else {
      localStorage.removeItem("muid");
    }
  };

  logout = () => {
    this.setSession(null);
    this.setPermissions(null);
    this.setMuid(null);
  };

  isAuthTokenValid = (access_token) => {
    if (!access_token) {
      return false;
    }
    // const decoded = jwtDecode(access_token);
    // const currentTime = Date.now() / 1000;
    // if (decoded.exp < currentTime) {
    //   console.warn('access token expired');
    //   return false;
    // }

    return true;
  };

  getAccessToken = () => {
    return window.localStorage.getItem("jwt_access_token");
  };
}

const instance = new JwtService();

export default instance;
