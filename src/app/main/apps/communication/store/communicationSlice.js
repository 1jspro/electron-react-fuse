import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { showMessage } from 'app/store/fuse/messageSlice';
import axios from 'axios';
import FuseUtils from '@fuse/utils';

export const getMembers = createAsyncThunk('CommunicationApp/members/getMembers', async () => {
  const response = await axios.get('members');

  const data = await response.data.data.members;

  return data;
});

export const getStaff = createAsyncThunk('CommunicationApp/staff/getStaff', async () => {
  const response = await axios.get('staffs', {});

  const data = await response.data.data.staffs;

  return data;
});


export const sendMessage = createAsyncThunk(
  'CommunicationApp/communication/sendMessage',
  async (postData, { dispatch, getState }) => {

    console.log(postData);
    const user = getState().auth.user;

    const  response = await axios.put('communication', postData);
    const data = await response.data;

    return data;
  }
);


const communicationSlice = createSlice({
  name: 'CommunicationApp/communication',
  initialState: null,
  reducers: {
    getMembers: (state, action) => action.payload,
    getStaff: (state, action) => action.payload,
    resetMessage: () => null,
    newMessage: {
      reducer: (state, action) => action.payload,
      prepare: (event) => ({
        payload: {
          user_type: "members",
          users: "",
          message: ""
        },
      }),
    },  
  },
  extraReducers: {
    [sendMessage.fulfilled]: (state, action) => action.payload,
  },
});

export const { resetMessage, newMessage } = communicationSlice.actions;

export default communicationSlice.reducer;
