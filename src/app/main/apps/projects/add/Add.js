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
import { resetProject, newProject, getProject, saveProject } from '../store/projectslice';
import reducer from '../store';
import PageHeader from './PageHeader';
import clsx from 'clsx';
import FuseUtils from '@fuse/utils';
import { showMessage } from 'app/store/fuse/messageSlice';
import { getStaff } from '../../staff/store/staffListSlice';
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
  title: yup.string().required('You must enter project title'),
  progress: yup.number('progress must be a `number`').min(0).max(100).required('You must enter project progress'),
  budget: yup.number('budget must be a `number`').min(0).required('You must enter project budget'),
  start_date: yup.string().required('You must enter start date'),
  end_date: yup.string().required('You must enter end date'),
  due_date: yup.string().required('You must enter due date'),
  phase: yup.string().required('You must enter phase'),
});

function Project(props) {
  const dispatch = useDispatch();
  const project = useSelector(({ projectsApp }) => projectsApp.project);
  const navigate = useNavigate();

  const routeParams = useParams();
  const [tabValue, setTabValue] = useState(0);
  const [noProject, setNoProject] = useState(false);
  const [selectedImage, setSelectedImage] = useState();
  const [selectedUpdateImage, setSelectedUpdateImage] = useState();
  const [checked, setChecked] = useState(true);
  const [staffData, setstaffData] = useState(null);
  const [LevelData, setLevelData] = useState(null);
  const methods = useForm({
    mode: 'onChange',
    defaultValues: {
      staffs: [],
    },
    resolver: yupResolver(schema),
  });
  const { reset, watch, control, onChange, formState, setValue, getValues } = methods;
  const { isValid, dirtyFields, errors } = formState;
  const form = watch();

  useDeepCompareEffect(() => {
    function updateProjectState() {
      const { projectId } = routeParams;

      if (projectId === 'new') {
        /**
         * Create New project data
         */
        dispatch(newProject());
      } else {
        /**
         * Get project data
         */
        dispatch(getProject(routeParams)).then((action) => {
          /**
           * If the requested project is not exist show message
           */
          if (!action.payload) {
            setNoProject(true);
          } else {

          }

          if (action.payload.project_image) {
            setSelectedUpdateImage(action.payload.project_image);
          }
        });
      }
    }

    updateProjectState();
  }, [dispatch, routeParams]);

  useEffect(() => {
    if (!project) {
      return;
    }
    /**
     * Reset the form on project state changes
     */
    reset(project);
  }, [project, reset]);

  useEffect(() => {
    dispatch(getStaff()).then((action) => {
      setstaffData(action.payload);
    });
    dispatch(getLevelDataList()).then((action) => {
      setLevelData(action.payload);
    });
    return () => {
      /**
       * Reset projects on component unload
       */
      dispatch(resetProject());
      setNoProject(false);
    };
  }, [dispatch]);

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
        setValue('project_image', e.target.result);
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

  /**
   * Tab Change
   */
  function handleTabChange(event, value) {
    setTabValue(value);
  }



  function handleSaveProject() {
    dispatch(saveProject(getValues())).then((action) => {
      dispatch(showMessage({ message: action.payload.message || "Something went wrong" }));
      navigate('/apps/projects');
    });
  }

  /**
   * Show Message if the requested projects is not exists
   */
  if (noProject) {
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
          to="/apps/projects"
          color="inherit"
        >
          Go to Project Page
        </Button>
      </motion.div>
    );
  }

  /**
   * Wait while project data is loading and form is setted
   */
  if (
    _.isEmpty(form) ||
    (project && routeParams.projectId !== project.encryption_id && routeParams.projectId !== 'new')
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
                name="title"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    className="mt-8 mb-16 px-3 w-full sm:w-1/1 lg:w-1/1"
                    error={!!errors.title}
                    required
                    helperText={errors?.title?.message}
                    label="Title"
                    autoFocus
                    id="title"
                    variant="outlined"
                    fullWidth
                  />
                )}
              />

              <Controller
                name="belong_to_level"
                control={control}
                className="px-3"
                render={({ field }) => (
                  <FormControl fullWidth className='px-3'>
                    <InputLabel id={"member-simple-select-label"}>Level</InputLabel>
                    {/* mt-8 mb-16 px-3 */}
                    <Select
                      {...field}
                      id="belong_to_level"
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
                name="staffs"
                control={control}
                className="px-3"
                render={({ field }) => (
                  <FormControl fullWidth className='px-3'>
                    <InputLabel id={"member-simple-select-label"}>Staff</InputLabel>
                    {/* mt-8 mb-16 px-3 */}
                    <Select
                      {...field}
                      id={`staffs`}
                      labelId={"member-simple-select-label"}
                      label="Select Staff"
                      name={`staffs`}
                      value={(getValues('staffs') !== undefined) ? getValues('staffs') : []}
                      /* onChange={(e) => {
                        setValue(`staffs`, e.target.value)
                      }} */
                      className="mb-16 px-3"
                      multiple
                    >
                      <MenuItem key={"el_0"} value={""}>Select</MenuItem>
                      {staffData && staffData.length > 0 && staffData.map((member, k) => {
                        return (<MenuItem key={"el_" + member.id + ""} value={member.id + ""} >{member.first_name} {member.last_name}</MenuItem>)
                      })}
                    </Select>
                  </FormControl>
                )}
              />

              <Controller
                name="progress"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    className="mt-8 mb-16 px-3 w-full sm:w-1/2 lg:w-1/2"
                    error={!!errors.progress}
                    required
                    helperText={errors?.progress?.message}
                    label="Progress"
                    id="progress"
                    variant="outlined"
                    min={0}
                    type="number"
                    fullWidth
                    InputProps={{
                      startAdornment: <InputAdornment position="start">%</InputAdornment>,
                      inputMode: 'numeric', pattern: '[0-9]*'
                    }}
                  />
                )}
              />

              <Controller
                name="priority"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth className='mt-8 mb-16 px-3 w-full sm:w-1/2 lg:w-1/2 '>
                    <InputLabel id="priority">Priority</InputLabel>
                    <Select
                      {...field}
                      id='priority'
                      labelId="priority"
                      label='priority'
                      className=''
                      defaultValue={getValues('priority')}
                    >
                      {/* <MenuItem key={'0'} value={''}>Select</MenuItem> */}
                      <MenuItem key={'Urgent'} value={`Urgent`}>{`Urgent`}</MenuItem>
                      <MenuItem key={'High'} value={`High`}>{`High`}</MenuItem>
                      <MenuItem key={'Medium'} value={`Medium`}>{`Medium`}</MenuItem>
                      <MenuItem key={'Low'} value={`Low`}>{`Low`}</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />

              <Controller
                name="budget"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    className="mt-8 mb-16 px-3 w-full sm:w-1/2 lg:w-1/2"
                    error={!!errors.budget}
                    required
                    helperText={errors?.budget?.message}
                    label="Budget"
                    id="budget"
                    variant="outlined"
                    min={0}
                    type="number"
                    fullWidth
                  />
                )}
              />

              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth className='mt-8 mb-16 px-3 w-full sm:w-1/2 lg:w-1/2 '>
                    <InputLabel id="status">Status</InputLabel>
                    <Select
                      {...field}
                      id='status'
                      labelId="status"
                      label='status'
                      className=''
                    >
                      <MenuItem key={'0'} value={''}>Select</MenuItem>
                      <MenuItem key={'Pending'} value={`Pending`}>{`Pending`}</MenuItem>
                      <MenuItem key={'Terminated'} value={`Terminated`}>{`Terminated`}</MenuItem>
                      <MenuItem key={'Finished'} value={`Finished`}>{`Finished`}</MenuItem>
                      <MenuItem key={'Waiting'} value={`Waiting`}>{`Waiting`}</MenuItem>
                      <MenuItem key={'Ongoing'} value={`Ongoing`}>{`Ongoing`}</MenuItem>
                    </Select>
                  </FormControl>
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
                name="due_date"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    className="mt-8 mb-16 px-3 w-full sm:w-1/2 lg:w-1/2"
                    error={!!errors.due_date}
                    required
                    helperText={errors?.due_date?.message}
                    label="Due Date"
                    id="due_date"
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
                name="phase"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    className="mt-8 mb-16 px-3 w-full sm:w-1/2 lg:w-1/2"
                    error={!!errors.phase}
                    required
                    helperText={errors?.phase?.message}
                    label="Phase"
                    autoFocus
                    id="phase"
                    variant="outlined"
                    fullWidth
                  />
                )}
              />

              <Controller
                name={`note`}
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    className='mt-8 mb-16 px-3 w-full sm:w-1/2 lg:w-1/2 '
                    label={`Note`}
                    placehoder={`Note`}
                    id={`note`}
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
                        name="project_image"
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
                onClick={handleSaveProject}
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

export default withReducer('projectsApp', reducer)(Project);
