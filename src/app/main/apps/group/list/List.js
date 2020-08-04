/* eslint-disable no-nested-ternary */
import withReducer from 'app/store/withReducer';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Icon from '@mui/material/Icon';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FuseLoading from '@fuse/core/FuseLoading';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectGroupList, getGroupList } from '../store/GroupDataListSlice';
import reducer from '../store';

// import ListHeader from './ListHeader';
// import ListTable from './ListTable';

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

function List() {
  const dispatch = useDispatch();
  const GroupDataList = useSelector(selectGroupList);
  const user = useSelector(({ auth }) => auth.user);
  const permissions = user && user.data && user.data.permissions ? user.data.permissions : [];

  const [data, setData] = useState(GroupDataList);
  const [loading, setLoading] = useState(true);
  const [oldSearchText, setOldSearchText] = useState('');
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    dispatch(getGroupList({ searchText })).then(() => setLoading(false));
  }, []);

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
      setData(GroupDataList);
    }

    return () => clearTimeout(getData);
  }, [GroupDataList, searchText]);

  function handleSearch(search) {
    dispatch(getGroupList({ searchText: search })).then((action) => {
      setData(action.payload);
    });
  }

  function handleSearchText(event) {
    setSearchText(event.target.value);
  }

  // useEffect(() => {
  //   if (searchText !== undefined && searchText.length > 0) {
  //     if (oldSearchText !== searchText) {
  //       handleSearch(searchText);
  //     }
  //     setOldSearchText(searchText);
  //   } else if (oldSearchText && searchText.length === 0) {
  //     handleSearch('');
  //     setOldSearchText('');
  //   } else {
  //     setData(GroupDataList);
  //   }
  // }, [GroupDataList, searchText]);

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

  // return <Root header={<ListHeader />} content={<ListTable />} innerScroll />;
  return (
    <Root className="flex flex-col flex-auto shrink-0 w-full">
      <div className="header relative overflow-hidden flex shrink-0 items-center justify-center h-200 sm:h-200">
        <div className="flex flex-col max-w-2xl mx-auto w-full p-24 sm:p-32">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0 } }}
            className="flex items-center justify-between"
          >
            <Typography color="inherit" className="text-24 sm:text-44 font-bold tracking-tight">
              Groups
            </Typography>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0, transition: { delay: 0.2 } }}
            >
              {permissions.indexOf('groups:create') > -1 && (
                <Button
                  component={Link}
                  to="/apps/group/new"
                  className="whitespace-nowrap"
                  variant="contained"
                  color="secondary"
                >
                  <span className="hidden sm:flex">Add Group</span>
                  <span className="flex sm:hidden">New</span>
                </Button>
              )}
            </motion.div>
          </motion.div>
        </div>
        <Icon className="header-icon">person</Icon>
      </div>
      <div className="flex flex-col flex-1 max-w-2xl w-full mx-auto px-8 sm:px-16 py-24">
        <div className="flex flex-col shrink-0 sm:flex-row items-center justify-between py-24">
          <TextField
            label="Search for a group"
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
                  <>
                    {data.map((group, k) => {
                      return (
                        <motion.div
                          key={k}
                          variants={item}
                          className="w-full pb-24 sm:w-1/2 lg:w-1/3 sm:p-16"
                        >
                          <Card className="flex flex-col shadow">
                            <button
                              className="flex shrink-0 items-center justify-between px-24 h-64 pointerCurser"
                              style={{
                                background: '#fff',
                                color: '#000',
                              }}
                              onClick={() => {}}
                              type="button"
                            >
                              <Typography
                                className="font-bold truncate"
                                color="inherit"
                                variant="subtitle1"
                              >
                                {group.name}
                              </Typography>
                              <Box sx={{ display: 'flex' }}>
                                <Link
                                  to={`/apps/group/${group.encryption_id}`}
                                  className="flex items-center justify-center opacity-75"
                                >
                                  <Icon title="Edit" className="text-blue text-20 mx-8">
                                    edit
                                  </Icon>
                                </Link>
                                <Link
                                  to={`/apps/groups/${group.id}`}
                                  className="flex items-center justify-center opacity-75"
                                >
                                  <Icon title="View Details" className="text-blue text-20 mx-8">
                                    visibility
                                  </Icon>
                                </Link>
                              </Box>
                            </button>
                            {/* <CardContent className="flex flex-col flex-auto justify-center">
                              <Box
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  flexDirection: 'column',
                                  mb: 1.5,
                                }}
                              >
                                <Typography variant="h6">Count</Typography>
                                <Typography variant="h5">{group.totalRecords}</Typography>
                              </Box>
                            </CardContent> */}
                          </Card>
                        </motion.div>
                      );
                    })}
                  </>
                </div>
              </div>
            </motion.div>
          </div>
        ) : (
          <div className="flex flex-1 items-center justify-center">
            <Typography color="textSecondary" className="text-24 my-24">
              No Groups found!
            </Typography>
          </div>
        )}
      </div>
    </Root>
  );
}

export default withReducer('GroupListApp', reducer)(List);
