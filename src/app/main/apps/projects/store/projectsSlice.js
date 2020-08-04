import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'axios';

export const getAllProjects = createAsyncThunk('projectsApp/projects/getAllProjects', async (postData, { dispatch, getState }) => {
  const response = await axios.get('projects');

  const data = await response.data.data.projectData;

  return data;
});

export const getProjectDashboard = createAsyncThunk('projectsApp/projects/getProjectDashboard', async (postData, { dispatch, getState }) => {
  const response = await axios.get('project-dashboard');

  const data = await response.data.data;

  return data;
});


export const getProjects = createAsyncThunk('projectsApp/projects/getProjects', async (postData) => {
  postData = postData ? postData : { page: 0, rowsPerPage: 100, searchText: '' }
  const response = await axios.get('projects?page=' + (postData.page + 1) + '&limit=' + postData.rowsPerPage + '&search=' + postData.searchText);

  const data = await response.data.data;
  data.projectData = data.projectData.map((a) => {
    a.totalRecords = Number(data.Count);
    return a;
  });

  return data.projectData;

});

export const removeProjects = createAsyncThunk(
  'projectsApp/projects/removeProjects',
  async (projectIds, { dispatch, getState }) => {
    let created_by = getState().auth.user.uuid;
    let Idstr = projectIds.encryptedIds;
    const response = await axios.delete('projects/' + Idstr);
    let data = response.data;
    data.projectIds = [projectIds.ids];
    return data;
  }
);

const projectsAdapter = createEntityAdapter({});

export const { selectAll: selectProjects, selectById: selectPositionById } =
  projectsAdapter.getSelectors((state) => state.projectsApp.projects);

const projectsSlice = createSlice({
  name: 'projectsApp/projects',
  initialState: projectsAdapter.getInitialState({
    searchText: '',
  }),
  reducers: {
    setProjectsSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || '' }),
    },
  },
  extraReducers: {
    [getAllProjects.fulfilled]: (state, action) => { },
    [getProjectDashboard.fulfilled]: (state, action) => { },
    [getProjects.fulfilled]: projectsAdapter.setAll,
    [removeProjects.fulfilled]: (state, action) =>
      projectsAdapter.removeMany(state, action.payload.projectIds),
  },
});

export const { setProjectsSearchText } = projectsSlice.actions;

export default projectsSlice.reducer;
