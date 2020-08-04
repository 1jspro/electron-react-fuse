import _ from '@lodash';
import { styled, useTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import FormControl from '@mui/material/FormControl';
import Icon from '@mui/material/Icon';
import InputLabel from '@mui/material/InputLabel';
import LinearProgress from '@mui/material/LinearProgress';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import withReducer from 'app/store/withReducer';
import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import ConfirmationDialogRaw from './ConfirmationDialogRaw';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import reducer from '../store';
import { showMessage } from 'app/store/fuse/messageSlice';
import FuseLoading from '@fuse/core/FuseLoading';
import TablePagination from '@mui/material/TablePagination';
import { saveMirrorUser, exitMirrorUser, setUserData } from 'app/auth/store/userSlice';
import { getSupervisors, selectSupervisors, getSupervisorToken, getSupervisorProfile } from '../store/supervisorsSlice';
import jwtService from 'app/services/jwtService';

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

function Supervisors(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const supervisors = useSelector(selectSupervisors);
  const user = useSelector(({ auth }) => auth.user);
  const permissions = (user && user.data && user.data.permissions) ? user.data.permissions : [];

  const theme = useTheme();
  const [filteredData, setFilteredData] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [open, setOpen] = useState(false);
  const [rowItem, setRowitem] = useState({});
  const [searchLoading, setSearchLoading] = useState(false);
  const [oldSearchText, setOldSearchText] = useState('');
  const [loading, setLoading] = useState(true);
  const [totalPage, setTotalpage] = useState(1);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    dispatch(getSupervisors({page, rowsPerPage, searchText})).then(() => setLoading(false));
  }, [dispatch]);

  function handleSearch (search) {
    dispatch(getSupervisors({page, rowsPerPage, searchText:search})).then((action) => { 
      setFilteredData(action.payload); 
      setLoading(false);
      // if (oldSearchText != searchText) {
      //   setSearchLoading(false);
      // }
    });
  }

  /*useEffect(() => {
    function getFilteredArray() {
      if (searchText.length === 0) {
        return supervisors;
      }

      return _.filter(supervisors, (item) => {
        return (item.first_name+item.last_name).toLowerCase().includes(searchText.toLowerCase());
      });
    }

    if (supervisors) {
      setFilteredData(getFilteredArray());
    }
  }, [supervisors, searchText]);*/

  useEffect(() => {
    if (searchText.length > 0) {
      if (oldSearchText != searchText) {
        setPage(0);
        handleSearch(searchText);
      } 
      setOldSearchText(searchText);
    
    // if (searchText.length !== 0) {
    //   setFilteredData(
    //     _.filter(producers, (item) => item.name.toLowerCase().includes(searchText.toLowerCase()))
    //   );
    //   setPage(0);
    } else if (oldSearchText && searchText.length == 0) {
      handleSearch('');
      setOldSearchText('');
    } else {
      setFilteredData(supervisors);
    }
  }, [supervisors, searchText]);


  function handleSearchText(event) {
    setSearchText(event.target.value);
  }

  function handleRemove(item) {
    setRowitem(item);

    setTimeout(() => {
      setOpen(true);
    }, 1)
  }

  function handleSupervisorLogin(event, supervisor) {
    console.log(supervisor, 'supervisor');
    dispatch(getSupervisorToken({supervisor_id: supervisor.id})).then((action) => { 
      if (action.payload.status && action.payload.data) {
        dispatch(saveMirrorUser({access_token: action.payload.data})).then((data) => { 
          dispatch(getSupervisorProfile()).then((userAction) => { 
            let userData = userAction.payload;
            console.log(userData, 'userData')
            if (userData.user_data) {
              let muid = window.localStorage.getItem('muid');
              if (muid) {
                userData.user_data.muid = muid;
              } else {
                userData.user_data.muid = '';
              }

              let permissions = userData.user_data.permissions;
              let read_only_permissions = userData.user_data['read-only'] ? userData.user_data['read-only'] : [];
              if (read_only_permissions.length > 0) {
                permissions = permissions.filter((p) => {
                  if (read_only_permissions.indexOf(p) === -1) {
                    return p;
                  }
                })
              }

              if(userData.user_data['show_id_card'] === 0){
                var arr = ['id-cards:create','id-cards:edit','id-cards:delete','id-cards:read'];
                permissions = permissions.filter((p) => {
                  if (arr.indexOf(p) === -1) {
                    return p;
                  }
                })
              }

              userData.user_data.permissions = permissions;

              jwtService.setPermissions(permissions);

              let user = {
                muid: userData.user_data.muid ? userData.user_data.muid : "",
                role: userData.user_data.roles, // guest
                data: {
                  displayName: userData.user_data.first_name ? (userData.user_data.first_name + ' ' + userData.user_data.last_name) : "",
                  photoURL: userData.user_data.profile_pic,
                  email: userData.user_data.email,
                  permissions: userData.user_data.permissions,
                  level_id: userData.user_data.level_id ? userData.user_data.level_id : ""
                },
              }
              dispatch(setUserData(user));
              dispatch(showMessage({ message: "You are on "+supervisor.org_name+"'s dashboard" }));
              navigate(`/apps/dashboard`);
              window.location.reload();
            } else {
              dispatch(exitMirrorUser({})); 
              dispatch(showMessage({ message: "Something went wrong......!" }));
              navigate(`/apps/dashboard`);
            }
          });
        });
      }
    });
  }

  

  function handleEdit(item) {
    navigate(`/apps/supervisors/${item.encryption_id}`);
  }

   const handleClose = () => {
    setOpen(false);
  };

  function handleChangePage(event, value) {
    setLoading(true);
    dispatch(getSupervisors({page:value, rowsPerPage, searchText})).then((action) => { 
      setPage(value); 
      setFilteredData(action.payload); 
      setLoading(false);
    });
  }

  function handleChangeRowsPerPage(event) {
    setLoading(true);
    dispatch(getSupervisors({page:0, rowsPerPage: event.target.value, searchText})).then((action) => { 
      setPage(0); 
      setRowsPerPage(event.target.value);
      setFilteredData(action.payload); 
      setLoading(false);
    });
  }

  return (
    <Root className="flex flex-col flex-auto shrink-0 w-full">
      <div className="header relative overflow-hidden flex shrink-0 items-center justify-center h-200 sm:h-200">
        <div className="flex flex-col max-w-2xl mx-auto w-full p-24 sm:p-32">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0 } }}>
            <Typography color="inherit" className="text-24 sm:text-44 font-bold tracking-tight">
              Supervisors
            </Typography>
          </motion.div>
        </div>
        <Icon className="header-icon">person</Icon>
      </div>
      <div className="flex flex-col flex-1 max-w-2xl w-full mx-auto px-8 sm:px-16 py-24">
        <div className="flex flex-col shrink-0 sm:flex-row items-center justify-between py-24">
          <TextField
            label="Search for an supervisor"
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
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0, transition: { delay: 0.2 } }}
          >
            {permissions.indexOf("supervisor:create") > -1 && <Button
                          component={Link}
                          to="/apps/supervisors/new"
                          className="whitespace-nowrap"
                          variant="contained"
                          color="secondary"
                        >
                          <span className="hidden sm:flex">Add New Supervisor</span>
                          <span className="flex sm:hidden">New</span>
                        </Button>}
            {/*<Button
                          className="whitespace-nowrap mx-4"
                          variant="contained"
                          color="secondary"
                          onClick={handleExcelExport}
                          startIcon={<Icon className="hidden sm:flex">get_app</Icon>}
                        >
                          Excel
                        </Button>
                        <Button
                          className="whitespace-nowrap mx-4"
                          variant="contained"
                          color="secondary"
                          onClick={handleCSVExport}
                          startIcon={<Icon className="hidden sm:flex">get_app</Icon>}
                        >
                          CSV
                        </Button>*/}
          </motion.div>
        </div>


        {useMemo(() => {
          const container = {
            show: {
              transition: {
                staggerChildren: 0.1,
              },
            },
          };

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

          return (
            loading ? (<FuseLoading />) :
            (filteredData &&
            (filteredData.length > 0 ? (
              <div className="boxLayoutWrap">
              <motion.div
                className="flex flex-wrap py-24"
                variants={container}
                initial="hidden"
                animate="show"
              >
                {filteredData.map((supervisor) => {
                  return (
                    <motion.div
                      variants={item}
                      className="w-full pb-24 sm:w-1/2 lg:w-1/3 sm:p-16"
                      key={supervisor.id}
                    >
                      <Card className="flex flex-col h-300 shadow">
                        <div
                          className="flex shrink-0 items-center justify-between px-24 h-64"
                          style={{
                            background: '#fff',
                            color: '#000'
                          }}
                        >
                          {/*<Typography className="font-medium truncate" color="inherit">
                                                      {supervisor.role}
                                                    </Typography>*/}
                          {/*<Button
                                                      variant="contained"
                                                      component="span"
                                                      size="large"
                                                      color="primary"
                                                      onClick={e => handleSupervisorLogin(e, supervisor)}
                                                    >
                                                      Login
                                                    </Button>*/}
                          <div className="flex items-center justify-center opacity-75">
                            {permissions.indexOf("supervisor:edit") > -1 && 
                              <Icon className="text-20 mx-8" color="inherit" onClick={(event) => {event.stopPropagation();handleEdit(supervisor);}}>
                                edit
                            </Icon>}
                            {permissions.indexOf("supervisor:delete") > -1 && 
                            <Icon className="text-20" color="inherit" onClick={(event) => {event.stopPropagation();handleRemove(supervisor);}}>
                              delete
                            </Icon>}
                          </div>
                        </div>
                        <CardContent className="flex flex-col flex-auto items-center justify-center">
                          <div className="w-52 mb-20">
                            { supervisor.profile_pic ?
                              <img
                                className="w-full block rounded"
                                src={supervisor.profile_pic}
                                alt={supervisor.first_name+' '+supervisor.last_name}
                              /> :
                              <img
                                className="w-full block rounded"
                                src="assets/images/logos/user.png"
                                alt={supervisor.first_name+' '+supervisor.last_name}
                              />
                            }
                          </div>
                          <Typography className="text-center text-16 font-medium">
                            {supervisor.first_name+' '+supervisor.last_name}
                          </Typography>
                          <Typography className="text-center text-13 mt-8 font-normal">
                            Organization : {(supervisor.org_name) ? supervisor.org_name : '--'}
                          </Typography>
                          <Typography
                            className="text-center text-13 mt-8 font-normal"
                            color="textSecondary"
                          >
                            {supervisor.email}
                          </Typography>
                          <Typography
                            className="text-center text-13  font-normal"
                            color="textSecondary"
                          >
                            {supervisor.phone_no}
                          </Typography>
                          {supervisor.hasOwnProperty('total_supervisor_member') && <Typography className="text-center text-12 mt-8 font-medium">
                            Total supervisor Members : {supervisor.total_supervisor_member}
                          </Typography>}
                          <Typography className="text-center text-12 font-medium">
                            Total Members : {supervisor.total_member}
                          </Typography>
                          <Typography className="text-center text-12 font-medium">
                            Total Levels : {supervisor.total_level_data}
                          </Typography>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
                
              </motion.div>
              <TablePagination
                  className="shrink-0 border-t-1"
                  component="div"
                  count={filteredData[0].totalPage}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  backIconButtonProps={{
                    'aria-label': 'Previous Page',
                  }}
                  nextIconButtonProps={{
                    'aria-label': 'Next Page',
                  }}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </div>
            ) : (
              <div className="flex flex-1 items-center justify-center">
                <Typography color="textSecondary" className="text-24 my-24">
                  No supervisors found!
                </Typography>
              </div>
            )))
          );
        }, [filteredData, theme.palette])}
      </div>
      <ConfirmationDialogRaw
          id="deleteDialog"
          keepMounted
          open={open}
          onClose={handleClose}
          value={rowItem}
        />
    </Root>
  );
}

export default withReducer('supervisorsApp', reducer)(Supervisors);
