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
import { resetAsset, newAsset, getAsset, saveAsset, getCategories } from '../store/assetSlice';
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
    .required('You must enter asset name'),
  category_id: yup
    .string()
    .required('You must select the category'),
  type: yup
    .string()
    .required('You must select the type of assets'),
  brand: yup
    .string()
    .required('You must enter the brand'),
  serial_no: yup
    .string()
    .required('You must enter the serial number'),
  asset_value: yup
    .string()
    .required('You must enter the Value'),
});

function Asset(props) {
  const dispatch = useDispatch();
  const asset = useSelector(({ assetsApp }) => assetsApp.asset);
  const navigate = useNavigate();

  const routeParams = useParams();
  const [tabValue, setTabValue] = useState(0);
  const [noAsset, setNoAsset] = useState(false);
  const [selectedImage, setSelectedImage] = useState();
  const [selectedUpdateImage, setSelectedUpdateImage] = useState();
  const [checked, setChecked] = useState(true);
  const [categories, setCategories] = useState([]);

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
    dispatch(getCategories()).then((action) => {
      setCategories(action.payload);
    });
  }, [dispatch]);

  useDeepCompareEffect(() => {
    function updateAssetState() {
      const { assetId } = routeParams;

      if (assetId === 'new') {
        /**
         * Create New asset data
         */
        dispatch(newAsset());
      } else {
        /**
         * Get asset data
         */
        dispatch(getAsset(routeParams)).then((action) => {
          /**
           * If the requested asset is not exist show message
           */
          if (!action.payload) {
            setNoAsset(true);
          } else {

          }
        });
      }
    }

    updateAssetState();
  }, [dispatch, routeParams]);

  useEffect(() => {
    if (!asset) {
      return;
    }
    /**
     * Reset the form on asset state changes
     */
    reset(asset);
  }, [asset, reset]);

  useEffect(() => {
    return () => {
      /**
       * Reset asset on component unload
       */
      dispatch(resetAsset());
      setNoAsset(false);
    };
  }, [dispatch]);

  /**
   * Tab Change
   */
  function handleTabChange(event, value) {
    setTabValue(value);
  }


  function handleSaveAsset() {
    dispatch(saveAsset(getValues())).then((action) => {
      dispatch(showMessage({ message: action.payload.message }));
      navigate('/apps/asset');
    });
  }



  /**
   * Show Message if the requested assets is not exists
   */
  if (noAsset) {
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
          to="/apps/asset"
          color="inherit"
        >
          Go to Assets Page
        </Button>
      </motion.div>
    );
  }

  /**
   * Wait while asset data is loading and form is setted
   */
  if (
    _.isEmpty(form) ||
    (asset && routeParams.assetId !== asset.encryption_id && routeParams.assetId !== 'new')
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
                      className="mt-8 mb-16 px-3 w-full sm:w-1/2 lg:w-1/2"
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
                  name="category_id"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth className="mt-8 mb-16 px-3 w-full sm:w-1/2 lg:w-1/2">
                      <InputLabel id="category-simple-select-label">Category*</InputLabel>
                      <Select
                        {...field}
                        id="category_id"
                        labelId="category-simple-select-label"
                        label="Category*"
                        required
                        /* className="mt-8 mb-16 mx-4" */
                        defaultValue=""
                      >
                        <MenuItem key={"0"} value={""}>Select</MenuItem>
                        {categories && categories.length > 0 && categories.map((category) =>
                          <MenuItem key={category.id + ""} value={category.id + ""} >{category.name}</MenuItem>
                        )}
                      </Select>
                    </FormControl>

                  )}
                />

              </div>

              <div className="flex -mx-4">
                <Controller
                  name="type"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth className="mt-8 mb-16 px-3 w-full sm:w-1/2 lg:w-1/2">
                      <InputLabel id="type-simple-select-label">Type Of asset*</InputLabel>
                      <Select
                        {...field}
                        id="type"
                        labelId="type-simple-select-label"
                        label="Type Of asset*"
                        required
                        
                        defaultValue=""
                      >
                        <MenuItem key={"0"} value={""}>Select Type Of Asset</MenuItem>
                        <MenuItem key={"1"} value={"New"}>New</MenuItem>
                        <MenuItem key={"2"} value={"Old"}>Old</MenuItem>
                      </Select>
                    </FormControl>

                  )}
                />

                <Controller
                  name="brand"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      className="mt-8 mb-16 px-3 w-full sm:w-1/2 lg:w-1/2"
                      error={!!errors.brand}
                      required
                      helperText={errors?.brand?.message}
                      label="Brand"
                      autoFocus
                      id="brand"
                      variant="outlined"
                      fullWidth
                    />
                  )}
                />


              </div>

              <div className="flex -mx-4">
                <Controller
                  name="serial_no"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      className="mt-8 mb-16 px-3 w-full sm:w-1/2 lg:w-1/2"
                      error={!!errors.serial_no}
                      required
                      helperText={errors?.serial_no?.message}
                      label="Serial No"
                      autoFocus
                      id="serial_no"
                      variant="outlined"
                      fullWidth
                    />
                  )}
                />
                <Controller
                  name="asset_value"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      className="mt-8 mb-16 px-3 w-full sm:w-1/2 lg:w-1/2"
                      error={!!errors.asset_value}
                      required
                      helperText={errors?.asset_value?.message}
                      label="Asset Value"
                      autoFocus
                      id="asset_value"
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
                onClick={handleSaveAsset}
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

export default withReducer('assetsApp', reducer)(Asset);
