import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { showMessage } from 'app/store/fuse/messageSlice';
import axios from 'axios';
import FuseUtils from '@fuse/utils';


export const getSettings = createAsyncThunk('auth/settings/getSettings', async (params) => {
  const response = await axios.post('user/getSettings', {});

  const data = await response.data.settings;
console.log(data);
  return data === undefined ? null : data;
});

export const updateSettings = createAsyncThunk(
  'auth/settings/updateSettings',
  async (postData, { dispatch, getState }) => {

    const user = getState().auth.user;
    const formData = new FormData();

    formData.append('website_title', postData['website_title']);
    formData.append('contact', postData['contact']);
    formData.append('email', postData['email']);
    formData.append('address', postData['address']);
    formData.append('about', postData['about']);
    formData.append('logo_lg', postData['logo_lg']);
    formData.append('producer_landing_page_customization_charge', postData['producer_landing_page_customization_charge']);
    formData.append('facebook_url', postData['facebook_url'] ? postData['facebook_url'] : "");
    formData.append('linkedin_url', postData['linkedin_url'] ? postData['linkedin_url'] : "");
    formData.append('twitter_url', postData['twitter_url'] ? postData['twitter_url'] : "");
    formData.append('instagram_url', postData['instagram_url'] ? postData['instagram_url'] : "");
    formData.append('youtube_url', postData['youtube_url'] ? postData['youtube_url'] : "");


    const response = await axios.post('user/saveSettings', formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    const data = await response.data;


    return data;
  }
);



const settingsSlice = createSlice({
  name: 'auth/settings',
  initialState: null,
  reducers: {
    resetSettings: () => null,
    newSettings: {
      reducer: (state, action) => action.payload,
      prepare: (event) => ({
        payload: {
          id: '',
          website_title: '',
          contact: '',
          email: '',
          address: '',
          about: '',
          logo_lg: ''
        },
      }),
    },  
  },
  extraReducers: {
    [getSettings.fulfilled]: (state, action) => action.payload,
    [updateSettings.fulfilled]: (state, action) => action.payload,
  },
});

export const { resetSettings, newSettings } = settingsSlice.actions;

export default settingsSlice.reducer;
