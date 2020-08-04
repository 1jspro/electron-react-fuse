import { createEntityAdapter, createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const getHomeData = createAsyncThunk('DashboardApp/widgets/getHomeData', async (postData, { dispatch, getState }) => {
  let user = getState().auth.user;
  let apiUrl = "";
  if (user.role[0] == 'super-admin') {
    apiUrl = 'home-super-admin';
  } else if (user.role[0] == 'admin') {
    apiUrl = 'home-admin';
  } else if (user.role[0] == 'member-admin') {
    apiUrl = 'home-member-admin';
  } else {
    apiUrl = 'home-member';
  }

  const response = await axios.get(apiUrl);
  const data = await response.data.data;

  return data;
});

const widgetsAdapter = createEntityAdapter({});

export const { selectEntities: selectWidgets, selectById: selectWidgetById } =
  widgetsAdapter.getSelectors((state) => state.DashboardApp.widgets);

const dashboardSlice = createSlice({
  name: 'DashboardApp/widgets',
  initialState: widgetsAdapter.getInitialState(),
  reducers: {},
  extraReducers: {
    [getHomeData.fulfilled]: widgetsAdapter.setAll,
  },
});

export default dashboardSlice.reducer;
