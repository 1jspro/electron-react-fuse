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
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import InputLabel from '@mui/material/InputLabel';
import Autocomplete from '@mui/material/Autocomplete';
import { resetGroup, newGroup, getGroup, saveGroup, getAllGroup, getFlowGroup } from '../store/groupDataSlice';
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
    .required('You must enter group data name'),
});

function GroupData(props) {
  const dispatch = useDispatch();
  const groupData = useSelector(({ groupDataListApp }) => groupDataListApp.groupData);
  const navigate = useNavigate();

  const routeParams = useParams();
  const [tabValue, setTabValue] = useState(0);
  const [noGroupData, setNoGroupData] = useState(false);
  const [selectedImage, setSelectedImage] = useState();
  const [selectedUpdateImage, setSelectedUpdateImage] = useState();
  const [checked, setChecked] = useState(true);
  const [groups, setGroups] = useState([]);
  const [flowGroups, setFlowGroups] = useState([]);
  const [groupDataList, setGroupDataList] = useState([]);
  const [selectedDataIds, setSelectedDataIds] = useState({});


  const methods = useForm({
    mode: 'onChange',
    defaultValues: {},
    resolver: yupResolver(schema),
  });
  const { reset, watch, control, onChange, formState, setValue, getValues } = methods;
  const { isValid, dirtyFields, errors } = formState;
  const form = watch();
  const name = watch('name');
  const group_id = watch('group_id');

  /* useEffect(() => {
    dispatch(getAllGroup()).then((action) => {
      setGroups(action.payload);
    });
  }, [dispatch]); */


  useDeepCompareEffect(() => {
    function updateGroupDataState() {
      const { dataId } = routeParams;
      if (dataId === 'new') {
        dispatch(newGroup());
      } else {
        dispatch(getGroup(routeParams)).then((action) => {
          if (!action.payload) {
            setNoGroupData(true);
          } else {
            setValue('name',action.payload.name)
            setValue('encryption_id',action.payload.encryption_id)
          }
        });
      }
    }

    updateGroupDataState();
  }, [dispatch, routeParams]);

  useEffect(() => {
    if (!groupData) {
      return;
    }
    /**
     * Reset the form on group state changes
     */
    reset(groupData);
  }, [groupData, reset]);

  useEffect(() => {
    return () => {
      /**
       * Reset groups on component unload
       */
      dispatch(resetGroup());
      setNoGroupData(false);
    };
  }, [dispatch]);

  /**
   * Tab Change
   */
  function handleTabChange(event, value) {
    setTabValue(value);
  }

  function handleSaveGroupData() {
    dispatch(saveGroup(getValues())).then((action) => {
      dispatch(showMessage({ message: action.payload.message }));
      navigate('/apps/group');
    });
  }

  /**
   * Show Message if the requested groups is not exists
   */
  if (noGroupData) {
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
          to="/apps/group"
          color="inherit"
        >
          Go to Branch Data Page
        </Button>
      </motion.div>
    );
  }

  /**
   * Wait while group data is loading and form is setted
   */
  if (
    /* _.isEmpty(form) || */
    (groupData && routeParams.dataId !== groupData.encryption_id && routeParams.dataId !== 'new')
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
                    id="name"
                    variant="outlined"
                    fullWidth
                    autoFocus
                  />
                )}
              />
            <div className="clearfix"></div>
            </div>
            {}
            <motion.div
              className="mt30"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0, transition: { delay: 0.3 } }}
            >
              <Button
                className="whitespace-nowrap mx-4 pull-right"
                variant="contained"
                color="secondary"
                disabled={(!name)}
                onClick={handleSaveGroupData}
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

export default withReducer('groupDataListApp', reducer)(GroupData);
