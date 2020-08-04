import FuseLoading from '@fuse/core/FuseLoading';
import FusePageSimple from '@fuse/core/FusePageSimple';
import FusePageCarded from '@fuse/core/FusePageCarded';
import 'font-awesome/css/font-awesome.min.css';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import DOMPurify from 'dompurify';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from "@mui/material/MenuItem";
import { styled } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tab from '@mui/material/Tab';
import Icon from '@mui/material/Icon';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import PageHeader from './PageHeader';
import { getElection, getVotingDetails, getVotingCandidatesDetails, VotingForCandidates } from '../store/electionslice';
import * as yup from 'yup';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useForm, FormProvider, useFormContext, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { showMessage } from 'app/store/fuse/messageSlice';
const Root = styled(FusePageCarded)(({ theme }) => ({
  '& .FusePageCarded-header': {
    minHeight: 72,
    height: 72,
    alignItems: 'center',
    [theme.breakpoints.up('sm')]: {
      minHeight: 136,
      height: 136,
    },
  },

  '& .FusePageCarded-toolbar': {
    minHeight: 72,
    height: 72,
    alignItems: 'center',
    [theme.breakpoints.up('sm')]: {
      minHeight: 110,
      height: 110,
    },
  },

  '& .productImageUpload': {
    transitionProperty: 'box-shadow',
    transitionDuration: theme.transitions.duration.short,
    transitionTimingFunction: theme.transitions.easing.easeInOut,
  },

  '& .productImageItem': {
    transitionProperty: 'box-shadow',
    transitionDuration: theme.transitions.duration.short,
    transitionTimingFunction: theme.transitions.easing.easeInOut,
    '&:hover': {
      '& .productImageFeaturedStar': {
        opacity: 0.8,
      },
    },
    '&.featured': {
      pointerEvents: 'none',
      boxShadow: theme.shadows[3],
      '& .productImageFeaturedStar': {
        opacity: 1,
      },
      '&:hover .productImageFeaturedStar': {
        opacity: 1,
      },
    },
  },
}));

const schema = yup.object().shape({
  voting_detail: yup.object().shape({
    candidate: yup.string().required('You must select candidate'),
    position: yup.string().required('You must select position'),
  })
});

function Details() {
  const dispatch = useDispatch();
  const routeParams = useParams();
  const [election, setElection] = useState({});
  const [Candidate, setCandidate] = useState({});
  const [loading, setLoading] = useState(true);
  const [Role, setRole] = useState('');
  const theme = useTheme();

  const methods = useForm({
    mode: 'onChange',
    defaultValues: {
      voting_detail: []
    },
    resolver: yupResolver(schema),
  });
  const { reset, watch, control, onChange, formState, setValue, getValues } = methods;
  const { isValid, dirtyFields, errors } = formState;
  const form = watch();
  const navigate = useNavigate();
  useEffect(() => {
    setRole(JSON.parse(localStorage.getItem('sessionDatas')).roles)

    if (JSON.parse(localStorage.getItem('sessionDatas')).roles === 'member-admin' || JSON.parse(localStorage.getItem('sessionDatas')).roles === 'member') {
      dispatch(getVotingDetails(routeParams)).then((action) => {
        if (action.payload.message !== undefined) {
          dispatch(showMessage({ message: action.payload.message }));
          navigate('/apps/elections');
        }
        setElection(action.payload);
        setLoading(false);
      });
    } else {
      dispatch(getElection(routeParams)).then((action) => {
        action.payload.votes_summary = JSON.parse(action.payload.votes_summary)
        setElection(action.payload);
        setLoading(false);
      });
    }
  }, [dispatch]);
  function handleVoteElection() {
    dispatch(VotingForCandidates({ electionId: routeParams.electionId, voting_detail: getValues().voting_detail })).then((action) => {
      dispatch(showMessage({ message: (action.payload.message !== undefined) ? action.payload.message : 'Something went wrong!' }));
      navigate('/apps/elections');
    });
  }

  /**
   * Wait while election data is loading
   */
  if (loading) {
    return <FuseLoading />;
  }
  return (
    <Root
      header={<PageHeader />}
      contentToolbar={
        <>
          <div className="w-full px-24  flex flex-col md:flex-row flex-1 items-center">

            <div className="flex flex-col md:flex-row flex-1 items-center justify-between p-8">
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0, transition: { delay: 0.2 } }}
              >
                <Typography
                  className="md:px-16 text-16 md:text-20 font-semibold tracking-tight"
                  variant="h4"
                  color="inherit"
                >
                  {election.election_name}
                </Typography>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0, transition: { delay: 0.2 } }}
              >
                <Typography
                  className="md:px-16 text-16 md:text-20 font-semibold tracking-tight"
                  variant="h4"
                  color="inherit"
                >
                  {'Status:'} <small className="text-secondary font-medium"> {election.election_status} </small>
                </Typography>
              </motion.div>
            </div>
          </div>
        </>
      }
      content={
        <div className="p-16 sm:p-24">
          <div>
            {Role === 'member-admin' || Role === 'member' ?
              <FormProvider {...methods}>
                <div className='flex flex-row w-full'>
                  {election && election.candidates.length > 0 && election.candidates.map((ele, k) => {
                    return (<>
                      <Controller
                        name={`voting_detail[${k}].candidate`}
                        control={control}
                        className="px-3"
                        render={({ field }) => (
                          <FormControl fullWidth className='px-3 w-full sm:w-1/2 lg:w-1/2' >
                            <InputLabel id={`voting_detail_${k}_candidate`}>Candidate For {ele.position.name}</InputLabel>
                            {/* mt-8 mb-16 px-3 */}
                            <Select
                              {...field}
                              id={`voting_detail_${k}_candidate`}
                              labelId={"member-simple-select-label"}
                              label="Select Candidate"
                              className="mb-16 px-3"
                              onChange={(e) => {
                                setValue(`voting_detail[${k}].position`, ele.position.id)
                                setValue(`voting_detail[${k}].candidate`, e.target.value)
                              }}
                            >
                              <MenuItem key={"el_0"} value={""}>Select</MenuItem>
                              {ele.candidates && ele.candidates.length > 0 && ele.candidates.map((member, k) => {
                                return (<MenuItem key={"el_" + member.id + ""} value={member.id + ""} >{member.first_name} {member.last_name}</MenuItem>)
                              })}
                            </Select>
                          </FormControl>
                        )}
                      />
                    </>)
                  })}


                  <motion.div
                    className=""
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0, transition: { delay: 0.3 } }}
                  >
                    <Button
                      className="whitespace-nowrap "
                      variant="contained"
                      color="secondary"
                      /* disabled={(!isValid)} */
                      onClick={handleVoteElection}
                    >
                      Vote
                    </Button>
                  </motion.div>
                </div>
              </FormProvider>
              : ''}
            <table className="detailTable infoTable" style={{ float: 'none' }}>
              <tbody>
                {/* label="Select Member" */}
                <tr>
                  <th className="titleWidth" align="left">Start Date:</th>
                  <td align="left">{election.start_date ? election.start_date : '-'}</td>
                  <th className="titleWidth" align="left">End Date: </th>
                  <td align="left">{election.end_date ? election.end_date : '-'}</td>
                </tr>
                <tr>
                  <th className="titleWidth" align="left">Description:</th>
                  <td align="left" colSpan={3}>{election.description ? election.description : '-'}</td>
                </tr>
              </tbody>
            </table>

          </div>

          {Role === 'admin' ? <div>
            <Typography
              className="mx-16 mt-20 mb-16 text-16 md:text-20 font-semibold tracking-tight"
              variant="h4"
              color="inherit"
            >
              Vote Summary
            </Typography>
            {election && election.member_details.length > 0 && election.member_details.map((ele, k) => {
              var votes = election.votes_summary.filter((e) => e.position == ele.position.id)[0]
              var _votes_ = []
              if(votes?.candidates && votes?.candidates.length > 0){
                votes?.candidates.map((_eleCandidate_, k) => {
                  let __v__ = _eleCandidate_.split(':')
                  _votes_.push({id : __v__[0], votes : __v__[1]})
                })
              }
              if(ele.candidates && ele.candidates.length > 0){
                ele.candidates.map((eleCandidate, k) => {
                  ele.candidates[k]['votes'] = _votes_.filter((e) => e.id == eleCandidate.id)[0].votes
                })
              }
              return (<div className='mt-16 mb-16'>
                <Typography
                  className="px-16 text-14 font-semibold tracking-tight"
                  variant="h5"
                  color="inherit"
                >
                  {ele.position.name}
                </Typography>
                {ele.candidates && ele.candidates.length > 0 ?
                  <div className='m-8 px-16'>
                    {ele.candidates.map((eleCandidate, k) => {
                      return (<div className=''>
                        {/* &#8226; &bull;  */}&#x2022; {eleCandidate.first_name} {eleCandidate.last_name} - <b>{eleCandidate.votes} Vote(s)</b>
                      </div>)
                    })}
                  </div>
                  : ''}
              </div>
              )
            })}
          </div> : ''}
        </div>
      }
    />
  );
}

export default Details;
