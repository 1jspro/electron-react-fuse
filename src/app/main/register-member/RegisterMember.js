import FuseLoading from '@fuse/core/FuseLoading';
import FusePageCarded from '@fuse/core/FusePageCarded';
import { useDeepCompareEffect } from '@fuse/hooks';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import withReducer from 'app/store/withReducer';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Icon from '@mui/material/Icon';
import Radio from '@mui/material/Radio';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams, useNavigate } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import _ from '@lodash';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { styled } from '@mui/material/styles';
import {
  resetMember,
  newMember,
  getAdmin,
  getLevels,
  getLevelsData,
  getPositions,
  getEducationLevels,
  getDynamicForms,
  getIndustries,
  getProfessions,
  saveMember,
} from 'app/auth/store/memberSlice';
import { showMessage } from 'app/store/fuse/messageSlice';
import reducer from 'app/auth/store';
import InputLabel from '@mui/material/InputLabel';
import clsx from 'clsx';
import genericDefaultFormFormat from 'app/main/utils/defaultFormFormat';
import { getAllGroup } from '../apps/group/store/GroupDataListSlice';
import PageHeader from './PageHeader';

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
  first_name: yup.string().required('The first name field is required.'),
  last_name: yup.string().required('The last name field is required.'),
  /* email: yup
    .string()
    .required('The email field is required.').email('You must enter a valid email'), */
  phone_no: yup
    .string()
    .required('The phone no field is required.')
    .min(8, 'You must enter a valid phone no.')
    .max(13, 'You must enter a valid phone no.'),
});

function Member(props) {
  const dispatch = useDispatch();
  const member = useSelector(({ auth }) => auth.member);

  const routeParams = useParams();
  const [tabValue, setTabValue] = useState(0);
  const [noMember, setNoMember] = useState(false);
  const [admin, setAdmin] = useState({});
  const [admin_id, setAdminId] = useState('');
  const [levels, setLevels] = useState([]);
  const [levelDataList, setLevelDataList] = useState([]);
  const [selectedDataIds, setSelectedDataIds] = useState({});
  const [education_levels, setEducationLevels] = useState([]);
  const [dynamic_forms, setDynamicForms] = useState([]);
  const [positions, setPositions] = useState([]);
  const [industries, setIndustries] = useState([]);
  const [professions, setProfessions] = useState([]);
  const [selectedImage, setSelectedImage] = useState();
  const [selectedUpdateImage, setSelectedUpdateImage] = useState();
  const [selectedGender, setSelectedGender] = useState('Male');
  const [self_employed, setSelfEmployed] = useState('Yes');
  const [have_position, setHavePosition] = useState('Yes');
  const [groups, setGroups] = useState([]);
  const [extra_field, setExtraFields] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadingForm, setloadingForm] = useState(false);
  const [items, setItems] = useState([]);

  const methods = useForm({
    mode: 'onChange',
    defaultValues: { gender: 'Male' },
    reValidateMode: 'onSubmit',
    shouldFocusError: true,
    resolver: yupResolver(schema),
  });
  const {
    reset,
    watch,
    control,
    onChange,
    formState,
    setValue,
    getValues,
    handleSubmit,
    defaultValues,
  } = methods;

  /* const {
    reset, watch, onChange, setValue, getValues,
    handleSubmit,
    control,
    formState: { isValid, dirtyFields, errors }
  } = useForm(); */

  const { isValid, dirtyFields, errors } = formState;
  /* console.log(dirtyFields) */
  const form = watch();

  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getPositions(routeParams)).then((action) => {
      setPositions(action.payload);
    });
    dispatch(getAllGroup(routeParams)).then((action) => {
      setGroups(action.payload);
    });
    dispatch(getDynamicForms(routeParams)).then((action) => {
      setDynamicForms(action.payload);
    });
    dispatch(getEducationLevels(routeParams)).then((action) => {
      setEducationLevels(action.payload);
    });
    dispatch(getIndustries(routeParams)).then((action) => {
      setIndustries(action.payload);
    });
    dispatch(getProfessions(routeParams)).then((action) => {
      setProfessions(action.payload);
    });
  }, [dispatch]);

  useDeepCompareEffect(() => {
    function updateMemberState() {
      const { adminId } = routeParams;
      /**
       * Create New member data
       */

      dispatch(newMember());
      setAdminId(admin_id);
      dispatch(getAdmin(routeParams)).then((action) => {
        action.payload.other_settings
          ? setItems(action.payload.other_settings)
          : setItems(genericDefaultFormFormat);
        /**
         * If the requested admin is not exist show message
         */
        setValue('gender', 'Male');
        if (!action.payload) {
          setNoMember(true);
        } else {
          setAdmin(action.payload);
          setLoading(false);
          dispatch(
            getLevels({ level_id: action.payload.level_id, adminId: routeParams.adminId })
          ).then((action) => {
            setLevels(action.payload);
            const top_level_id = action.payload[0].id;

            dispatch(getLevelsData({ level_id: top_level_id, adminId: routeParams.adminId })).then(
              (action) => {
                const datalist = [...levelDataList];
                datalist[top_level_id] = action.payload;
                setLevelDataList(datalist);
              }
            );
          });
        }
      });
    }

    updateMemberState();
  }, [dispatch, routeParams]);

  useEffect(() => {
    if (!member || (member && member.error && member.error.length > 0)) {
      if (member && member.error && member.error.length > 0) {
        setTabValue(0);
      }
      return;
    }
    /**
     * Reset the form on member state changes
     */
    reset(member);
  }, [member, reset]);

  useEffect(() => {
    return () => {
      /**
       * Reset member on component unload
       */
      dispatch(resetMember());
      setNoMember(false);
    };
  }, [dispatch]);

  useEffect(() => {
    levels &&
      levels.length > 0 &&
      levels.map((level, k) => {
        if (levelDataList && levelDataList[level.id] && levelDataList[level.id].length === 1) {
          handleLevelChange(k, `${levelDataList[level.id][0].id}`);
        }
      });
  }, [levels, dispatch]);

  /**
   * Tab Change
   */
  function handleTabChange(event, value) {
    setTabValue(value);
  }

  function handleGenderChange(event, value) {
    setSelectedGender(event.target.value);
    setValue('gender', event.target.value);
  }

  function handleSelfEmployedChange(event, value) {
    setSelfEmployed(event.target.value);
    setValue('self_employed', event.target.value);
  }

  function handlePositionChange(event, value) {
    setHavePosition(event.target.value);
    setValue('have_position', event.target.value);
    setValue('position', '');
  }

  function handleSaveMember(event) {
    event.preventDefault();
    setValue('adminId', routeParams.adminId);
    setloadingForm(true);
    dispatch(saveMember(getValues())).then((action) => {
      if (action.payload && action.payload.errors) {
        dispatch(showMessage({ message: action.payload.message }));
      } else if (action.payload && action.payload.error && action.payload.error[0]) {
        dispatch(showMessage({ message: action.payload.error[0].message }));
      } else {
        dispatch(showMessage({ message: action.payload.message }));
        // navigate('/apps/members');
        window.location.reload();
      }
      setloadingForm(false);
    });
  }

  function handleLevelChange(key, value) {
    const dataIds = { ...selectedDataIds };
    dataIds[levels[key].id] = `${value}`;
    setValue(`level_${levels[key].id}`, `${value}`);
    setSelectedDataIds(dataIds);

    if (levels && key < levels.length) {
      const level_id = levels[key + 1] ? levels[key + 1].id : '';
      if (level_id) {
        dispatch(getLevelsData({ level_id, parent_id: value, adminId: routeParams.adminId })).then(
          (action) => {
            const datalist = [...levelDataList];
            datalist[level_id] = action.payload;
            setLevelDataList(datalist);
          }
        );
      }
    }
    if (key == levels.length - 1) {
      setValue('level_id', levels[key].id);
      setValue('level_data_id', value);
    }
  }

  // This function will be triggered when the file field change
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
      const { files } = event.target;
      const reader = new FileReader();
      reader.readAsDataURL(files[0]);

      reader.onload = (e) => {
        setValue('profile_pic', e.target.result);
        setValue('profile_pic_uploaded', true);
        /* this.setState({
            selectedFile: e.target.result,
          }) */
      };
    }
  };

  // This function will be triggered when the "Remove This Image" button is clicked
  const removeSelectedImage = () => {
    setSelectedImage();
    setValue('profile_pic_uploaded', false);
  };

  const handleFieldChange = (index, evnt, type = '') => {
    const { name, value, checked } = evnt.target;
    const dataId = name.split('@#$')[1];
    const extraField = { ...extra_field };
    if (type === 'multiple') {
      if (extraField[dataId] === undefined) {
        extraField[dataId] = [];
      }
      if (checked) {
        extraField[dataId].push(value);
      } else {
        const index__ = extraField[dataId].indexOf(value);
        if (index__ !== -1) {
          extraField[dataId].splice(index__, 1);
        }
      }
    } else {
      extraField[dataId] = value;
    }
    setExtraFields(extraField);
    setValue('extra_field', extraField);
    console.log(extraField, 'extraField');
  };

  /**
   * Show Message if the requested members is not exists
   */
  if (noMember) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.1 } }}
        className="flex flex-col flex-1 items-center justify-center h-full"
      >
        <Typography color="textSecondary" variant="h5">
          There is no such organization!
        </Typography>
        <Button
          className="mt-24"
          component={Link}
          variant="outlined"
          to="/apps/dashboard"
          color="inherit"
        >
          Go to Home Page
        </Button>
      </motion.div>
    );
  }

  /**
   * Wait while member data is loading and form is setted
   */
  const isNotFormReady = _.isEmpty(form) || !items.length;

  const firstName = (
    <Grid item xs={12} md={6}>
      <Controller
        name="first_name"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            className="mt-8 mb-16"
            error={!!errors.first_name}
            helperText={errors?.first_name?.message}
            label="First Name"
            id="first_name"
            autoFocus
            required
            variant="outlined"
            fullWidth
          />
        )}
      />
    </Grid>
  );

  const lastName = (
    <Grid item xs={12} md={6}>
      <Controller
        name="last_name"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            className="mt-8 mb-16"
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
    </Grid>
  );

  const email = (
    <Grid item xs={12} md={6}>
      <Controller
        name="email"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            className="mt-8 mb-16"
            error={!!errors.email}
            helperText={errors?.email?.message}
            label="Email"
            id="email"
            disabled={!!(routeParams.memberId !== 'new' && member.email)}
            readOnly={!!(routeParams.memberId !== 'new' && member.email)}
            variant="outlined"
            fullWidth
          />
        )}
      />
    </Grid>
  );

  const phoneNumber = (
    <Grid item xs={12} md={6}>
      <Controller
        name="phone_no"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            className="mt-8 mb-16"
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
    </Grid>
  );

  const education = (
    <Grid item xs={12} md={6}>
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
              className="mt-8 mb-16"
              defaultValue=""
            >
              <MenuItem key="el_0" value="">
                Select
              </MenuItem>

              {education_levels &&
                education_levels.length > 0 &&
                education_levels.map((level) => (
                  <MenuItem key={`el_${level.id}`} value={`${level.id}`}>
                    {level.name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        )}
      />
    </Grid>
  );

  const industry = (
    <Grid item xs={12} md={6}>
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
              className="mt-8 mb-16"
              defaultValue=""
            >
              <MenuItem key="in_0" value="">
                Select
              </MenuItem>

              {industries &&
                industries.length > 0 &&
                industries.map((industry) => (
                  <MenuItem key={`in_${industry.id}`} value={`${industry.id}`}>
                    {industry.name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        )}
      />
    </Grid>
  );

  const profession = (
    <Grid item xs={12} md={6}>
      <Controller
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
              className="mt-8 mb-16"
              defaultValue=""
            >
              <MenuItem key="pr_0" value="">
                Select
              </MenuItem>

              {professions &&
                professions.length > 0 &&
                professions.map((profession) => (
                  <MenuItem key={`pr_${profession.id}`} value={`${profession.id}`}>
                    {profession.name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        )}
      />
    </Grid>
  );

  const employmentStatus = (
    <Grid item xs={12} md={6}>
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
              className="mt-8 mb-16"
              defaultValue=""
            >
              <MenuItem key="es_0" value="">
                Select
              </MenuItem>
              <MenuItem key="es_1" value="Fully Employed">
                Fully Employed
              </MenuItem>
              <MenuItem key="es_2" value="Part Time">
                Part Time
              </MenuItem>
              <MenuItem key="es_3" value="Unemployed">
                Unemployed
              </MenuItem>
            </Select>
          </FormControl>
        )}
      />
    </Grid>
  );

  const idType = (
    <Grid item xs={12} md={6}>
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
              className="mt-8 mb-16"
              defaultValue=""
            >
              <MenuItem key="it_0" value="">
                Select
              </MenuItem>
              <MenuItem key="it_1" value="Voter Id">
                Voter Id
              </MenuItem>
              <MenuItem key="it_2" value="Passport">
                Passport
              </MenuItem>
              {/* <MenuItem key={'it_3'} value={'Escowas'}>Escowas</MenuItem> */}
              <MenuItem key="it_4" value="Ghana Card">
                Ghana Card
              </MenuItem>
            </Select>
          </FormControl>
        )}
      />
    </Grid>
  );

  const idNumber = (
    <Grid item xs={12} md={6}>
      <Controller
        name="id_number"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            className="mt-8 mb-16"
            error={!!errors.id_number}
            helperText={errors?.id_number?.message}
            label="Enter ID Number"
            id="id_number"
            variant="outlined"
            fullWidth
          />
        )}
      />
    </Grid>
  );

  const _levels = (
    <Grid item xs={12}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
        {levels &&
          levels.length > 0 &&
          levels.map((level, k) => (
            <Controller
              name={`level_${level.id}`}
              key={k}
              control={control}
              render={({ field }) => {
                return (
                  <FormControl fullWidth>
                    <InputLabel id={`level-simple-select-label_${level.id}`}>
                      {level.name}
                    </InputLabel>
                    <Select
                      {...field}
                      id={`level_${level.id}`}
                      labelId={`level-simple-select-label_${level.id}`}
                      label={level.name}
                      className="mt-8 mb-16"
                      /* value={selectedDataIds[level.id] ? selectedDataIds[level.id] : ((levelDataList && levelDataList[level.id] && levelDataList[level.id].length === 1) ? levelDataList[level.id][0].id + '' : '')} */
                      value={selectedDataIds[level.id] || ''}
                      onChange={(evnt) => handleLevelChange(k, evnt.target.value)}
                    >
                      <MenuItem key={`ld_${level.id}`} value="">
                        Select
                      </MenuItem>
                      {levelDataList &&
                        levelDataList[level.id] &&
                        levelDataList[level.id].length > 0 &&
                        levelDataList[level.id].map((levelData, k) => (
                          <MenuItem key={`el_${levelData.id}`} value={`${levelData.id}`}>
                            {levelData.name}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                );
              }}
            />
          ))}
      </Stack>
    </Grid>
  );

  const gender = (
    <Grid item xs={12} md={6}>
      <div className="mt-8 mb-16 mx-4 w-98">
        <Typography>Gender</Typography>
        <ul className="inlineUl">
          <li key="male">
            <Radio
              checked={selectedGender === 'Male'}
              onChange={handleGenderChange}
              value="Male"
              name="gender"
              id="male"
            />
            <label htmlFor="male">Male</label>
          </li>
          <li key="female">
            <Radio
              checked={selectedGender === 'Female'}
              onChange={handleGenderChange}
              value="Female"
              name="gender"
              id="female"
            />
            <label htmlFor="female">Female</label>
          </li>
        </ul>
      </div>
    </Grid>
  );

  const policyNumber = (
    <Grid item xs={12} md={6}>
      <Controller
        name="policy_number"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            className="mt-8 mb-16"
            error={!!errors.policy_number}
            helperText={errors?.policy_number?.message}
            label="Enter Policy Number"
            id="policy_number"
            variant="outlined"
            fullWidth
          />
        )}
      />
    </Grid>
  );

  const dob = (
    <Grid item xs={12} md={6}>
      <Controller
        name="dob"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            className="mt-8 mb-16"
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
    </Grid>
  );

  const dateOfJoining = (
    <Grid item xs={12} md={6}>
      <Controller
        name="date_year_of_joining"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            className="mt-8 mb-16"
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
    </Grid>
  );

  const selfEmployed = (
    <Grid item xs={12}>
      <div className="flex -mx-4">
        <div className="mt-8 mb-16 mx-4 w-98">
          <Typography>Are you Self Employed?</Typography>
          <ul className="inlineUl">
            <li key="yes_s">
              <Radio
                checked={self_employed === 'Yes'}
                onChange={handleSelfEmployedChange}
                value="Yes"
                name="self_employed"
                id="s_yes"
              />
              <label htmlFor="s_yes">Yes</label>
            </li>
            <li key="no_s">
              <Radio
                checked={self_employed === 'No'}
                onChange={handleSelfEmployedChange}
                value="No"
                name="self_employed"
                id="s_no"
              />
              <label htmlFor="s_no">No</label>
            </li>
          </ul>
        </div>
      </div>

      {self_employed == 'Yes' && (
        <div className="flex -mx-4">
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
      )}
    </Grid>
  );

  const _position = (
    <Grid item xs={12}>
      <div className="flex -mx-4">
        <div className="mt-8 mb-16 mx-4 w-98">
          <Typography>Do you have Position?</Typography>
          <ul className="inlineUl">
            <li key="yes_p">
              <Radio
                checked={have_position === 'Yes'}
                onChange={handlePositionChange}
                value="Yes"
                name="have_position"
                id="p_yes"
              />
              <label htmlFor="p_yes">Yes</label>
            </li>
            <li key="no_p">
              <Radio
                checked={have_position === 'No'}
                onChange={handlePositionChange}
                value="No"
                name="have_position"
                id="p_no"
              />
              <label htmlFor="p_no">No</label>
            </li>
          </ul>
        </div>
      </div>

      {have_position == 'Yes' && (
        <div className="flex -mx-4">
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
                  className="mt-8 mb-16"
                  defaultValue=""
                >
                  <MenuItem key="pss_0" value="">
                    Select
                  </MenuItem>
                  {positions &&
                    positions.length > 0 &&
                    positions.map((position, k) => (
                      <MenuItem key={`pss_${position.id}`} value={`${position.id}`}>
                        {position.name}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            )}
          />
        </div>
      )}
    </Grid>
  );

  const status = (
    <Grid item xs={12} md={6}>
      <div className="mt-8 mb-16">
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
                className="mt-8 mb-16"
                defaultValue=""
              >
                <MenuItem key="st_0" value="">
                  Select
                </MenuItem>
                <MenuItem key="st_1" value="Active">
                  Active
                </MenuItem>
                <MenuItem key="st_2" value="Suspended">
                  Suspended
                </MenuItem>
                <MenuItem key="st_3" value="Withdrawn">
                  Withdrawn
                </MenuItem>
                <MenuItem key="st_4" value="Deceased">
                  Deceased
                </MenuItem>
              </Select>
            </FormControl>
          )}
        />
      </div>
    </Grid>
  );

  const passportPicture = (
    <Grid item xs={12} md={6}>
      <div className="mt-8 mb-16 mx-4 w-98">
        <Typography>Please Upload a clear passport picture of yours</Typography>
        <Controller
          control={control}
          render={({ field: { onChange, value } }) => (
            <label
              htmlFor="button-file"
              className="pull-left productImageUpload flex items-center justify-center relative w-128 h-128 rounded-16 mx-12 mb-24 overflow-hidden cursor-pointer shadow hover:shadow-lg"
            >
              <input
                type="file"
                name="profile_pic"
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
    </Grid>
  );

  const _groups = (
    <Grid item xs={12}>
      <Controller
        name="group"
        control={control}
        render={({ field }) => (
          <FormControl fullWidth>
            <InputLabel id="group-simple-select-label">Group</InputLabel>
            <Select
              {...field}
              id="group"
              labelId="group-simple-select-label"
              label="Group"
              className="mt-8 mb-16"
              defaultValue={getValues('groups') || ''}
            >
              <MenuItem key="pss_0" value="">
                Select
              </MenuItem>
              {groups &&
                groups.length > 0 &&
                groups.map((group, k) => (
                  <MenuItem key={`pss_${group.id}`} value={`${group.id}`}>
                    {group.name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        )}
      />
    </Grid>
  );

  const formItems = [
    { name: 'first_name', component: firstName },
    { name: 'last_name', component: lastName },
    { name: 'email', component: email },
    { name: 'phone_number', component: phoneNumber },
    { name: 'education', component: education },
    { name: 'industry', component: industry },
    { name: 'profession', component: profession },
    { name: 'employment_status', component: employmentStatus },
    { name: 'id_type', component: idType },
    { name: 'id_number', component: idNumber },
    { name: 'levels', component: _levels },
    { name: 'gender', component: gender },
    { name: 'policy_number', component: policyNumber },
    { name: 'dob', component: dob },
    { name: 'date_of_joining', component: dateOfJoining },
    { name: 'self_employed', component: selfEmployed },
    { name: 'position', component: _position },
    { name: 'groups', component: _groups },
    { name: 'status', component: status },
    { name: 'passport_picture', component: passportPicture },
  ];

  const sortedFormItems = items
    .sort((a, b) => a.position - b.position)
    .map((item) => {
      const correspondingFormItem = formItems.find((formItem) => formItem.name === item.name);
      return { ...correspondingFormItem, ...item };
    });

  return (
    <>
      {/* <FormProvider {...methods}> */}
      <Root
        header={<PageHeader admin={admin} loading={loading} />}
        content={
          <>
            {!isNotFormReady ? (
              <form onSubmit={(e) => handleSaveMember(e)} className="p-16 sm:p-24 greyBg">
                <div className={tabValue !== 0 ? 'hidden' : ''}>
                  <Grid container columnSpacing={1}>
                    {sortedFormItems.map((item, index) => {
                      return item.checked ? (
                        <React.Fragment key={index}>{item.component}</React.Fragment>
                      ) : null;
                    })}
                  </Grid>
                </div>
                <hr />
                <Typography className="mb-16 mt30" color="textSecondary" variant="h5">
                  Customized Section
                </Typography>
                <div className="flex flex-wrap -mx-3">
                  {dynamic_forms &&
                    dynamic_forms.length > 0 &&
                    dynamic_forms.map((form, k) => (
                      <React.Fragment key={k}>
                        {form.input_fields.tag == 'input' && (
                          <Controller
                            key={k}
                            name={`${form.name}@#$${form.id}`}
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                className="mt-8 mb-16 px-3 w-full sm:w-1/2 lg:w-1/2"
                                label={form.label}
                                placehoder={form.label}
                                id={form.name}
                                type={form.input_fields.type ? form.input_fields.type : 'text'}
                                variant="outlined"
                                value={extra_field[form.id]}
                                onChange={(evnt) => handleFieldChange(k, evnt)}
                                fullWidth
                              />
                            )}
                          />
                        )}
                        {form.input_fields.tag == 'textarea' && (
                          <Controller
                            key={k}
                            name={`${form.name}@#$${form.id}`}
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                className="mt-8 mb-16 px-3 w-full sm:w-1/2 lg:w-1/2"
                                label={form.label}
                                placehoder={form.label}
                                id={form.name}
                                multiline
                                rows={3}
                                type="text"
                                variant="outlined"
                                value={extra_field[form.id]}
                                onChange={(evnt) => handleFieldChange(k, evnt)}
                                fullWidth
                              />
                            )}
                          />
                        )}
                        {form.input_fields.tag == 'select' && (
                          <Controller
                            key={k}
                            name={`${form.name}@#$${form.id}`}
                            control={control}
                            render={({ field }) => (
                              <FormControl
                                fullWidth
                                className="mt-8 mb-16 px-3 w-full sm:w-1/2 lg:w-1/2 "
                              >
                                <InputLabel id={`${form.name}-simple-select-label`}>
                                  {form.label}
                                </InputLabel>
                                <Select
                                  {...field}
                                  id={form.name}
                                  labelId={`${form.name}-simple-select-label`}
                                  label={form.label}
                                  className=""
                                  value={extra_field[form.id] ? extra_field[form.id] : ''}
                                  onChange={(evnt) => handleFieldChange(k, evnt)}
                                >
                                  <MenuItem key="0" value="">
                                    Select
                                  </MenuItem>
                                  {form.option &&
                                    form.option.length > 0 &&
                                    form.option.map((option, kl) => (
                                      <MenuItem key={`ex_${kl}`} value={option.value}>
                                        {option.label}
                                      </MenuItem>
                                    ))}
                                </Select>
                              </FormControl>
                            )}
                          />
                        )}

                        {form.input_fields.tag == 'radio' && (
                          <div className="mt-8 mb-16 px-4 w-full sm:w-1/2 lg:w-1/2">
                            <Typography>{form.label}</Typography>
                            <ul className="inlineUl">
                              {form.option &&
                                form.option.length > 0 &&
                                form.option.map((option, ke) => (
                                  <li key={ke}>
                                    <Radio
                                      checked={extra_field[form.id] === option.value}
                                      onChange={(evnt) => handleFieldChange(k, evnt)}
                                      value={option.value}
                                      name={`${form.name}@#$${form.id}`}
                                      id={`${form.name}@#$${option.value}`}
                                    />
                                    <label htmlFor={`${form.name}@#$${option.value}`}>
                                      {option.label}
                                    </label>
                                  </li>
                                ))}
                            </ul>
                          </div>
                        )}

                        {form.input_fields.tag == 'checkbox' && (
                          <div className="mt-8 mb-16 px-4 w-full sm:w-1/2 lg:w-1/2">
                            <Typography>{form.label}</Typography>
                            <ul className="inlineUl">
                              {form.option &&
                                form.option.length > 0 &&
                                form.option.map((option, ke) => (
                                  <li key={ke}>
                                    <Checkbox
                                      checked={
                                        extra_field[form.id] !== undefined &&
                                        extra_field[form.id].indexOf(option.value) >
                                          -1 /* extra_field[form.id] === option.value */
                                      }
                                      onChange={(evnt) => handleFieldChange(k, evnt, 'multiple')}
                                      value={option.value}
                                      name={`${form.name}@#$${form.id}`}
                                      id={`${form.name}@#$${option.value}`}
                                      inputProps={{ 'aria-label': 'controlled' }}
                                    />
                                    <label htmlFor={`${form.name}@#$${option.value}`}>
                                      {option.label}
                                    </label>
                                  </li>
                                ))}
                            </ul>
                          </div>
                        )}
                      </React.Fragment>
                    ))}
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
                    disabled={loadingForm}
                    type="submit"
                    style={{ opacity: loadingForm ? '0.27' : '1' }}
                    /* onClick={(e) => handleSaveMember(e)} */
                  >
                    {loadingForm ? 'Loading' : 'Save'}
                  </Button>

                  <div className="clearfix" />
                </motion.div>
              </form>
            ) : (
              <div className="h-full flex">
                <FuseLoading />
              </div>
            )}
          </>
        }
        innerScroll
      />
      {/* </FormProvider> */}
    </>
  );
}

export default withReducer('auth', reducer)(Member);
