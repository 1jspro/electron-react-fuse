import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import FuseUtils from '@fuse/utils';

export const getEducationLevel = createAsyncThunk('educationLevelsApp/educationLevel/getEducationLevel', async (params) => {
  console.log(params);
  const response = await axios.get('education-levels/'+params.levelId);

  const data = await response.data.status;

  return data === undefined ? null : data;
});

export const removeEducationLevel = createAsyncThunk(
  'educationLevelsApp/educationLevel/removeEducationLevel',
  async (val, { dispatch, getState }) => {
    const { id } = getState().educationLevelsApp.educationLevel;
    await axios.delete('education-levels/'+id);

    return id;
  }
);

export const saveEducationLevel = createAsyncThunk(
  'educationLevelsApp/educationLevel/saveEducationLevel',
  async (postData, { dispatch, getState }) => {
    const { educationLevel } = getState().educationLevelsApp;
    let url = "";
    let response = "";
    if (postData.encryption_id) {
      url = 'education-levels/'+postData.encryption_id;
      response = await axios.put(url, postData);
    } else {
      url = 'education-levels';
      response = await axios.post(url, postData);
    }
    
    const data = await response.data;

    console.log(data)
    return data;
  }
);

const educationLevelSlice = createSlice({
  name: 'educationLevelsApp/educationLevel',
  initialState: null,
  reducers: {
    resetLevel: () => null,
    newLevel: {
      reducer: (state, action) => action.payload,
      prepare: (event) => ({
        payload: {
          id: '',
          name: '',
          price: 0,
          image: '',
          is_active: true,
        },
      }),
    },
  },
  extraReducers: {
    [getEducationLevel.fulfilled]: (state, action) => action.payload,
    [saveEducationLevel.fulfilled]: (state, action) => action.payload,
    [removeEducationLevel.fulfilled]: (state, action) => null,
  },
});

export const { newLevel, resetLevel } = educationLevelSlice.actions;

export default educationLevelSlice.reducer;
