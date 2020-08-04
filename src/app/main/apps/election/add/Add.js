import FuseLoading from '@fuse/core/FuseLoading';
import FusePageCarded from '@fuse/core/FusePageCarded';
import { useDeepCompareEffect } from '@fuse/hooks';
import Button from '@mui/material/Button';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import withReducer from 'app/store/withReducer';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams, useNavigate } from 'react-router-dom';
import _ from '@lodash';
import { useForm, FormProvider, useFormContext, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Switch from "@mui/material/Switch";
import MenuItem from "@mui/material/MenuItem";
import Select from '@mui/material/Select';
import InputAdornment from '@mui/material/InputAdornment';
import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import FormControlLabel from '@mui/material/FormControlLabel';
import Autocomplete from '@mui/material/Autocomplete';
import { resetElection, newElection, getElection, saveElection, getVotingDetails } from '../store/electionslice';
import reducer from '../store';
import PageHeader from './PageHeader';
import clsx from 'clsx';
import FuseUtils from '@fuse/utils';
import { showMessage } from 'app/store/fuse/messageSlice';
import { getStaff } from '../../staff/store/staffListSlice';
import { getMembers } from "../../members/store/membersSlice";
import { getLevelDataList } from "../../level-data/store/levelDataListSlice";
import { getAllPositions } from "../../positions/store/positionsSlice";

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

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  election_name: yup.string().required('You must enter election title'),
  start_date: yup.string().required('You must enter start date'),
  end_date: yup.string().required('You must enter end date'),
  election_status: yup.string().required('You must select status'),
});

function Election(props) {
  const dispatch = useDispatch();
  const election = useSelector(({ electionsApp }) => electionsApp.election);
  const navigate = useNavigate();

  const routeParams = useParams();
  const [noElection, setNoElection] = useState(false);
  const [LevelData, setLevelData] = useState(null);
  const [MemberData, setMemberData] = useState(null);
  const [PositionData, setPositionData] = useState(null);

  const methods = useForm({
    mode: 'onChange',
    defaultValues: {
      candidates: [
        {
          "candidates": [266, 23],
          "position": 4
        },
        {
          "candidates": [1486, 23],
          "position": 3
        }
      ],
      is_active: 1,
      name: '',
    },
    resolver: yupResolver(schema),
  });
  const { reset, watch, control, onChange, formState, setValue, getValues } = methods;
  const { isValid, dirtyFields, errors } = formState;
  const form = watch();

  useDeepCompareEffect(() => {
    function updateElectionState() {
      const { electionId } = routeParams;

      if (electionId === 'new') {
        /**
         * Create New election data
         */
        dispatch(newElection());
      } else {
        /**
         * Get election data
         */
        dispatch(getElection(routeParams)).then((action) => {
          /**
           * If the requested election is not exist show message
           */
          if (!action.payload) {
            setNoElection(true);
          } else {

          }
        });
        /* dispatch(getVotingDetails(routeParams)).then((action) => {
        }) */
      }
    }

    updateElectionState();
  }, [dispatch, routeParams]);

  useEffect(() => {
    if (!election) {
      return;
    }
    /**
     * Reset the form on election state changes
     */
    reset(election);
  }, [election, reset]);

  useEffect(() => {
    dispatch(getMembers()).then((action) => {
      setMemberData(action.payload);
    });
    dispatch(getLevelDataList()).then((action) => {
      setLevelData(action.payload);
    });

    dispatch(getAllPositions()).then((action) => {
      setPositionData(action.payload);
    });


    return () => {
      /**
       * Reset elections on component unload
       */
      dispatch(resetElection());
      setNoElection(false);
    };
  }, [dispatch]);

  function handleSaveElection() {
    dispatch(saveElection(getValues())).then((action) => {
      dispatch(showMessage({ message: action.payload.message }));
      navigate('/apps/elections');
    });
  }

  /**
   * Show Message if the requested elections is not exists
   */
  if (noElection) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.1 } }}
        className="flex flex-col flex-1 items-center justify-center h-full"
      >
        <Typography color="textSecondary" variant="h5">
          There is no such data!
        </Typography>
        <Button
          className="mt-24"
          component={Link}
          variant="outlined"
          to="/apps/elections"
          color="inherit"
        >
          Go to Election Page
        </Button>
      </motion.div>
    );
  }

  /**
   * Wait while election data is loading and form is setted
   */
  if (
    _.isEmpty(form) ||
    (election && routeParams.electionId !== election.encryption_id && routeParams.electionId !== 'new')
  ) {
    return <FuseLoading />;
  }
  return (
    <FormProvider {...methods}>
      <Root
        header={<PageHeader />}
        content={
          <div className="p-16 sm:p-24 greyBg">
            <div className='flex flex-wrap -mx-3'>
              <Controller
                name="election_name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    className="mt-8 mb-16 px-3 w-full sm:w-1/1 lg:w-1/1"
                    error={!!errors.election_name}
                    required
                    helperText={errors?.election_name?.message}
                    label="Name"
                    autoFocus
                    id="election_name"
                    variant="outlined"
                    fullWidth
                  />
                )}
              />

              <Controller
                name="election_for_level"
                control={control}
                className="px-3"
                render={({ field }) => (
                  <FormControl fullWidth className='px-3'>
                    <InputLabel id={"member-simple-select-label"}>Level</InputLabel>
                    {/* mt-8 mb-16 px-3 */}
                    <Select
                      {...field}
                      id="election_for_level"
                      labelId={"member-simple-select-label"}
                      label="Select Level"
                      className="mb-16 px-3"
                    /* onChange={(evnt) => handleChange(evnt)}
                    defaultValue="" */
                    >
                      <MenuItem key={"el_0"} value={""}>Select</MenuItem>
                      {LevelData && LevelData.length > 0 && LevelData.map((level, k) => {
                        return (<MenuItem key={"el_" + level.id + ""} value={level.id + ""} >{level.name}</MenuItem>)
                      })}
                    </Select>
                  </FormControl>
                )}
              />

              <Controller
                name="candidates"
                control={control}
                render={({ field }) => {
                  console.log(field.value)
                  return (
                    field.value.length > 0 && field.value.map((cc, i) => {
                      return (
                        <div className='flex flex-row w-full'>
                          <FormControl fullWidth className='px-3'>
                            <InputLabel id={"member-simple-select-label"}>Candidates</InputLabel>
                            <Select

                              id={`candidates_${i}_candidates`}
                              labelId={"member-simple-select-label"}
                              label="Select Candidates"
                              name={`candidates[${i}].candidates`}
                              value={cc.candidates}
                              onChange={(e) => {
                                setValue(`candidates[${i}].candidates`, e.target.value)
                              }}
                              className="mb-16 px-3"
                              multiple
                            >
                              <MenuItem key={"el_0"} value={""}>Select</MenuItem>
                              {MemberData && MemberData.length > 0 && MemberData.map((member, k) => {
                                return (<MenuItem key={"el_" + member.id + ""} value={member.id + ""} >{member.first_name} {member.last_name}</MenuItem>)
                              })}
                            </Select>
                          </FormControl>

                          <FormControl fullWidth className='px-3'>
                            <InputLabel id={"member-simple-select-label"}>Position</InputLabel>
                            <Select
                              id="election_for_Position"
                              labelId={"member-simple-select-label"}
                              label="Select Position"
                              className="mb-16 px-3"
                              name={`candidates[${i}].position`}
                              value={cc.position}
                              onChange={(e) => {
                                setValue(`candidates[${i}].position`, e.target.value)
                              }}
                            >
                              <MenuItem key={"el_0"} value={""}>Select</MenuItem>
                              {PositionData && PositionData.length > 0 && PositionData.map((level, k) => {
                                return (<MenuItem key={"el_" + level.id + ""} value={level.id + ""} >{level.name}</MenuItem>)
                              })}
                            </Select>
                          </FormControl>

                          <motion.div
                            className="sm:w-1/3 mt-4"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0, transition: { delay: 0.3 } }}
                          >
                            {(i > 0) ? <Button
                              className="whitespace-nowrap mx-4 pull-left"
                              variant="contained"
                              color="secondary"
                              onClick={(e) => {
                                e.preventDefault()
                                console.log(e)
                                /* console.log(getValues().candidates) */
                                setValue(`candidates`, getValues().candidates.splice(i, 1))
                              }}
                            >
                              Remove
                            </Button> : ''}
                            <div className="clearfix"></div>
                          </motion.div>
                        </div>
                      )
                    })
                  )
                }}
              />
              <Controller
                name="candidates"
                control={control}
                render={({ field }) => {
                  return (
                    <motion.div
                      className="mt-0 w-full mb-6"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0, transition: { delay: 0.3 } }}
                    >
                      <Button
                        className="whitespace-nowrap mx-4 pull-left"
                        variant="contained"
                        color="secondary"
                        onClick={(e) => {
                          setValue(`candidates`, [...field.value, { candidates: [], position: 0 }])
                        }}
                      >
                        Add More
                      </Button>
                      <div className="clearfix"></div>
                    </motion.div>
                  )
                }}
              />

              <Controller
                name="election_status"
                control={control}
                render={({ field }) => {
                  console.log(field.value)
                  return (
                    <FormControl fullWidth className='mt-8 mb-16 px-3 w-full sm:w-1/2 lg:w-1/2 '>
                      <InputLabel id="election_status">Status</InputLabel>
                      <Select
                        {...field}
                        id='election_status'
                        labelId="election_status"
                        label='Status'
                        className=''
                        value={field.value}
                      >
                        <MenuItem key={'0'} value={''}>Select</MenuItem>
                        <MenuItem key={'Pending'} value={`Pending`}>{`Pending`}</MenuItem>
                        <MenuItem key={'Incompleted'} value={`Incompleted`}>{`Incompleted`}</MenuItem>
                        <MenuItem key={'Finished'} value={`Finished`}>{`Finished`}</MenuItem>
                        <MenuItem key={'Waiting'} value={`Waiting`}>{`Waiting`}</MenuItem>
                        <MenuItem key={'Ongoing'} value={`Ongoing`}>{`Ongoing`}</MenuItem>
                      </Select>
                    </FormControl>
                  )
                }}
              />

              <Controller
                name="start_date"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    className="mt-8 mb-16 px-3 w-full sm:w-1/2 lg:w-1/2"
                    error={!!errors.start_date}
                    required
                    helperText={errors?.start_date?.message}
                    label="Start Date"
                    id="start_date"
                    variant="outlined"
                    type="date"
                    fullWidth
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                )}
              />
              <Controller
                name="end_date"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    className="mt-8 mb-16 px-3 w-full sm:w-1/2 lg:w-1/2"
                    error={!!errors.end_date}
                    required
                    helperText={errors?.end_date?.message}
                    label="End Date"
                    id="end_date"
                    variant="outlined"
                    type="date"
                    fullWidth
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                )}
              />

              <Controller
                name={`description`}
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    className='mt-8 mb-16 px-3 w-full sm:w-1/2 lg:w-1/2 '
                    label={`Description`}
                    placehoder={`Description`}
                    id={`description`}
                    multiline
                    rows={3}
                    type={'text'}
                    variant='outlined'
                    fullWidth
                  />
                )}
              />
            </div>
            <div className="flex -mx-4">
              <Controller
                name="is_active"
                control={control}
                render={({ field }) => {
                  console.log(field.value)
                  return (<FormControlLabel className='px-3' control={<Switch checked={(field.value === 1) ? true : false} name="is_active" />} label={`${(field.value === 1) ? 'Active' : 'Inactive'}`} onChange={(event) => {
                    setValue('is_active', (event.target.checked) ? 1 : 0);
                  }} />)
                }}
              />
            </div>
            <motion.div
              className="mt30"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0, transition: { delay: 0.3 } }}
            >
              <Button
                className="whitespace-nowrap mx-4 pull-right"
                variant="contained"
                color="secondary"
                disabled={(!isValid)}
                onClick={handleSaveElection}
              >
                Save
              </Button>
            </motion.div>
          </div>
        }
        innerScroll
      />
    </FormProvider>
  );
}

export default withReducer('electionsApp', reducer)(Election);
