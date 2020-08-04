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
import { resetSettings, getSettings, updateSettings } from 'app/auth/store/settingsSlice';
import reducer from 'app/auth/store';
import clsx from 'clsx';
import FuseUtils from '@fuse/utils';
import PageHeader from './PageHeader';
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
  website_title: yup
    .string()
    .required('You must enter title of the website'),
  email: yup.string().email('You must enter a valid email').required('You must enter contact email'),
  contact: yup.string().required('You must enter contact no.')
        .min(8, 'You must enter a valid contact no.').max(13, 'You must enter a valid contact no.'),
  address: yup
    .string()
    .required('You must enter the address'),
});

function Settings(props) {
  const dispatch = useDispatch();
  const settings = useSelector(({ auth }) => auth.settings);
  console.log(settings);
  const user = useSelector(({ auth }) => auth.user);
  const navigate = useNavigate();

  const routeParams = useParams();
  const [tabValue, setTabValue] = useState(0);
  const [noSettings, setNoSettings] = useState(false);
  const [selectedImage, setSelectedImage] = useState();
  const [selectedUpdateImage, setSelectedUpdateImage] = useState();
  const [checked, setChecked] = useState(true);



  const methods = useForm({
    mode: 'onChange',
    defaultValues: {},
    resolver: yupResolver(schema),
  });
  const { reset, watch, control, onChange, formState, setValue, getValues } = methods;
  const { isValid, dirtyFields, errors } = formState;
  const form = watch();


  function updateSettingsState() {
    console.log(user);
      /**
       * Get settings data
       */
      dispatch(getSettings()).then((action) => {
        /**
         * If the requested settings is not exist show message
         */
        if (!action.payload) {
          setNoSettings(true);
        } else {
          if (action.payload.logo_lg) {
            setSelectedUpdateImage(action.payload.logo_lg);
          }

        }
      });
  }
  useDeepCompareEffect(() => {
    updateSettingsState();
  }, [dispatch]);

  useEffect(() => {
    if (!settings) {
      return;
    }
    /**
     * Reset the form on settings state changes
     */
    reset(settings);
  }, [settings, reset]);

  useEffect(() => {
    return () => {
      /**
       * Reset settings on component unload
       */
      dispatch(resetSettings());
      setNoSettings(false);
    };
  }, [dispatch]);

  /**
   * Tab Change
   */
  function handleTabChange(event, value) {
    setTabValue(value);
  }


  // This function will be triggered when the file field change
  const imageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedImage(e.target.files[0]);
      setValue('logo_lg', e.target.files[0]);
    }
  };

  // This function will be triggered when the "Remove This Image" button is clicked
  const removeSelectedImage = () => {
    setSelectedImage();
  };
  

  function handleSaveSettings() {
    dispatch(updateSettings(getValues())).then((action) => {
      dispatch(showMessage({ message: action.payload.message }));
      updateSettingsState();
    });
  }



  /**
   * Show Message if the requested breeds is not exists
   */

  /**
   * Wait while breed data is loading and form is setted
   */
  if (_.isEmpty(form)) {
    return <FuseLoading />;
  }

  

  return (
    <FormProvider {...methods}>
      <Root
        header={<PageHeader />}
        content={
          <div className="p-16 sm:p-24">
            <div className={tabValue !== 0 ? 'hidden' : ''}>
              <div>
              <Typography>Website Logo</Typography>


                <Controller
                control={control}
                render={({ field: { onChange, value } }) => (
                  <label
                    htmlFor="button-file"
                    className="pull-left productImageUpload flex items-center justify-center relative w-128 h-128 rounded-16 mx-12 mb-24 overflow-hidden cursor-pointer shadow hover:shadow-lg"
                  >

                    <input type="file" name="logo_lg" className="hidden" id="button-file"  accept="image/*"  onChange={imageChange} />
                    
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
              <Controller
                name="website_title"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    className="mt-8 mb-16 mx-3"
                    error={!!errors.website_title}
                    required
                    helperText={errors?.website_title?.message}
                    label="Website Title"
                    autoFocus
                    id="website_title"
                    variant="outlined"
                    fullWidth
                  />
                )}
              />
              <div className="flex -mx-4">
                
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      className="mt-8 mb-16  mx-4"
                      error={!!errors.email}
                      required
                      helperText={errors?.email?.message}
                      label="Email Id"
                      id="email"
                      variant="outlined"
                      fullWidth
                    />
                  )}
                />
                <Controller
                  name="contact"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type='number'
                      className="mt-8 mb-16 mx-4"
                      error={!!errors.contact}
                      required
                      helperText={errors?.contact?.message}
                      label="Contact No"
                      id="contact"
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
                    className="mt-8 mb-16"
                    id="address"
                    label="Physical Address"
                    type="text"
                    multiline
                    rows={5}
                    helperText={errors?.address?.message}
                    variant="outlined"
                    fullWidth
                  />
                )}
              /> 

              <Controller
                name="about"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    className="mt-8 mb-16"
                    id="about"
                    label="Write something about yourself..."
                    type="text"
                    multiline
                    rows={5}
                    helperText={errors?.about?.message}
                    variant="outlined"
                    fullWidth
                  />
                )}
              />

              <div className="flex -mx-4">
                  <Controller
                    name="facebook_url"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        className="mt-8 mb-16 mx-4"
                        error={!!errors.facebook_url}
                        helperText={errors?.facebook_url?.message}
                        label="Facebook Link"
                        id="facebook_url"
                        variant="outlined"
                        fullWidth
                      />
                    )}
                  />

                  <Controller
                    name="twitter_url"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        className="mt-8 mb-16 mx-4"
                        error={!!errors.twitter_url}
                        helperText={errors?.twitter_url?.message}
                        label="Twitter Link"
                        id="twitter_url"
                        variant="outlined"
                        fullWidth
                      />
                    )}
                  />
                  
                </div>
                <div className="flex -mx-4">
                  <Controller
                    name="linkedin_url"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        className="mt-8 mb-16 mx-4"
                        error={!!errors.linkedin_url}
                        helperText={errors?.linkedin_url?.message}
                        label="LinkedIn Link"
                        id="linkedin_url"
                        variant="outlined"
                        fullWidth
                      />
                    )}
                  />

                  <Controller
                    name="instagram_url"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        className="mt-8 mb-16 mx-4"
                        error={!!errors.instagram_url}
                        helperText={errors?.instagram_url?.message}
                        label="Instagram Link"
                        id="instagram_url"
                        variant="outlined"
                        fullWidth
                      />
                    )}
                  />
                </div>

                <div className="flex -mx-4">
                  <Controller
                    name="youtube_url"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        className="mt-8 mb-16 mx-4"
                        error={!!errors.youtube_url}
                        helperText={errors?.youtube_url?.message}
                        label="Youtube Link"
                        id="youtube_url"
                        variant="outlined"
                        fullWidth
                      />
                    )}
                  />

                  <Controller
                    name="producer_landing_page_customization_charge"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        className="mt-8 mb-16 mx-4"
                        error={!!errors.producer_landing_page_customization_charge}
                        helperText={errors?.producer_landing_page_customization_charge?.message}
                        label="Producer's Customize Landig Page Charges ($)"
                        id="producer_landing_page_customization_charge"
                        variant="outlined"
                        fullWidth
                      />
                    )}
                  />
                  
                </div>

            
            </div>
            <motion.div
              className="mt30 pb30"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0, transition: { delay: 0.3 } }}
            >
              <Button
                className="whitespace-nowrap mx-4 pull-right"
                variant="contained"
                color="secondary"
                disabled={(!isValid)}
                onClick={handleSaveSettings}
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

export default withReducer('auth', reducer)(Settings);
