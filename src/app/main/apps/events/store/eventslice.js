import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import FuseUtils from '@fuse/utils';

export const getEvent = createAsyncThunk('eventsApp/event/getEvent', async (params) => {
  const response = await axios.get('event/' + params.eventId);

  const data = await response.data.data;
  return data === undefined ? null : data;
});

export const removeEvent = createAsyncThunk(
  'eventsApp/event/removeEvent',
  async (val, { dispatch, getState }) => {
    const { id } = getState().eventsApp.event;
    await axios.delete('event/' + id);

    return id;
  }
);

export const getEventList = createAsyncThunk('electionsApp/election/getEventList', async (params) => {
  const response = await axios.get('get_event_list/'+params);

  const data = await response.data.data;
  if (response.data.data === '') {
    return { message: response.data.message }
  }
  return data === undefined ? null : data;
});

export const AttendingEvent = createAsyncThunk('electionsApp/election/AttendingEvent', async (params) => {
  const response = await axios.get('attending/'+params.encryption_id+'?event_id='+params.event_id);

  const data = await response.data.data;
  if (response.data.data === '') {
    return { message: response.data.message }
  }
  return data === undefined ? null : data;
});

export const saveEvent = createAsyncThunk(
  'eventsApp/event/saveEvent',
  async (postData, { dispatch, getState }) => {
    const { event } = getState().eventsApp;
    let url = "";
    let response = "";
    if (postData.encryption_id) {
      url = 'event/' + postData.encryption_id;
      response = await axios.put(url, postData);
    } else {
      url = 'event';
      response = await axios.post(url, postData)
    }
    if (response.data.data === '') {
      return { message: response.data.message }
    }
    const data = await response.data;
    return data;
  }
);

const eventSlice = createSlice({
  name: 'eventsApp/event',
  initialState: null,
  reducers: {
    resetEvent: () => null,
    newEvent: {
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
    [getEvent.fulfilled]: (state, action) => action.payload,
    [getEventList.fulfilled]: (state, action) => action.payload,
    [AttendingEvent.fulfilled]: (state, action) => action.payload,
    [saveEvent.fulfilled]: (state, action) => action.payload,
    [removeEvent.fulfilled]: (state, action) => null,
  },
});

export const { newEvent, resetEvent } = eventSlice.actions;

export default eventSlice.reducer;
