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
import { resetLevelData, newLevelData, getLevelData, saveLevelData, getAllLevels, getAllParentLevels, getFlowLevels, getFlowLevelsData } from '../store/levelDataSlice';
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
    .required('You must enter level data name'),
  level_id: yup
    .string()
    .required('You must select the level'),
});

function LevelData(props) {
  const dispatch = useDispatch();
  const levelData = useSelector(({ levelDataListApp }) => levelDataListApp.levelData);
  const navigate = useNavigate();

  const routeParams = useParams();
  const [tabValue, setTabValue] = useState(0);
  const [noLevelData, setNoLevelData] = useState(false);
  const [selectedImage, setSelectedImage] = useState();
  const [selectedUpdateImage, setSelectedUpdateImage] = useState();
  const [checked, setChecked] = useState(true);
  const [levels, setLevels] = useState([]);
  const [flowLevels, setFlowLevels] = useState([]);
  const [levelDataList, setLevelDataList] = useState([]);
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
  const level_id = watch('level_id');

  useEffect(() => {
    dispatch(getAllLevels()).then((action) => {
      setLevels(action.payload);
    });
  }, [dispatch]);


  useDeepCompareEffect(() => {
    function updateLevelDataState() {
      const { dataId } = routeParams;

      if (dataId === 'new') {
        /**
         * Create New level data
         */
        dispatch(newLevelData());
      } else {
        /**
         * Get level data
         */
        dispatch(getLevelData(routeParams)).then((action) => {
          /**
           * If the requested level is not exist show message
           */
          if (!action.payload) {
            setNoLevelData(true);
          } else {
            if (action.payload.level_id) {
              let levelId = action.payload.level_id;
              let parentId = action.payload.parent_id;
              setValue("level_id", levelId);
              dispatch(getFlowLevels({"level_id": levelId})).then((action) => {
                const flows = action.payload.filter((f) => {
                  if (f.id != levelId) {
                    return f;
                  }
                })
                setFlowLevels(flows);
                if (parentId) {
                  let parent_id = parentId;

                  dispatch(getAllParentLevels({"parent_id": parent_id})).then((action) => {
                    let dataIds = {};
                    for (const key in action.payload.data.parents) {
                      dataIds[action.payload.data.parents[key]["level_id"]] = action.payload.data.parents[key]["id"]+"";
                      setValue("level_"+action.payload.data.parents[key]["level_id"], action.payload.data.parents[key]["id"]+"");
                    }
                    
                    const datalist = [...levelDataList];
                    for (const key in action.payload.dataList) {
                      datalist[key] = action.payload.dataList[key];
                    }
                    setLevelDataList(datalist);
                    setSelectedDataIds(dataIds);
                  });
                }
              });
            }
          }
        });
      }
    }

    updateLevelDataState();
  }, [dispatch, routeParams]);

  useEffect(() => {
    if (!levelData) {
      return;
    }
    /**
     * Reset the form on level state changes
     */
    reset(levelData);
  }, [levelData, reset]);

  useEffect(() => {
    return () => {
      /**
       * Reset levels on component unload
       */
      dispatch(resetLevelData());
      setNoLevelData(false);
    };
  }, [dispatch]);

  /**
   * Tab Change
   */
  function handleTabChange(event, value) {
    setTabValue(value);
  }

//   function handleLevelList(parents, index) {
//       dispatch(getFlowLevelsData({"level_id": parents[index].level_id, parent_id: parents[index].parent_id})).then((action) => {
//         const datalist = [...levelDataList];
//         datalist[parents[index].level_id] = action.payload;
//         setLevelDataList(datalist);
//         if (index < parents.length-1) {
//           setTimeout(() => {
//               handleLevelList(parents, (index+1));
//           }, 7000);
//         }
//       });
// }


  function handleSaveLevelData() {
    dispatch(saveLevelData(getValues())).then((action) => {
      dispatch(showMessage({ message: action.payload.message }));
      navigate('/apps/level-data');
    });
  }

  function handleLevelChange(event) {
    setValue("level_id", event.target.value);
    const levelId = levels.filter((l) => {
      if (l.id == event.target.value) {
        return l
      }
    })[0]["parent_id"];


    dispatch(getFlowLevels({"level_id": levelId})).then((action) => {
      setFlowLevels(action.payload);
      const top_level_id = action.payload[0].id;
      dispatch(getFlowLevelsData({"level_id": top_level_id})).then((action) => {
        const datalist = [...levelDataList];
        datalist[top_level_id] = action.payload;
        setLevelDataList(datalist)
      });
    });
  }

  function handleFlowLevelChange(key, event) {
    let dataIds = {...selectedDataIds};
    console.log(selectedDataIds);
    dataIds[flowLevels[key]['id']] = event.target.value+"";
    setValue("level_"+flowLevels[key]['id'], event.target.value+"");
    console.log(dataIds);
    setSelectedDataIds(dataIds);

    if (flowLevels && key < flowLevels.length) {
      let levelId = flowLevels[key+1] ? flowLevels[key+1].id : "";
      if (levelId) {


        dispatch(getFlowLevelsData({level_id: levelId, parent_id: event.target.value})).then((action) => {
          const datalist = [...levelDataList];
          datalist[levelId] = action.payload;
          setLevelDataList(datalist)
        });
      }
    }

    if (key == flowLevels.length - 1) {
      setValue('parent_id', event.target.value);
    }
  }



  /**
   * Show Message if the requested levels is not exists
   */
  if (noLevelData) {
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
          to="/apps/level-data"
          color="inherit"
        >
          Go to Branch Data Page
        </Button>
      </motion.div>
    );
  }

  /**
   * Wait while level data is loading and form is setted
   */
  if (
    _.isEmpty(form) ||
    (levelData && routeParams.dataId !== levelData.encryption_id && routeParams.dataId !== 'new')
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
                  name="level_id"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel id="level-simple-select-label">Branch*</InputLabel>
                      <Select
                        {...field}
                        id="level_id"
                        labelId="level-simple-select-label"
                        label="Branch*"
                        required
                        autoFocus
                        className="mb-16"
                        onChange={(evnt)=>handleLevelChange(evnt)} 
                        defaultValue=""
                        >
                          <MenuItem key={"0"} value={""}>Select</MenuItem>
                        {levels && levels.length > 0 && levels.map((l) => 
                          <MenuItem key={l.id+""} value={l.id+""} >{l.name} {" -> (" + l.flow + ")" }</MenuItem>
                        )}
                      </Select>
                    </FormControl>

                  )}
                />
              {flowLevels && flowLevels.length > 0 && flowLevels.map((level, k) => 
                  <Controller
                    name={"level_"+level.id}
                    key={k}
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth>
                        <InputLabel id={"level-simple-select-label_"+level.id}>{level.name}</InputLabel>
                        <Select
                          {...field}
                          id={"level_"+level.id}
                          labelId={"level-simple-select-label_"+level.id}
                          label={level.name}
                          className="mt-8 mb-16 mx-4"
                          value={selectedDataIds[level.id] ? selectedDataIds[level.id] : ""}
                          onChange={(evnt)=>handleFlowLevelChange(k, evnt)} 
                          >
                            <MenuItem key={"ld_"+level.id} value={""}>Select</MenuItem>
                            {levelDataList && levelDataList[level.id] && levelDataList[level.id].length > 0 && levelDataList[level.id].map((levelData, k) => 
                              <MenuItem key={"el_"+levelData.id+""} value={levelData.id+""} >{levelData.name}</MenuItem>
                            )}
                        </Select>
                      </FormControl>
                    )}
                  />
              )}

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
                  />
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
                disabled={(!name || !level_id)}
                onClick={handleSaveLevelData}
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

export default withReducer('levelDataListApp', reducer)(LevelData);
