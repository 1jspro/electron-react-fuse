import FuseLoading from '@fuse/core/FuseLoading';
import FusePageSimple from '@fuse/core/FusePageSimple';
import FusePageCarded from '@fuse/core/FusePageCarded';
import 'font-awesome/css/font-awesome.min.css';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import DOMPurify from 'dompurify';
import * as yup from 'yup';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from "@mui/material/MenuItem";
import { styled } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tab from '@mui/material/Tab';
import Icon from '@mui/material/Icon';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import PageHeader from './PageHeader';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { getMemberWithoutAuth, getAllParentLevels } from '../apps/members/store/memberSlice';
import { getEventList, AttendingEvent } from "../apps/events/store/eventslice";
import { useForm, FormProvider, useFormContext, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

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

  '& .FusePageCarded-toolbar': {
    minHeight: 'auto',
    height: 'auto',
    alignItems: 'center',
    padding: '10px 0',
    '& .member-details': {
      gap: '10px',
    },
    [theme.breakpoints.up('lg')]: {
      minHeight: 110,
      height: 110,
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

const schema = yup.object().shape({
  event_id: yup.string().required('You must select event'),
});

function MemberDetails() {
  const dispatch = useDispatch();
  const routeParams = useParams();

  const [selectedTab, setSelectedTab] = useState(0);
  const [member, setMember] = useState({});
  const [levels, setLevels] = useState([]);
  const [dynamic_forms, setDynamicForms] = useState([]);
  const [extra_field, setExtraFields] = useState({});
  const [loading, setLoading] = useState(true);
  const [Event, setEvent] = useState(null);
  const theme = useTheme();
  const methods = useForm({
    mode: 'onChange',
    defaultValues: {
      candidates: []
    },
    resolver: yupResolver(schema),
  });
  const { reset, watch, control, onChange, formState, setValue, getValues } = methods;
  const { isValid, dirtyFields, errors } = formState;
  const form = watch();

  useEffect(() => {
    console.log(routeParams.memberId)
    dispatch(getMemberWithoutAuth(routeParams.memberId)).then((action) => {
      setMember(action.payload);

      if (action.payload.extra_field) {
        let extraField = JSON.parse(action.payload.extra_field);
        setExtraFields(extraField);
      }

      dispatch(getEventList(routeParams.memberId)).then((action) => {
        setEvent(action.payload)
      });

      dispatch(getAllParentLevels({ "parent_id": action.payload.level_data_id, logIn: false })).then((action) => {
        let listdata = [];
        for (let x in action.payload.data.parents) {
          listdata.push(action.payload.data.parents[x]);
        }

        setLevels(listdata);
        setLoading(false);
      });
      // });
      // dispatch(getDynamicForms()).then((action) => {
      //   setDynamicForms(action.payload);
    });
  }, [dispatch]);


  function handleTabChange(event, value) {
    setSelectedTab(value);
  }

  function AttendEvent() {
    dispatch(AttendingEvent({ encryption_id: routeParams.memberId, event_id: getValues().event_id })).then((action) => {

      dispatch(showMessage({ message: action.payload.message }));
      dispatch(getEventList(routeParams.memberId)).then((action) => {
        setEvent(action.payload)
      });
    });
  }


  function handleRedirect(url) {
    // body...
    window.open(url, "_blank");
  }

  /**
   * Wait while member data is loading
   */
  if (loading) {
    return <FuseLoading />;
  }


  return (
    <Root
      header={<PageHeader admin={member.admin} />}
      contentToolbar={
        <>
          <div className="w-full px-24  flex flex-col md:flex-row flex-1 items-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1, transition: { delay: 0.1 } }}>
              {member.profile_pic ?
                <img
                  className="roundImg  w-7 h-7"
                  src={member.profile_pic}
                /> :
                <img
                  className="roundImg  w-7 h-7"
                  src="assets/images/logos/user.png"
                />
              }
            </motion.div>


            <div className="flex flex-col md:flex-row flex-1 items-center justify-between p-8 member-details">
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0, transition: { delay: 0.2 } }}
              >
                <Typography
                  className="md:px-16 text-16 md:text-20 font-semibold tracking-tight"
                  variant="h4"
                  color="inherit"
                >
                  {member.first_name + ' ' + member.last_name}
                </Typography>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0, transition: { delay: 0.2 } }}
              >
                <Typography
                  className="md:px-16 text-16 md:text-20 font-semibold tracking-tight"
                  variant="h4"
                  color="inherit"
                >
                  {member.email && (<>{'Email ID:'} <small className="text-grey font-medium"> {member.email} </small></>)}
                </Typography>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0, transition: { delay: 0.2 } }}
              >
                <Typography
                  className="md:px-16 text-16 md:text-20 font-semibold tracking-tight"
                  variant="h4"
                  color="inherit"
                >
                  {'Phone No:'} <small className="text-grey font-medium"> {member.phone_no} </small>
                </Typography>
              </motion.div>

              <motion.div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <FormProvider {...methods}>
                  <>
                    <Controller
                      name="event_id"
                      control={control}
                      className="px-3"
                      render={({ field }) => (
                        <FormControl fullWidth className='px-3 w-full sm:w-1/2 lg:w-1/2' style={{ width: '200px' }}>
                          <InputLabel id={"member-simple-select-label"}>Event</InputLabel>
                          {/* mt-8 mb-16 px-3 */}
                          <Select
                            {...field}
                            id="event_id"
                            labelId={"member-simple-select-label"}
                            label="Select Event"
                            className="px-3"
                          >
                            <MenuItem key={"el_0"} value={""}>Select</MenuItem>
                            {Event && Event.length > 0 && Event.map((event, k) => {
                              return (<MenuItem key={"el_" + event.id + ""} value={event.id + ""} >{event.event_name}</MenuItem>)
                            })}
                          </Select>
                        </FormControl>
                      )}
                    />


                    <motion.div
                      className=""
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0, transition: { delay: 0.3 } }}
                    >
                      <Button
                        className="whitespace-nowrap mx-4 pull-right"
                        variant="contained"
                        color="secondary"
                        disabled={(!isValid)}
                        onClick={AttendEvent}
                      >
                        Attend
                      </Button>
                    </motion.div>
                  </>
                </FormProvider>
              </motion.div>
            </div>
          </div>
        </>
      }
      content={
        <div className="p-16 sm:p-24">
          <div>
            <table className="detailTable infoTable">
              {(window.innerWidth < 768) ?
                <tbody>
                  <style>
                    {`.detailTable.infoTable .titleWidth { padding : 10px; font-size : 14px; width : 8%; }`}
                  </style>
                  <tr>
                    <th className="titleWidth" align="left">First Name: </th>
                    <td align="left">{member.first_name ? member.first_name : '-'}</td>
                  </tr>
                  <tr>
                    <th className="titleWidth" align="left">Last Name:</th>
                    <td align="left">{member.last_name ? member.last_name : '-'}</td>
                  </tr>
                  <tr>
                    <th className="titleWidth" align="left">Gender:</th>
                    <td align="left">{member.gender ? member.gender : '-'}</td>
                  </tr>
                  <tr>
                    <th className="titleWidth" align="left">ID Card Number: </th>
                    <td align="left">{member.id_card_number ? member.id_card_number : '-'}</td>
                  </tr>
                  <tr>
                    <th className="titleWidth" align="left">ID Type: </th>
                    <td align="left">{member.id_type ? member.id_type : '-'}</td>
                  </tr>
                  <tr>
                    <th className="titleWidth" align="left">Id Number:</th>
                    <td align="left">{member.id_number ? member.id_number : '-'}</td>
                  </tr>
                  <tr>
                    <th className="titleWidth" align="left">Telephone number: </th>
                    <td align="left">{member.phone_no ? member.phone_no : '-'}</td>
                  </tr>
                  <tr>
                    <th className="titleWidth" align="left">Email:</th>
                    <td align="left">{member.email ? member.email : '-'}</td>
                  </tr>
                  <tr>
                    <th className="titleWidth" align="left">Education Level: </th>
                    <td align="left">{member.education_level_name ? member.education_level_name : '-'}</td>
                  </tr>
                  <tr>
                    <th className="titleWidth" align="left">Industry:</th>
                    <td align="left">{member.industry_name ? member.industry_name : '-'}</td>
                  </tr>
                  <tr>
                    <th className="titleWidth" align="left">Profession: </th>
                    <td align="left">{member.profession_name ? member.profession_name : '-'}</td>
                  </tr>
                  <tr>
                    <th className="titleWidth" align="left">Employment Status:</th>
                    <td align="left">{member.employment_status ? member.employment_status : '-'} </td>
                  </tr>
                  {(levels && levels.length > 0) && levels.map((level, k) =>
                    <tr key={"l_" + k}>
                      <th className="titleWidth" align="left">{level.level.name}: </th>
                      <td colSpan="3" align="left">{level.name ? level.name : '-'}</td>
                    </tr>
                  )}
                  <tr>
                    <th className="titleWidth" align="left">Date of Joining: </th>
                    <td align="left">{member.date_year_of_joining ? member.date_year_of_joining : '-'}</td>
                  </tr>
                  <tr>
                    <th className="titleWidth" align="left">Date of Birth:</th>
                    <td align="left">{member.dob ? member.dob : '-'} </td>
                  </tr>
                  <tr>
                    <th className="titleWidth" align="left">Whats your Position?: </th>
                    <td align="left">{member.position ? member.position : '-'}</td>
                  </tr>
                  <tr>
                    <th className="titleWidth" align="left">Status:</th>
                    <td align="left">{member.status ? member.status : '-'} </td>
                  </tr>
                  {(dynamic_forms && dynamic_forms.length > 0) && dynamic_forms.map((form, k) =>
                    <tr key={"f_" + k}>
                      <th className="titleWidth" align="left">{form.label}: </th>
                      <td colSpan="3" align="left">{(extra_field && extra_field[form.id]) ? extra_field[form.id] : '-'}</td>
                    </tr>
                  )}
                </tbody>
                :
                <tbody>
                  <tr>
                    <th className="titleWidth" align="left">First Name: </th>
                    <td align="left">{member.first_name ? member.first_name : '-'}</td>
                    <th className="titleWidth" align="left">Last Name:</th>
                    <td align="left">{member.last_name ? member.last_name : '-'}</td>
                  </tr>
                  <tr>
                    <th className="titleWidth" align="left">Gender:</th>
                    <td align="left">{member.gender ? member.gender : '-'}</td>
                    <th className="titleWidth" align="left">ID Card Number: </th>
                    <td align="left">{member.id_card_number ? member.id_card_number : '-'}</td>
                  </tr>
                  <tr>
                    <th className="titleWidth" align="left">ID Type: </th>
                    <td align="left">{member.id_type ? member.id_type : '-'}</td>
                    <th className="titleWidth" align="left">Id Number:</th>
                    <td align="left">{member.id_number ? member.id_number : '-'}</td>
                  </tr>
                  <tr>
                    <th className="titleWidth" align="left">Telephone number: </th>
                    <td align="left">{member.phone_no ? member.phone_no : '-'}</td>
                    <th className="titleWidth" align="left">Email:</th>
                    <td align="left">{member.email ? member.email : '-'}</td>
                  </tr>
                  <tr>
                    <th className="titleWidth" align="left">Education Level: </th>
                    <td align="left">{member.education_level_name ? member.education_level_name : '-'}</td>
                    <th className="titleWidth" align="left">Industry:</th>
                    <td align="left">{member.industry_name ? member.industry_name : '-'}</td>
                  </tr>
                  <tr>
                    <th className="titleWidth" align="left">Profession: </th>
                    <td align="left">{member.profession_name ? member.profession_name : '-'}</td>
                    <th className="titleWidth" align="left">Employment Status:</th>
                    <td align="left">{member.employment_status ? member.employment_status : '-'} </td>
                  </tr>
                  {(levels && levels.length > 0) && levels.map((level, k) =>
                    <tr key={"l_" + k}>
                      <th className="titleWidth" align="left">{level.level.name}: </th>
                      <td colSpan="3" align="left">{level.name ? level.name : '-'}</td>
                    </tr>
                  )}
                  <tr>
                    <th className="titleWidth" align="left">Date of Joining: </th>
                    <td align="left">{member.date_year_of_joining ? member.date_year_of_joining : '-'}</td>
                    <th className="titleWidth" align="left">Date of Birth:</th>
                    <td align="left">{member.dob ? member.dob : '-'} </td>
                  </tr>
                  <tr>
                    <th className="titleWidth" align="left">Whats your Position?: </th>
                    <td align="left">{member.position ? member.position : '-'}</td>
                    <th className="titleWidth" align="left">Status:</th>
                    <td align="left">{member.status ? member.status : '-'} </td>
                  </tr>
                  {(dynamic_forms && dynamic_forms.length > 0) && dynamic_forms.map((form, k) =>
                    <tr key={"f_" + k}>
                      <th className="titleWidth" align="left">{form.label}: </th>
                      <td colSpan="3" align="left">{(extra_field && extra_field[form.id]) ? extra_field[form.id] : '-'}</td>
                    </tr>
                  )}
                </tbody>
              }
            </table>
          </div>
        </div>
      }
    />
  );
}

export default MemberDetails;
