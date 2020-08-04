import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { ipcRenderer } from "electron";

export const getLevels = createAsyncThunk(
  "membersApp/member/getLevels",
  async (postData, { dispatch, getState }) => {
    const { user } = getState().auth;
    if (user.role.length === 0) {
      ipcRenderer.send("get-database", `levelResponse`);
      return await new Promise((res) =>
        ipcRenderer.on("return-levelResponse", (event, members) => {
          res(members);
        })
      );
    } else {
      const response = await axios.get(
        `levelResponse/${user.data.level_id}`,
        {}
      );
      const data = await response.data.data;
      return data;
    }
  }
);

export const getPositions = createAsyncThunk(
  "membersApp/positions/getPositions",
  async (postData, { dispatch, getState }) => {
    const { user } = getState().auth;
    if (user.role.length === 0) {
      ipcRenderer.send("get-database", "positions");
      return await new Promise((res) =>
        ipcRenderer.on("return-positions", (event, members) => {
          res(members);
        })
      );
    } else {
      const response = await axios.get("positions");
      const data = await response.data.data.positionData;
      return data;
    }
  }
);

export const getDynamicForms = createAsyncThunk(
  "membersApp/dynamicForms/getDynamicForms",
  async (postData, { dispatch, getState }) => {
    const { user } = getState().auth;
    if (user.role.length === 0) {
      ipcRenderer.send("get-database", "dynamicForms");
      return await new Promise((res) =>
        ipcRenderer.on("return-dynamicForms", (event, members) => {
          res(members);
        })
      );
    } else {
      const response = await axios.get("dynamic-forms");
      const data = await response.data.data;
      return data.dynamicFormsData;
    }
  }
);

export const getAllParentLevels = createAsyncThunk(
  "membersApp/parent_levels/getAllParentLevels",
  async (postData, { dispatch, getState }) => {
    const response = await axios.get(
      `levelDataUpdate/${postData.parent_id}`,
      {}
    );

    const data = await response.data.data;
    const parents = await data.parents;
    const dataList = {};
    for (const key in parents) {
      const parent = parents[key];
      dataList[parent.level_id] = [];
      let end_url = parent.level_id;

      if (parent.parent_id) {
        end_url += `/${parent.parent_id}`;
      }
      if (postData.logIn === undefined) {
        const response = await axios.get(`levelDataResponse/${end_url}`, {});
        dataList[parent.level_id] = response.data.data;
      }
    }

    return { data, dataList };
  }
);

export const getLevelsData = createAsyncThunk(
  "membersApp/member/getLevelsData",
  async (postData, { dispatch, getState }) => {
    let end_url = postData.level_id;
    if (postData.parent_id) {
      end_url += `/${postData.parent_id}`;
    }
    const url = `levelDataResponse/${end_url}`;
    const { user } = getState().auth;
    if (user.role.length === 0) {
      ipcRenderer.send("get-data", url);
      return await new Promise((res) =>
        ipcRenderer.on(`return-${url}`, (event, members) => {
          res(members);
        })
      );
    } else {
      const response = await axios.get(url, {});

      const data = await response.data.data;

      return data;
    }
  }
);

export const getEducationLevels = createAsyncThunk(
  "membersApp/member/getEducationLevels",
  async () => {
    const { user } = getState().auth;
    if (user.role.length === 0) {
      ipcRenderer.send("get-database", "educationLevels");
      return await new Promise((res) =>
        ipcRenderer.on("return-educationLevels", (event, members) => {
          res(members);
        })
      );
    } else {
      const response = await axios.get("education-levels", {});
      const data = await response.data.data.educationLevelData;
      return data;
    }
  }
);

export const getIndustries = createAsyncThunk(
  "membersApp/member/getIndustries",
  async () => {
    const { user } = getState().auth;
    if (user.role.length === 0) {
      ipcRenderer.send("get-database", "industries");
      return await new Promise((res) =>
        ipcRenderer.on("return-industries", (event, members) => {
          res(members);
        })
      );
    } else {
      const response = await axios.get("industries", {});
      const data = await response.data.data.industryData;
      return data;
    }
  }
);

export const getProfessions = createAsyncThunk(
  "membersApp/member/getProfessions",
  async () => {
    const { user } = getState().auth;
    if (user.role.length === 0) {
      ipcRenderer.send("get-database", "professions");
      return await new Promise((res) =>
        ipcRenderer.on("return-professions", (event, members) => {
          res(members);
        })
      );
    } else {
      const response = await axios.get("professions?list=true", {});
      const data = await response.data.data.professionData;
      return data;
    }
  }
);

export const getMember = createAsyncThunk(
  "membersApp/member/getMember",
  async (params) => {
    const { user } = getState().auth;
    if (user.role.length === 0) {
      ipcRenderer.send("get-member", params.memberId);
      return await new Promise((res) =>
        ipcRenderer.on("return-member", (event, members) => {
          res(members);
        })
      );
    } else {
      const response = await axios.get(`members/${params.memberId}`);
      const data = await response.data.data;
      return data === undefined ? null : data;
    }
  }
);

export const getMemberWithoutAuth = createAsyncThunk(
  "member/getMemberWithoutAuth",
  async (memberId) => {
    const response = await axios.get("memberShow", {
      params: {
        encryption_id: memberId,
      },
    });

    const data = await response.data.data;

    return data === undefined ? null : data;
  }
);

export const removeMember = createAsyncThunk(
  "membersApp/member/removeMember",
  async (val, { dispatch, getState }) => {
    const { id } = getState().membersApp.member;
    await axios.delete(`members/${id}`);

    return id;
  }
);

export const saveMember = createAsyncThunk(
  "membersApp/member/saveMember",
  async (postData, { dispatch, getState }) => {
    const { member } = getState().membersApp;
    const { user } = getState().auth;

    const formData = new FormData();

    const fdata = {
      first_name: postData.first_name ? postData.first_name : "",
      last_name: postData.last_name ? postData.last_name : "",
      email: postData.email ? postData.email : "",
      phone_no: postData.phone_no ? postData.phone_no : "",
      level_id: postData.level_id ? postData.level_id : "",
      education_level: postData.education_level ? postData.education_level : "",
      industry: postData.industry ? postData.industry : "",
      profession: postData.profession ? postData.profession : "",
      employment_status: postData.employment_status
        ? postData.employment_status
        : "",
      id_type: postData.id_type ? postData.id_type : "",
      id_number: postData.id_number ? postData.id_number : "",
      gender: postData.gender ? postData.gender : "",
      date_year_of_joining: postData.date_year_of_joining
        ? postData.date_year_of_joining
        : "",
      dob: postData.dob ? postData.dob : "",
      policy_number: postData.policy_number ? postData.policy_number : "",
      // profession_status: postData['profession_status'] ? postData['profession_status'] : "",
      self_employed: postData.self_employed ? postData.self_employed : "",
      business_name: postData.business_name ? postData.business_name : "",
      business_location: postData.business_location
        ? postData.business_location
        : "",
      position: postData.position ? postData.position : "",
      profile_pic:
        postData.profile_pic_uploaded && postData.profile_pic
          ? postData.profile_pic
          : "",
      status: postData.status ? postData.status : "",
      level_id: postData.level_id ? postData.level_id : "",
      level_data_id: postData.level_data_id ? postData.level_data_id : "",
      extra_field: postData.extra_field ? postData.extra_field : {},
      groups: postData.group ? postData.group : "",
    };

    Object.keys(fdata).forEach(function (key) {
      formData.append(key, postData[key] ? postData[key] : "");
    });

    let response = null;

    if (postData.encryption_id) {
      response = await axios
        .put(`members/${postData.encryption_id}`, fdata)
        .catch(function (err) {
          return err.response;
        });
    } else {
      if (user.role.length === 0) {
        ipcRenderer.send("register-member", fdata);
        response = {
          data: fdata,
        };
      } else {
        response = await axios.post("members", fdata).catch(function (err) {
          return err.response;
        });
      }
    }
    let data = {};
    if (response.data.errors) {
      data = { ...response.data, ...postData };
    } else {
      data = { ...postData, ...response.data, errors: null };
    }

    return data;
  }
);

export const saveDefaultFormFormat = createAsyncThunk(
  "membersApp/member/saveDefaultFormFormat",
  async (formData) => {
    const _formData = {
      other_settings: formData,
    };
    try {
      const response = await axios.post("other-settings", _formData);
      return response.data;
    } catch (error) {
      throw new Error(error);
    }
  }
);

const memberSlice = createSlice({
  name: "membersApp/member",
  initialState: null,
  reducers: {
    getLevels: (state, action) => action.payload,
    getLevelsData: (state, action) => action.payload,
    getDynamicForms: (state, action) => action.payload,
    getPositions: (state, action) => action.payload,
    getAllParentLevels: (state, action) => action.payload,
    getEducationLevels: (state, action) => action.payload,
    getIndustries: (state, action) => action.payload,
    getProfessions: (state, action) => action.payload,
    resetMember: () => null,
    newMember: {
      reducer: (state, action) => action.payload,
      prepare: (event) => ({
        payload: {
          id: "",
          first_name: "",
          last_name: "",
          email: "",
          phone_no: "",
          level_id: "",
          education_level: "",
          industry: "",
          profession: "",
          employment_status: "",
          id_type: "",
          id_number: "",
          gender: "",
          date_year_of_joining: "",
          dob: "",
          profession_status: "",
          self_employed: "",
          position: "",
          status: "",
        },
      }),
    },
  },
  extraReducers: {
    [getMember.fulfilled]: (state, action) => action.payload,
    [saveMember.fulfilled]: (state, action) => action.payload,
    [saveDefaultFormFormat.fulfilled]: (state, action) => action.payload,
    [removeMember.fulfilled]: (state, action) => null,
  },
});

export const { newMember, resetMember } = memberSlice.actions;

export default memberSlice.reducer;
