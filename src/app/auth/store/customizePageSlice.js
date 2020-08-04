
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import FuseUtils from '@fuse/utils';


export const getPageData = createAsyncThunk('customizeLandingPageApp/page/getPageData', async (params, { dispatch, getState }) => {
  let loggedInUser = getState().auth.user.uuid;
  const response = await axios.post('PageCustomization/getPageData', { producer_id: loggedInUser});

  const data = await response.data.data;

  return data === undefined ? null : data;
});

export const checkForPayment = createAsyncThunk('customizeLandingPageApp/page/checkForPayment', async (postData, { dispatch, getState }) => {
  let loggedInUser = getState().auth.user.uuid;
  const response = await axios.post('PageCustomization/checkForPayment', {loggedInUser});

  const data = await response.data;

  return data;
});


export const savePage = createAsyncThunk(
  'customizeLandingPageApp/page/savePage',
  async (pageData, { dispatch, getState }) => {
    let user = getState().auth.user;
    const formData = new FormData();

    formData.append('page_id', pageData['id'] ? pageData['id'] : "");
    formData.append('contact_person_name', pageData['contact_person_name'] ? pageData['contact_person_name'] : "");
    formData.append('contact_person_email', pageData['contact_person_email'] ? pageData['contact_person_email'] : "");
    formData.append('contact_person_phone', pageData['contact_person_phone'] ? pageData['contact_person_phone'] : "");
    formData.append('address', pageData['address'] ? pageData['address'] : "");
    formData.append('description', pageData['description'] ? pageData['description'] : "");
    formData.append('facebook_url', pageData['facebook_url'] ? pageData['facebook_url'] : "");
    formData.append('twitter_url', pageData['twitter_url'] ? pageData['twitter_url'] : "");
    formData.append('linkedin_url', pageData['linkedin_url'] ? pageData['linkedin_url'] : "");
    formData.append('youtube_url', pageData['youtube_url'] ? pageData['youtube_url'] : "");
    formData.append('instagram_url', pageData['instagram_url'] ? pageData['instagram_url'] : "");
    formData.append('pinterest_url', pageData['pinterest_url'] ? pageData['pinterest_url'] : "");
    formData.append('business_name', pageData['business_name'] ? pageData['business_name'] : "");
    formData.append('business_category', pageData['business_category'] ? pageData['business_category'] : "");
    formData.append('business_phone', pageData['business_phone'] ? pageData['business_phone'] : "");
    formData.append('business_website', pageData['business_website'] ? pageData['business_website'] : "");
    formData.append('business_address', pageData['business_address'] ? pageData['business_address'] : "");
    formData.append('gmap_link', pageData['gmap_link'] ? pageData['gmap_link'] : "");
    formData.append('coupon', pageData['coupon'] ? pageData['coupon'] : "");
    formData.append('farmer_markets', pageData['farmer_markets'] ? pageData['farmer_markets'] : "");
    formData.append('farm_stand', pageData['farm_stand'] ? pageData['farm_stand'] : "");
    formData.append('testimonial_1_first_name', pageData['testimonial_1_first_name'] ? pageData['testimonial_1_first_name'] : "");
    formData.append('testimonial_1_last_name', pageData['testimonial_1_last_name'] ? pageData['testimonial_1_last_name'] : "");
    formData.append('testimonial_1_city', pageData['testimonial_1_city'] ? pageData['testimonial_1_city'] : "");
    formData.append('testimonial_1_state', pageData['testimonial_1_state'] ? pageData['testimonial_1_state'] : "");
    formData.append('testimonial_1_feedback', pageData['testimonial_1_feedback'] ? pageData['testimonial_1_feedback'] : "");
    formData.append('testimonial_2_first_name', pageData['testimonial_2_first_name'] ? pageData['testimonial_2_first_name'] : "");
    formData.append('testimonial_2_last_name', pageData['testimonial_2_last_name'] ? pageData['testimonial_2_last_name'] : "");
    formData.append('testimonial_2_city', pageData['testimonial_2_city'] ? pageData['testimonial_2_city'] : "");
    formData.append('testimonial_2_state', pageData['testimonial_2_state'] ? pageData['testimonial_2_state'] : "");
    formData.append('testimonial_2_feedback', pageData['testimonial_2_feedback'] ? pageData['testimonial_2_feedback'] : "");
    formData.append('producer_id', user.uuid);
    formData.append('logo', pageData['image'] ? pageData['image'] : "");

    console.log(pageData);
    let row = 0;
    pageData.images.forEach(function (img, k) {
      formData.append('images['+row+']', img['url']);
      row++;
    });

    let vrow = 0;
    pageData.videos.forEach(function (video, k) {
      if (video && video['link']) {
        formData.append('videos['+vrow+']', video['link']);
        vrow++;
      }
    });

    let erow = 0;
    pageData.events.forEach(function (event, k) {
      formData.append('events['+erow+']', JSON.stringify(event));
      erow++;
    });

    if (pageData['id']) {
      formData.append('created_by', pageData['created_by']);
    }else {
      formData.append('created_by', user.uuid);
    }


    const response = await axios.post('PageCustomization/save', formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    const data = await response.data;

    return data;
  }
);

const customizePageSlice = createSlice({
  name: 'customizeLandingPageApp/page',
  initialState: null,
  reducers: {
    resetPage: () => null,
    newPage: {
      reducer: (state, action) => action.payload,
      prepare: (event) => ({
        payload: {
          id: '',
          contact_person_name: '',
          contact_person_email: '',
          contact_person_phone: '',
          address: '',
          description: '',
          logo: '',
          facebook_url: '',
          twitter_url: '',
          linkedin_url: '',
          instagram_url: '',
          youtube_url: '',
          pinterest_url: '',
          business_name: '',
          business_category: '',
          business_phone: '',
          business_website: '',
          business_address: '',
          gmap_link: '',
          coupon: '',
          farmer_markets: '',
          farm_stand: '',
          testimonial_1_first_name: '',
          testimonial_1_last_name: '',
          testimonial_1_city: '',
          testimonial_1_state: '',
          testimonial_1_feedback: '',
          testimonial_2_first_name: '',
          testimonial_2_last_name: '',
          testimonial_2_city: '',
          testimonial_2_state: '',
          testimonial_2_feedback: '',
          images: [],
          videos: [{"link": ""}],
          events: [{"title": "", "date": "", "description": ""}]
        },
      }),
    },
  },
  extraReducers: {
    [getPageData.fulfilled]: (state, action) => action.payload,
    [checkForPayment.fulfilled]: (state, action) => action.payload,
    [savePage.fulfilled]: (state, action) => action.payload,
  },
});

export const { newPage, resetPage } = customizePageSlice.actions;

export default customizePageSlice.reducer;
