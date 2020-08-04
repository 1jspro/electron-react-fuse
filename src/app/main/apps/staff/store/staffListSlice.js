import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'axios';


export const getAllStaff = createAsyncThunk('staffApp/staffList/getAllStaff', async (postData, { dispatch, getState }) => {
  let loggedInUser = getState().auth.user.uuid;
  const response = await axios.get('staffs');

  const data = await response.data.data.staffs;

  return data;
});

export const getStaff = createAsyncThunk('staffApp/staffList/getStaff', async (postData, { dispatch, getState }) => {
  let loggedInUser = getState().auth.user.uuid;
  postData = postData ? postData : {page:0, rowsPerPage:100, searchText: ''}
  const response = await axios.get('staffs?page='+(postData.page+1)+'&limit='+postData.rowsPerPage+'&search='+postData.searchText);

  let data = await response.data.data;

  data.staffs = data.staffs.map((a) => {
    a.totalPage = Number(data.memberCount);
    return a;
  });

  return data.staffs;
});

export const removeStaff = createAsyncThunk(
  'staffApp/staffList/removeStaff',
  async (staffIds, { dispatch, getState }) => {
    let created_by = getState().auth.user.uuid;
    let Idstr = staffIds.encryptedIds;
    const response = await axios.delete('staffs/'+Idstr);
    let data = response.data;
    data.staffIds = [staffIds.ids];

    return data;
  }
);


const staffAdapter = createEntityAdapter({});


export const { selectAll: selectStaffList, selectById: selectStaffById } =
  staffAdapter.getSelectors((state) => state.staffApp.staffList);

const staffListSlice = createSlice({
  name: 'staffApp/staffList',
  initialState: staffAdapter.getInitialState({
    searchText: '',
  }),
  reducers: {
    setStaffListSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
        // console.log(action);
      },
      prepare: (event) => ({ payload: event.target.value || '' }),
    },
  },
  extraReducers: {
    [getStaff.fulfilled]: staffAdapter.setAll,
    [getAllStaff.fulfilled]: (state, action) => {},
    [removeStaff.fulfilled]: (state, action) => {
      staffAdapter.removeMany(state, action.payload.staffIds);
    },
  },
});

export const { setStaffListSearchText } = staffListSlice.actions;

export default staffListSlice.reducer;
