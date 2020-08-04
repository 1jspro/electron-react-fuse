import DemoContent from '@fuse/core/DemoContent';
import { styled } from '@mui/material/styles';
import FusePageSimple from '@fuse/core/FusePageSimple';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Icon from '@mui/material/Icon';
import Radio from '@mui/material/Radio';
import { motion } from 'framer-motion';
import { useEffect, useRef, memo, useState } from 'react';
import { getPaymentInfo } from './store/subscriptionSlice';
import { useDispatch, useSelector } from 'react-redux';
import Moment from 'moment';
import Button from '@mui/material/Button';
import FuseLoading from '@fuse/core/FuseLoading';
import {useLocation, useNavigate} from "react-router-dom";

const Root = styled(FusePageSimple)({
  '& .FusePageSimple-header': {},
  '& .FusePageSimple-toolbar': {},
  '& .FusePageSimple-content': {},
  '& .FusePageSimple-sidebarHeader': {},
  '& .FusePageSimple-sidebarContent': {},
});

function SubscriptionPayment(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [payment_status, setPaymentStatus] = useState({});
  const [loading, setLoading] = useState(true);

  const search = useLocation().search;
  const reference = new URLSearchParams(search).get('reference');

  useEffect(() => {
    dispatch(getPaymentInfo({reference: reference})).then((action) => {
      setPaymentStatus(action.payload);
      setLoading(false);
    });
  }, [dispatch]);

  function handleBtnClick(ev) {
    navigate('/apps/subscriptions');
  }

  const container = {
    show: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  if (loading) {
    return <FuseLoading />;
  }

  return (
    <Root
      header={
        <Typography
          component={motion.span}
          initial={{ x: -20 }}
          animate={{ x: 0, transition: { delay: 0.2 } }}
          delay={300}
          className="hidden p40 sm:flex text-16 md:text-24 mx-12 font-semibold"
        >
          Payment Status
        </Typography>
      }
      content={
        <div className="p-12 lg:ltr:pr-0 lg:rtl:pl-0">
          <motion.div className="flex flex-wrap" variants={container} initial="hidden" animate="show">
           
              <motion.div variants={item} className="widget flex w-full sm:w-1/1 md:w-1/1 p-12 ">
                <Paper className="w-full rounded-20   p-16 shadow flex flex-col justify-between ptb-50">
                  
                  <div className="text-center mtb-30">
                    <Icon className="text-58 text-green-800 font-normal">
                      check_circle
                    </Icon>
                    <Typography className="text-18 text-green-800 font-normal">
                      {payment_status.message}
                    </Typography>

                  </div>

                  <div className="w-full  min-h-420 text-center h-420">
                    <table className="text-left m-auto text-14 font-normal">
                      <tr>
                        <td>Subscribed Package :-</td>
                        <td><span className="text-blue-800 ">{payment_status.data.package_name}</span></td>
                      </tr>
                      <tr>
                        <td>Amount Paid :-</td>
                        <td><span className="text-blue-800 ">{payment_status.data.amount_paid}</span></td>
                      </tr>
                      <tr>
                        <td>Number Of SMS Allowed :-</td>
                        <td><span className="text-blue-800 ">{payment_status.data.available_sms}</span></td>
                      </tr>
                      <tr>
                        <td>Number Of Members Allowed to add :-</td>
                        <td><span className="text-blue-800 ">{payment_status.data.available_members}</span></td>
                      </tr>
                      <tr>
                        <td>Plan Valid Upto :-</td>
                        <td><span className="text-blue-800 ">{payment_status.data.number_of_days} Days</span></td>
                      </tr>
                      <tr>
                        <td>Your plan expires on :-</td>
                        <td><span className="text-blue-800 ">{Moment(Number(payment_status.data.end_date*1000)).format('MMM DD, YYYY')}</span></td>
                      </tr>
                    </table>
                    
                    <motion.div
                      className="mt30"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0, transition: { delay: 0.3 } }}
                    >
                      <Button
                        className="whitespace-nowrap mx-4"
                        variant="contained"
                        color="secondary"
                        onClick={handleBtnClick}
                      >
                        View Subscription History
                      </Button>

                      <div className="clearfix"></div>
                    </motion.div>
                </div>
                </Paper>
              </motion.div>
          </motion.div>
        </div>
      }
    />
  );
}

export default SubscriptionPayment;
