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
import { resetEvent, newEvent, getEvent, saveEvent } from '../store/eventslice';
import reducer from '../store';
import PageHeader from './PageHeader';
import clsx from 'clsx';
import FuseUtils from '@fuse/utils';
import { showMessage } from 'app/store/fuse/messageSlice';
import { getStaff } from '../../staff/store/staffListSlice';
import { getMembers } from "../../members/store/membersSlice";
import { getLevelDataList } from "../../level-data/store/levelDataListSlice";

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
  event_name: yup.string().required('You must enter event name'),
  start_date: yup.string().required('You must enter start date'),
  end_date: yup.string().required('You must enter end date'),
  venue: yup.string().required('You must enter venue'),
  agenda: yup.string().required('You must enter agenda'),
  event_for_level: yup.string().required('This field is required'),
});

function Event(props) {
  const dispatch = useDispatch();
  const event = useSelector(({ eventsApp }) => eventsApp.event);
  const navigate = useNavigate();

  const routeParams = useParams();
  const [tabValue, setTabValue] = useState(0);
  const [noEvent, setNoEvent] = useState(false);
  const [selectedImage, setSelectedImage] = useState();
  const [selectedUpdateImage, setSelectedUpdateImage] = useState();
  const [checked, setChecked] = useState(true);
  const [LevelData, setLevelData] = useState(null);
  const [MemberData, setMemberData] = useState(null);
  const methods = useForm({
    mode: 'onChange',
    defaultValues: { candidates: [] },
    resolver: yupResolver(schema),
  });
  const { reset, watch, control, onChange, formState, setValue, getValues } = methods;
  const { isValid, dirtyFields, errors } = formState;
  const form = watch();


  useDeepCompareEffect(() => {
    function updateEventState() {
      const { eventId } = routeParams;

      if (eventId === 'new') {
        /**
         * Create New event data
         */
        dispatch(newEvent());
      } else {
        /**
         * Get event data
         */
        dispatch(getEvent(routeParams)).then((action) => {
          /**
           * If the requested event is not exist show message
           */
          if (!action.payload) {
            setNoEvent(true);
          } else {

          }
          if (action.payload.event_image) {
            setSelectedUpdateImage(action.payload.event_image);
          }
        });
      }
    }

    updateEventState();
  }, [dispatch, routeParams]);

  useEffect(() => {
    if (!event) {
      return;
    }
    /**
     * Reset the form on event state changes
     */
    reset(event);
  }, [event, reset]);

  useEffect(() => {
    dispatch(getMembers()).then((action) => {
      setMemberData(action.payload);
    });
    dispatch(getLevelDataList()).then((action) => {
      setLevelData(action.payload);
    });
    return () => {
      /**
       * Reset events on component unload
       */
      dispatch(resetEvent());
      setNoEvent(false);
    };
  }, [dispatch]);

  /**
   * Tab Change
   */
  function handleTabChange(event, value) {
    setTabValue(value);
  }

  const imageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedImage(e.target.files[0]);
      // setValue('profile_pic', e.target.files[0]);
      /* const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();

        reader.onload = () => {
          setValue('profile_pic', `data:${file.type};base64,${btoa(reader.result)}`);
          console.log(`data:${file.type};base64,${btoa(reader.result)}`);
        };
      } */
      const { files } = e.target;
      const reader = new FileReader();
      reader.readAsDataURL(files[0]);

      reader.onload = (e) => {
        setValue('event_image', e.target.result);
        /* this.setState({
            selectedFile: e.target.result,
          }) */
      };
    }
  };

  // This function will be triggered when the "Remove This Image" button is clicked
  const removeSelectedImage = () => {
    setSelectedImage();
  };

  function handleSaveEvent() {
    dispatch(saveEvent(getValues())).then((action) => {
      console.log(action)
      dispatch(showMessage({ message: action?.payload?.message || "Something went wrong" }));
      navigate('/apps/events');
    });
  }

  /**
   * Show Message if the requested events is not exists
   */
  if (noEvent) {
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
          to="/apps/events"
          color="inherit"
        >
          Go to Event Page
        </Button>
      </motion.div>
    );
  }

  /**
   * Wait while event data is loading and form is setted
   */
  if (
    _.isEmpty(form) ||
    (event && routeParams.eventId !== event.encryption_id && routeParams.eventId !== 'new')
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
                name="event_name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    className="mt-8 mb-16 px-3 w-full sm:w-1/1 lg:w-1/1"
                    error={!!errors.event_name}
                    required
                    helperText={errors?.event_name?.message}
                    label="Name"
                    autoFocus
                    id="event_name"
                    variant="outlined"
                    fullWidth
                  />
                )}
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
                name={`venue`}
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    className='mt-8 mb-16 px-3 w-full sm:w-1/2 lg:w-1/2 '
                    label={`Venue`}
                    placehoder={`Venue`}
                    id={`venue`}
                    multiline
                    required
                    rows={3}
                    type={'text'}
                    variant='outlined'
                    fullWidth
                  />
                )}
              />

              <Controller
                name={`agenda`}
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    className='mt-8 mb-16 px-3 w-full sm:w-1/2 lg:w-1/2 '
                    label={`Agenda`}
                    placehoder={`Agenda`}
                    id={`agenda`}
                    multiline
                    required
                    rows={3}
                    type={'text'}
                    variant='outlined'
                    fullWidth
                  />
                )}
              />

              <Controller
                name="event_for_level"
                control={control}
                className="px-3"
                render={({ field }) => (
                  <FormControl fullWidth className='px-3'>
                    <InputLabel id={"member-simple-select-label"}>Level</InputLabel>
                    {/* mt-8 mb-16 px-3 */}
                    <Select
                      {...field}
                      id="event_for_level"
                      labelId={"member-simple-select-label"}
                      label="Select Level"
                      required
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
                name={`other_matters`}
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    className='mt-8 mb-16 px-3 w-full sm:w-1/2 lg:w-1/2 '
                    label={`Other matters`}
                    placehoder={`Other matters`}
                    id={`other_matters`}
                    multiline
                    rows={3}
                    type={'text'}
                    variant='outlined'
                    fullWidth
                  />
                )}
              />
              <div className="mt-8 mb-16 px-3 w-full sm:w-1/2 lg:w-1/2 ">
                <Typography>Please upload an image</Typography>
                <Controller
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <label
                      htmlFor="button-file"
                      className="pull-left productImageUpload flex items-center justify-center relative w-128 h-128 rounded-16 mx-12 mb-24 overflow-hidden cursor-pointer shadow hover:shadow-lg"
                    >
                      <input
                        type="file"
                        name="event_image"
                        className="hidden"
                        id="button-file"
                        accept="image/*"
                        onChange={imageChange}
                      />

                      <Icon fontSize="large" color="action">
                        cloud_upload
                      </Icon>
                    </label>
                  )}
                />
                {selectedImage && (
                  <div
                    className={clsx(
                      'productImageItem flex items-center justify-center relative w-128 h-128 rounded-16 mx-12 mb-24 overflow-hidden cursor-pointer outline-none shadow hover:shadow-lg'
                    )}
                  >
                    <img
                      className="max-w-none w-auto h-full"
                      src={URL.createObjectURL(selectedImage)}
                      alt="image"
                    />
                    <IconButton
                      onClick={removeSelectedImage}
                      className={clsx('w-40 h-40 removeBtn', props.className)}
                      size="large"
                    >
                      <Icon>delete</Icon>
                    </IconButton>
                  </div>
                )}

                {selectedUpdateImage && !selectedImage && (
                  <div
                    className={clsx(
                      'productImageItem flex items-center justify-center relative w-128 h-128 rounded-16 mx-12 mb-24 overflow-hidden cursor-pointer outline-none shadow hover:shadow-lg'
                    )}
                  >
                    <img className="max-w-none w-auto h-full" src={selectedUpdateImage} alt="image" />
                  </div>
                )}

                <div className="clearfix" />
              </div>
            </div>
            <div className="flex -mx-4">
              <Controller
                name="is_active"
                control={control}
                render={({ field }) => {
                  return (<FormControlLabel className='px-3' control={<Switch checked={field.value} name="is_active" />} label={`${(field.value) ? 'Active' : 'Inactive'}`} onChange={(event) => {
                    setValue('is_active', event.target.checked);
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
                onClick={handleSaveEvent}
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

export default withReducer('eventsApp', reducer)(Event);
