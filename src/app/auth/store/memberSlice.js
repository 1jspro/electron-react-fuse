import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getLevels = createAsyncThunk(
  "auth/member/getLevels",
  async (postData, { dispatch, getState }) => {
    const response = await axios.get("levelResponse/" + postData.level_id, {
      headers: {
        Authorization: `Bearer ${postData.adminId}`,
      },
    });

    const data = await response.data.data;

    return data;
  }
);

export const getPositions = createAsyncThunk(
  "auth/positions/getPositions",
  async (postData, { dispatch, getState }) => {
    const response = await axios.get("positions", {
      headers: {
        Authorization: `Bearer ${postData.adminId}`,
      },
    });

    const data = await response.data.data.positionData;

    return data;
  }
);

export const getDynamicForms = createAsyncThunk(
  "auth/dynamicForms/getDynamicForms",
  async (postData, { dispatch, getState }) => {
    const response = await axios.get("dynamic-forms", {
      headers: {
        Authorization: `Bearer ${postData.adminId}`,
      },
    });

    const data = await response.data.data;
    return data.dynamicFormsData;
  }
);

export const getAllParentLevels = createAsyncThunk(
  "auth/parent_levels/getAllParentLevels",
  async (postData, { dispatch, getState }) => {
    const response = await axios.get("levelDataUpdate/" + postData.parent_id, {
      headers: {
        Authorization: `Bearer ${postData.adminId}`,
      },
    });

    const data = await response.data.data;

    const parents = await data.parents;

    let dataList = {};
    for (const key in parents) {
      let parent = parents[key];
      dataList[parent.level_id] = [];
      let end_url = parent.level_id;

      if (parent.parent_id) {
        end_url += "/" + parent.parent_id;
      }
      const response = await axios.get("levelDataResponse/" + end_url, {
        headers: {
          Authorization: `Bearer ${postData.adminId}`,
        },
      });
      dataList[parent.level_id] = response.data.data;
    }

    return { data, dataList };
  }
);

export const getLevelsData = createAsyncThunk(
  "auth/member/getLevelsData",
  async (postData, { dispatch, getState }) => {
    let end_url = postData.level_id;

    if (postData.parent_id) {
      end_url += "/" + postData.parent_id;
    }

    const response = await axios.get("levelDataResponse/" + end_url, {
      headers: {
        Authorization: `Bearer ${postData.adminId}`,
      },
    });

    const data = await response.data.data;

    return data;
  }
);

export const getEducationLevels = createAsyncThunk(
  "auth/member/getEducationLevels",
  async (params) => {
    const response = await axios.get("education-levels", {
      headers: {
        Authorization: `Bearer ${params.adminId}`,
      },
    });

    const data = await response.data.data.educationLevelData;

    return data;
  }
);

export const getIndustries = createAsyncThunk(
  "auth/member/getIndustries",
  async (params) => {
    const response = await axios.get("industries", {
      headers: {
        Authorization: `Bearer ${params.adminId}`,
      },
    });

    const data = await response.data.data.industryData;

    return data;
  }
);

export const getProfessions = createAsyncThunk(
  "auth/member/getProfessions",
  async (params) => {
    const response = await axios.get("professions", {
      headers: {
        Authorization: `Bearer ${params.adminId}`,
      },
    });

    const data = await response.data.data.professionData;

    return data;
  }
);

export const getAdmin = createAsyncThunk(
  "auth/admin/getAdmin",
  async (params) => {
    const response = await axios.get("user-data", {
      headers: {
        Authorization: `Bearer ${params.adminId}`,
      },
    });

    const data = await response.data.user_data;

    return data === undefined ? null : data;
  }
);

export const saveMember = createAsyncThunk(
  "auth/member/saveMember",
  async (postData, { dispatch, getState }) => {
    const { member } = getState().auth;

    const fdata = {
      first_name: postData["first_name"] ? postData["first_name"] : "",
      last_name: postData["last_name"] ? postData["last_name"] : "",
      email: postData["email"] ? postData["email"] : "",
      phone_no: postData["phone_no"] ? postData["phone_no"] : "",
      level_id: postData["level_id"] ? postData["level_id"] : "",
      education_level: postData["education_level"]
        ? postData["education_level"]
        : "",
      industry: postData["industry"] ? postData["industry"] : "",
      profession: postData["profession"] ? postData["profession"] : "",
      employment_status: postData["employment_status"]
        ? postData["employment_status"]
        : "",
      id_type: postData["id_type"] ? postData["id_type"] : "",
      id_number: postData["id_number"] ? postData["id_number"] : "",
      gender: postData["gender"] ? postData["gender"] : "",
      date_year_of_joining: postData["date_year_of_joining"]
        ? postData["date_year_of_joining"]
        : "",
      dob: postData["dob"] ? postData["dob"] : "",
      profession_status: postData["profession_status"]
        ? postData["profession_status"]
        : "",
      self_employed: postData["self_employed"] ? postData["self_employed"] : "",
      business_name: postData["business_name"] ? postData["business_name"] : "",
      business_location: postData["business_location"]
        ? postData["business_location"]
        : "",
      position: postData["position"] ? postData["position"] : "",
      profile_pic:
        postData["profile_pic_uploaded"] && postData["profile_pic"]
          ? postData["profile_pic"]
          : "",
      status: postData["status"] ? postData["status"] : "",
      level_id: postData["level_id"] ? postData["level_id"] : "",
      level_data_id: postData["level_data_id"] ? postData["level_data_id"] : "",
      extra_field: postData["extra_field"] ? postData["extra_field"] : {},
    };

    const response = await axios
      .post("members", fdata, {
        headers: {
          Authorization: `Bearer ${postData.adminId}`,
        },
      })
      .catch(function (err) {
        return err.response;
      });
    const data = await { ...response.data, ...postData };

    return data;
  }
);

const memberSlice = createSlice({
  name: "auth/member",
  initialState: null,
  reducers: {
    getLevels: (state, action) => action.payload,
    getLevelsData: (state, action) => action.payload,
    getDynamicForms: (state, action) => action.payload,
    getAllParentLevels: (state, action) => action.payload,
    getEducationLevels: (state, action) => action.payload,
    getIndustries: (state, action) => action.payload,
    getProfessions: (state, action) => action.payload,
    getAdmin: (state, action) => action.payload,
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
    [saveMember.fulfilled]: (state, action) => action.payload,
  },
});

export const { newMember, resetMember } = memberSlice.actions;

export default memberSlice.reducer;
