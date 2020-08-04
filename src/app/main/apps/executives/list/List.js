import { styled, useTheme } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Icon from '@mui/material/Icon';
import ManRoundedIcon from '@mui/icons-material/ManRounded';
import FiberManualRecordRoundedIcon from '@mui/icons-material/FiberManualRecordRounded';
import WomanRoundedIcon from '@mui/icons-material/WomanRounded';
import WcRoundedIcon from '@mui/icons-material/WcRounded';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import withReducer from 'app/store/withReducer';
import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import FuseLoading from '@fuse/core/FuseLoading';
import { getExecutives, selectExecutives } from '../store/executivesSlice';
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

function Executives(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const executives = useSelector(selectExecutives);
  const user = useSelector(({ auth }) => auth.user);
  const permissions = user && user.data && user.data.permissions ? user.data.permissions : [];

  const theme = useTheme();
  const [filteredData, setFilteredData] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [open, setOpen] = useState(false);
  const [openImport, setOpenImport] = useState(false);
  const [openExport, setOpenExport] = useState(false);
  const [rowItem, setRowitem] = useState({});
  const [searchLoading, setSearchLoading] = useState(false);
  const [oldSearchText, setOldSearchText] = useState('');
  const [loading, setLoading] = useState(true);
  const [totalPage, setTotalpage] = useState(1);
  const [selectedRow, setSelectedRow] = useState([]);
  const [token, setToken] = useState(window.localStorage.getItem('jwt_access_token'));
  const [selectedExecutive, setSelectedExecutive] = useState(null);

  useEffect(() => {
    dispatch(getExecutives({ searchText })).then(() => setLoading(false));
  }, [dispatch]);

  function handleSearch(search) {
    dispatch(getExecutives({ searchText: search })).then((action) => {
      serializefilteredData(action.payload);
      setLoading(false);
      // if (oldSearchText != searchText) {
      //   setSearchLoading(false);
      // }
    });
  }

  /* useEffect(() => {
    function getFilteredArray() {
      if (searchText.length === 0) {
        return executives;
      }

      return _.filter(executives, (item) => {
        return (item.first_name+item.last_name).toLowerCase().includes(searchText.toLowerCase());
      });
    }

    if (executives) {
      setFilteredData(getFilteredArray());
    }
  }, [executives, searchText]); */

  useEffect(() => {
    // const getData = setTimeout(() => {
    //   axios
    //   .get(`https://api.postalpincode.in/pincode/${pinCode}`)
    //   .then((response) => {
    //     console.log(response.data[0]);
    //   });
    // }, 2000)

    // return () => clearTimeout(getData)
    let getData;
    if (searchText.length > 0) {
      if (oldSearchText !== searchText) {
        getData = setTimeout(() => handleSearch(searchText), 1000);
      }
      setOldSearchText(searchText);

      // if (searchText.length !== 0) {
      //   setFilteredData(
      //     _.filter(producers, (item) => item.name.toLowerCase().includes(searchText.toLowerCase()))
      //   );
      //   setPage(0);
    } else if (oldSearchText && searchText.length === 0) {
      handleSearch('');
      setOldSearchText('');
    } else {
      serializefilteredData();
    }

    return () => clearTimeout(getData);
  }, [executives, searchText]);

  function serializefilteredData(data = executives) {
    const _executives = data.map((i) => ({
      ...i,
      femaleCount: i.members.filter((x) => x.gender?.toLowerCase() === 'female').length,
      maleCount: i.members.filter((x) => x.gender?.toLowerCase() === 'male').length,
    }));
    setFilteredData(_executives);
  }

  function handleSearchText(event) {
    setSearchText(event.target.value);
  }

  function handleDetails(item) {
    navigate(`/apps/members/details/${item.encryption_id}`);
  }

  function handlePreview(item) {
    if (item.id_card_path) {
      window.open(item.id_card_path, '_blank', 'noopener,noreferrer');
    }
  }

  function handleSelectExecutive(executive) {
    setSelectedExecutive(executive);
  }

  return (
    <Root className="flex flex-col flex-auto shrink-0 w-full">
      <div className="header relative overflow-hidden flex shrink-0 items-center justify-center h-200 sm:h-200">
        <div className="flex flex-col max-w-2xl mx-auto w-full p-24 sm:p-32">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0 } }}>
            <Typography color="inherit" className="text-24 sm:text-44 font-bold tracking-tight">
              Executives
            </Typography>
          </motion.div>
        </div>
        <Icon className="header-icon">person</Icon>
      </div>
      <div className="flex flex-col flex-1 max-w-2xl w-full mx-auto px-8 sm:px-16 py-24">
        <div className="flex flex-col shrink-0 sm:flex-row items-center justify-between py-24">
          <TextField
            label="Search for a member"
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
            {/* <Button
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
                        </Button> */}
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

          return loading ? (
            <FuseLoading />
          ) : (
            filteredData &&
              (filteredData.length > 0 ? (
                <div className="boxLayoutWrap">
                  <motion.div
                    className="flex flex-wrap py-24"
                    variants={container}
                    initial="hidden"
                    animate="show"
                  >
                    <div className="w-full pb-24 sm:p-16">
                      <div className="flex flex-wrap">
                        {selectedExecutive ? (
                          <>
                            <Box className="w-full flex items-center">
                              <IconButton
                                sx={{ mr: 2 }}
                                onClick={() => handleSelectExecutive(null)}
                              >
                                <ArrowBackIcon />
                              </IconButton>
                              <Typography color="textSecondary" variant="h5">
                                {selectedExecutive.position} ({selectedExecutive.members.length})
                              </Typography>
                            </Box>
                            {selectedExecutive.members &&
                              selectedExecutive.members.length > 0 &&
                              selectedExecutive.members.map((member, mk) => {
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
                                          <Icon
                                            title="View Details"
                                            className="text-blue text-20 mx-8"
                                            onClick={(event) => {
                                              event.stopPropagation();
                                              handleDetails(member);
                                            }}
                                          >
                                            visibility
                                          </Icon>
                                        </div>
                                      </div>
                                      <CardContent className="flex flex-col flex-auto items-center justify-center">
                                        <div className="w-52 mb-20 imfw">
                                          {member.profile_pic ? (
                                            <img
                                              className="w-full block rounded"
                                              src={member.profile_pic}
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
                                        <Typography className="text-center text-12 mt-8 font-medium">
                                          {member.level_name} : {member.level_data_name}
                                        </Typography>
                                      </CardContent>
                                      {/* {!member.id_card_path && <CardActions className="justify-center pb-24">
                                                      <Button
                                                        onClick={(event) => {event.stopPropagation();generateIdCard(member);}}
                                                        className="justify-start px-32"
                                                        color="primary"
                                                        variant="outlined"
                                                      >
                                                        Generate Id Card
                                                      </Button>
                                                    </CardActions>} */}
                                    </Card>
                                  </motion.div>
                                );
                              })}
                          </>
                        ) : (
                          <>
                            {filteredData.map((executive, k) => {
                              return (
                                <motion.div
                                  key={k}
                                  variants={item}
                                  className="w-full pb-24 sm:w-1/2 lg:w-1/3 sm:p-16"
                                >
                                  <Card className="flex flex-col h-256 shadow">
                                    <button
                                      className="flex shrink-0 items-center justify-between px-24 h-64 pointerCurser"
                                      style={{
                                        background: '#fff',
                                        color: '#000',
                                      }}
                                      onClick={() => handleSelectExecutive(executive)}
                                      type="button"
                                    >
                                      <Typography
                                        className="font-bold truncate"
                                        color="inherit"
                                        variant="subtitle1"
                                      >
                                        {executive.position}
                                      </Typography>
                                      <div className="flex items-center justify-center opacity-75">
                                        <Icon
                                          title="View Details"
                                          className="text-blue text-20 mx-8"
                                        >
                                          visibility
                                        </Icon>
                                      </div>
                                    </button>
                                    <CardContent className="flex flex-col flex-auto justify-center ">
                                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                                        <ManRoundedIcon sx={{ fontSize: 25, mr: 1 }} />
                                        <Typography sx={{ width: 50 }} variant="subtitle1">
                                          Male
                                        </Typography>
                                        <Box sx={{ mx: 1 }}>
                                          <FiberManualRecordRoundedIcon sx={{ fontSize: 4 }} />
                                        </Box>
                                        <Typography variant="subtitle1">
                                          <b>{executive.maleCount}</b>
                                        </Typography>
                                      </Box>
                                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                                        <WomanRoundedIcon sx={{ fontSize: 25, mr: 1 }} />
                                        <Typography sx={{ width: 50 }} variant="subtitle1">
                                          Female
                                        </Typography>
                                        <Box sx={{ mx: 1 }}>
                                          <FiberManualRecordRoundedIcon sx={{ fontSize: 4 }} />
                                        </Box>
                                        <Typography variant="subtitle1">
                                          <b>{executive.femaleCount}</b>
                                        </Typography>
                                      </Box>
                                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <WcRoundedIcon sx={{ fontSize: 25, mr: 1 }} />
                                        <Typography sx={{ width: 50 }} variant="subtitle1">
                                          <b>Total</b>
                                        </Typography>
                                        <Box sx={{ mx: 1 }}>
                                          <FiberManualRecordRoundedIcon sx={{ fontSize: 4 }} />
                                        </Box>
                                        <Typography variant="subtitle1">
                                          <b>{executive.members.length}</b>
                                        </Typography>
                                      </Box>
                                    </CardContent>
                                  </Card>
                                </motion.div>
                              );
                            })}
                          </>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </div>
              ) : (
                <div className="flex flex-1 items-center justify-center">
                  <Typography color="textSecondary" className="text-24 my-24">
                    No members found!
                  </Typography>
                </div>
              ))
          );
        }, [filteredData, theme.palette, selectedExecutive])}
      </div>
    </Root>
  );
}

export default withReducer('executivesApp', reducer)(Executives);
