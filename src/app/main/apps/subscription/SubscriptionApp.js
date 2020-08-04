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
import { getPackages, getSubscriptions, subscribePackage } from './store/subscriptionSlice';
import { useDispatch, useSelector } from 'react-redux';
import Moment from 'moment';
import Button from '@mui/material/Button';
import FuseLoading from '@fuse/core/FuseLoading';


const Root = styled(FusePageSimple)({
  '& .FusePageSimple-header': {},
  '& .FusePageSimple-toolbar': {},
  '& .FusePageSimple-content': {},
  '& .FusePageSimple-sidebarHeader': {},
  '& .FusePageSimple-sidebarContent': {},
});

function Subscription(props) {
  const dispatch = useDispatch();
  const [packages, setPackages] = useState({});
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [isSubscribing, setSubscribing] = useState(false);
  const [selectedValue, setSelectedValue] = useState('');
  const [packageListView, setPackageListView] = useState(false);

  useEffect(() => {
    dispatch(getPackages()).then((action) => {
      setPackages(action.payload);
      dispatch(getSubscriptions()).then((action) => {
        if (action.payload.subscription_detail) {
          setData(action.payload);
        } else {
          setPackageListView(true);
        }
        setLoading(false);
      });
    });
  }, [dispatch]);

  function handleSubscription(ev) {
    setSubscribing(true);
    dispatch(subscribePackage({package_id: selectedValue})).then((action) => {
      console.log(action.payload);
      window.location.href = action.payload;
      setSubscribing(false);
    });
    
  }

  
  function handleChangeSubscription(ev) {
    setPackageListView(true);
  }

  function closePackageList(ev) {
    setPackageListView(false);
  }

  
  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };
  
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
          Subscribed Packages
        </Typography>
      }
      content={
        <div className="p-12 lg:ltr:pr-0 lg:rtl:pl-0">
          <motion.div className="flex flex-wrap" variants={container} initial="hidden" animate="show">
           
              {data.subscription_detail && <motion.div variants={item} className="widget flex w-full sm:w-1/2 md:w-1/2 p-12 ">
                <Paper className="w-full rounded-20   p-16 shadow flex flex-col justify-between ptb-50">
                  
                  <div className="text-left">
                    <Typography className="text-18 text-blue-800 font-normal">
                      Current Subscribed Package
                    </Typography>

                    <div className="w-full mt30 min-h-420 h-420">
                        <div className="text-14 font-normal">Subscribed Package :- <span className="text-blue-800 ">{data.subscription_detail.package_name}</span></div> 
                        <div className="text-14 font-normal">Your plan expires on :- <span className="text-blue-800 ">{Moment(Number(data.subscription_detail.end_date*1000)).format('MMM DD, YYYY')}</span></div> 
                        <div className="text-14 font-normal">Number Of SMS Left :- <span className="text-blue-800 ">{data.subscription_detail.available_sms}</span></div> 
                        <div className="text-14 font-normal">Number Of Members left to add :- <span className="text-blue-800 ">{data.subscription_detail.available_members}</span></div> 


                        <motion.div
                          className="mt30"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0, transition: { delay: 0.3 } }}
                        >
                          <Button
                            className="whitespace-nowrap mx-4"
                            variant="contained"
                            color="secondary"
                            onClick={handleChangeSubscription}
                          >
                            Change Subscription
                          </Button>


                          <div className="clearfix"></div>
                        </motion.div>
                    </div>

                  </div>
                </Paper>
              </motion.div>}

              {packageListView && <motion.div variants={item} className="widget flex w-full sm:w-1/1 md:w-1/1 p-12 ">
                <Paper className="w-full p-16 rounded-20 shadow flex flex-col justify-between ptb-50">
                  
                  <div className="text-left">
                    <Typography className="text-18 text-blue-800 font-normal pull-left">
                      Select Package Subscriptions
                    </Typography>
                    <Typography className="text-18 text-blue-800 font-normal pointerCursor pull-right" onClick={closePackageList}>
                      Close
                    </Typography>

                    <div className="w-full mt30  min-h-420 h-420">
                       <ul>
                          {packages && packages.length > 0 && _.orderBy(
                              packages,
                              ['package_days'],
                              ['asc']
                            ).map((pack) => 
                            <li key={pack.id+""} className="pointerCursor">
                              <Radio
                                checked={selectedValue == pack.id}
                                onChange={handleChange}
                                value={pack.id}
                                name="radio-buttons"
                                id={'pack_'+pack.id}
                              />
                              <label htmlFor={'pack_'+pack.id} className="pointerCursor">
                                {pack.name} <br />
                                - Validity In Number of Days: <span className="text-blue-800 font-normal">{pack.package_days}</span> <br />
                                - Number Of SMS Includes: <span className="text-blue-800 font-normal">{pack.sms_allowed}</span> <br />
                                - Number Of Members Includes: <span className="text-blue-800 font-normal">{pack.members_allowed}</span> <br />
                                - Package Price: <span className="text-blue-800 font-normal">{pack.package_cost}</span> <br />
                                - <span className="">{pack.description}</span>
                              </label>
                             </li>
                          )}
                        </ul>

                        <motion.div
                          className="mt30"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0, transition: { delay: 0.3 } }}
                        >
                          <Button
                            className="whitespace-nowrap mx-4"
                            variant="contained"
                            color="secondary"
                            disabled={(isSubscribing || !selectedValue)}
                            onClick={handleSubscription}
                          >
                            <span>{ !isSubscribing ? 'Subscribe Now' : "Please wait..."}</span>
                          </Button>


                          <div className="clearfix"></div>
                        </motion.div>
                    </div>
                  </div>
                </Paper>
              </motion.div> }

              <motion.div variants={item} className="widget flex w-full sm:w-1/1 md:w-1/1 p-12 ">
                <Paper className="w-full p-16 rounded-20 shadow flex flex-col justify-between ptb-50">
                  
                  <div className="text-left">
                    <Typography className="text-18 text-blue-800 font-normal">
                      Previously Subscribed Packages
                    </Typography>

                    <div className="w-full  mt30 min-h-420 h-420">
                      {(!data.subscription_history || (data.subscription_history && data.subscription_history.length == 0)) && <div className="text-16 mtb-30 text-center text-red-800 ">Subscription History Not Found.</div>}

                      {data.subscription_history && data.subscription_history.length > 0 && <table className="table  w-full table-bordered">
                          <thead>
                            <tr>
                                <th>#</th>
                                <th>Package Detail</th>
                                <th>Start - End Date</th>
                                <th>Payment Mode / Amount Paid</th>
                            </tr>
                          </thead>
                          <tbody>
                            {data.subscription_history && data.subscription_history.length > 0 && _.orderBy(
                              data.subscription_history,
                              ['id'],
                              ['asc']
                            ).map((pack, key) => 
                            <tr key={"sub_"+key}>
                              <td>{key+1}</td>
                              <td>
                                Package Name: {pack.package_name} <br />
                                Number of SMS: {pack.number_of_sms} <br />
                                Number of Members: {pack.number_of_members} <br />
                                Number of Days: {pack.number_of_days} <br />
                              </td>
                              <td>
                                {Moment(Number(pack.start_date)*1000).format('DD-MM-YYYY')} - {Moment(Number(pack.end_date)*1000).format('DD-MM-YYYY')} 
                              </td>
                              <td>
                                Payment Mode: {pack.payment_mode} <br />
                                Amount Paid: {pack.amount_paid}
                              </td>
                            </tr>
                            )}
                          </tbody>
                          <tfoot>
                            <tr>
                                <th>#</th>
                                <th>Package Detail</th>
                                <th>Start - End Date</th>
                                <th>Payment Mode / Amount Paid</th>
                            </tr>
                          </tfoot>
                        </table>}
                    </div>
                  </div>
                </Paper>
              </motion.div>
          </motion.div>
        </div>
      }
    />
  );
}

export default Subscription;
