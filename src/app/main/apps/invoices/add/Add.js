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
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams, useNavigate } from 'react-router-dom';
import _ from '@lodash';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { styled } from '@mui/material/styles';
import InputLabel from '@mui/material/InputLabel';
import { showMessage } from 'app/store/fuse/messageSlice';
import {
  resetInvoice,
  newInvoice,
  getInvoice,
  getLevels,
  getLevelsData,
  getAllParentLevels,
  getMembers,
  saveInvoice,
  getMembersPosition,
  getGroup,
  getMembersGroup,
  getMembersL,
} from '../store/invoiceSlice';
import reducer from '../store';
import PageHeader from './PageHeader';
import { getPositions } from '../../positions/store/positionsSlice';

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
  name: yup.string().required('The title field is required.'),
});

function Invoice(props) {
  const dispatch = useDispatch();
  const invoice = useSelector(({ invoicesApp }) => invoicesApp.invoice);

  const routeParams = useParams();
  const [tabValue, setTabValue] = useState(0);
  const [noInvoice, setNoInvoice] = useState(false);
  const [invoice_id, setInvoiceId] = useState('');
  const [levels, setLevels] = useState([]);
  const [Position, setPosition] = useState([]);
  const [Group, setGroup] = useState([]);
  const [levelDataList, setLevelDataList] = useState([]);
  const [selectedDataIds, setSelectedDataIds] = useState({});
  const [members, setMembers] = useState([]);
  const [selected_all_members, setSelectAllMembers] = useState(false);
  const [selected_members, setSelectedMembers] = useState([]);
  const [items, setItems] = useState([{ item: '', description: '', quantity: '', cost: 0 }]);

  const methods = useForm({
    mode: 'onChange',
    defaultValues: {
      invoice_type: 'general',
    },
    resolver: yupResolver(schema),
  });
  const { reset, watch, control, onChange, formState, setValue, getValues } = methods;
  const { isValid, dirtyFields, errors } = formState;
  const form = watch();

  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getLevels()).then((action) => {
      setLevels(action.payload);
      const top_level_id = action.payload[0].id;

      dispatch(getLevelsData({ level_id: top_level_id })).then((action) => {
        const datalist = [...levelDataList];
        datalist[top_level_id] = action.payload;
        setLevelDataList(datalist);
      });
    });
    dispatch(getMembers()).then((action) => {
      setMembers(action.payload);
    });
    dispatch(getPositions()).then((action) => setPosition(action.payload));
    dispatch(getGroup()).then((action) => setGroup(action.payload));
  }, [dispatch]);

  useDeepCompareEffect(() => {
    function updateInvoiceState() {
      const { invoiceId } = routeParams;

      if (invoiceId === 'new') {
        /**
         * Create New invoice data
         */
        dispatch(newInvoice());
      } else {
        /**
         * Get invoice data
         */
        setInvoiceId(invoice_id);
        dispatch(getInvoice(routeParams)).then((action) => {
          /**
           * If the requested invoice is not exist show message
           */
          if (!action.payload) {
            setNoInvoice(true);
          }

          if (action.payload.members) {
            setSelectedMembers(action.payload.members);
          }

          if (/* action.payload.items */ action.payload.items.length > 0) {
            setItems(action.payload.items);
          }

          if (action.payload.level_data_id) {
            const parent_id = action.payload.level_data_id;
            dispatch(getMembersL({ level_data_id: action.payload.level_data_id })).then(
              (action) => {
                setMembers(action.payload);
                dispatch(getAllParentLevels({ parent_id })).then((action) => {
                  const dataIds = {};
                  for (const key in action.payload.data.parents) {
                    dataIds[
                      action.payload.data.parents[key].level_id
                    ] = `${action.payload.data.parents[key].id}`;
                    setValue(
                      `level_${action.payload.data.parents[key].level_id}`,
                      `${action.payload.data.parents[key].id}`
                    );
                  }

                  const datalist = [...levelDataList];
                  for (const key in action.payload.dataList) {
                    datalist[key] = action.payload.dataList[key];
                  }
                  setLevelDataList(datalist);
                  setSelectedDataIds(dataIds);
                });
              }
            );
          }
        });
      }
    }

    updateInvoiceState();
  }, [dispatch, routeParams]);

  useEffect(() => {
    if (!invoice || (invoice && invoice.error && invoice.error.length > 0)) {
      if (invoice && invoice.error && invoice.error.length > 0) {
        setTabValue(0);
      }
      return;
    }
    /**
     * Reset the form on invoice state changes
     */
    reset(invoice);
  }, [invoice, reset]);

  useEffect(() => {
    return () => {
      /**
       * Reset invoice on component unload
       */
      dispatch(resetInvoice());
      setNoInvoice(false);
    };
  }, [dispatch]);

  /**
   * Tab Change
   */
  function handleTabChange(event, value) {
    setTabValue(value);
  }

  function handleSaveInvoice(event) {
    event.preventDefault();

    dispatch(saveInvoice(getValues())).then((action) => {
      if (action.payload && action.payload.error && action.payload.error[0]) {
        dispatch(showMessage({ message: action.payload.error[0].message }));
      } else {
        dispatch(showMessage({ message: action.payload.message }));
        navigate('/apps/invoices');
      }
    });
  }

  function handleLevelChange(key, event) {
    const dataIds = { ...selectedDataIds };
    dataIds[levels[key].id] = `${event.target.value}`;
    setValue(`level_${levels[key].id}`, `${event.target.value}`);
    setSelectedDataIds(dataIds);

    dispatch(getMembersL({ level_data_id: event.target.value })).then((action) => {
      setMembers(action.payload);
      if (levels && key < levels.length) {
        const level_id = levels[key + 1] ? levels[key + 1].id : '';
        if (level_id) {
          dispatch(getLevelsData({ level_id, parent_id: event.target.value })).then((action) => {
            const datalist = [...levelDataList];
            datalist[level_id] = action.payload;
            setLevelDataList(datalist);
          });
        }
      }
    });

    if (key == levels.length - 1) {
      setValue('level_id', levels[key].id);
      setValue('level_data_id', event.target.value);
    }

    /* const { value } = event.target;
    const list = [...levels];
    list[key]["selected_data"] = value;
    setLevels(list); */
  }

  const handlePositionChange = (value) => {
    dispatch(getMembersPosition({ positionId: value })).then((action) => {
      setMembers(action.payload);
    });
  };
  const handleGroupChange = (value) => {
    dispatch(getMembersGroup({ GroupId: value })).then((action) => {
      setMembers(action.payload);
    });
  };

  const handleMemberChange = (event) => {
    let {
      target: { value },
    } = event;
    if (value.indexOf('all_members') != -1 && selected_members.length != members.length) {
      setSelectAllMembers(true);
      value = members.map((d) => {
        return `${d.id}`;
      });
      setSelectedMembers(
        // On autofill we get a stringified value.
        typeof value === 'string' ? value.split(',') : value
      );
      setValue('members[]', value);
    } else {
      setSelectAllMembers(false);
      const selectAllIndex = value.indexOf('all_members');
      if (selectAllIndex > -1) {
        value.splice(selectAllIndex, 1);
      }
      setSelectedMembers(
        // On autofill we get a stringified value.
        typeof value === 'string' ? value.split(',') : value
      );
      setValue('members[]', value);
    }
  };

  const addMoreItem = () => {
    setItems([...items, { item: '', description: '', quantity: '', cost: 0 }]);
  };

  const removeItem = (index) => {
    const rows = [...items];
    rows.splice(index, 1);
    setItems(rows);
  };

  const handleItemChange = (index, evnt) => {
    const { name, value } = evnt.target;
    const list = [...items];
    list[index][name] = getValues('invoice_type') === 'general' && name === 'cost' ? 0 : value;
    setItems(list);
    setValue(`items[${index}][${name}]`, value);
  };

  const handleType = (value) => {
    setValue('invoice_type', value);
    if (value === 'general') {
      const list = [...items];
      list.map((e, i) => {
        list[i].cost = 0;
      });
      setItems(list);
    }
  };

  /**
   * Show Message if the requested invoices is not exists
   */
  if (noInvoice) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.1 } }}
        className="flex flex-col flex-1 items-center justify-center h-full"
      >
        <Typography color="textSecondary" variant="h5">
          There is no such invoice!
        </Typography>
        <Button
          className="mt-24"
          component={Link}
          variant="outlined"
          to="/apps/invoices"
          color="inherit"
        >
          Go to invoices Page
        </Button>
      </motion.div>
    );
  }

  /**
   * Wait while invoice data is loading and form is setted
   */
  if (
    _.isEmpty(form) ||
    (invoice && routeParams.invoiceId !== invoice.encryption_id && routeParams.invoiceId !== 'new')
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
                <div className="flex flex-wrap -mx-3">
                  <Controller
                    name="invoice_type"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth className="mt-8 mb-16 px-3 w-full sm:w-1/2 lg:w-1/2 ">
                        <InputLabel id="invoice_type">Type</InputLabel>
                        <Select
                          {...field}
                          id={form.name}
                          labelId="invoice_type"
                          label="Type"
                          className=" "
                          value={getValues('invoice_type')}
                          onChange={(e) => handleType(e.target.value)}
                        >
                          <MenuItem key="general" value="general">
                            General
                          </MenuItem>
                          <MenuItem key="custom" value="custom">
                            Custom
                          </MenuItem>
                        </Select>
                      </FormControl>
                    )}
                  />
                  <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        className="mt-8 mb-16 px-3 w-full sm:w-1/2 lg:w-1/2"
                        error={!!errors.name}
                        helperText={errors?.name?.message}
                        label="Title"
                        id="name"
                        autoFocus
                        required
                        variant="outlined"
                        fullWidth
                      />
                    )}
                  />
                </div>

                <div className="flex -mx-4">
                  <Controller
                    name="filterBy"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth className="mt-8 mb-16 px-3 w-full sm:w-1/2 lg:w-1/2">
                        <InputLabel id="filterBy">Filter by</InputLabel>
                        <Select
                          {...field}
                          id="filterBy"
                          labelId="filterBy"
                          label="Filter by"
                          className=""
                        >
                          <MenuItem key="ld_" value="">
                            Select
                          </MenuItem>
                          <MenuItem key="level" value="level">
                            Level
                          </MenuItem>
                          <MenuItem key="position" value="position">
                            Position
                          </MenuItem>
                          <MenuItem key="group" value="group">
                            Group
                          </MenuItem>
                        </Select>
                      </FormControl>
                    )}
                  />
                </div>

                {getValues('filterBy') === 'level' ? (
                  <div className="flex -mx-4">
                    {levels &&
                      levels.length > 0 &&
                      levels.map((level, k) => (
                        <Controller
                          name={`level_${level.id}`}
                          key={k}
                          control={control}
                          render={({ field }) => (
                            <FormControl fullWidth>
                              <InputLabel id={`level-simple-select-label_${level.id}`}>
                                {level.name}
                              </InputLabel>
                              <Select
                                {...field}
                                id={`level_${level.id}`}
                                labelId={`level-simple-select-label_${level.id}`}
                                label={level.name}
                                className="mt-8 mb-16 mx-4"
                                value={selectedDataIds[level.id] ? selectedDataIds[level.id] : ''}
                                onChange={(evnt) => handleLevelChange(k, evnt)}
                              >
                                <MenuItem key={`ld_${level.id}`} value="">
                                  Select {level.selected_data}
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
                          )}
                        />
                      ))}
                  </div>
                ) : (
                  ''
                )}

                {getValues('filterBy') === 'position' || getValues('filterBy') === 'group' ? (
                  <>
                    <div className="flex -mx-4">
                      {getValues('filterBy') === 'position' ? (
                        <Controller
                          name="position"
                          control={control}
                          render={({ field }) => (
                            <FormControl
                              fullWidth
                              className="mt-8 mb-16 px-3 w-full sm:w-1/2 lg:w-1/2"
                            >
                              <InputLabel id="position">Position</InputLabel>
                              <Select
                                {...field}
                                id="position"
                                labelId="position"
                                label="Position"
                                className=""
                                onChange={(evnt) => handlePositionChange(evnt.target.value)}
                              >
                                <MenuItem key="ld_" value="">
                                  Select
                                </MenuItem>
                                {Position &&
                                  Position.length > 0 &&
                                  Position.map((PostionData, k) => (
                                    <MenuItem
                                      key={`el_${PostionData.id}`}
                                      value={`${PostionData.id}`}
                                    >
                                      {PostionData.name}
                                    </MenuItem>
                                  ))}
                              </Select>
                            </FormControl>
                          )}
                        />
                      ) : (
                        ''
                      )}
                      {getValues('filterBy') === 'group' ? (
                        <Controller
                          name="group"
                          control={control}
                          render={({ field }) => (
                            <FormControl
                              fullWidth
                              className="mt-8 mb-16 px-3 w-full sm:w-1/2 lg:w-1/2"
                            >
                              <InputLabel id="group">Group</InputLabel>
                              <Select
                                {...field}
                                id="group"
                                labelId="group"
                                label="Group"
                                className=""
                                onChange={(evnt) => handleGroupChange(evnt.target.value)}
                              >
                                <MenuItem key="ld_" value="">
                                  Select
                                </MenuItem>
                                {Group &&
                                  Group.length > 0 &&
                                  Group.map((GroupData, k) => (
                                    <MenuItem key={`el_${GroupData.id}`} value={`${GroupData.id}`}>
                                      {GroupData.name}
                                    </MenuItem>
                                  ))}
                              </Select>
                            </FormControl>
                          )}
                        />
                      ) : (
                        ''
                      )}
                    </div>
                  </>
                ) : (
                  ''
                )}

                <div className="flex ">
                  <Controller
                    name="members"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth>
                        <InputLabel id="demo-multiple-checkbox-label">Members</InputLabel>
                        <Select
                          {...field}
                          id="members"
                          labelId="demo-multiple-checkbox-label"
                          label="Members"
                          className="mt-8 mb-16"
                          defaultValue=""
                          multiple
                          value={selected_members}
                          onChange={handleMemberChange}
                          renderValue={(selected) => {
                            const labels = members
                              ?.filter((m) => {
                                if (selected.indexOf(`${m.id}`) != -1) {
                                  return m;
                                }
                              })
                              .map((m) => {
                                return `${m.first_name} ${m.last_name}`;
                              });
                            return labels?.join(', ');
                          }}
                          MenuProps={MenuProps}
                        >
                          <MenuItem key="0" value="all_members">
                            <Checkbox checked={selected_all_members} />
                            <ListItemText primary="Select All" />
                          </MenuItem>

                          {members &&
                            members.length > 0 &&
                            members.map((member) => (
                              <MenuItem key={`${member.id}`} value={`${member.id}`}>
                                <Checkbox checked={selected_members.indexOf(`${member.id}`) > -1} />
                                <ListItemText
                                  primary={`${member.first_name} ${member.last_name}`}
                                />
                              </MenuItem>
                            ))}
                        </Select>
                      </FormControl>
                    )}
                  />
                </div>
                {items &&
                  items.map((item_val, k) => (
                    <div key={k} className="">
                      <div className="flex -mx-3">
                        <Controller
                          name="item"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              className="mt-8 mb-16 mx-3"
                              label="Item Name"
                              id={`item_${k}`}
                              variant="outlined"
                              value={item_val.item}
                              onChange={(evnt) => handleItemChange(k, evnt)}
                              fullWidth
                              InputLabelProps={{
                                shrink: true,
                              }}
                            />
                          )}
                        />
                        <Controller
                          name="description"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              className="mt-8 mb-16 mx-3"
                              label="Description"
                              id={`description_${k}`}
                              variant="outlined"
                              value={item_val.description}
                              onChange={(evnt) => handleItemChange(k, evnt)}
                              fullWidth
                              InputLabelProps={{
                                shrink: true,
                              }}
                            />
                          )}
                        />

                        {getValues('invoice_type') === 'custom' ? (
                          <>
                            <Controller
                              name="quantity"
                              control={control}
                              render={({ field }) => (
                                <TextField
                                  {...field}
                                  className="mt-8 mb-16 mx-3"
                                  label="Quantity"
                                  type="number"
                                  min="0"
                                  id={`quantity_${k}`}
                                  variant="outlined"
                                  value={item_val.quantity}
                                  onChange={(evnt) => handleItemChange(k, evnt)}
                                  fullWidth
                                  InputLabelProps={{
                                    shrink: true,
                                  }}
                                />
                              )}
                            />

                            <Controller
                              name="cost"
                              control={control}
                              render={({ field }) => (
                                <TextField
                                  {...field}
                                  className="mt-8 mb-16 mx-3"
                                  label="Cost"
                                  type="number"
                                  min="0"
                                  id={`cost_${k}`}
                                  variant="outlined"
                                  value={item_val.cost}
                                  onChange={(evnt) => handleItemChange(k, evnt)}
                                  fullWidth
                                  InputLabelProps={{
                                    shrink: true,
                                  }}
                                />
                              )}
                            />
                          </>
                        ) : null}

                        {k != 0 && (
                          <motion.div
                            className="mt-8"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0, transition: { delay: 0.3 } }}
                          >
                            <Button
                              className="whitespace-nowrap mx-4 pull-right"
                              variant="contained"
                              color="secondary"
                              onClick={(evnt) => removeItem(k)}
                            >
                              Remove
                            </Button>
                            <div className="clearfix" />
                          </motion.div>
                        )}
                        {k == items.length - 1 && (
                          <motion.div
                            className="mt-8"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0, transition: { delay: 0.3 } }}
                          >
                            <Button
                              className="whitespace-nowrap mx-4 pull-left"
                              variant="contained"
                              color="secondary"
                              onClick={addMoreItem}
                            >
                              Add More
                            </Button>

                            <div className="clearfix" />
                          </motion.div>
                        )}
                      </div>
                    </div>
                  ))}
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
                disabled={!isValid}
                onClick={handleSaveInvoice}
              >
                Save
              </Button>

              <div className="clearfix" />
            </motion.div>
          </div>
        }
        innerScroll
      />
    </FormProvider>
  );
}

export default withReducer('invoicesApp', reducer)(Invoice);
