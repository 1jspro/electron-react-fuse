import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import FuseUtils from '@fuse/utils';

export const getElection = createAsyncThunk('electionsApp/election/getElection', async (params) => {
  const response = await axios.get('election/' + params.electionId);

  const data = await response.data.data;
  data.candidates = JSON.parse(data.candidates)
  return data === undefined ? null : data;
});

export const getVotingDetails = createAsyncThunk('electionsApp/election/getVotingDetails', async (params) => {
  const response = await axios.get('vote/' + params.electionId);

  const data = await response.data.data;
  if (response.data.data === '') {
    return { message: response.data.message }
  }
  return data === undefined ? null : data;
});

export const getVotingCandidatesDetails = createAsyncThunk('electionsApp/election/getVotingCandidatesDetails', async (params) => {
  const response = await axios.get('candidates?candidates=' + params);

  const data = await response.data.data;
  if (response.data.data === '') {
    return { message: response.data.message }
  }
  return data === undefined ? null : data;
});

export const VotingForCandidates = createAsyncThunk('electionsApp/election/VotingForCandidates', async (params) => {
  const response = await axios.get('voting/' + params.electionId + '?voting_detail=' + JSON.stringify(params.voting_detail)+'')
  /* const response = await axios.put('voting/' + params.electionId, { voting_detail: params.voting_detail }); */

  const data = await response.data.data;
  if (response.data.data === '') {
    return { message: response.data.message }
  }
  return data === undefined ? null : data;
});

export const getMemberLink = createAsyncThunk('electionsApp/election/getMemberLink', async (params) => {
  const response = await axios.get('get_member_link');
  const data = await response.data.data;
  return data === undefined ? null : data;
});

export const removeElection = createAsyncThunk(
  'electionsApp/election/removeElection',
  async (val, { dispatch, getState }) => {
    const { id } = getState().electionsApp.election;
    await axios.delete('election/' + id);

    return id;
  }
);

export const saveElection = createAsyncThunk(
  'electionsApp/election/saveElection',
  async (postData, { dispatch, getState }) => {
    const { election } = getState().electionsApp;
    let url = "";
    let response = "";
    if (postData.encryption_id) {
      postData['name'] = '';
      url = 'election/' + postData.encryption_id;
      response = await axios.put(url, postData);
    } else {
      url = 'election';
      delete postData.id;
      delete postData.name;
      //postData.election_for_level = '27';
      response = await axios.post(url, postData)
        .then((response) => {
          return response
        }).catch((error) => {
          console.error('oops, something went wrong!', error);
        });
    }
    console.log(response)
    const data = await response.data;

    console.log(data)
    return data;
  }
);

const electionSlice = createSlice({
  name: 'electionsApp/election',
  initialState: null,
  reducers: {
    resetElection: () => null,
    newElection: {
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
    [getElection.fulfilled]: (state, action) => action.payload,
    [getVotingDetails.fulfilled]: (state, action) => action.payload,
    [getVotingCandidatesDetails.fulfilled]: (state, action) => action.payload,
    [getMemberLink.fulfilled]: (state, action) => action.payload,
    [saveElection.fulfilled]: (state, action) => action.payload,
    [VotingForCandidates.fulfilled]: (state, action) => action.payload,
    [removeElection.fulfilled]: (state, action) => null,
  },
});

export const { newElection, resetElection } = electionSlice.actions;

export default electionSlice.reducer;
