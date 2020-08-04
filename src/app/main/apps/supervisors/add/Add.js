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
import { resetSupervisor, newSupervisor, getSupervisor, getAdmins, saveSupervisor, removeSupervisor } from '../store/supervisorSlice';
import countries from '../data/countries.json';
import reducer from '../store';
import PageHeader from './PageHeader';
import InputLabel from '@mui/material/InputLabel';
import { showMessage } from 'app/store/fuse/messageSlice';

import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
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

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

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

function Supervisor(props) {
  const dispatch = useDispatch();
  const supervisor = useSelector(({ supervisorsApp }) => supervisorsApp.supervisor);

  const routeParams = useParams();
  const [tabValue, setTabValue] = useState(0);
  const [noSupervisor, setNoSupervisor] = useState(false);
  const [supervisor_id, setSupervisorId] = useState('');
  const [admins, setAdmins] = useState([]);
  const [selectedImage, setSelectedImage] = useState();
  const [selectedUpdateImage, setSelectedUpdateImage] = useState();

  const [selected_all_admins, setSelectAllAdmins] = useState(false);
  const [selected_admins, setSelectedAdmins] = useState([]);

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
    dispatch(getAdmins()).then((action) => {
      setAdmins(action.payload);
    });
  }, [dispatch]);

  useDeepCompareEffect(() => {
    function updateSupervisorState() {
      const { supervisorId } = routeParams;

      if (supervisorId === 'new') {
        /**
         * Create New supervisor data
         */
        dispatch(newSupervisor());
      } else {
        /**
         * Get supervisor data
         */
         setSupervisorId(supervisor_id);
        dispatch(getSupervisor(routeParams)).then((action) => {
          /**
           * If the requested Supervisor is not exist show message
           */
          if (!action.payload) {
            setNoSupervisor(true);
          }
          if (action.payload.profile_pic) {
              setSelectedUpdateImage(action.payload.profile_pic);
          }
          if (action.payload.supervisor_for) {
            let supervisor_for = action.payload.supervisor_for.split(",");
            setSelectedAdmins(supervisor_for);
            setValue('admins[]', supervisor_for);
          }
        });
      }
    }

    updateSupervisorState();
  }, [dispatch, routeParams]);

  useEffect(() => {
    if (!supervisor || (supervisor && supervisor.error && supervisor.error.length > 0)) {
      if (supervisor && supervisor.error && supervisor.error.length > 0) {
        setTabValue(0);
      }
      return;
    }
    /**
     * Reset the form on supervisor state changes
     */
    reset(supervisor);
  }, [supervisor, reset]);

  useEffect(() => {
    return () => {
      /**
       * Reset supervisor on component unload
       */
      dispatch(resetSupervisor());
      setNoSupervisor(false);
    };
  }, [dispatch]);

  /**
   * Tab Change
   */
  function handleTabChange(event, value) {
    setTabValue(value);
  }


  
  function handleSaveSupervisor(event) {
    event.preventDefault();
    
    dispatch(saveSupervisor(getValues())).then((action) => {
      if (action.payload && action.payload.error && action.payload.error[0]) {
        dispatch(showMessage({ message: action.payload.error[0].message }));
      } else {
        dispatch(showMessage({ message: action.payload.message }));
        navigate('/apps/supervisors');
      }
    });
  }

  const handleAdminChange = (event) => {
    let {
      target: { value },
    } = event;
    if (value.indexOf('all_admins') != -1 && selected_admins.length != admins.length) {
      setSelectAllAdmins(true);
      value = admins.map((d) => {
        return d.id+"";
      });
      setSelectedAdmins(
        // On autofill we get a stringified value.
        typeof value === 'string' ? value.split(',') : value,
      );
      setValue('admins[]', value);
    } else {
      setSelectAllAdmins(false);
      let selectAllIndex = value.indexOf("all_admins");
      if (selectAllIndex > -1) {
        value.splice(selectAllIndex, 1);
      }
      setSelectedAdmins(
        // On autofill we get a stringified value.
        typeof value === 'string' ? value.split(',') : value,
      );
      setValue('admins[]', value);
    }
  };
  // This function will be triggered when the file field change
  const imageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedImage(e.target.files[0]);
      // setValue('profile_pic', e.target.files[0]);
      let files = event.target.files;
      let reader = new FileReader();
      reader.readAsDataURL(files[0]);

      reader.onload = (e) => {
        setValue('profile_pic', e.target.result);
        setValue('profile_pic_uploaded', true);
          /*this.setState({
              selectedFile: e.target.result,
            })*/
      }
    }
  };

  // This function will be triggered when the "Remove This Image" button is clicked
  const removeSelectedImage = () => {
    setSelectedImage();
    setValue('profile_pic_uploaded', false);
  };

  
  /**
   * Show Message if the requested supervisors is not exists
   */
  if (noSupervisor) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.1 } }}
        className="flex flex-col flex-1 items-center justify-center h-full"
      >
        <Typography color="textSecondary" variant="h5">
          There is no such supervisor!
        </Typography>
        <Button
          className="mt-24"
          component={Link}
          variant="outlined"
          to="/apps/supervisors"
          color="inherit"
        >
          Go to Supervisors Page
        </Button>
      </motion.div>
    );
  }

  /**
   * Wait while supervisor data is loading and form is setted
   */
  if (
    _.isEmpty(form) ||
    (supervisor && routeParams.supervisorId !== supervisor.encryption_id && routeParams.supervisorId !== 'new')
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
                            disabled={(routeParams.supervisorId !== 'new') ? true : false}
                            readOnly={(routeParams.supervisorId !== 'new') ? true : false}
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
                            disabled={(routeParams.supervisorId !== 'new') && supervisor.phone_no ? true : false}
                            readOnly={(routeParams.supervisorId !== 'new') && supervisor.phone_no ? true : false}
                            variant="outlined"
                            fullWidth
                          />
                        )}
                      />
                    </div>

                    {(routeParams.supervisorId === 'new') &&
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
                          <FormControl fullWidth>
                            <InputLabel id="country-simple-select-label">Country</InputLabel>
                            <Select
                              {...field}
                              id="country"
                              labelId="country-simple-select-label"
                              label="Country"
                              className="mt-8 mb-16 mx-4"
                              defaultValue=""
                              >
                                <MenuItem key={"0"} value={""}>Select</MenuItem>

                              {countries && countries.length > 0 && countries.map((country, k) => 
                                <MenuItem key={"cn_"+k} value={country.code+" - "+country.name} >{country.code+" - "+country.name}</MenuItem>
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

                    <Controller
                      name="address"
                      control={control}
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

                    <div>
                      <Typography>Profile Pic</Typography>
                        <Controller
                        control={control}
                        render={({ field: { onChange, value } }) => (
                          <label
                            htmlFor="button-file"
                            className="pull-left productImageUpload flex items-center justify-center relative w-128 h-128 rounded-16 mx-12 mb-24 overflow-hidden cursor-pointer shadow hover:shadow-lg"
                          >

                            <input type="file" name="profile_pic" className="hidden" id="button-file"  accept="image/*"  onChange={imageChange} />
                            
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
                      Select Admins:
                    </Typography>

                    <div className="flex -mx-4">
                      <Controller
                        name="admins"
                        control={control}
                        render={({ field }) => (
                          <FormControl fullWidth>
                            <InputLabel id="demo-multiple-checkbox-label">Admins *</InputLabel>
                            <Select
                              {...field}
                              id="admins"
                              labelId="demo-multiple-checkbox-label"
                              label="Admins *"
                              className="mt-8 mb-16"
                              defaultValue=""
                              multiple
                              value={selected_admins}
                              onChange={handleAdminChange}
                              renderValue={(selected) => {
                                let labels = admins.filter((m)=> {
                                  if (selected.indexOf(m.id+"") != -1) {
                                    return m;
                                  }
                                }).map((m) => {
                                  return m.first_name+" "+m.last_name;
                                }); 
                                return labels.join(', ')
                              }}
                              MenuProps={MenuProps}
                              >
                                <MenuItem key={"0"} value={"all_admins"}>
                                <Checkbox checked={selected_all_admins} />
                                  <ListItemText primary={"Select All"} />
                                </MenuItem>

                              {admins && admins.length > 0 && admins.map((admin) => 
                                <MenuItem key={admin.id+""} value={admin.id+""}>
                                  <Checkbox checked={selected_admins.indexOf(admin.id+"") > -1} />
                                  <ListItemText primary={/* admin.first_name+' '+admin.last_name+' ('+ */admin.org_name/* +')' */} />
                                </MenuItem>
                              )}
                            </Select>
                          </FormControl>

                        )}
                      />

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
                  disabled={(!isValid || selected_admins.length == 0)}
                  onClick={handleSaveSupervisor}
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

export default withReducer('supervisorsApp', reducer)(Supervisor);
