import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'axios';


export const getAllSupervisors = createAsyncThunk('supervisorsApp/supervisors/getAllSupervisors', async (postData, { dispatch, getState }) => {
  let loggedInUser = getState().auth.user.uuid;
  const response = await axios.get('supervisor');

  const data = await response.data.data.supervisor;

  return data;
});

export const getSupervisors = createAsyncThunk('supervisorsApp/supervisors/getSupervisors', async (postData, { dispatch, getState }) => {
  let loggedInUser = getState().auth.user.uuid;
  postData = postData ? postData : {page:0, rowsPerPage:100, searchText: ''}
  const response = await axios.get('supervisor?page='+(postData.page+1)+'&limit='+postData.rowsPerPage+'&search='+postData.searchText);

  let data = await response.data.data;

  data.supervisor = data.supervisor.map((a) => {
    a.totalPage = Number(data.supervisorCount);
    return a;
  });

  return data.supervisor;
});

export const getSupervisorProfile = createAsyncThunk('supervisorsApp/supervisorProfile/getSupervisorProfile', async (postData, { dispatch, getState }) => {
  const response = await axios.get('user-data');

  const data = await response.data;

  return data;
});

export const getSupervisorToken = createAsyncThunk('supervisorsApp/supervisorToken/getSupervisorToken', async (postData, { dispatch, getState }) => {
  const response = await axios.post('user-token', postData);

  const data = await response.data;

  return data;
});


export const removeSupervisors = createAsyncThunk(
  'supervisorsApp/supervisors/removeSupervisors',
  async (supervisorIds, { dispatch, getState }) => {
    let created_by = getState().auth.user.uuid;
    let Idstr = supervisorIds.encryptedIds;
    const response = await axios.delete('supervisor/'+Idstr);
    let data = response.data;
    data.supervisorIds = [supervisorIds.ids];

    return data;
  }
);


const supervisorsAdapter = createEntityAdapter({});


export const { selectAll: selectSupervisors, selectById: selectSupervisorById } =
  supervisorsAdapter.getSelectors((state) => state.supervisorsApp.supervisors);

const supervisorsSlice = createSlice({
  name: 'supervisorsApp/supervisors',
  initialState: supervisorsAdapter.getInitialState({
    searchText: '',
  }),
  reducers: {
    setSupervisorsSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
        // console.log(action);
      },
      prepare: (event) => ({ payload: event.target.value || '' }),
    },
  },
  extraReducers: {
    [getSupervisors.fulfilled]: supervisorsAdapter.setAll,
    [getAllSupervisors.fulfilled]: (state, action) => {},
    [getSupervisorToken.fulfilled]: (state, action) => {},
    [getSupervisorProfile.fulfilled]: (state, action) => {},
    [removeSupervisors.fulfilled]: (state, action) => {
      supervisorsAdapter.removeMany(state, action.payload.supervisorIds);
    },
  },
});

export const { setSupervisorsSearchText } = supervisorsSlice.actions;

export default supervisorsSlice.reducer;
