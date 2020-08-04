import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'axios';

export const getAllPackages = createAsyncThunk('packagesApp/packages/getAllPackages', async (postData, { dispatch, getState }) => {
  const response = await axios.get('packages');

  const data = await response.data.data.packageData;

  return data;
});

export const getPackages = createAsyncThunk('packagesApp/packages/getPackages', async (postData) => {
  postData = postData ? postData : {page:0, rowsPerPage:100, searchText: ''}
  const response = await axios.get('packages?page='+(postData.page+1)+'&limit='+postData.rowsPerPage+'&search='+postData.searchText);

  const data = await response.data.data;
  data.packageData = data.packageData.map((a) => {
    a.totalRecords = Number(data.Count);
    return a;
  });

  return data.packageData;
});

export const removePackages = createAsyncThunk(
  'packagesApp/packages/removePackages',
  async (packageIds, { dispatch, getState }) => {
    let created_by = getState().auth.user.uuid;
    let Idstr = packageIds.encryptedIds;
    const response = await axios.delete('packages/'+Idstr);
    let data = response.data;
    data.packageIds = [packageIds.ids];
    return data;
  }
);

const packageAdapter = createEntityAdapter({});

export const { selectAll: selectPackages, selectById: selectPackageById } =
  packageAdapter.getSelectors((state) => state.packagesApp.packages);

const packagesSlice = createSlice({
  name: 'packagesApp/packages',
  initialState: packageAdapter.getInitialState({
    searchText: '',
  }),
  reducers: {
    setPackagesSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || '' }),
    },
  },
  extraReducers: {
    [getPackages.fulfilled]: packageAdapter.setAll,
    [getAllPackages.fulfilled]: (state, action) => {},
    [removePackages.fulfilled]: (state, action) =>
      packageAdapter.removeMany(state, action.payload.packageIds),
  },
});

export const { setPackagesSearchText } = packagesSlice.actions;

export default packagesSlice.reducer;
