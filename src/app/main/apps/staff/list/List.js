import _ from '@lodash';
import { styled, useTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
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
import FuseLoading from '@fuse/core/FuseLoading';
import TablePagination from '@mui/material/TablePagination';
import { getStaff, selectStaffList } from '../store/staffListSlice';

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

function StaffList(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const staffList = useSelector(selectStaffList);
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
  const [selectedRow, setSelectedRow] = useState([]);

  useEffect(() => {
    dispatch(getStaff({page, rowsPerPage, searchText})).then(() => setLoading(false));
  }, [dispatch]);

  function handleSearch (search) {
    dispatch(getStaff({page, rowsPerPage, searchText:search})).then((action) => { 
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
        return staffList;
      }

      return _.filter(staffList, (item) => {
        return (item.first_name+item.last_name).toLowerCase().includes(searchText.toLowerCase());
      });
    }

    if (staffList) {
      setFilteredData(getFilteredArray());
    }
  }, [staffList, searchText]);*/

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
      setFilteredData(staffList);
    }
  }, [staffList, searchText]);


  function handleSearchText(event) {
    setSearchText(event.target.value);
  }

  function handleRemove(item) {
    setRowitem(item);

    setTimeout(() => {
      setOpen(true);
    }, 1)
  }

  function handleEdit(item) {
    navigate(`/apps/staff/${item.encryption_id}`);
  }

  function handleDetails(item) {
    navigate(`/apps/staff/details/${item.encryption_id}`);
  }

  function handlePreview(item) {
    if (item.id_card_path) {
      window.open(item.id_card_path, '_blank', 'noopener,noreferrer');
    }
  }

   const handleClose = () => {
    setOpen(false);
  };

  function handleChangePage(event, value) {
    setLoading(true);
    dispatch(getStaff({page:value, rowsPerPage, searchText})).then((action) => { 
      setPage(value); 
      setFilteredData(action.payload); 
      setLoading(false);
    });
  }

  function handleChangeRowsPerPage(event) {
    setLoading(true);
    dispatch(getStaff({page:0, rowsPerPage: event.target.value, searchText})).then((action) => { 
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
              Staff
            </Typography>
          </motion.div>
        </div>
        <Icon className="header-icon">person</Icon>
      </div>
      <div className="flex flex-col flex-1 max-w-2xl w-full mx-auto px-8 sm:px-16 py-24">
        <div className="flex flex-col shrink-0 sm:flex-row items-center justify-between py-24">
          <TextField
            label="Search for a staff member"
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
            {permissions.indexOf("staffs:create") > -1 && 
              <Button
                component={Link}
                to="/apps/staff/new"
                className="whitespace-nowrap"
                variant="contained"
                color="secondary"
              >
                <span className="hidden sm:flex">Add New Staff</span>
                <span className="flex sm:hidden">New</span>
              </Button>
            }
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
                {filteredData.map((member) => {
                  return (
                    <motion.div
                      variants={item}
                      className="w-full pb-24 sm:w-1/2 lg:w-1/3 sm:p-16"
                      key={member.id}
                    >
                      <Card className="flex flex-col h-256 shadow">
                        <div
                          className="flex shrink-0 items-center justify-between px-24 h-64"
                          style={{
                            background: '#fff',
                            color: '#000'
                          }}
                        >  
                          <Typography className={member.id_card_path ? "font-medium truncate pointerCurser" : "font-medium truncate "} color="inherit" onClick={(event) => {event.stopPropagation();handlePreview(member);}}>
                            {member.id_card_number}
                          </Typography>
                          <div className="flex items-center justify-center opacity-75">
                            <Icon title="View Details" className="text-blue text-20 mx-8" onClick={(event) => {event.stopPropagation();handleDetails(member);}}>visibility</Icon>
                            {permissions.indexOf("staffs:edit") > -1 && <Icon className="text-20 mx-8" color="inherit" onClick={(event) => {event.stopPropagation();handleEdit(member);}}>
                              edit
                            </Icon>}
                            {permissions.indexOf("staffs:delete") > -1 && <Icon className="text-20" color="inherit" onClick={(event) => {event.stopPropagation();handleRemove(member);}}>
                              delete
                            </Icon>}
                          </div>
                        </div>
                        <CardContent className="flex flex-col flex-auto items-center justify-center">
                          <div className="w-52 mb-20 imfw">
                            { member.profile_pic ?
                              <img
                                className="w-full block rounded"
                                src={member.profile_pic}
                                alt={member.first_name+' '+member.last_name}
                              /> :
                              <img
                                className="w-full block rounded"
                                src="assets/images/logos/user.png"
                                alt={member.first_name+' '+member.last_name}
                              />
                            }
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
                        </CardContent>
                        {/*{!member.id_card_path && <CardActions className="justify-center pb-24">
                                                  <Button
                                                    onClick={(event) => {event.stopPropagation();generateIdCard(member);}}
                                                    className="justify-start px-32"
                                                    color="primary"
                                                    variant="outlined"
                                                  >
                                                    Generate Id Card
                                                  </Button>
                                                </CardActions>}*/}
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
                  No staff found!
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

export default withReducer('staffApp', reducer)(StaffList);
