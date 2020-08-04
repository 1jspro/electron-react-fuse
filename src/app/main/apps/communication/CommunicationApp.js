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
import ListItemText from '@mui/material/ListItemText';
import MenuItem from "@mui/material/MenuItem";
import Select from '@mui/material/Select';
import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import FormControlLabel from '@mui/material/FormControlLabel';
import Autocomplete from '@mui/material/Autocomplete';
import { resetMessage, newProfile, sendMessage, getMembers, getStaff } from './store/communicationSlice';
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
  message: yup
    .string()
    .required('The message field is required.'),
});

function Communication(props) {
  const dispatch = useDispatch();
  const message = useSelector(({ CommunicationApp }) => CommunicationApp.communication);
  const user = useSelector(({ auth }) => auth.user);
  const user_role = user.role[0];

  const navigate = useNavigate();

  const routeParams = useParams();
  const [tabValue, setTabValue] = useState(0);
  const [noMessage, setNoMessage] = useState(true);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState("members");
  const [user_list, setUserList] = useState([]);
  const [selected_all_users, setSelectAllUsers] = useState(false);
  const [selected_users, setSelectedUsers] = useState([]);


  const methods = useForm({
    mode: 'onChange',
    defaultValues: {},
    resolver: yupResolver(schema),
  });
  const { reset, watch, control, onChange, formState, setValue, getValues } = methods;
  const { isValid, dirtyFields, errors } = formState;
  const form = watch();

  useEffect(() => {
    dispatch(getMembers()).then((action) => {
      setValue("user_type", "members")
      setUserList(action.payload);
      setLoading(false);
    });
  }, [dispatch]);

  useEffect(() => {
    if (!message) {
      return;
    }
    /**
     * Reset the form on message state changes
     */
    reset(message);
  }, [message, reset]);

  useEffect(() => {
    return () => {
      /**
       * Reset message on component unload
       */
      dispatch(resetMessage());
      setNoMessage(false);
    };
  }, [dispatch]);

  /**
   * Tab Change
   */
  function handleTabChange(event, value) {
    setTabValue(value);
  }

  function handleTypeChange(event, value) {
    setSelectedType(event.target.value);
    setValue("user_type", event.target.value)

    if (event.target.value == "members") {
      dispatch(getMembers()).then((action) => {
        setUserList(action.payload);
      });

    } else {
      dispatch(getStaff()).then((action) => {
        setUserList(action.payload);
      });
    }

    setValue("users[]", []);
  }

  function handleSendMessage() {
    dispatch(sendMessage(getValues())).then((action) => {
      dispatch(showMessage({ message: action.payload.message }));
      setNoMessage(true);
    });
  }

  const handleUserChange = (event) => {
    let {
      target: { value },
    } = event;
    if (value.indexOf('all_users') != -1 && selected_users.length != user_list.length) {
      setSelectAllUsers(true);
      value = user_list.map((d) => {
        return d.id+"";
      });
      setSelectedUsers(
        // On autofill we get a stringified value.
        typeof value === 'string' ? value.split(',') : value,
      );
      setValue('users[]', value);
    } else {
      setSelectAllUsers(false);
      let selectAllIndex = value.indexOf("all_users");
      if (selectAllIndex > -1) {
        value.splice(selectAllIndex, 1);
      }
      setSelectedUsers(
        // On autofill we get a stringified value.
        typeof value === 'string' ? value.split(',') : value,
      );
      setValue('users[]', value);
    }
  }; 





  /**
   * Show Message if the requested breeds is not exists
   */

  /**
   * Wait while breed data is loading and form is setted
   */
  if (loading) {
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
                    <div className="mt-8 mb-16 mx-4 w-98">
                      <ul className="inlineUl">
                        <li key={"male"}>
                          <Radio
                            checked={selectedType === 'members'}
                            onChange={handleTypeChange}
                            value={'members'}
                            name="user_type"
                            id={'members'}
                          />
                          <label htmlFor={'members'}>
                            Members
                          </label>
                         </li>
                         <li key={"staff"}>
                          <Radio
                            checked={selectedType === 'staff'}
                            onChange={handleTypeChange}
                            value={'staff'}
                            name="user_type"
                            id={'staff'}
                          />
                          <label htmlFor={'staff'}>
                            Staff
                          </label>
                         </li>
                      </ul>
                    </div>
                  </div>

                  <div className="mt-8 mb-16 mx-4 w-98">
                    {/*<Checkbox
                                          checked={checked}
                                          onChange={(evnt)=>handleChange(k, evnt)} 
                                          name="all_users"
                                          id="all_users"
                                          inputProps={{ 'aria-label': 'controlled' }}
                                        />
                                        <label htmlFor="all_users">
                                          Send sms for {selectedType}
                                        </label>*/}

                    <Controller
                      name="users"
                      control={control}
                      render={({ field }) => (
                        <FormControl fullWidth>
                          <InputLabel id="demo-multiple-checkbox-label text-capitalize">{selectedType == 'members' ? "Members" : "Staff"}</InputLabel>
                          <Select
                            {...field}
                            id="users"
                            labelId="demo-multiple-checkbox-label"
                            label={selectedType == 'members' ? "Members" : "Staff"}
                            className="mt-8 mb-16"
                            defaultValue=""
                            multiple
                            value={selected_users}
                            onChange={handleUserChange}
                            renderValue={(selected) => {
                              let labels = user_list.filter((m)=> {
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
                              <MenuItem key={"0"} value={"all_users"}>
                              <Checkbox checked={selected_all_users} />
                                <ListItemText primary={"Select All"} />
                              </MenuItem>

                            {user_list && user_list.length > 0 && user_list.map((user) => 
                              <MenuItem key={user.id+""} value={user.id+""}>
                                <Checkbox checked={selected_users.indexOf(user.id+"") > -1} />
                                <ListItemText primary={user.first_name+' '+user.last_name} />
                              </MenuItem>
                            )}
                          </Select>
                        </FormControl>

                      )}
                    />
                  </div>

                  <Controller
                    name="message"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        className="mt-8 mb-16 mx-4"
                        id="message"
                        label="Message"
                        type="text"
                        multiline
                        rows={3}
                        variant="outlined"
                        fullWidth
                      />
                    )}
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
                  onClick={handleSendMessage}
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

export default withReducer('CommunicationApp', reducer)(Communication);
