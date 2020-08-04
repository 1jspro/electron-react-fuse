import FuseScrollbars from '@fuse/core/FuseScrollbars';
import _ from '@lodash';
import Icon from '@mui/material/Icon';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import withRouter from '@fuse/core/withRouter';
import FuseLoading from '@fuse/core/FuseLoading';
import ListTableHead from './ListTableHead';
import { getDynamicFields } from '../store/summarySlice';
import ReactApexChart from 'react-apexcharts';
import { useNavigate } from 'react-router-dom';
function ListTable(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const searchText = useSelector(({ dynamicFieldsSummary }) => dynamicFieldsSummary.summary.searchText);
  const user = useSelector(({ auth }) => auth.user);
  const permissions = (user && user.data && user.data.permissions) ? user.data.permissions : [];

  const [PieChart, setPieChart] = useState({
    options: {},
    series: [],
    chart_type: "bar",
    chart_height: 200
  });

  const [open, setOpen] = useState(false);
  const [rowItem, setRowitem] = useState('');
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState([]);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);

  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [oldSearchText, setOldSearchText] = useState('');
  const [order, setOrder] = useState({
    direction: 'desc',
    id: 'created_at',
  });
  var hashNumber = 0;
  const [hashNumberTotal, sethashNumberTotal] = useState(0);

  useEffect(() => {
    setLoading(true)
    dispatch(getDynamicFields({ record_id: props.dynamicId })).then((action) => {
      setData(action.payload);
      setPage(0);
      
      var hashNumberTotal_ = 0;
      action.payload.map((n, k) => {
        if (props.valueName === undefined || props.valueName === n.value) {
          n.users.map((vv, vk) => {
            hashNumberTotal_ = hashNumberTotal_ + 1
          })
        }
      })
      sethashNumberTotal(hashNumberTotal_);
      var ___ = { series: [], labels: [] };
      action.payload && action.payload.length > 0 && action.payload.map((UData, k) => {
        ___.series.push(UData.users.length)
        ___.labels.push((UData.value === null || UData.value === undefined || UData.value === '') ? UData.value + '' : UData.value)
      })
      setPieChart({
        chart_type: "donut",
        options: {
          labels: ___.labels,
          chart: {
            id: "dynamic_field_bar",
            events: {
              dataPointSelection: (event, chartContext, config) => {
                /* console.log(event, chartContext, config) */
                navigate(`/apps/dynamic_field_details/${props.dynamicId}/${props.dynamicName}/${___.labels[config.dataPointIndex]}`);
              }
            },
          }
        },
        series: ___.series
      })
      setLoading(false)
    });
  }, [dispatch,props.valueName]);

  /* function handleSearch(search) {
    dispatch(getDynamicFields({ record_id: props.dynamicId })).then((action) => {
      setData(action.payload);
    });
  } */

  useEffect(() => {
    var hashNumberTotal_ = 0;
    data.map((n, k) => {
      if (props.valueName === undefined || props.valueName === n.value) {
        n.users.map((vv, vk) => {
          var name = ''
          if (vk === 0) {
            name = vv.first_name || vv.last_name ? vv.first_name + ' ' + vv.last_name : '-'
          } else {
            if (vv[0] !== undefined) {
              name = vv[0].first_name || vv[0].last_name ? vv[0].first_name + ' ' + vv[0].last_name : '-'
            } else {
              name = vv.first_name || vv.last_name ? vv.first_name + ' ' + vv.last_name : '-'
            }
          }
          if (name.toLowerCase().includes(searchText.toLowerCase())) {
            hashNumberTotal_ = hashNumberTotal_ + 1
          }
        })
      }
    })
    setPage(0);
    sethashNumberTotal(hashNumberTotal_);
  }, [searchText])
  /* useEffect(() => {
    if (searchText.length > 0) {
      if (oldSearchText != searchText) {
        setPage(0);
        handleSearch(searchText);
      }
      setOldSearchText(searchText);
    } else if (oldSearchText && searchText.length == 0) {
      handleSearch('');
      setOldSearchText('');
    } else {
      setData(assets);
    }
  }, [searchText]); */

  function handleRequestSort(event, property) {
    const id = property;
    let direction = 'desc';

    if (order.id === property && order.direction === 'desc') {
      direction = 'asc';
    }

    setOrder({
      direction,
      id,
    });
  }

  function handleSelectAllClick(event) {
    if (event.target.checked) {
      setSelected(data.map((n) => n.id));
      return;
    }
    setSelected([]);
  }

  function handleDeselect() {
    setSelected([]);
  }

  function handleClick(item) {
    /* props.navigate(`/apps/asset/${item.encryption_id}`); */
  }

  function handleRemove(item) {
    setRowitem(item);

    setTimeout(() => {
      setOpen(true);
    }, 1)
  }


  function handleEdit(item) {
    props.navigate(`/apps/asset/${item.encryption_id}`);
  }

  function handleCheck(event, id) {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  }

  /* function handleChangePage(event, value) {
    setLoading(true);
    dispatch(getDynamicFields({ record_id: props.dynamicId })).then((action) => {
      setPage(value);
      setData(action.payload);
      setLoading(false);
    });
  } */
  function handleChangePage(event, value) {
    setLoading(true);
    setPage(value);
    setLoading(false);
  }

  function handleChangeRowsPerPage(event) {
    setPage(0);
    setRowsPerPage(event.target.value);
  }


  const handleClose = () => {
    setOpen(false);
  };

  if (loading) {
    return <FuseLoading />;
  }

  if (data.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.1 } }}
        className="flex flex-1 items-center justify-center h-full"
      >
        <Typography color="textSecondary" variant="h5">
          There are no data!
        </Typography>
      </motion.div>
    );
  }

  return (
    <div className="w-full flex flex-col">
      <FuseScrollbars className="tablewraper overflow-x-auto h-auto" style={{ height: 'auto' }}>

        {props.valueName == undefined && (data[0].input_tag === 'checkbox' || data[0].input_tag === 'radio' || data[0].input_tag === 'select') ?
          <div style={{ width: '80%', margin: '0 auto' }}>
            <ReactApexChart
              options={PieChart.options} series={PieChart.series} type={PieChart.chart_type}
            />
          </div> : ''}

        {props.valueName == undefined && (data[0].input_tag === 'checkbox' || data[0].input_tag === 'radio' || data[0].input_tag === 'select') ? '' :
          <>
            <Table stickyHeader className="min-w-xl" aria-labelledby="tableTitle">
              <ListTableHead
                selectedAssetIds={selected}
                order={order}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={data.length}
                onMenuItemClick={handleDeselect}
              />

              <TableBody>
                {data.map((n, k) => {
                  const isSelected = selected.indexOf(n.id) !== -1;
                  return (
                    <>{props.valueName === undefined || props.valueName === n.value ?
                      <>{n.users.map((vv, vk) => {
                        var name = ''

                        if (vk === 0) {
                          name = vv.first_name || vv.last_name ? vv.first_name + ' ' + vv.last_name : '-'
                        } else {
                          if (vv[0] !== undefined) {
                            name = vv[0].first_name || vv[0].last_name ? vv[0].first_name + ' ' + vv[0].last_name : '-'
                          } else {
                            name = vv.first_name || vv.last_name ? vv.first_name + ' ' + vv.last_name : '-'
                          }
                        }
                        var valid = false
                        if (name.toLowerCase().includes(searchText.toLowerCase())) {
                          valid = name.toLowerCase().includes(searchText.toLowerCase())
                          hashNumber = hashNumber + 1
                        }
                        var start = 0
                        var end = 0
                        if (page === 0) {
                          start = (page + 1)
                          end = ((page + 1) * rowsPerPage)
                        } else {
                          start = (page * rowsPerPage) + 1
                          end = ((page + 1) * rowsPerPage)
                        }
                        return (hashNumber >= start && hashNumber <= end && valid ? <TableRow
                          className="h-32 cursor-pointer"
                          hover
                          role="checkbox"
                          aria-checked={isSelected}
                          tabIndex={-1}
                          key={n.id}
                          selected={isSelected}
                          onClick={(event) => handleClick(n)}
                        >

                          <TableCell className="p-4 md:p-16" component="th" scope="row">
                            {hashNumber}
                          </TableCell>

                          <TableCell className="p-4 md:p-16" component="th" scope="row">
                            {name}
                          </TableCell>
                          <TableCell className="p-4 md:p-16" component="th" scope="row">
                            {n.value ? n.value : '-'}
                          </TableCell>
                        </TableRow> : '')
                      })}</> : ''}</>
                  );
                })}
              </TableBody>
            </Table>

            <TablePagination
              className="shrink-0 border-t-1"
              component="div"
              count={hashNumberTotal}
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
          </>
        }
      </FuseScrollbars>

    </div>
  );
}

export default withRouter(ListTable);
