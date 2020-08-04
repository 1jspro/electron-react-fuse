import { createEntityAdapter, createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const getSubscriptions = createAsyncThunk('SubscriptionApp/subscriptions/getSubscriptions', async (postData, { dispatch, getState }) => {
  let loggedInUser = getState().auth.user.uuid;
  const response = await axios.get('subscriptions');

  const data = await response.data.data;

  return data;
});

export const getPackages = createAsyncThunk('SubscriptionApp/packages/getPackages', async (postData, { dispatch, getState }) => {
  const response = await axios.get('packages');

  const data = await response.data.data.packageData;

  return data;
});


export const subscribePackage = createAsyncThunk('SubscriptionApp/package/subscribePackage', async (postData, { dispatch, getState }) => {
  const response = await axios.post('paystack-payment', {package_id:postData.package_id});

  const data = await response.data;

  return data;
});

export const getPaymentInfo = createAsyncThunk('SubscriptionApp/paymentStatus/getPaymentInfo', async (postData, { dispatch, getState }) => {
  const response = await axios.post('payment-response', {reference:postData.reference});

  const data = await response.data;

  return data;
});


const subscriptionAdapter = createEntityAdapter({});

export const { selectEntities: selectSubscriptions, selectById: selectSubscriptionById } =
  subscriptionAdapter.getSelectors((state) => state.SubscriptionApp.subscriptions);

const subscriptionSlice = createSlice({
  name: 'SubscriptionApp/subscriptions',
  initialState: subscriptionAdapter.getInitialState(),
  reducers: {},
  extraReducers: {
    [getSubscriptions.fulfilled]: subscriptionAdapter.setAll,
    [getPackages.fulfilled]: (state, action) => {},
    [subscribePackage.fulfilled]: (state, action) => {},
  },
});

export default subscriptionSlice.reducer;
