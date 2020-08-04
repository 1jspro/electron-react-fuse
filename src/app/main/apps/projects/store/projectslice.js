import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import FuseUtils from '@fuse/utils';

export const getProject = createAsyncThunk('projectsApp/project/getProject', async (params) => {
  const response = await axios.get('projects/' + params.projectId);
  // const staff_id = []
  // response.data.data.staffs_names = response.data.data.staffs;
  // response.data.data.staffs && response.data.data.staffs.length > 0 && response.data.data.staffs.map((staff, k) => {
  //   staff_id.push(staff.id)
  // })
  // response.data.data.staffs = staff_id
  const data = response.data.data;

  return data === undefined ? null : data;
});

export const removeProject = createAsyncThunk(
  'projectsApp/project/removeProject',
  async (val, { dispatch, getState }) => {
    const { id } = getState().projectsApp.project;
    await axios.delete('projects/' + id);

    return id;
  }
);

export const saveProject = createAsyncThunk(
  'projectsApp/project/saveProject',
  async (postData, { dispatch, getState }) => {
    const { project } = getState().projectsApp;
    let url = "";
    let response = "";
    postData.staffs = postData.staffs.join(',')
    if (postData.encryption_id) {
      url = 'projects/' + postData.encryption_id;
      response = await axios.put(url, postData);
    } else {
      url = 'projects';
      response = await axios.post(url, postData);
    }

    const data = await response.data;

    console.log(data)
    return data;
  }
);

const projectSlice = createSlice({
  name: 'projectsApp/project',
  initialState: null,
  reducers: {
    resetProject: () => null,
    newProject: {
      reducer: (state, action) => action.payload,
      prepare: (event) => ({
        payload: {
          id: '',
          name: '',
          is_active: true,
        },
      }),
    },
  },
  extraReducers: {
    [getProject.fulfilled]: (state, action) => action.payload,
    [saveProject.fulfilled]: (state, action) => action.payload,
    [removeProject.fulfilled]: (state, action) => null,
  },
});

export const { newProject, resetProject } = projectSlice.actions;

export default projectSlice.reducer;
