/* eslint-disable no-nested-ternary */
import withReducer from 'app/store/withReducer';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import Icon from '@mui/material/Icon';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import FuseLoading from '@fuse/core/FuseLoading';
import { getMembersGroup } from '../../invoices/store/invoiceSlice';
import reducer from '../store';

const Root = styled('div')(({ theme }) => ({
  '& .header': {
    background: `linear-gradient(to right, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
    color: theme.palette.getContrastText(theme.palette.primary.main),
    '& .header-icon': {
      position: 'absolute',
      top: -64,
      left: 0,
      opacity: 0.04,
      fontSize: 512,
      width: 512,
      height: 512,
      pointerEvents: 'none',
    },
  },
}));

function Members() {
  const dispatch = useDispatch();
  const routeParams = useParams();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [oldSearchText, setOldSearchText] = useState('');
  const [searchText, setSearchText] = useState('');

  function handleSearchText(event) {
    setSearchText(event.target.value);
  }

  function handleSearch(search) {
    dispatch(getMembersGroup({ GroupId: routeParams.id, searchText: search })).then((action) => {
      setData(action.payload);
    });
  }

  function handlePreview(item) {
    if (item.id_card_path) {
      window.open(item.id_card_path, '_blank', 'noopener,noreferrer');
    }
  }

  useEffect(() => {
    dispatch(getMembersGroup({ GroupId: routeParams.id })).then((action) => {
      setLoading(false);
      if (action?.payload) setData(action.payload);
    });
  }, [dispatch]);

  useEffect(() => {
    let getData;
    if (searchText.length > 0) {
      if (oldSearchText !== searchText) {
        getData = setTimeout(() => handleSearch(searchText), 1000);
      }
      setOldSearchText(searchText);

    } else if (oldSearchText && searchText.length === 0) {
      handleSearch('');
      setOldSearchText('');
    } else {
      setData(data);
    }

    return () => clearTimeout(getData);
  }, [data, searchText]);

  const item = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    show: {
      opacity: 1,
      y: 0,
    },
  };

  const container = {
    show: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <Root className="flex flex-col flex-auto shrink-0 w-full">
      <div className="header relative overflow-hidden flex shrink-0 items-center justify-center h-200 sm:h-200">
        <div className="flex flex-col max-w-2xl mx-auto w-full p-24 sm:p-32">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0 } }}>
            <Typography color="inherit" className="text-24 sm:text-44 font-bold tracking-tight">
              Group Members
            </Typography>
          </motion.div>
        </div>
        <Icon className="header-icon">person</Icon>
      </div>
      <div className="flex flex-col flex-1 max-w-2xl w-full mx-auto px-8 sm:px-16 py-24">
        <div className="flex flex-col shrink-0 sm:flex-row items-center justify-between py-24">
          <TextField
            label="Search for a group member"
            placeholder="Enter a keyword..."
            className="flex w-full sm:w-320 mb-16 sm:mb-0 mx-16"
            value={searchText}
            inputProps={{
              'aria-label': 'Search',
            }}
            onChange={handleSearchText}
            variant="outlined"
            InputLabelProps={{
              shrink: true,
            }}
          />
        </div>

        {loading ? (
          <FuseLoading />
        ) : data.length > 0 ? (
          <div className="boxLayoutWrap">
            <motion.div
              className="flex flex-wrap py-24"
              variants={container}
              initial="hidden"
              animate="show"
            >
              <div className="w-full pb-24 sm:p-16">
                <div className="flex flex-wrap">
                  {data.map((member, mk) => {
                    return (
                      <motion.div
                        variants={item}
                        className="w-full pb-24 sm:w-1/2 lg:w-1/3 sm:p-16"
                        key={`member_${mk}`}
                      >
                        <Card className="flex flex-col h-256 shadow">
                          <div
                            className="flex shrink-0 items-center justify-between px-24 h-64"
                            style={{
                              background: '#fff',
                              color: '#000',
                            }}
                          >
                            <Typography
                              className={
                                member.id_card_path
                                  ? 'font-medium truncate pointerCurser'
                                  : 'font-medium truncate '
                              }
                              color="inherit"
                              onClick={(event) => {
                                event.stopPropagation();
                                handlePreview(member);
                              }}
                            >
                              {member.id_card_number}
                            </Typography>
                            <div className="flex items-center justify-center opacity-75">
                              <Link to={`/apps/members/details/${member.encryption_id}`}>
                                <Icon title="View Details" className="text-blue text-20 mx-8">
                                  visibility
                                </Icon>
                              </Link>
                            </div>
                          </div>
                          <CardContent className="flex flex-col flex-auto items-center justify-center">
                            <div className="w-52 mb-20 imfw">
                              {member.profile_pic ? (
                                <img
                                  className="w-full block rounded"
                                  src={`https://app.atdamss.com/storage/${member.profile_pic}`}
                                  alt={`${member.first_name} ${member.last_name}`}
                                />
                              ) : (
                                <img
                                  className="w-full block rounded"
                                  src="assets/images/logos/user.png"
                                  alt={`${member.first_name} ${member.last_name}`}
                                />
                              )}
                            </div>
                            <Typography className="text-center text-16 font-medium">
                              {member.first_name} {member.last_name}
                            </Typography>
                            <Typography
                              className="text-center text-13 font-normal"
                              color="textSecondary"
                            >
                              {member.email}
                            </Typography>
                            <Typography
                              className="text-center text-13 font-normal"
                              color="textSecondary"
                            >
                              {member.phone_no}
                            </Typography>
                            {/* <Typography className="text-center text-12 mt-8 font-medium">
                              {member.level_name} : {member.level_data_name}
                            </Typography> */}
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </div>
        ) : (
          <div className="flex flex-1 items-center justify-center">
            <Typography color="textSecondary" className="text-24 my-24">
              No Groups Members found!
            </Typography>
          </div>
        )}
      </div>
    </Root>
  );
}

export default withReducer('GroupMembersListApp', reducer)(Members);
