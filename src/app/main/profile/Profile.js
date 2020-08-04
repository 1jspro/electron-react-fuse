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
import Radio from '@mui/material/Radio';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from "@mui/material/MenuItem";
import Select from '@mui/material/Select';
import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import FormControlLabel from '@mui/material/FormControlLabel';
import Autocomplete from '@mui/material/Autocomplete';
import { resetProfile, newProfile, getProfile, updateProfile, getLevels, getLevelsData, getPositions, getAllParentLevels, getEducationLevels, getDynamicForms, getIndustries, getProfessions } from 'app/auth/store/profileSlice';
import { setUserData } from 'app/auth/store/userSlice';
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

function Profile(props) {
  const dispatch = useDispatch();
  const profile = useSelector(({ auth }) => auth.profile);
  const user = useSelector(({ auth }) => auth.user);
  const user_role = user.role[0];

  const navigate = useNavigate();

  const routeParams = useParams();
  const [tabValue, setTabValue] = useState(0);
  const [noProfile, setNoProfile] = useState(false);

  const [selectedImage, setSelectedImage] = useState();
  const [selectedUpdateImage, setSelectedUpdateImage] = useState();

  const [selectedImage2, setSelectedImage2] = useState();
  const [selectedUpdateImage2, setSelectedUpdateImage2] = useState();

  const [selectedSignature, setSelectedSignature] = useState();
  const [selectedUpdateSignature, setSelectedUpdateSignature] = useState();

  const [selectedTFILandscape, setSelectedTFILandscape] = useState();
  const [selectedUpdateTFILandscape, setSelectedUpdateTFILandscape] = useState();

  const [selectedTBILandscape, setSelectedTBILandscape] = useState();
  const [selectedUpdateTBILandscape, setSelectedUpdateTBILandscape] = useState();

  const [selectedTFIPortrait, setSelectedTFIPortrait] = useState();
  const [selectedUpdateTFIPortrait, setSelectedUpdateTFIPortrait] = useState();

  const [selectedTBIPortrait, setSelectedTBIPortrait] = useState();
  const [selectedUpdateTBIPortrait, setSelectedUpdateTBIPortrait] = useState();

  const [levelDataList, setLevelDataList] = useState([]);
  const [selectedDataIds, setSelectedDataIds] = useState({});
  const [education_levels, setEducationLevels] = useState([]);
  const [dynamic_forms, setDynamicForms] = useState([]);
  const [industries, setIndustries] = useState([]);
  const [professions, setProfessions] = useState([]);
  const [positions, setPositions] = useState([]);
  const [selectedGender, setSelectedGender] = useState('Male');
  const [self_employed, setSelfEmployed] = useState('Yes');
  const [have_position, setHavePosition] = useState('Yes');
  const [extra_field, setExtraFields] = useState({});
  const [selectedProfile, setSelectedProfile] = useState();
  const [selectedUpdateProfile, setSelectedUpdateProfile] = useState();


  const [checked, setChecked] = useState(true);
  const [levels, setLevels] = useState([]);



  const methods = useForm({
    mode: 'onChange',
    defaultValues: {},
    resolver: yupResolver(schema),
  });
  const { reset, watch, control, onChange, formState, setValue, getValues } = methods;
  const { isValid, dirtyFields, errors } = formState;
  const form = watch();

  useEffect(() => {
    dispatch(getLevels()).then((action) => {
      setLevels(action.payload);
      if (user_role == "member" || user_role == "member-admin") {
        const top_level_id = action.payload[0].id;

        dispatch(getLevelsData({ level_id: top_level_id })).then((action) => {
          const datalist = [...levelDataList];
          datalist[top_level_id] = action.payload;
          setLevelDataList(datalist)
        });
      }
    });

    if (user_role == "member" || user_role == "member-admin") {
      dispatch(getPositions()).then((action) => {
        setPositions(action.payload);
      });
      dispatch(getDynamicForms()).then((action) => {
        setDynamicForms(action.payload);
      });
      dispatch(getEducationLevels()).then((action) => {
        setEducationLevels(action.payload);
      });
      dispatch(getIndustries()).then((action) => {
        setIndustries(action.payload);
      });
      dispatch(getProfessions()).then((action) => {
        setProfessions(action.payload);
      });
    }
  }, [dispatch]);


  function updateProfileState() {
    console.log(user);
    /**
     * Get Profile data
     */
    dispatch(getProfile({ profileId: user.uuid })).then((action) => {
      /**
       * If the requested profile is not exist show message
       */
      if (!action.payload) {
        setNoProfile(true);
      } else {
        if (action.payload.org_image) {
          setSelectedUpdateImage(action.payload.org_image);
        }

        if (action.payload.org_image_two) {
          setSelectedUpdateImage2(action.payload.org_image_two);
        }

        if (action.payload.signature) {
          setSelectedUpdateSignature(action.payload.signature);
        }

        if (action.payload.template_front_image_landscape) {
          setSelectedUpdateTFILandscape(action.payload.template_front_image_landscape);
        }

        if (action.payload.template_back_image_landscape) {
          setSelectedUpdateTBILandscape(action.payload.template_back_image_landscape);
        }

        if (action.payload.template_front_image_portrait) {
          setSelectedUpdateTFIPortrait(action.payload.template_front_image_portrait);
        }

        if (action.payload.template_back_image_portrait) {
          setSelectedUpdateTBIPortrait(action.payload.template_back_image_portrait);
        }

        if (user_role == "member" || user_role == "member-admin" || user_role == "supervisor") {
          if (action.payload.profile_pic) {
            setSelectedUpdateProfile(action.payload.profile_pic);
          }
        }

        if (user_role == "member" || user_role == "member-admin") {
          if (action.payload.gender) {
            setSelectedGender(action.payload.gender);
          }

          if (action.payload.self_employed) {
            setSelfEmployed(action.payload.self_employed);
          }

          if (action.payload.have_position) {
            setHavePosition(action.payload.have_position);
          }

          if (action.payload.extra_field) {
            let extraField = JSON.parse(action.payload.extra_field);
            setExtraFields(extraField);
            setValue('extra_field', extraField);
          }

          if (action.payload.level_data_id) {
            let parent_id = action.payload.level_data_id;
            dispatch(getAllParentLevels({ "parent_id": parent_id })).then((action) => {
              let dataIds = {};
              for (const key in action.payload.data.parents) {
                dataIds[action.payload.data.parents[key]["level_id"]] = action.payload.data.parents[key]["id"] + "";
                setValue("level_" + action.payload.data.parents[key]["level_id"], action.payload.data.parents[key]["id"] + "");
              }

              const datalist = [...levelDataList];
              for (const key in action.payload.dataList) {
                datalist[key] = action.payload.dataList[key];
              }
              setLevelDataList(datalist);
              setSelectedDataIds(dataIds);
              console.log(action.payload);
            });
          }
        }

        setValue("encryption_id", action.payload.encryption_id);

      }
    });
  }
  useDeepCompareEffect(() => {

    updateProfileState();
  }, [dispatch]);

  useEffect(() => {
    if (!profile) {
      return;
    }
    /**
     * Reset the form on profile state changes
     */
    reset(profile);
  }, [profile, reset]);

  useEffect(() => {
    return () => {
      /**
       * Reset Profile on component unload
       */
      dispatch(resetProfile());
      setNoProfile(false);
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

  // This function will be triggered when the file field change
  const image2Change = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedImage2(e.target.files[0]);
      // setValue('org_image', e.target.files[0]);
      let files = event.target.files;
      let reader = new FileReader();
      reader.readAsDataURL(files[0]);

      reader.onload = (e) => {
        setValue('org_image_two', e.target.result);
        setValue('org_image_two_uploaded', true);
        /*this.setState({
            selectedFile: e.target.result,
          })*/
      }
    }
  };

  // This function will be triggered when the "Remove This Image" button is clicked
  const removeSelectedImage2 = () => {
    setSelectedImage2();
    setValue('org_image_two_uploaded', false);
  };

  // This function will be triggered when the file field change
  const signatureChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedSignature(e.target.files[0]);
      // setValue('org_image', e.target.files[0]);
      let files = event.target.files;
      let reader = new FileReader();
      reader.readAsDataURL(files[0]);

      reader.onload = (e) => {
        setValue('signature', e.target.result);
        setValue('signature_uploaded', true);
        /*this.setState({
            selectedFile: e.target.result,
          })*/
      }
    }
  };

  // This function will be triggered when the "Remove This Image" button is clicked
  const removeSelectedSignature = () => {
    setSelectedSignature();
    setValue('signature_uploaded', false);
  };

  // This function will be triggered when the file field change
  const tfILandscapeChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedTFILandscape(e.target.files[0]);
      // setValue('org_image', e.target.files[0]);
      let files = event.target.files;
      let reader = new FileReader();
      reader.readAsDataURL(files[0]);

      reader.onload = (e) => {
        setValue('template_front_image_landscape', e.target.result);
        setValue('template_front_image_landscape_uploaded', true);
        /*this.setState({
            selectedFile: e.target.result,
          })*/
      }
    }
  };

  // This function will be triggered when the "Remove This Image" button is clicked
  const removeSelectedTFILandscape = () => {
    setSelectedTFILandscape();
    setValue('template_front_image_landscape_uploaded', false);
  };

  // This function will be triggered when the file field change
  const tbILandscapeChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedTBILandscape(e.target.files[0]);
      // setValue('org_image', e.target.files[0]);
      let files = event.target.files;
      let reader = new FileReader();
      reader.readAsDataURL(files[0]);

      reader.onload = (e) => {
        setValue('template_back_image_landscape', e.target.result);
        setValue('template_back_image_landscape_uploaded', true);
        /*this.setState({
            selectedFile: e.target.result,
          })*/
      }
    }
  };

  // This function will be triggered when the "Remove This Image" button is clicked
  const removeSelectedTBILandscape = () => {
    setSelectedTBILandscape();
    setValue('template_back_image_landscape_uploaded', false);
  };

  // This function will be triggered when the file field change
  const tfIPortraitChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedTFIPortrait(e.target.files[0]);
      // setValue('org_image', e.target.files[0]);
      let files = event.target.files;
      let reader = new FileReader();
      reader.readAsDataURL(files[0]);

      reader.onload = (e) => {
        setValue('template_front_image_portrait', e.target.result);
        setValue('template_front_image_portrait_uploaded', true);
        /*this.setState({
            selectedFile: e.target.result,
          })*/
      }
    }
  };

  // This function will be triggered when the "Remove This Image" button is clicked
  const removeSelectedTFIPortrait = () => {
    setSelectedTFIPortrait();
    setValue('template_front_image_portrait_uploaded', false);
  };

  // This function will be triggered when the file field change
  const tbIPortraitChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedTBIPortrait(e.target.files[0]);
      // setValue('org_image', e.target.files[0]);
      let files = event.target.files;
      let reader = new FileReader();
      reader.readAsDataURL(files[0]);

      reader.onload = (e) => {
        setValue('template_back_image_portrait', e.target.result);
        setValue('template_back_image_portrait_uploaded', true);
        /*this.setState({
            selectedFile: e.target.result,
          })*/
      }
    }
  };

  // This function will be triggered when the "Remove This Image" button is clicked
  const removeSelectedTBIPortrait = () => {
    setSelectedTBIPortrait();
    setValue('template_back_image_portrait_uploaded', false);
  };

  function handleGenderChange(event, value) {
    setSelectedGender(event.target.value);
    setValue("gender", event.target.value)
  }

  function handleSelfEmployedChange(event, value) {
    setSelfEmployed(event.target.value);
    setValue("self_employed", event.target.value)
  }

  function handlePositionChange(event, value) {
    setHavePosition(event.target.value);
    setValue("have_position", event.target.value)
    setValue("position", "")
  }

  function handleLevelChange(key, event) {
    let dataIds = { ...selectedDataIds };
    dataIds[levels[key]['id']] = event.target.value + "";
    setValue("level_" + levels[key]['id'], event.target.value + "");
    setSelectedDataIds(dataIds);

    if (levels && key < levels.length) {
      let level_id = levels[key + 1] ? levels[key + 1].id : "";
      if (level_id) {
        dispatch(getLevelsData({ level_id: level_id, parent_id: event.target.value })).then((action) => {
          const datalist = [...levelDataList];
          datalist[level_id] = action.payload;
          setLevelDataList(datalist)
        });
      }
    }

    if (key == levels.length - 1) {
      setValue('level_id', levels[key]["id"]);
      setValue('level_data_id', event.target.value);
    }

    /*const { value } = event.target;
    const list = [...levels];
    list[key]["selected_data"] = value;
    setLevels(list);*/
  }

  // This function will be triggered when the file field change
  const profileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedProfile(e.target.files[0]);
      let files = event.target.files;
      let reader = new FileReader();
      reader.readAsDataURL(files[0]);

      reader.onload = (e) => {
        setValue('profile_pic', e.target.result);
        setValue('profile_pic_uploaded', true);
      }
    }
  };

  // This function will be triggered when the "Remove This Image" button is clicked
  const removeSelectedProfile = () => {
    setSelectedProfile();
    setValue('profile_pic_uploaded', false);
  };


  const handleFieldChange = (index, evnt) => {
    const { name, value } = evnt.target;
    const dataId = name.split("@#$")[1];
    const extraField = { ...extra_field };
    extraField[dataId] = value;
    setExtraFields(extraField);
    setValue('extra_field', extraField);
    console.log(extraField, "extraField");
  }


  function handleSaveProfile() {
    dispatch(updateProfile(getValues())).then((action) => {
      dispatch(showMessage({ message: action.payload.message }));
      dispatch(setUserData(action.payload.user));
      updateProfileState();
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
          <div className="p-16 sm:p-24 greyBg">
            <div className={tabValue !== 0 ? 'hidden' : ''}>
              <div>
                {user.role[0] == 'admin' &&
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
                        name="org_sub_title"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            className="mt-8 mb-16 mx-4"
                            error={!!errors.org_sub_title}
                            helperText={errors?.org_sub_title?.message}
                            label="Organization Sub Title"
                            id="org_sub_title"
                            autoFocus
                            variant="outlined"
                            fullWidth
                          />
                        )}
                      />
                    </div>

                    <div className="flex -mx-4">
                      <Controller
                        name="org_moto"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            className="mt-8 mb-16 mx-4"
                            error={!!errors.org_moto}
                            helperText={errors?.org_moto?.message}
                            label="Organization Moto"
                            id="org_moto"
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

                    <div className="flex -mx-3">
                      <div className="mx-3">
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

                      <div className="mx-3">
                        <Typography>Organization Logo 2</Typography>
                        <Controller
                          control={control}
                          render={({ field: { onChange, value } }) => (
                            <label
                              htmlFor="button-file2"
                              className="pull-left productImageUpload flex items-center justify-center relative w-128 h-128 rounded-16 mx-12 mb-24 overflow-hidden cursor-pointer shadow hover:shadow-lg"
                            >

                              <input type="file" name="org_image_two" className="hidden" id="button-file2" accept="image/*" onChange={image2Change} />

                              <Icon fontSize="large" color="action">
                                cloud_upload
                              </Icon>

                            </label>
                          )}
                        />
                        {selectedImage2 && (
                          <div
                            className={clsx(
                              'productImageItem flex items-center justify-center relative w-128 h-128 rounded-16 mx-12 mb-24 overflow-hidden cursor-pointer outline-none shadow hover:shadow-lg')}
                          >
                            <img className="max-w-none w-auto h-full" src={URL.createObjectURL(selectedImage2)} alt="image" />
                            <IconButton
                              onClick={removeSelectedImage2}
                              className={clsx('w-40 h-40 removeBtn', props.className)}
                              size="large"
                            >
                              <Icon>delete</Icon>
                            </IconButton>

                          </div>


                        )}

                        {selectedUpdateImage2 && !selectedImage2 && (
                          <div
                            className={clsx(
                              'productImageItem flex items-center justify-center relative w-128 h-128 rounded-16 mx-12 mb-24 overflow-hidden cursor-pointer outline-none shadow hover:shadow-lg')}
                          >
                            <img className="max-w-none w-auto h-full" src={selectedUpdateImage2} alt="image" />
                          </div>
                        )}

                        <div className="clearfix"></div>

                      </div>

                      <div className="mx-3">
                        <Typography>Signature</Typography>
                        <Controller
                          control={control}
                          render={({ field: { onChange, value } }) => (
                            <label
                              htmlFor="signatureFile"
                              className="pull-left productImageUpload flex items-center justify-center relative w-128 h-128 rounded-16 mx-12 mb-24 overflow-hidden cursor-pointer shadow hover:shadow-lg"
                            >

                              <input type="file" name="signature" className="hidden" id="signatureFile" accept="image/*" onChange={signatureChange} />

                              <Icon fontSize="large" color="action">
                                cloud_upload
                              </Icon>

                            </label>
                          )}
                        />
                        {selectedSignature && (
                          <div
                            className={clsx(
                              'productImageItem flex items-center justify-center relative w-128 h-128 rounded-16 mx-12 mb-24 overflow-hidden cursor-pointer outline-none shadow hover:shadow-lg')}
                          >
                            <img className="max-w-none w-auto h-full" src={URL.createObjectURL(selectedSignature)} alt="image" />
                            <IconButton
                              onClick={removeSelectedSignature}
                              className={clsx('w-40 h-40 removeBtn', props.className)}
                              size="large"
                            >
                              <Icon>delete</Icon>
                            </IconButton>

                          </div>


                        )}

                        {selectedUpdateSignature && !selectedSignature && (
                          <div
                            className={clsx(
                              'productImageItem flex items-center justify-center relative w-128 h-128 rounded-16 mx-12 mb-24 overflow-hidden cursor-pointer outline-none shadow hover:shadow-lg')}
                          >
                            <img className="max-w-none w-auto h-full" src={selectedUpdateSignature} alt="image" />
                          </div>
                        )}

                        <div className="clearfix"></div>

                      </div>
                    </div>

                    <Typography className="mb-16" color="textSecondary" variant="h5">
                      ID Card Template Info
                    </Typography>

                    <div className="flex -mx-4">
                      <Controller
                        name="id_card_design"
                        control={control}
                        render={({ field }) => (
                          <FormControl fullWidth>
                            <InputLabel id="design-simple-select-label">Id Card Design</InputLabel>
                            <Select
                              {...field}
                              id="id_card_design"
                              labelId="design-simple-select-label"
                              label="Id Card Design"
                              className="mt-8 mb-16 mx-4"
                              defaultValue=""
                            >
                              <MenuItem key={"0"} value={""}>Select</MenuItem>
                              <MenuItem key={"7"} value={"default_portrait"}>Default Portrait</MenuItem>
                              <MenuItem key={"4"} value={"custom_portrait"}>Custom Portrait</MenuItem>
                              <MenuItem key={"8"} value={"default_landscape"}>Default Landscape</MenuItem>
                              <MenuItem key={"1"} value={"custom_landscape"}>Custom Landscape</MenuItem>
                              <MenuItem key={"6"} value={"custom_color_portrait"}>Custom Color Portrait</MenuItem>
                              <MenuItem key={"5"} value={"custom_color_landscape"}>Custom Color Landscape</MenuItem>

                            </Select>
                          </FormControl>

                        )}
                      />

                      <Controller
                        name="template_top_color"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            type="color"
                            className="mt-8 mb-16 mx-4 mx100"
                            error={!!errors.template_top_color}
                            helperText={errors?.template_top_color?.message}
                            label="Top Color"
                            id="template_top_color"
                            variant="outlined"
                            fullWidth
                          />
                        )}
                      />

                      <Controller
                        name="template_bottom_color"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            type="color"
                            className="mt-8 mb-16 mx-4 mx100"
                            error={!!errors.template_bottom_color}
                            helperText={errors?.template_bottom_color?.message}
                            label="Bottom Color"
                            id="template_bottom_color"
                            variant="outlined"
                            fullWidth
                          />
                        )}
                      />

                      <Controller
                        name="template_background_color"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            type="color"
                            className="mt-8 mb-16 mx-4 mx100"
                            error={!!errors.template_background_color}
                            helperText={errors?.template_background_color?.message}
                            label="Background Color"
                            id="template_background_color"
                            variant="outlined"
                            fullWidth
                          />
                        )}
                      />
                    </div>

                    <div className="flex -mx-4">
                      <div className="mx-4">
                        <Typography>Front Landscape Image</Typography>
                        <Controller
                          control={control}
                          render={({ field: { onChange, value } }) => (
                            <label
                              htmlFor="FLIFile"
                              className="pull-left productImageUpload flex items-center justify-center relative w-128 h-128 rounded-16 mx-12 mb-24 overflow-hidden cursor-pointer shadow hover:shadow-lg"
                            >

                              <input type="file" name="template_front_image_landscape" className="hidden" id="FLIFile" accept="image/*" onChange={tfILandscapeChange} />

                              <Icon fontSize="large" color="action">
                                cloud_upload
                              </Icon>

                            </label>
                          )}
                        />
                        {selectedTFILandscape && (
                          <div
                            className={clsx(
                              'productImageItem flex items-center justify-center relative w-128 h-128 rounded-16 mx-12 mb-24 overflow-hidden cursor-pointer outline-none shadow hover:shadow-lg')}
                          >
                            <img className="max-w-none w-auto h-full" src={URL.createObjectURL(selectedTFILandscape)} alt="image" />
                            <IconButton
                              onClick={removeSelectedTFILandscape}
                              className={clsx('w-40 h-40 removeBtn', props.className)}
                              size="large"
                            >
                              <Icon>delete</Icon>
                            </IconButton>

                          </div>


                        )}

                        {selectedUpdateTFILandscape && !selectedTFILandscape && (
                          <div
                            className={clsx(
                              'productImageItem flex items-center justify-center relative w-128 h-128 rounded-16 mx-12 mb-24 overflow-hidden cursor-pointer outline-none shadow hover:shadow-lg')}
                          >
                            <img className="max-w-none w-auto h-full" src={selectedUpdateTFILandscape} alt="image" />
                          </div>
                        )}

                        <div className="clearfix"></div>

                      </div>

                      <div className="mx-4">
                        <Typography>Back Landscape Image</Typography>
                        <Controller
                          control={control}
                          render={({ field: { onChange, value } }) => (
                            <label
                              htmlFor="BLIFile"
                              className="pull-left productImageUpload flex items-center justify-center relative w-128 h-128 rounded-16 mx-12 mb-24 overflow-hidden cursor-pointer shadow hover:shadow-lg"
                            >

                              <input type="file" name="template_back_image_landscape" className="hidden" id="BLIFile" accept="image/*" onChange={tbILandscapeChange} />

                              <Icon fontSize="large" color="action">
                                cloud_upload
                              </Icon>

                            </label>
                          )}
                        />
                        {selectedTBILandscape && (
                          <div
                            className={clsx(
                              'productImageItem flex items-center justify-center relative w-128 h-128 rounded-16 mx-12 mb-24 overflow-hidden cursor-pointer outline-none shadow hover:shadow-lg')}
                          >
                            <img className="max-w-none w-auto h-full" src={URL.createObjectURL(selectedTBILandscape)} alt="image" />
                            <IconButton
                              onClick={removeSelectedTBILandscape}
                              className={clsx('w-40 h-40 removeBtn', props.className)}
                              size="large"
                            >
                              <Icon>delete</Icon>
                            </IconButton>

                          </div>


                        )}

                        {selectedUpdateTBILandscape && !selectedTBILandscape && (
                          <div
                            className={clsx(
                              'productImageItem flex items-center justify-center relative w-128 h-128 rounded-16 mx-12 mb-24 overflow-hidden cursor-pointer outline-none shadow hover:shadow-lg')}
                          >
                            <img className="max-w-none w-auto h-full" src={selectedUpdateTBILandscape} alt="image" />
                          </div>
                        )}

                        <div className="clearfix"></div>

                      </div>

                      <div className="mx-4">
                        <Typography>Front Portrait Image</Typography>
                        <Controller
                          control={control}
                          render={({ field: { onChange, value } }) => (
                            <label
                              htmlFor="FPIFile"
                              className="pull-left productImageUpload flex items-center justify-center relative w-128 h-128 rounded-16 mx-12 mb-24 overflow-hidden cursor-pointer shadow hover:shadow-lg"
                            >

                              <input type="file" name="template_front_image_portrait" className="hidden" id="FPIFile" accept="image/*" onChange={tfIPortraitChange} />

                              <Icon fontSize="large" color="action">
                                cloud_upload
                              </Icon>

                            </label>
                          )}
                        />
                        {selectedTFIPortrait && (
                          <div
                            className={clsx(
                              'productImageItem flex items-center justify-center relative w-128 h-128 rounded-16 mx-12 mb-24 overflow-hidden cursor-pointer outline-none shadow hover:shadow-lg')}
                          >
                            <img className="max-w-none w-auto h-full" src={URL.createObjectURL(selectedTFIPortrait)} alt="image" />
                            <IconButton
                              onClick={removeSelectedTFIPortrait}
                              className={clsx('w-40 h-40 removeBtn', props.className)}
                              size="large"
                            >
                              <Icon>delete</Icon>
                            </IconButton>

                          </div>


                        )}

                        {selectedUpdateTFIPortrait && !selectedTFIPortrait && (
                          <div
                            className={clsx(
                              'productImageItem flex items-center justify-center relative w-128 h-128 rounded-16 mx-12 mb-24 overflow-hidden cursor-pointer outline-none shadow hover:shadow-lg')}
                          >
                            <img className="max-w-none w-auto h-full" src={selectedUpdateTFIPortrait} alt="image" />
                          </div>
                        )}

                        <div className="clearfix"></div>

                      </div>

                      <div className="mx-4">
                        <Typography>Back Portrait Image</Typography>
                        <Controller
                          control={control}
                          render={({ field: { onChange, value } }) => (
                            <label
                              htmlFor="BPIFile"
                              className="pull-left productImageUpload flex items-center justify-center relative w-128 h-128 rounded-16 mx-12 mb-24 overflow-hidden cursor-pointer shadow hover:shadow-lg"
                            >

                              <input type="file" name="template_front_image_portrait" className="hidden" id="BPIFile" accept="image/*" onChange={tbIPortraitChange} />

                              <Icon fontSize="large" color="action">
                                cloud_upload
                              </Icon>

                            </label>
                          )}
                        />
                        {selectedTBIPortrait && (
                          <div
                            className={clsx(
                              'productImageItem flex items-center justify-center relative w-128 h-128 rounded-16 mx-12 mb-24 overflow-hidden cursor-pointer outline-none shadow hover:shadow-lg')}
                          >
                            <img className="max-w-none w-auto h-full" src={URL.createObjectURL(selectedTBIPortrait)} alt="image" />
                            <IconButton
                              onClick={removeSelectedTBIPortrait}
                              className={clsx('w-40 h-40 removeBtn', props.className)}
                              size="large"
                            >
                              <Icon>delete</Icon>
                            </IconButton>

                          </div>


                        )}

                        {selectedUpdateTBIPortrait && !selectedTBIPortrait && (
                          <div
                            className={clsx(
                              'productImageItem flex items-center justify-center relative w-128 h-128 rounded-16 mx-12 mb-24 overflow-hidden cursor-pointer outline-none shadow hover:shadow-lg')}
                          >
                            <img className="max-w-none w-auto h-full" src={selectedUpdateTBIPortrait} alt="image" />
                          </div>
                        )}

                        <div className="clearfix"></div>

                      </div>
                    </div>


                    <Typography className="mb-16" color="textSecondary" variant="h5">
                      Admin Info
                    </Typography>
                  </div>}



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
                        disabled={true}
                        readOnly={true}
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
                        variant="outlined"
                        fullWidth
                      />
                    )}
                  />
                </div>

                {(user.role[0] == 'admin' || user.role[0] == 'super-admin' || user.role[0] == 'staff' || user.role[0] == 'supervisor') &&
                  <div className="flex -mx-4">
                    <Controller
                      name="country"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          className="mt-8 mb-16 mx-4"
                          error={!!errors.country}
                          helperText={errors?.country?.message}
                          label="Country"
                          id="country"
                          variant="outlined"
                          fullWidth
                        />
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
                }

                {(user.role[0] == 'admin' || user.role[0] == 'super-admin' || user.role[0] == 'staff' || user.role[0] == 'supervisor') &&
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
                }

                {(user.role[0] == 'admin') &&
                  <Controller
                    name="back_content"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        className="mt-8 mb-16 mx-4"
                        id="back_content"
                        label="ID Card Back Content"
                        type="text"
                        multiline
                        rows={3}
                        variant="outlined"
                        fullWidth
                      />
                    )}
                  />
                }

                {(user.role[0] == 'supervisor') &&
                  <div className="mt-8 mb-16 mx-4 w-98">
                    <Typography>Please Upload a clear passport picture of yours</Typography>
                    <Controller
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <label
                          htmlFor="button-file"
                          className="pull-left productImageUpload flex items-center justify-center relative w-128 h-128 rounded-16 mx-12 mb-24 overflow-hidden cursor-pointer shadow hover:shadow-lg"
                        >

                          <input type="file" name="profile_pic" className="hidden" id="button-file" accept="image/*" onChange={profileChange} />

                          <Icon fontSize="large" color="action">
                            cloud_upload
                          </Icon>

                        </label>
                      )}
                    />
                    {selectedProfile && (
                      <div
                        className={clsx(
                          'productImageItem flex items-center justify-center relative w-128 h-128 rounded-16 mx-12 mb-24 overflow-hidden cursor-pointer outline-none shadow hover:shadow-lg')}
                      >
                        <img className="max-w-none w-auto h-full" src={URL.createObjectURL(selectedProfile)} alt="image" />
                        <IconButton
                          onClick={removeSelectedProfile}
                          className={clsx('w-40 h-40 removeBtn', props.className)}
                          size="large"
                        >
                          <Icon>delete</Icon>
                        </IconButton>

                      </div>


                    )}

                    {selectedUpdateProfile && !selectedProfile && (
                      <div
                        className={clsx(
                          'productImageItem flex items-center justify-center relative w-128 h-128 rounded-16 mx-12 mb-24 overflow-hidden cursor-pointer outline-none shadow hover:shadow-lg')}
                      >
                        <img className="max-w-none w-auto h-full" src={selectedUpdateProfile} alt="image" />
                      </div>
                    )}

                    <div className="clearfix"></div>

                  </div>
                }

                {/*{user.role[0] == 'admin' &&
                                          <div>
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
                                                        <MenuItem key={level.id+""} value={level.id+""} >{level.flow}</MenuItem>
                                                      )}
                                                    </Select>
                                                  </FormControl>
                    
                                                )}
                                              />
                    
                                            </div>
                                          </div>
                                        }*/}

                {(user.role[0] == 'member' || user.role[0] == 'member-admin') &&
                  <>
                    {/*<div className="flex -mx-4">
                                                  <Controller
                                                    name="education_level"
                                                    control={control}
                                                    render={({ field }) => (
                                                      <FormControl fullWidth>
                                                        <InputLabel id="level-simple-select-label">Education Level</InputLabel>
                                                        <Select
                                                          {...field}
                                                          id="education_level"
                                                          labelId="level-simple-select-label"
                                                          label="Education Level"
                                                          className="mt-8 mb-16 mx-4"
                                                          defaultValue=""
                                                          >
                                                            <MenuItem key={"el_0"} value={""}>Select</MenuItem>
                        
                                                          {education_levels && education_levels.length > 0 && education_levels.map((level) => 
                                                            <MenuItem key={"el_"+level.id+""} value={level.id+""} >{level.name}</MenuItem>
                                                          )}
                                                        </Select>
                                                      </FormControl>
                        
                                                    )}
                                                  />
                        
                                                  <Controller
                                                    name="industry"
                                                    control={control}
                                                    render={({ field }) => (
                                                      <FormControl fullWidth>
                                                        <InputLabel id="industry-simple-select-label">Industry</InputLabel>
                                                        <Select
                                                          {...field}
                                                          id="industry"
                                                          labelId="industry-simple-select-label"
                                                          label="Industry"
                                                          className="mt-8 mb-16 mx-4"
                                                          defaultValue=""
                                                          >
                                                            <MenuItem key={"in_0"} value={""}>Select</MenuItem>
                        
                                                          {industries && industries.length > 0 && industries.map((industry) => 
                                                            <MenuItem key={"in_"+industry.id+""} value={industry.id+""} >{industry.name}</MenuItem>
                                                          )}
                                                        </Select>
                                                      </FormControl>
                        
                                                    )}
                                                  />
                        
                                                </div>*/}

                    <div className="flex -mx-4">
                      {/*<Controller
                                                      name="profession"
                                                      control={control}
                                                      render={({ field }) => (
                                                        <FormControl fullWidth>
                                                          <InputLabel id="profession-simple-select-label">Profession</InputLabel>
                                                          <Select
                                                            {...field}
                                                            id="profession"
                                                            labelId="profession-simple-select-label"
                                                            label="Profession"
                                                            className="mt-8 mb-16 mx-4"
                                                            defaultValue=""
                                                            >
                                                              <MenuItem key={"pr_0"} value={""}>Select</MenuItem>
                          
                                                            {professions && professions.length > 0 && professions.map((profession) => 
                                                              <MenuItem key={"pr_"+profession.id+""} value={profession.id+""} >{profession.name}</MenuItem>
                                                            )}
                                                          </Select>
                                                        </FormControl>
                          
                                                      )}
                                                    />*/}
                      <div className="mt-8 mb-16 mx-4 w-98">
                        <Typography>Gender</Typography>
                        <ul className="inlineUl">
                          <li key={"male"}>
                            <Radio
                              checked={selectedGender === 'Male'}
                              onChange={handleGenderChange}
                              value={'Male'}
                              name="gender"
                              id={'male'}
                            />
                            <label htmlFor={'male'}>
                              Male
                            </label>
                          </li>
                          <li key={"female"}>
                            <Radio
                              checked={selectedGender === 'Female'}
                              onChange={handleGenderChange}
                              value={'Female'}
                              name="gender"
                              id={'female'}
                            />
                            <label htmlFor={'female'}>
                              Female
                            </label>
                          </li>
                        </ul>
                      </div>

                      <Controller
                        name="employment_status"
                        control={control}
                        render={({ field }) => (
                          <FormControl fullWidth>
                            <InputLabel id="employment-status-simple-select-label">Employment Status</InputLabel>
                            <Select
                              {...field}
                              id="employment_status"
                              labelId="employment-status-simple-select-label"
                              label="Employment Status"
                              className="mt-8 mb-16 mx-4"
                              defaultValue=""
                            >
                              <MenuItem key={"es_0"} value={""}>Select</MenuItem>
                              <MenuItem key={"es_1"} value={"Fully Employed"}>Fully Employed</MenuItem>
                              <MenuItem key={"es_2"} value={"Part Time"}>Part Time</MenuItem>
                              <MenuItem key={"es_3"} value={"Unemployed"}>Unemployed</MenuItem>

                            </Select>
                          </FormControl>

                        )}
                      />

                    </div>

                    <div className="flex -mx-4">
                      <Controller
                        name="id_type"
                        control={control}
                        render={({ field }) => (
                          <FormControl fullWidth>
                            <InputLabel id="id-type-simple-select-label">Id Type</InputLabel>
                            <Select
                              {...field}
                              id="id_type"
                              labelId="id-type-simple-select-label"
                              label="Id Type"
                              className="mt-8 mb-16 mx-4"
                              defaultValue=""
                            >
                              <MenuItem key={"it_0"} value={""}>Select</MenuItem>
                              <MenuItem key={"it_1"} value={"Voter Id"}>Voter Id</MenuItem>
                              <MenuItem key={"it_2"} value={"Passport"}>Passport</MenuItem>
                              {/* <MenuItem key={"it_3"} value={"Escowas"}>Escowas</MenuItem> */}
                              <MenuItem key={"it_4"} value={"Ghana Card"}>Ghana Card</MenuItem>
                            </Select>
                          </FormControl>
                        )}
                      />

                      <Controller
                        name="id_number"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            className="mt-8 mb-16 mx-4"
                            error={!!errors.id_number}
                            helperText={errors?.id_number?.message}
                            label="Enter ID Number"
                            id="id_number"
                            variant="outlined"
                            fullWidth
                          />
                        )}
                      />
                    </div>
                    <div className="flex -mx-4">
                      {levels && levels.length > 0 && levels.map((level, k) =>
                        <Controller
                          name={"level_" + level.id}
                          key={k}
                          control={control}
                          render={({ field }) => (
                            <FormControl fullWidth>
                              <InputLabel id={"level-simple-select-label_" + level.id}>{level.name}</InputLabel>
                              <Select
                                {...field}
                                id={"level_" + level.id}
                                labelId={"level-simple-select-label_" + level.id}
                                label={level.name}
                                className="mt-8 mb-16 mx-4"
                                value={selectedDataIds[level.id] ? selectedDataIds[level.id] : ""}
                                onChange={(evnt) => handleLevelChange(k, evnt)}
                              >
                                <MenuItem key={"ld_" + level.id} value={""}>Select</MenuItem>
                                {levelDataList && levelDataList[level.id] && levelDataList[level.id].length > 0 && levelDataList[level.id].map((levelData, k) =>
                                  <MenuItem key={"el_" + levelData.id + ""} value={levelData.id + ""} >{levelData.name}</MenuItem>
                                )}
                              </Select>
                            </FormControl>
                          )}
                        />
                      )}
                    </div>
                    <div className="flex -mx-4">


                      {/*<Controller
                                                  name="profession_status"
                                                  control={control}
                                                  render={({ field }) => (
                                                    <FormControl fullWidth>
                                                      <InputLabel id="profession_status-simple-select-label">Profession Status?</InputLabel>
                                                      <Select
                                                        {...field}
                                                        id="profession_status"
                                                        labelId="profession_status-simple-select-label"
                                                        label="Profession Status?"
                                                        className="mt-8 mb-16 mx-4"
                                                        defaultValue=""
                                                        >
                                                          <MenuItem key={"pf_0"} value={""}>Select</MenuItem>
                                                          <MenuItem key={"pf_1"} value={"Staff"}>Staff</MenuItem>
                                                          <MenuItem key={"pf_2"} value={"Member"}>Member</MenuItem>
                                                          <MenuItem key={"pf_3"} value={"President"}>President</MenuItem>
                                                      </Select>
                                                    </FormControl>
                                                  )}
                                                />*/}
                      <Controller
                        name="policy_number"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            className="mt-8 mb-16 mx-4"
                            error={!!errors.policy_number}
                            helperText={errors?.policy_number?.message}
                            label="Enter Policy Number"
                            id="policy_number"
                            variant="outlined"
                            fullWidth
                          />
                        )}
                      />
                    </div>
                    <div className="flex -mx-4">
                      <Controller
                        name="dob"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            className="mt-8 mb-16 mx-4"
                            label="Date Of Birth"
                            type="date"
                            id="dob"
                            variant="outlined"
                            fullWidth
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                        )}
                      />

                      <Controller
                        name="date_year_of_joining"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            className="mt-8 mb-16 mx-4"
                            label="Date Year of Joining"
                            type="date"
                            id="date_year_of_joining"
                            variant="outlined"
                            fullWidth
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                        )}
                      />
                    </div>

                    {/*<div className="flex -mx-4">
                                                  <div className="mt-8 mb-16 mx-4 w-98">
                                                    <Typography>Are you Self Employed?</Typography>
                                                    <ul className="inlineUl">
                                                      <li key={"yes_s"}>
                                                        <Radio
                                                          checked={self_employed === 'Yes'}
                                                          onChange={handleSelfEmployedChange}
                                                          value={'Yes'}
                                                          name="self_employed"
                                                          id={'s_yes'}
                                                        />
                                                        <label htmlFor={'s_yes'}>
                                                          Yes
                                                        </label>
                                                       </li>
                                                       <li key={"no_s"}>
                                                        <Radio
                                                          checked={self_employed === 'No'}
                                                          onChange={handleSelfEmployedChange}
                                                          value={'No'}
                                                          name="self_employed"
                                                          id={'s_no'}
                                                        />
                                                        <label htmlFor={'s_no'}>
                                                          No
                                                        </label>
                                                       </li>
                                                    </ul>
                                                  </div>
                                                </div>
                        
                                                {self_employed == 'Yes' && <div className="flex -mx-4">
                                                    <Controller
                                                      name="business_name"
                                                      control={control}
                                                      render={({ field }) => (
                                                        <TextField
                                                          {...field}
                                                          className="mt-8 mb-16 mx-4"
                                                          error={!!errors.business_name}
                                                          helperText={errors?.business_name?.message}
                                                          label="Business Name"
                                                          id="business_name"
                                                          variant="outlined"
                                                          fullWidth
                                                        />
                                                      )}
                                                    />
                        
                                                    <Controller
                                                      name="business_location"
                                                      control={control}
                                                      render={({ field }) => (
                                                        <TextField
                                                          {...field}
                                                          className="mt-8 mb-16 mx-4"
                                                          error={!!errors.business_location}
                                                          helperText={errors?.business_location?.message}
                                                          label="Business Location"
                                                          id="business_location"
                                                          variant="outlined"
                                                          fullWidth
                                                        />
                                                      )}
                                                    />
                                                  </div>
                                                }
                        
                                                <div className="flex -mx-4">
                                                  <div className="mt-8 mb-16 mx-4 w-98">
                                                    <Typography>Do you have Position?</Typography>
                                                    <ul className="inlineUl">
                                                      <li key={"yes_p"}>
                                                        <Radio
                                                          checked={have_position === 'Yes'}
                                                          onChange={handlePositionChange}
                                                          value={'Yes'}
                                                          name="have_position"
                                                          id={'p_yes'}
                                                        />
                                                        <label htmlFor={'p_yes'}>
                                                          Yes
                                                        </label>
                                                       </li>
                                                       <li key={"no_p"}>
                                                        <Radio
                                                          checked={have_position === 'No'}
                                                          onChange={handlePositionChange}
                                                          value={'No'}
                                                          name="have_position"
                                                          id={'p_no'}
                                                        />
                                                        <label htmlFor={'p_no'}>
                                                          No
                                                        </label>
                                                       </li>
                                                    </ul>
                                                  </div>
                                                </div>*/}

                    {/*{have_position == 'Yes' && <div className="flex -mx-4">
                                                  <Controller
                                                    name="position"
                                                    control={control}
                                                    render={({ field }) => (
                                                      <FormControl fullWidth>
                                                        <InputLabel id="position-simple-select-label">Position</InputLabel>
                                                        <Select
                                                          {...field}
                                                          id="position"
                                                          labelId="position-simple-select-label"
                                                          label="Position"
                                                          className="mt-8 mb-16 mx-4"
                                                          defaultValue=""
                                                          >
                                                            <MenuItem key={"pss_0"} value={""}>Select</MenuItem>
                                                            {positions && positions.length > 0 && positions.map((position, k) => 
                                                              <MenuItem key={"pss_"+position.id+""} value={position.id+""} >{position.name}</MenuItem>
                                                            )}
                                                        </Select>
                                                      </FormControl>
                                                    )}
                                                  />
                                                  </div>
                                                }*/}

                    <div className="flex -mx-4">
                      <div className="mt-8 mb-16 mx-4 w-98">
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
                                <MenuItem key={"st_0"} value={""}>Select</MenuItem>
                                <MenuItem key={"st_1"} value={"Active"}>Active</MenuItem>
                                <MenuItem key={"st_2"} value={"Suspended"}>Suspended</MenuItem>
                                <MenuItem key={"st_3"} value={"Withdrawn"}>Withdrawn</MenuItem>
                                <MenuItem key={"st_4"} value={"Deceased"}>Deceased</MenuItem>
                              </Select>
                            </FormControl>
                          )}
                        />
                      </div>

                      <div className="mt-8 mb-16 mx-4 w-98">
                        <Typography>Please Upload a clear passport picture of yours</Typography>
                        <Controller
                          control={control}
                          render={({ field: { onChange, value } }) => (
                            <label
                              htmlFor="button-file"
                              className="pull-left productImageUpload flex items-center justify-center relative w-128 h-128 rounded-16 mx-12 mb-24 overflow-hidden cursor-pointer shadow hover:shadow-lg"
                            >

                              <input type="file" name="profile_pic" className="hidden" id="button-file" accept="image/*" onChange={profileChange} />

                              <Icon fontSize="large" color="action">
                                cloud_upload
                              </Icon>

                            </label>
                          )}
                        />
                        {selectedProfile && (
                          <div
                            className={clsx(
                              'productImageItem flex items-center justify-center relative w-128 h-128 rounded-16 mx-12 mb-24 overflow-hidden cursor-pointer outline-none shadow hover:shadow-lg')}
                          >
                            <img className="max-w-none w-auto h-full" src={URL.createObjectURL(selectedProfile)} alt="image" />
                            <IconButton
                              onClick={removeSelectedProfile}
                              className={clsx('w-40 h-40 removeBtn', props.className)}
                              size="large"
                            >
                              <Icon>delete</Icon>
                            </IconButton>

                          </div>


                        )}

                        {selectedUpdateProfile && !selectedProfile && (
                          <div
                            className={clsx(
                              'productImageItem flex items-center justify-center relative w-128 h-128 rounded-16 mx-12 mb-24 overflow-hidden cursor-pointer outline-none shadow hover:shadow-lg')}
                          >
                            <img className="max-w-none w-auto h-full" src={selectedUpdateProfile} alt="image" />
                          </div>
                        )}

                        <div className="clearfix"></div>

                      </div>
                    </div>
                    {/*<hr />
                                                <Typography className="mb-16 mt30" color="textSecondary" variant="h5">
                                                  Other Information
                                                </Typography>
                                                <div className="flex -mx-3">
                                                {dynamic_forms && dynamic_forms.length > 0 && dynamic_forms.map((form, k) => 
                                                  <>{form.input_fields.tag == 'input' &&
                                                      <Controller
                                                        key={k}
                                                        name={form.name+"@#$"+form.id}
                                                        control={control}
                                                        render={({ field }) => (
                                                          <TextField
                                                            {...field}
                                                            className="mt-8 mb-16 mx-3"
                                                            label={form.label}
                                                            placehoder={form.label}
                                                            id={form.name}
                                                            type={form.input_fields.type ? form.input_fields.type : "text"}
                                                            variant="outlined"
                                                            value={extra_field[form.id]}
                                                            onChange={(evnt)=>handleFieldChange(k, evnt)} 
                                                            fullWidth
                                                          />
                                                        )}
                                                      />
                                                    }
                                                    {form.input_fields.tag == 'textarea' &&
                                                      <Controller
                                                        key={k}
                                                        name={form.name+"@#$"+form.id}
                                                        control={control}
                                                        render={({ field }) => (
                                                          <TextField
                                                            {...field}
                                                            className="mt-8 mb-16 mx-3"
                                                            label={form.label}
                                                            placehoder={form.label}
                                                            id={form.name}
                                                            multiline
                                                            rows={3}
                                                            type={"text"}
                                                            variant="outlined"
                                                            value={extra_field[form.id]}
                                                            onChange={(evnt)=>handleFieldChange(k, evnt)} 
                                                            fullWidth
                                                          />
                                                        )}
                                                      />
                                                    }
                                                    {form.input_fields.tag == 'select' &&
                                                      <Controller
                                                        key={k}
                                                        name={form.name+"@#$"+form.id}
                                                        control={control}
                                                        render={({ field }) => (
                                                          <FormControl fullWidth>
                                                            <InputLabel id={form.name+"-simple-select-label"}>{form.label}</InputLabel>
                                                            <Select
                                                              {...field}
                                                              id={form.name}
                                                              labelId={form.name+"-simple-select-label"}
                                                              label={form.label}
                                                              className="mt-8 mb-16 mx-3"
                                                              value={extra_field[form.id] ? extra_field[form.id] : ""}
                                                              onChange={(evnt)=>handleFieldChange(k, evnt)} 
                                                              >
                                                                <MenuItem key={"0"} value={""}>Select</MenuItem>
                                                                {form.option && form.option.length > 0 && form.option.map((option,kl) => 
                                                                  <MenuItem key={"ex_"+kl+""} value={option.value} >{option.label}</MenuItem>
                                                                )}
                                                            </Select>
                                                          </FormControl>
                                                        )}
                                                      />
                                                    }
                        
                                                    {form.input_fields.tag == 'radio' &&
                                                      <div className="mt-8 mb-16 mx-4 w-98">
                                                        <Typography>{form.label}</Typography>
                                                        <ul className="inlineUl">
                                                          {form.option && form.option.length > 0 && form.option.map((option,ke) => 
                                                            <li key={ke}>
                                                              <Radio
                                                                checked={extra_field[form.id] === option.value}
                                                                onChange={(evnt)=>handleFieldChange(k, evnt)} 
                                                                value={option.value}
                                                                name={form.name+"@#$"+form.id}
                                                                id={form.name+"@#$"+option.value}
                                                              />
                                                              <label htmlFor={form.name+"@#$"+option.value}>
                                                                {option.label}
                                                              </label>
                                                             </li>
                                                          )}
                                                        </ul>
                                                      </div>
                                                    }
                        
                                                    {form.input_fields.tag == 'checkbox' &&
                                                      <div className="mt-8 mb-16 mx-4 w-98">
                                                        <Typography>{form.label}</Typography>
                                                        <ul className="inlineUl">
                                                          {form.option && form.option.length > 0 && form.option.map((option,ke) => 
                                                            <li key={ke}>
                                                              <Checkbox
                                                                checked={extra_field[form.id] === option.value}
                                                                onChange={(evnt)=>handleFieldChange(k, evnt)} 
                                                                value={option.value}
                                                                name={form.name+"@#$"+form.id}
                                                                id={form.name+"@#$"+option.value}
                                                                inputProps={{ 'aria-label': 'controlled' }}
                                                              />
                                                              <label htmlFor={form.name+"@#$"+option.value}>
                                                                {option.label}
                                                              </label>
                                                             </li>
                                                          )}
                                                        </ul>
                                                      </div>
                                                    }
                                                  </>
                                                )}
                                                </div>*/}
                  </>
                }
              </div>
              <div className="flex -mx-4">
                <Controller
                  name="prefix"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      className="mt-8 mb-16 mx-4"
                      error={!!errors.prefix}
                      helperText={errors?.prefix?.message}
                      label="Prefix - Id card"
                      id="prefix"
                      variant="outlined"
                      fullWidth
                    />
                  )}
                />
              </div>
              <div className="flex -mx-4">

                <Controller
                  name="currency"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel id="design-simple-select-label">Currency</InputLabel>
                      <Select
                        {...field}
                        id="currency"
                        labelId="design-simple-select-label"
                        label="Currency"
                        className="mt-8 mb-16 mx-4"
                        defaultValue=""
                      >
                        <MenuItem key={"0"} value={""}>Select</MenuItem>
                        <MenuItem key={"7"} value={"USD"}>USD</MenuItem>
                        <MenuItem key={"4"} value={"GH₵"}>GH₵</MenuItem>

                      </Select>
                    </FormControl>

                  )}
                />

                <Controller
                  name="sms_sender_id"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      className="mt-8 mb-16 mx-4"
                      error={!!errors.sms_sender_id}
                      helperText={errors?.sms_sender_id?.message}
                      label="Sms Sender Id"
                      id="sms_sender_id"
                      required
                      variant="outlined"
                      fullWidth
                    />
                  )}
                />
              </div>
              <div className="flex mx-4">
                <Controller
                  name="print_exp_date_on_id"
                  control={control}
                  render={({ field }) => {
                    return (<FormControlLabel control={<Switch checked={(field.value === 0) ? false : true} name="print_exp_date_on_id" />} label={`${(field.value === 0) ? 'Hide Expiry Date' : 'Show Expiry Date'}`} onChange={(event) => {
                      var vv = (event.target.checked) ? 1 : 0
                      setValue('print_exp_date_on_id', vv);
                    }} />)
                  }}
                />
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
                onClick={handleSaveProfile}
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

export default withReducer('auth', reducer)(Profile);
