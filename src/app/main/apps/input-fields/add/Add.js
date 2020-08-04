import FuseLoading from '@fuse/core/FuseLoading';
import FusePageCarded from '@fuse/core/FusePageCarded';
import { useDeepCompareEffect } from '@fuse/hooks';
import Button from '@mui/material/Button';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import withReducer from 'app/store/withReducer';
import FormControl from '@mui/material/FormControl';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import InputLabel from '@mui/material/InputLabel';
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
import { resetField, newField, getField, saveField } from '../store/fieldSlice';
import reducer from '../store';
import PageHeader from './PageHeader';
import clsx from 'clsx';
import FuseUtils from '@fuse/utils';
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
    .required('You must enter field name'),
  tag: yup
    .string()
    .required('You must select field tag'),
});

function Field(props) {
  const dispatch = useDispatch();
  const field = useSelector(({ fieldsApp }) => fieldsApp.field);
  const navigate = useNavigate();

  const routeParams = useParams();
  const [tabValue, setTabValue] = useState(0);
  const [noField, setNoField] = useState(false);
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
  const name = watch('name');


  useDeepCompareEffect(() => {
    function updateFieldState() {
      const { fieldId } = routeParams;

      if (fieldId === 'new') {
        /**
         * Create New field data
         */
        dispatch(newField());
      } else {
        /**
         * Get field data
         */
        dispatch(getField(routeParams)).then((action) => {
          /**
           * If the requested field is not exist show message
           */
          if (!action.payload) {
            setNoField(true);
          } else {

          }
        });
      }
    }

    updateFieldState();
  }, [dispatch, routeParams]);

  useEffect(() => {
    if (!field) {
      return;
    }
    /**
     * Reset the form on field state changes
     */
    reset(field);
  }, [field, reset]);

  useEffect(() => {
    return () => {
      /**
       * Reset field on component unload
       */
      dispatch(resetField());
      setNoField(false);
    };
  }, [dispatch]);

  /**
   * Tab Change
   */
  function handleTabChange(event, value) {
    setTabValue(value);
  }



  function handleSaveField() {
    dispatch(saveField(getValues())).then((action) => {
      dispatch(showMessage({ message: action.payload.message }));
      navigate('/apps/input-fields');
    });
  }



  /**
   * Show Message if the requested fields is not exists
   */
  if (noField) {
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
          to="/apps/input-fields"
          color="inherit"
        >
          Go to Field Page
        </Button>
      </motion.div>
    );
  }

  /**
   * Wait while field data is loading and form is setted
   */
  if (
    _.isEmpty(form) ||
    (field && routeParams.fieldId !== field.encryption_id && routeParams.fieldId !== 'new')
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
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    className="mt-8 mb-16"
                    error={!!errors.name}
                    required
                    helperText={errors?.name?.message}
                    label="Name"
                    autoFocus
                    id="name"
                    variant="outlined"
                    fullWidth
                  />
                )}
              />

              <Controller
                name="tag"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel id="tag-simple-select-label">Tag*</InputLabel>
                    <Select
                      {...field}
                      id="tag"
                      labelId="tag-simple-select-label"
                      required
                      label="Tag*"
                      className="mt-8 mb-16 mx-4"
                      defaultValue=""
                      >
                        <MenuItem key={"tg_0"} value={""}>Select</MenuItem>
                        <MenuItem key={"tg_1"} value={"input"}>input</MenuItem>
                        <MenuItem key={"tg_2"} value={"textarea"}>textarea</MenuItem>
                        <MenuItem key={"tg_3"} value={"select"}>select</MenuItem>
                        <MenuItem key={"tg_4"} value={"radio"}>radio</MenuItem>
                        <MenuItem key={"tg_5"} value={"checkbox"}>checkbox</MenuItem>

                    </Select>
                  </FormControl>

                )}
              />


              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel id="type-simple-select-label">Type</InputLabel>
                    <Select
                      {...field}
                      id="type"
                      labelId="type-simple-select-label"
                      required
                      label="Type"
                      className="mt-8 mb-16 mx-4"
                      defaultValue=""
                      >
                        <MenuItem key={"es_0"} value={""}>Select</MenuItem>
                        <MenuItem key={"es_1"} value={"text"}>text</MenuItem>
                        <MenuItem key={"es_2"} value={"number"}>number</MenuItem>
                        <MenuItem key={"es_3"} value={"date"}>date</MenuItem>
                        <MenuItem key={"es_4"} value={"datetime-local"}>datetime-local</MenuItem>
                        <MenuItem key={"es_5"} value={"color"}>color</MenuItem>
                        <MenuItem key={"es_6"} value={"email"}>email</MenuItem>
                        <MenuItem key={"es_7"} value={"tel"}>tel</MenuItem>
                        <MenuItem key={"es_8"} value={"password"}>password</MenuItem>
                        <MenuItem key={"es_9"} value={"url"}>url</MenuItem>

                    </Select>
                  </FormControl>

                )}
              />

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
                onClick={handleSaveField}
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

export default withReducer('fieldsApp', reducer)(Field);
