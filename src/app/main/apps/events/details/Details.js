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
import { getEvent } from '../store/eventslice';
import { getStaff } from '../../staff/store/staffSlice';

import { Link, useParams, useNavigate } from 'react-router-dom';

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
    minHeight: 72,
    height: 72,
    alignItems: 'center',
    [theme.breakpoints.up('sm')]: {
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

function Details() {
  const dispatch = useDispatch();
  const routeParams = useParams();
  const [event, setEvent] = useState({});
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  useEffect(() => {
    dispatch(getEvent(routeParams)).then((action) => {
      setEvent(action.payload);
      /* dispatch(getStaff({"staffId": action.payload.belong_to_level})).then((action) => {
        let listdata = [];
        for (let x in action.payload.data.parents) {
          listdata.push(action.payload.data.parents[x]);
        }
        setLoading(false);
      }); */
      setLoading(false);
    });
  }, [dispatch]);

  /**
   * Wait while event data is loading
   */
  if (loading) {
    return <FuseLoading />;
  }
  return (
    <Root
      header={<PageHeader />}
      contentToolbar={
        <>
          <div className="w-full px-24  flex flex-col md:flex-row flex-1 items-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1, transition: { delay: 0.1 } }}>
              {event.event_image ?
                <img
                  className="roundImg  w-7 h-7"
                  src={event.event_image}
                /> :
                <img
                  className="roundImg  w-7 h-7"
                  src="assets/images/logos/user.png"
                />
              }
            </motion.div>


            <div className="flex flex-col md:flex-row flex-1 items-center justify-between p-8">
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0, transition: { delay: 0.2 } }}
              >
                <Typography
                  className="md:px-16 text-16 md:text-20 font-semibold tracking-tight"
                  variant="h4"
                  color="inherit"
                >
                  {event.event_name}
                </Typography>
              </motion.div>
              {/* <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0, transition: { delay: 0.2 } }}
              >
                <Typography
                  className="md:px-16 text-16 md:text-20 font-semibold tracking-tight"
                  variant="h4"
                  color="inherit"
                >
                  {event.progress && (<>{'Progress:'} <small className="text-secondary font-medium"> {event.progress}% </small></>) }
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
                  {'Status:'} <small className="text-secondary font-medium"> {event.status} </small>
                </Typography>
              </motion.div> */}
            </div>
          </div>
        </>
      }
      content={
        <div className="p-16 sm:p-24">
          <div>
            <table className="detailTable infoTable">
              <tbody>
              {/* label="Select Member" */}
                <tr>
                  <th className="titleWidth" align="left">Venue: </th>
                  <td align="left">{event.venue ? event.venue : '-'}</td>
                  <th className="titleWidth" align="left">Agenda:</th>
                  <td align="left">{event.agenda ? event.agenda : '-'}</td>
                </tr>
                <tr>
                  <th className="titleWidth" align="left">Start Date:</th>
                  <td align="left">{event.start_date ? event.start_date : '-'}</td>
                  <th className="titleWidth" align="left">End Date: </th>
                  <td align="left">{event.end_date ? event.end_date : '-'}</td>
                </tr>
                <tr>
                  <th className="titleWidth" align="left">Other Matters:</th>
                  <td align="left" colSpan={3}>{event.other_matters ? event.other_matters : '-'}</td>
                </tr>


              </tbody>
            </table>
          </div>
        </div>
      }
    />
  );
}

export default Details;
