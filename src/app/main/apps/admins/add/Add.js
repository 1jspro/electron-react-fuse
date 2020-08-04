import FuseLoading from '@fuse/core/FuseLoading';
import FusePageCarded from '@fuse/core/FusePageCarded';
import { useDeepCompareEffect } from '@fuse/hooks';
import Button from '@mui/material/Button';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import withReducer from 'app/store/withReducer';
import Switch from "@mui/material/Switch";
import MenuItem from "@mui/material/MenuItem";
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams, useNavigate } from 'react-router-dom';
import _ from '@lodash';
import { useForm, FormProvider, useFormContext, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { styled } from '@mui/material/styles';
import { resetAdmin, newAdmin, getAdmin, getLevels, saveAdmin, removeAdmin, getallLevels, getFinalallLevels } from '../store/adminSlice';
import countries from '../data/countries.json';
import reducer from '../store';
import PageHeader from './PageHeader';
import InputLabel from '@mui/material/InputLabel';
import { showMessage } from 'app/store/fuse/messageSlice';
import { getPackages } from "../../packages/store/packagesSlice";

import clsx from 'clsx';
import FuseUtils from '@fuse/utils';


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};


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
  first_name: yup
    .string()
    .required('The first name field is required.'),
  last_name: yup
    .string()
    .required('The last name field is required.'),
  email: yup
    .string()
    .required('The email field is required.').email('You must enter a valid email'),
  phone_no: yup.string().required('The phone no field is required.')
    .min(8, 'You must enter a valid phone no.').max(13, 'You must enter a valid phone no.'),
  password: yup
    .string()
    .required('The password field is required.'),
  re_password: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match'),
});

function Admin(props) {

  const dispatch = useDispatch();
  const admin = useSelector(({ adminsApp }) => adminsApp.admin);
  const routeParams = useParams();
  const [tabValue, setTabValue] = useState(0);
  const [noAdmin, setNoAdmin] = useState(false);
  const [admin_id, setAdminId] = useState('');
  const [levels, setLevels] = useState([]);
  const [Packages, setPackages] = useState([]);
  const [selectedImage, setSelectedImage] = useState();
  const [selectedUpdateImage, setSelectedUpdateImage] = useState();

  const methods = useForm({
    mode: 'onChange',
    defaultValues: {},
    resolver: yupResolver(schema),
  });
  const { reset, watch, control, onChange, formState, setValue, getValues } = methods;
  const { isValid, dirtyFields, errors } = formState;
  const form = watch();

  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getFinalallLevels()).then((action) => {
      setLevels(action.payload);
    });
    dispatch(getPackages()).then((action) => {
      setPackages(action.payload);
    });

  }, [dispatch]);

  useDeepCompareEffect(() => {
    function updateAdminState() {
      const { adminId } = routeParams;

      if (adminId === 'new') {
        /**
         * Create New admin data
         */
        dispatch(newAdmin());
      } else {
        /**
         * Get Admin data
         */
        setAdminId(admin_id);
        dispatch(getAdmin(routeParams)).then((action) => {
          /**
           * If the requested Admin is not exist show message
           */
          if (!action.payload) {
            setNoAdmin(true);
          }
          if (action.payload.org_image) {
            setSelectedUpdateImage(action.payload.org_image);
          }
        });
      }
    }

    updateAdminState();
  }, [dispatch, routeParams]);

  useEffect(() => {
    if (!admin || (admin && admin.error && admin.error.length > 0)) {
      if (admin && admin.error && admin.error.length > 0) {
        setTabValue(0);
      }
      return;
    }
    /**
     * Reset the form on admin state changes
     */
    reset(admin);
  }, [admin, reset]);

  useEffect(() => {
    return () => {
      /**
       * Reset admin on component unload
       */
      dispatch(resetAdmin());
      setNoAdmin(false);
    };
  }, [dispatch]);

  /**
   * Tab Change
   */
  function handleTabChange(event, value) {
    setTabValue(value);
  }



  function handleSaveAdmin(event) {
    event.preventDefault();
    console.log(getValues())
    dispatch(saveAdmin(getValues())).then((action) => {
      if (action.payload && action.payload.error && action.payload.error[0]) {
        dispatch(showMessage({ message: action.payload.error[0].message }));
      } else {
        dispatch(showMessage({ message: action.payload.message }));
        navigate('/apps/admins');
      }
    });
  }

  // This function will be triggered when the file field change
  const imageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedImage(e.target.files[0]);
      // setValue('org_image', e.target.files[0]);
      let files = event.target.files;
      let reader = new FileReader();
      reader.readAsDataURL(files[0]);

      reader.onload = (e) => {
        setValue('org_image', e.target.result);
        setValue('org_image_uploaded', true);
        /*this.setState({
            selectedFile: e.target.result,
          })*/
      }
    }
  };

  // This function will be triggered when the "Remove This Image" button is clicked
  const removeSelectedImage = () => {
    setSelectedImage();
    setValue('org_image_uploaded', false);
  };


  /**
   * Show Message if the requested admins is not exists
   */
  if (noAdmin) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.1 } }}
        className="flex flex-col flex-1 items-center justify-center h-full"
      >
        <Typography color="textSecondary" variant="h5">
          There is no such admin!
        </Typography>
        <Button
          className="mt-24"
          component={Link}
          variant="outlined"
          to="/apps/admins"
          color="inherit"
        >
          Go to Admins Page
        </Button>
      </motion.div>
    );
  }

  /**
   * Wait while admin data is loading and form is setted
   */
  if (
    _.isEmpty(form) ||
    (admin && routeParams.adminId !== admin.encryption_id && routeParams.adminId !== 'new')
  ) {
    return <FuseLoading />;
  }


  return (
    <FormProvider {...methods}>
      <Root
        header={<PageHeader />}
        content={
          <div className="p-16 sm:p-24 greyBg">
            <div className={tabValue !== 0 ? 'hidden' : ''}>
              <div>
                <Typography className="mb-16" color="textSecondary" variant="h5">
                  Organization Info
                </Typography>


                <div className="flex -mx-4">
                  <Controller
                    name="org_name"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        className="mt-8 mb-16 mx-4"
                        error={!!errors.org_name}
                        helperText={errors?.org_name?.message}
                        label="Organization Name"
                        id="org_name"
                        autoFocus
                        variant="outlined"
                        fullWidth
                      />
                    )}
                  />
                </div>
                <div className="flex -mx-4">
                  <Controller
                    name="org_meta_description"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        className="mt-8 mb-16 mx-4"
                        id="org_meta_description"
                        label="Organization Meta Description"
                        type="text"
                        multiline
                        rows={3}
                        variant="outlined"
                        fullWidth
                      />
                    )}
                  />

                  <Controller
                    name="meta_keyword"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        className="mt-8 mb-16 mx-4"
                        id="meta_keyword"
                        label="Meta keyword"
                        type="text"
                        multiline
                        rows={3}
                        variant="outlined"
                        fullWidth
                      />
                    )}
                  />
                </div>
                <div className="flex -mx-4">
                  <Controller
                    name="meta_tag"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        className="mt-8 mb-16 mx-4"
                        id="meta_tag"
                        label="Meta tag"
                        type="text"
                        multiline
                        rows={3}
                        variant="outlined"
                        fullWidth
                      />
                    )}
                  />

                  <Controller
                    name="org_address"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        className="mt-8 mb-16 mx-4"
                        id="org_address"
                        label="Company / Org Address"
                        type="text"
                        multiline
                        rows={3}
                        variant="outlined"
                        fullWidth
                      />
                    )}
                  />
                </div>

                <div>
                  <Typography>Organization Logo</Typography>
                  <Controller
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <label
                        htmlFor="button-file"
                        className="pull-left productImageUpload flex items-center justify-center relative w-128 h-128 rounded-16 mx-12 mb-24 overflow-hidden cursor-pointer shadow hover:shadow-lg"
                      >

                        <input type="file" name="org_image" className="hidden" id="button-file" accept="image/*" onChange={imageChange} />

                        <Icon fontSize="large" color="action">
                          cloud_upload
                        </Icon>

                      </label>
                    )}
                  />
                  {selectedImage && (
                    <div
                      className={clsx(
                        'productImageItem flex items-center justify-center relative w-128 h-128 rounded-16 mx-12 mb-24 overflow-hidden cursor-pointer outline-none shadow hover:shadow-lg')}
                    >
                      <img className="max-w-none w-auto h-full" src={URL.createObjectURL(selectedImage)} alt="image" />
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
                        'productImageItem flex items-center justify-center relative w-128 h-128 rounded-16 mx-12 mb-24 overflow-hidden cursor-pointer outline-none shadow hover:shadow-lg')}
                    >
                      <img className="max-w-none w-auto h-full" src={selectedUpdateImage} alt="image" />
                    </div>
                  )}

                  <div className="clearfix"></div>

                </div>

                <Typography className="mb-16" color="textSecondary" variant="h5">
                  Admin Info
                </Typography>

                <div className="flex -mx-4">
                  <Controller
                    name="first_name"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        className="mt-8 mb-16 mx-4"
                        error={!!errors.first_name}
                        helperText={errors?.first_name?.message}
                        label="First Name"
                        id="first_name"
                        required
                        variant="outlined"
                        fullWidth
                      />
                    )}
                  />

                  <Controller
                    name="last_name"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        className="mt-8 mb-16 mx-4"
                        error={!!errors.last_name}
                        helperText={errors?.last_name?.message}
                        label="Last Name"
                        id="last_name"
                        required
                        variant="outlined"
                        fullWidth
                      />
                    )}
                  />
                </div>

                <div className="flex -mx-4">
                  <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        className="mt-8 mb-16 mx-4"
                        error={!!errors.email}
                        helperText={errors?.email?.message}
                        label="Email"
                        id="email"
                        required
                        disabled={(routeParams.adminId !== 'new') ? true : false}
                        readOnly={(routeParams.adminId !== 'new') ? true : false}
                        variant="outlined"
                        fullWidth
                      />
                    )}
                  />

                  <Controller
                    name="phone_no"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        className="mt-8 mb-16 mx-4"
                        error={!!errors.phone_no}
                        helperText={errors?.phone_no?.message}
                        label="Phone Number"
                        id="phone_no"
                        required
                        /* disabled={(routeParams.adminId !== 'new') && admin.phone_no ? true : false}
                        readOnly={(routeParams.adminId !== 'new') && admin.phone_no ? true : false} */
                        variant="outlined"
                        fullWidth
                      />
                    )}
                  />
                </div>

                {(routeParams.adminId === 'new') &&
                  (<div className="flex -mx-4">
                    <Controller
                      name="password"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          className="mt-8 mb-16 mx-4"
                          error={!!errors.password}
                          helperText={errors?.password?.message}
                          label="Password"
                          id="password"
                          required
                          variant="outlined"
                          fullWidth
                        />
                      )}
                    />

                    <Controller
                      name="re_password"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          className="mt-8 mb-16 mx-4"
                          error={!!errors.re_password}
                          helperText={errors?.re_password?.message}
                          label="Repeat Password"
                          id="re_password"
                          required
                          variant="outlined"
                          fullWidth
                        />
                      )}
                    />
                  </div>)
                }

                <div className="flex -mx-4">
                  <Controller
                    name="country"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth className='px-4'>
                        <InputLabel id="country-simple-select-label">Country</InputLabel>
                        <Select
                          {...field}
                          id="country"
                          labelId="country-simple-select-label"
                          label="Country"
                          className="mt-8 mb-16 px-4"
                          defaultValue=""
                        >
                          <MenuItem key={"0"} value={""}>Select</MenuItem>

                          {countries && countries.length > 0 && countries.map((country, k) =>
                            <MenuItem key={"cn_" + k} value={country.code + " - " + country.name} >{country.code + " - " + country.name}</MenuItem>
                          )}
                        </Select>
                      </FormControl>

                    )}
                  />

                  <Controller
                    name="region"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        className="mt-8 mb-16 mx-4"
                        error={!!errors.region}
                        helperText={errors?.region?.message}
                        label="Region"
                        id="region"
                        variant="outlined"
                        fullWidth
                      />
                    )}
                  />

                  <Controller
                    name="city"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        className="mt-8 mb-16 mx-4"
                        error={!!errors.city}
                        helperText={errors?.city?.message}
                        label="City / Town"
                        id="city"
                        variant="outlined"
                        fullWidth
                      />
                    )}
                  />
                </div>
                <div className="flex -mx-4">
                  <Controller
                    name="address"
                    control={control}
                    className="-mx-4"
                    render={({ field }) => (
                      <TextField
                        {...field}
                        className="mt-8 mb-16 mx-4"
                        id="address"
                        label="Residential Address"
                        type="text"
                        multiline
                        rows={3}
                        variant="outlined"
                        fullWidth
                      />
                    )}
                  />
                </div>
                <div>

                  <Controller
                    name="package_id"
                    control={control}
                    className="px-3"
                    render={({ field }) => (
                      <FormControl fullWidth className='px-3'>
                        <InputLabel id={"member-simple-select-label"}>Package</InputLabel>
                        {/* mt-8 mb-16 px-3 */}
                        <Select
                          {...field}
                          id="package_id"
                          labelId={"member-simple-select-label"}
                          label="Select Package"
                          className="mb-16 px-3"
                        /* onChange={(evnt) => handleChange(evnt)}
                        defaultValue="" */
                        >
                          <MenuItem key={"el_0"} value={""}>Select</MenuItem>
                          {Packages && Packages.length > 0 && Packages.map((level, k) => {
                            return (<MenuItem key={"el_" + level.id + ""} value={level.id + ""} >{level.name}</MenuItem>)
                          })}
                        </Select>
                      </FormControl>
                    )}
                  />
                </div>

                <Typography className="mb-16" color="textSecondary" variant="h5">
                  Select Admin Level:
                </Typography>

                <div className="flex -mx-4">
                  <Controller
                    name="level_id"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth>
                        <InputLabel id="level-simple-select-label">Level</InputLabel>
                        <Select
                          {...field}
                          id="level_id"
                          labelId="level-simple-select-label"
                          label="Level"
                          className="mt-8 mb-16 mx-4"
                          defaultValue=""
                        >
                          <MenuItem key={"0"} value={""}>Select</MenuItem>

                          {levels && levels.length > 0 && levels.filter((level) => {
                            if (level.level_status == '1') {
                              return level;
                            }
                          }).map((level) =>
                            <MenuItem key={level.id + ""} value={level.id + ""} >{level.flow} {(level.name !== undefined && level.name !== '') ? `(${level.name})` : ''}</MenuItem>
                          )}
                        </Select>
                      </FormControl>

                    )}
                  />

                </div>

                <div className="flex -mx-4">
                  <Controller
                    name="show_id_card"
                    control={control}
                    render={({ field }) => {
                      return (<FormControlLabel control={<Switch checked={(field.value === 0) ? false : true} name="show_id_card" />} label={`${(field.value === 0) ? 'Hide' : 'Show'} Id Card`} onChange={(event) => {
                        var vv = (event.target.checked) ? 1 : 0
                        setValue('show_id_card', vv);
                      }} />)
                    }}
                  />
                  {/* <Controller
                    name="print_exp_date_on_id"
                    control={control}
                    render={({ field }) => {
                      return (<FormControlLabel control={<Switch checked={(field.value === 0) ? false : true} name="print_exp_date_on_id" />} label={`${(field.value === 0) ? 'Do not print' : 'Print'} expiry date on id`} onChange={(event) => {
                        var vv = (event.target.checked) ? 1 : 0
                        setValue('print_exp_date_on_id', vv);
                      }} />)
                    }}
                  /> */}
                </div>
              </div>
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
                onClick={handleSaveAdmin}
              >
                Save
              </Button>


              <div className="clearfix"></div>
            </motion.div>
          </div>
        }
        innerScroll
      />
    </FormProvider>
  );
}

export default withReducer('adminsApp', reducer)(Admin);
