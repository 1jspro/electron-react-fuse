import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'axios';

export const getAllAssets = createAsyncThunk('assetsApp/assets/getAllAssets', async (postData, { dispatch, getState }) => {
  const response = await axios.get('assets');

  const data = await response.data.data.assetData;

  return data;
});


export const getAssets = createAsyncThunk('assetsApp/assets/getAssets', async (postData) => {
  postData = postData ? postData : {page:0, rowsPerPage:100, searchText: ''}
  const response = await axios.get('assets?page='+(postData.page+1)+'&limit='+postData.rowsPerPage+'&search='+postData.searchText);

  const data = await response.data.data;
  data.assetData = data.assetData.map((a) => {
    a.totalRecords = Number(data.Count);
    return a;
  });

  return data.assetData;
});

export const removeAssets = createAsyncThunk(
  'assetsApp/assets/removeAssets',
  async (assetIds, { dispatch, getState }) => {
    let created_by = getState().auth.user.uuid;
    let Idstr = assetIds.encryptedIds;
    const response = await axios.delete('assets/'+Idstr);
    let data = response.data;
    data.assetIds = [assetIds.ids];
    return data;
  }
);

const assetAdapter = createEntityAdapter({});

export const { selectAll: selectAssets, selectById: selectassetById } =
  assetAdapter.getSelectors((state) => state.assetsApp.assets);

const assetsSlice = createSlice({
  name: 'assetsApp/assets',
  initialState: assetAdapter.getInitialState({
    searchText: '',
  }),
  reducers: {
    setAssetsSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || '' }),
    },
  },
  extraReducers: {
    [getAssets.fulfilled]: assetAdapter.setAll,
    [getAllAssets.fulfilled]: (state, action) => {},
    [removeAssets.fulfilled]: (state, action) =>
      assetAdapter.removeMany(state, action.payload.assetIds),
  },
});

export const { setAssetsSearchText } = assetsSlice.actions;

export default assetsSlice.reducer;
