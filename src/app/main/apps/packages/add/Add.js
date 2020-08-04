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
import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';
import FormControlLabel from '@mui/material/FormControlLabel';
import Autocomplete from '@mui/material/Autocomplete';
import { resetPackage, newPackage, getPackage, savePackage, getIntervals } from '../store/packageSlice';
import reducer from '../store';
import PageHeader from './PageHeader';
import clsx from 'clsx';
import FuseUtils from '@fuse/utils';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
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
  name: yup
    .string()
    .required('You must enter package name'),
  package_cost: yup
    .string()
    .required('You must enter package cost'),
  package_interval_id: yup
    .string()
    .required('You must select package interval'),
  description: yup
    .string()
    .required('You must enter package description'),
});

function PackageData(props) {
  const dispatch = useDispatch();
  const packageData = useSelector(({ packagesApp }) => packagesApp.packageData);
  const navigate = useNavigate();

  const routeParams = useParams();
  const [tabValue, setTabValue] = useState(0);
  const [noPackage, setNoPackage] = useState(false);
  const [selectedImage, setSelectedImage] = useState();
  const [selectedUpdateImage, setSelectedUpdateImage] = useState();
  const [checked, setChecked] = useState(true);
  const [intervals, setInervals] = useState([]);



  const methods = useForm({
    mode: 'onChange',
    defaultValues: {},
    resolver: yupResolver(schema),
  });
  const { reset, watch, control, onChange, formState, setValue, getValues } = methods;
  const { isValid, dirtyFields, errors } = formState;
  const form = watch();
  const name = watch('name');

  useEffect(() => {
    dispatch(getIntervals()).then((action) => {
      setInervals(action.payload);
    });
  }, [dispatch]);

  useDeepCompareEffect(() => {
    function updatePackageState() {
      const { packageId } = routeParams;

      if (packageId === 'new') {
        /**
         * Create New package data
         */
        dispatch(newPackage());
      } else {
        /**
         * Get package data
         */
        dispatch(getPackage(routeParams)).then((action) => {
          /**
           * If the requested package is not exist show message
           */
          if (!action.payload) {
            setNoPackage(true);
          } else {

          }
        });
      }
    }

    updatePackageState();
  }, [dispatch, routeParams]);

  useEffect(() => {
    if (!packageData) {
      return;
    }
    /**
     * Reset the form on package state changes
     */
    reset(packageData);
  }, [packageData, reset]);

  useEffect(() => {
    return () => {
      /**
       * Reset package on component unload
       */
      dispatch(resetPackage());
      setNoPackage(false);
    };
  }, [dispatch]);

  /**
   * Tab Change
   */
  function handleTabChange(event, value) {
    setTabValue(value);
  }


  function handleSavePackage() {
    dispatch(savePackage(getValues())).then((action) => {
      dispatch(showMessage({ message: action.payload.message }));
      navigate('/apps/packages');
    });
  }



  /**
   * Show Message if the requested packages is not exists
   */
  if (noPackage) {
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
          to="/apps/packages"
          color="inherit"
        >
          Go to Package Page
        </Button>
      </motion.div>
    );
  }

  /**
   * Wait while package data is loading and form is setted
   */
  if (
    _.isEmpty(form) ||
    (packageData && routeParams.packageId !== packageData.encryption_id && routeParams.packageId !== 'new')
  ) {
    return <FuseLoading />;
  }

  

  return (
    <FormProvider {...methods}>
      <Root
        header={<PageHeader />}
        content={
          <div className="p-16 sm:p-24">
            <div className={tabValue !== 0 ? 'hidden' : ''}>
              <div className="flex -mx-4">
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      className="mt-8 mb-16 mx-4"
                      error={!!errors.name}
                      required
                      helperText={errors?.name?.message}
                      label="Package Name"
                      autoFocus
                      id="name"
                      variant="outlined"
                      fullWidth
                    />
                  )}
                />

                <Controller
                  name="package_cost"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      className="mt-8 mb-16 mx-4"
                      error={!!errors.package_cost}
                      required
                      helperText={errors?.package_cost?.message}
                      label="Package Cost(GHS)"
                      id="package_cost"
                      min="0"
                      type="number"
                      variant="outlined"
                      fullWidth
                    />
                  )}
                />

                

              </div>

              <div className="flex -mx-4">
                
                <Controller
                  name="package_interval_id"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel id="interval-simple-select-label">Package Interval*</InputLabel>
                      <Select
                        {...field}
                        id="package_interval_id"
                        labelId="interval-simple-select-label"
                        label="Package Interval*"
                        required
                        className="mt-8 mb-16 mx-4"
                        defaultValue=""
                        >
                          <MenuItem key={"0"} value={""}>Select</MenuItem>
                        {intervals && intervals.length > 0 && intervals.map((interval) => 
                          <MenuItem key={interval.id+""} value={interval.id+""} >{interval.name}</MenuItem>
                        )}
                      </Select>
                    </FormControl>

                  )}
                />
                 
                <Controller
                  name="sms_allowed"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      className="mt-8 mb-16 mx-4"
                      error={!!errors.sms_allowed}
                      helperText={errors?.sms_allowed?.message}
                      label="Number Of SMS Allows(Leave Blank for unlimited)"
                      id="sms_allowed"
                      min="0"
                      type="number"
                      variant="outlined"
                      fullWidth
                    />
                  )}
                />

              </div>

              <div className="flex -mx-4">
                
                <Controller
                  name="members_allowed"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      className="mt-8 mb-16 mx-4"
                      error={!!errors.members_allowed}
                      helperText={errors?.members_allowed?.message}
                      label="Number Of Members Allows(Leave Blank for unlimited)"
                      id="members_allowed"
                      min="0"
                      type="number"
                      variant="outlined"
                      fullWidth
                    />
                  )}
                />

                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel id="status-simple-select-label">Status</InputLabel>
                      <Select
                        {...field}
                        id="status"
                        labelId="status-simple-select-label"
                        label="Status"
                        className="mt-8 mb-16 mx-4"
                        defaultValue=""
                        >
                          <MenuItem key={"0"} value={"active"}>Active</MenuItem>
                          <MenuItem key={"0"} value={"inactive"}>In Active</MenuItem>
                      </Select>
                    </FormControl>

                  )}
                />
              </div>
              <div className="flex -mx-4">
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      className="mt-8 mb-16"
                      id="description"
                      label="Description"
                      type="text"
                      required
                      multiline
                      rows={3}
                      variant="outlined"
                      fullWidth
                    />
                  )}
                />
              </div>

              <div className="clearfix"></div>
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
                onClick={handleSavePackage}
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

export default withReducer('packagesApp', reducer)(PackageData);
