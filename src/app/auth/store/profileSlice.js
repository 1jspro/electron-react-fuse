import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { showMessage } from 'app/store/fuse/messageSlice';
import axios from 'axios';
import FuseUtils from '@fuse/utils';


export const getLevels = createAsyncThunk('membersApp/member/getLevels', async (postData, { dispatch, getState }) => {
  let user = getState().auth.user;
  const response = await axios.get('levelResponse/'+user.data.level_id, {});

  const data = await response.data.data;

  return data;
});

export const getPositions = createAsyncThunk('membersApp/positions/getPositions', async (postData, { dispatch, getState }) => {
  const response = await axios.get('positions');

  const data = await response.data.data.positionData;

  return data;
});

export const getDynamicForms = createAsyncThunk('membersApp/dynamicForms/getDynamicForms', async (postData, { dispatch, getState }) => {
  let user = getState().auth.user;
  const response = await axios.get('dynamic-forms');

  const data = await response.data.data;
  return data.dynamicFormsData;
});

export const getAllParentLevels = createAsyncThunk('membersApp/parent_levels/getAllParentLevels', async (postData, { dispatch, getState }) => {
  const response = await axios.get('levelDataUpdate/'+postData.parent_id, {});

  const data = await response.data.data;

  const parents = await data.parents;

  let dataList = {};
  for (const key in parents) {
    let parent = parents[key];
    dataList[parent.level_id] = [];
    let end_url = parent.level_id;

    if (parent.parent_id) {
      end_url += "/"+parent.parent_id;
    }
    const response = await axios.get('levelDataResponse/'+end_url, {});
    dataList[parent.level_id] = response.data.data;
  }

  return {data, dataList};
});


export const getLevelsData = createAsyncThunk('membersApp/member/getLevelsData', async (postData, { dispatch, getState }) => {
  let user = getState().auth.user;

  let end_url = postData.level_id;

  if (postData.parent_id) {
    end_url += "/"+postData.parent_id;
  }

  const response = await axios.get('levelDataResponse/'+end_url, {});

  const data = await response.data.data;

  return data;
});

export const getEducationLevels = createAsyncThunk('membersApp/member/getEducationLevels', async () => {
  const response = await axios.get('education-levels', {});

  const data = await response.data.data.educationLevelData;

  return data;
});

export const getIndustries = createAsyncThunk('membersApp/member/getIndustries', async () => {
  const response = await axios.get('industries', {});

  const data = await response.data.data.industryData;

  return data;
});

export const getProfessions = createAsyncThunk('membersApp/member/getProfessions', async () => {
  const response = await axios.get('professions', {});

  const data = await response.data.data.professionData;

  return data;
});


export const getProfile = createAsyncThunk('auth/profile/getProfile', async (params) => {
  const response = await axios.get('profile', { });

  const data = await response.data.data;

  return data === undefined ? null : data;
});

export const updateProfile = createAsyncThunk(
  'auth/profile/updateProfile',
  async (postData, { dispatch, getState }) => {

    const user = getState().auth.user;


    postData["roles"] = user.role[0];
    postData['org_image'] = (postData['org_image_uploaded'] && postData['org_image']) ? postData['org_image'] : "";
    postData['org_image_two'] = (postData['org_image_two_uploaded'] && postData['org_image_two']) ? postData['org_image_two'] : "";
    postData['signature'] = (postData['signature_uploaded'] && postData['signature']) ? postData['signature'] : "";
    postData['template_front_image_landscape'] = (postData['template_front_image_landscape_uploaded'] && postData['template_front_image_landscape']) ? postData['template_front_image_landscape'] : "";
    postData['template_back_image_landscape'] = (postData['template_back_image_landscape_uploaded'] && postData['template_back_image_landscape']) ? postData['template_back_image_landscape'] : "";
    postData['template_front_image_portrait'] = (postData['template_front_image_portrait_uploaded'] && postData['template_front_image_portrait']) ? postData['template_front_image_portrait'] : "";
    postData['template_back_image_portrait'] = (postData['template_back_image_portrait_uploaded'] && postData['template_back_image_portrait']) ? postData['template_back_image_portrait'] : "";
    

    if (user.role[0] == "member" || user.role[0] == "member-admin") {
      postData = {
        first_name: postData['first_name'] ? postData['first_name'] : "",
        last_name: postData['last_name'] ? postData['last_name'] : "",
        email: postData['email'] ? postData['email'] : "",
        phone_no: postData['phone_no'] ? postData['phone_no'] : "",
        level_id: postData['level_id'] ? postData['level_id'] : "",
        education_level: postData['education_level'] ? postData['education_level'] : "",
        industry: postData['industry'] ? postData['industry'] : "",
        profession: postData['profession'] ? postData['profession'] : "",
        employment_status: postData['employment_status'] ? postData['employment_status'] : "",
        id_type: postData['id_type'] ? postData['id_type'] : "",
        id_number: postData['id_number'] ? postData['id_number'] : "",
        gender: postData['gender'] ? postData['gender'] : "",
        date_year_of_joining: postData['date_year_of_joining'] ? postData['date_year_of_joining'] : "",
        dob: postData['dob'] ? postData['dob'] : "",
        policy_number: postData['policy_number'] ? postData['policy_number'] : "",
        // profession_status: postData['profession_status'] ? postData['profession_status'] : "",
        self_employed: postData['self_employed'] ? postData['self_employed'] : "",
        business_name: postData['business_name'] ? postData['business_name'] : "",
        business_location: postData['business_location'] ? postData['business_location'] : "",
        position: postData['position'] ? postData['position'] : "",
        profile_pic: (postData['profile_pic_uploaded'] && postData['profile_pic']) ? postData['profile_pic'] : "",
        status: postData['status'] ? postData['status'] : "",
        level_id: postData['level_id'] ? postData['level_id'] : "",
        level_data_id: postData['level_data_id'] ? postData['level_data_id'] : "",
        extra_field: postData['extra_field'] ? postData['extra_field'] : {},
        encryption_id: postData.encryption_id
      }
    }

    if (user.role[0] == "staff" || user.role[0] == "supervisor") {
     let newData = {
        first_name: postData['first_name'] ? postData['first_name'] : "",
        last_name: postData['last_name'] ? postData['last_name'] : "",
        email: postData['email'] ? postData['email'] : "",
        phone_no: postData['phone_no'] ? postData['phone_no'] : "",
        country: postData['country'] ? postData['country'] : "",
        region: postData['region'] ? postData['region'] : "",
        city: postData['city'] ? postData['city'] : "",
        address: postData['address'] ? postData['address'] : "",
        encryption_id: postData.encryption_id
      }

      if (user.role[0] == "supervisor") {
        newData["profile_pic"] = (postData['profile_pic_uploaded'] && postData['profile_pic']) ? postData['profile_pic'] : "";
      }

      postData = newData;
    }

    const  response = await axios.put('profile/'+postData.encryption_id, postData);
    const data = await response.data;

    return data;
  }
);


export const changePassword = createAsyncThunk(
  'auth/profile/changePassword',
  async (postData, { dispatch, getState }) => {
    const user = getState().auth.user;
    postData.user_id = user.uuid;
    const response = await axios.post('user/change_password', postData);
    const data = await response.data;

    return data;
  }
);

const profileSlice = createSlice({
  name: 'auth/profile',
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
    resetProfile: () => null,
    newProfile: {
      reducer: (state, action) => action.payload,
      prepare: (event) => ({
        payload: {
          id: '',
          first_name: '',
          last_name: '',
          email: '',
          phone: '',
          profile_pic: ''
        },
      }),
    },  
  },
  extraReducers: {
    [getProfile.fulfilled]: (state, action) => action.payload,
    [updateProfile.fulfilled]: (state, action) => action.payload,
    [changePassword.fulfilled]: (state, action) => action.payload,
  },
});

export const { resetProfile, newProfile } = profileSlice.actions;

export default profileSlice.reducer;
