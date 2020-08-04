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
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import Checkbox from '@mui/material/Checkbox';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams, useNavigate } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import _ from '@lodash';
import { useForm, FormProvider, useFormContext, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { styled } from '@mui/material/styles';
import { resetStaff, newStaff, getStaff, getPermissions, saveStaff, removeStaff } from '../store/staffSlice';
import reducer from '../store';
import PageHeader from './PageHeader';
import InputLabel from '@mui/material/InputLabel';
import { showMessage } from 'app/store/fuse/messageSlice';
import countries from '../../admins/data/countries.json';
import Box from '@mui/material/Box';
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
});

function Staff(props) {
  const dispatch = useDispatch();
  const staff = useSelector(({ staffApp }) => staffApp.staff);

  const routeParams = useParams();
  const [tabValue, setTabValue] = useState(0);
  const [noStaff, setNoStaff] = useState(false);
  const [staff_id, setStaffId] = useState('');
  const [permissions, setPermissions] = useState([]);
  const [selectedImage, setSelectedImage] = useState();
  const [selectedUpdateImage, setSelectedUpdateImage] = useState();
  const [checked, setChecked] = useState({});
  const [permissionsValue, setPemissionsValue] = useState([]);
  const [childrenVisibility, setChildrenVisibility] = useState({});

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
    dispatch(getPermissions()).then((action) => {
      setPermissions(action.payload);
      let checkedParents = {};
      let childrenVisibilityOb = {}
      action.payload.forEach((permission) => {
        checkedParents[permission.parent] = permission.children.map((c) => {
          return false;
        });
        childrenVisibilityOb[permission.parent] = false;
      });
      setChecked(checkedParents);
      setChildrenVisibility(childrenVisibilityOb);
    });
  }, [dispatch]);

  useDeepCompareEffect(() => {
    function updateStaffState() {
      const { staffId } = routeParams;

      if (staffId === 'new') {
        /**
         * Create New staff data
         */
        dispatch(newStaff());
      } else {
        /**
         * Get staff data
         */
         setStaffId(staff_id);
        dispatch(getStaff(routeParams)).then((action) => {
          /**
           * If the requested staff is not exist show message
           */
          if (!action.payload) {
            setNoStaff(true);
          }

          if (action.payload.profile_pic) {
              setSelectedUpdateImage(action.payload.profile_pic);
          }

          if (action.payload.staff_permission) {
            dispatch(getPermissions()).then((act) => {
              setPermissions(act.payload);
              let checkedParents = {};
              
                act.payload.forEach((permission) => {
                  permission.children.forEach((child, k) => {
                    if (action.payload.staff_permission.indexOf(child) !== -1) {
                      if (checkedParents[permission.parent] && checkedParents[permission.parent].length > 0) {
                        checkedParents[permission.parent][k] = true;
                      } else {
                        checkedParents[permission.parent] = [];
                        checkedParents[permission.parent][k] = true;
                      }
                    }
                  });
                });
              console.log(checkedParents);
              setChecked(checkedParents);
            });

            setPemissionsValue(action.payload.staff_permission);
            setValue("permissions", action.payload.staff_permission.join(","));

          }

        });
      }
    }

    updateStaffState();
  }, [dispatch, routeParams]);

  useEffect(() => {
    if (!staff || (staff && staff.error && staff.error.length > 0)) {
      if (staff && staff.error && staff.error.length > 0) {
        setTabValue(0);
      }
      return;
    }
    /**
     * Reset the form on staff state changes
     */
    reset(staff);
  }, [staff, reset]);

  useEffect(() => {
    return () => {
      /**
       * Reset staff on component unload
       */
      dispatch(resetStaff());
      setNoStaff(false);
    };
  }, [dispatch]);

  /**
   * Tab Change
   */
  function handleTabChange(event, value) {
    setTabValue(value);
  }

 
  function handleSaveStaff(event) {
    event.preventDefault();
    dispatch(saveStaff(getValues())).then((action) => {
      if (action.payload && action.payload.error && action.payload.error[0]) {
        dispatch(showMessage({ message: action.payload.error[0].message }));
      } else {
        dispatch(showMessage({ message: action.payload.message }));
        navigate('/apps/staff');
      }
    });
  }

  // This function will be triggered when the file field change
  const imageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedImage(e.target.files[0]);
      // setValue('profile_pic', e.target.files[0]);
      /*const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();

        reader.onload = () => {
          setValue('profile_pic', `data:${file.type};base64,${btoa(reader.result)}`);
          console.log(`data:${file.type};base64,${btoa(reader.result)}`);
        };
      }*/
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

  const handleChangeParent = (permission, event) => {
    const checkedParents = {...checked};
    checkedParents[permission.parent] = permission.children.map((child) => {
      return event.target.checked;
    });
    setChecked(checkedParents);

    let permissionsSelected = [...permissionsValue];
    if (event.target.checked) {
      permission.children.forEach((child) => {
        if (permissionsSelected.indexOf(child) === -1) {
          permissionsSelected.push(child);
        }
      });
    } else {
      permission.children.forEach((child) => {
        if (permissionsSelected.indexOf(child) !== -1) {
          permissionsSelected.splice(permissionsSelected.indexOf(child), 1);
        }
      });
    }
    
    console.log(permissionsSelected);
    setPemissionsValue(permissionsSelected);
    setValue("permissions", permissionsSelected.join(","));
  };

  const handleChangeChildren = (permission, index, event) => {
    const checkedParents = {...checked};
    checkedParents[permission.parent][index] = event.target.checked;
    setChecked(checkedParents);

    let permissionsSelected = [...permissionsValue];
    let child = permission.children[index];
    if (event.target.checked) {
      if (permissionsSelected.indexOf(child) === -1) {
        permissionsSelected.push(child);
      }
    } else {
      if (permissionsSelected.indexOf(child) !== -1) {
        permissionsSelected.splice(permissionsSelected.indexOf(child), 1);
      }
    }

    console.log(permissionsSelected);
    setPemissionsValue(permissionsSelected);
    setValue("permissions", permissionsSelected.join(","));
  };

  const handleChildrenVisibility = (permission, event) => {
      const childrenVisibilityI = {...childrenVisibility};
      childrenVisibilityI[permission.parent] = !childrenVisibilityI[permission.parent];
      setChildrenVisibility(childrenVisibilityI);
  };

  
  /**
   * Show Message if the requested staffs is not exists
   */
  if (noStaff) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.1 } }}
        className="flex flex-col flex-1 items-center justify-center h-full"
      >
        <Typography color="textSecondary" variant="h5">
          There is no such staff!
        </Typography>
        <Button
          className="mt-24"
          component={Link}
          variant="outlined"
          to="/apps/staff"
          color="inherit"
        >
          Go to staff list Page
        </Button>
      </motion.div>
    );
  }

  /**
   * Wait while staff data is loading and form is setted
   */
  if (
    _.isEmpty(form) ||
    (staff && routeParams.staffId !== staff.encryption_id && routeParams.staffId !== 'new')
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
                  

                    {/*<div>
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
                    
                                        </div>*/}


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
                            disabled={(routeParams.staffId !== 'new') ? true : false}
                            readOnly={(routeParams.staffId !== 'new') ? true : false}
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
                            disabled={(routeParams.staffId !== 'new') && staff.phone_no ? true : false}
                            readOnly={(routeParams.staffId !== 'new') && staff.phone_no ? true : false}
                            variant="outlined"
                            fullWidth
                          />
                        )}
                      />
                    </div>

                    {(routeParams.staffId === 'new') &&
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

                    <Typography className="mb-16" color="textSecondary" variant="h5">
                      Permissions:
                    </Typography>

                    {permissions && permissions.length > 0 && permissions.map((permission, k) => 
                      <div key={"parent_"+k}>
                        {!childrenVisibility[permission.parent] &&
                          <Icon className="text-16 accordianIcon" onClick={(evnt)=>handleChildrenVisibility(permission, evnt)}>
                            add
                          </Icon>
                        }
                        {childrenVisibility[permission.parent] &&
                          <Icon className="text-16 accordianIcon" onClick={(evnt)=>handleChildrenVisibility(permission, evnt)}>
                            remove
                          </Icon>
                        }
                        <FormControlLabel
                          label={permission.parent}
                          className="text-capitalize"
                          control={
                            <Checkbox
                              checked={checked[permission.parent] && checked[permission.parent].filter((p) => {
                                if (p) {
                                  return p;
                                }
                              }).length == permission.children.length}
                              indeterminate={(checked[permission.parent] && (checked[permission.parent].filter((p) => {
                                if (p) {
                                  return p;
                                }
                              }).length < permission.children.length) && (checked[permission.parent].filter((p) => {
                                if (p) {
                                  return p;
                                }
                              }).length > 0))}
                              onChange={(evnt)=>handleChangeParent(permission, evnt)}
                            />
                          }
                        />
                        {childrenVisibility[permission.parent] &&
                        <Box sx={{ display: 'flex', flexDirection: 'column', ml: 3 }}>
                          {permission.children && permission.children.length > 0 && permission.children.map((child, ck) => 
                          <FormControlLabel
                            key={"child_"+ck}
                            className="text-capitalize"
                            label={child.replace(":", " ")}
                            control={<Checkbox checked={(checked[permission.parent] && checked[permission.parent][ck]) ? checked[permission.parent][ck] : false} onChange={(evnt)=>handleChangeChildren(permission, ck, evnt)} />}
                          />
                          )}
                        </Box>}
                      </div>
                    )}
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
                  onClick={handleSaveStaff}
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

export default withReducer('staffApp', reducer)(Staff);
