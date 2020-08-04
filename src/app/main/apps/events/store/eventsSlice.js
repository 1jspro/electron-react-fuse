import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'axios';

export const getAllEvents = createAsyncThunk('eventsApp/events/getAllEvents', async (postData, { dispatch, getState }) => {
  const response = await axios.get('event');

  const data = await response.data.data.eventData;

  return data;
});


export const getEvents = createAsyncThunk('eventsApp/events/getEvents', async (postData) => {
  postData = postData ? postData : { page: 0, rowsPerPage: 100, searchText: '' }
  const response = await axios.get('event?page=' + (postData.page + 1) + '&limit=' + postData.rowsPerPage + '&search=' + postData.searchText);

  const data = await response.data.data;
  data.eventData = data.eventData.map((a) => {
    a.totalRecords = Number(data.Count);
    return a;
  });

  return data.eventData;

});

export const removeEvents = createAsyncThunk(
  'eventsApp/events/removeEvents',
  async (eventIds, { dispatch, getState }) => {
    let created_by = getState().auth.user.uuid;
    let Idstr = eventIds.encryptedIds;
    const response = await axios.delete('event/' + Idstr);
    let data = response.data;
    data.eventIds = [eventIds.ids];
    return data;
  }
);

const eventsAdapter = createEntityAdapter({});

export const { selectAll: selectEvents, selectById: selectPositionById } =
  eventsAdapter.getSelectors((state) => state.eventsApp.events);

const eventsSlice = createSlice({
  name: 'eventsApp/events',
  initialState: eventsAdapter.getInitialState({
    searchText: '',
  }),
  reducers: {
    setEventsSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || '' }),
    },
  },
  extraReducers: {
    [getAllEvents.fulfilled]: (state, action) => { },
    [getEvents.fulfilled]: eventsAdapter.setAll,
    [removeEvents.fulfilled]: (state, action) =>
      eventsAdapter.removeMany(state, action.payload.eventIds),
  },
});

export const { setEventsSearchText } = eventsSlice.actions;

export default eventsSlice.reducer;
