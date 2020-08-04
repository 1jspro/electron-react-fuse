import Button from '@mui/material/Button';
import FuseScrollbars from '@fuse/core/FuseScrollbars';
import _ from '@lodash';
import Checkbox from '@mui/material/Checkbox';
import Icon from '@mui/material/Icon';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { showMessage } from 'app/store/fuse/messageSlice';
import { useDispatch, useSelector } from 'react-redux';
import withRouter from '@fuse/core/withRouter';
import FuseLoading from '@fuse/core/FuseLoading';
import { saveMirrorUser } from 'app/auth/store/userSlice';
import { getEvents, selectEvents } from '../store/eventsSlice';
import { getEventList, AttendingEvent } from "../store/eventslice";
import ListTableHead from './ListTableHead';
import ConfirmationDialogRaw from './ConfirmationDialogRaw';

function ListTable(props) {
  const dispatch = useDispatch();
  const events = useSelector(selectEvents);
  const searchText = useSelector(({ eventsApp }) => eventsApp.events.searchText);
  const user = useSelector(({ auth }) => auth.user);
  const permissions = (user && user.data && user.data.permissions) ? user.data.permissions : [];

  const [open, setOpen] = useState(false);
  const [rowItem, setRowitem] = useState('');
  const [loading, setLoading] = useState(true);
  const [Role, setRole] = useState('');
  const [Encryption_id, setEncryption_id] = useState('');
  const [selected, setSelected] = useState([]);
  const [data, setData] = useState(events);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [oldSearchText, setOldSearchText] = useState('');
  const [order, setOrder] = useState({
    direction: 'desc',
    id: 'created_at',
  });

  useEffect(() => {
    dispatch(getEvents({ page, rowsPerPage, searchText })).then(() => setLoading(false));
    setRole(JSON.parse(localStorage.getItem('sessionDatas')).roles)
    setEncryption_id(JSON.parse(localStorage.getItem('sessionDatas')).encryption_id)
    /* dispatch(getEventList('167619645427nmKH'))
    dispatch(AttendingEvent({ encryption_id: '167619645427nmKH', event_id: '1' })) */
  }, [dispatch]);

  function handleSearch(search) {
    dispatch(getEvents({ page, rowsPerPage, searchText: search })).then((action) => {
      setData(action.payload);
      // if (oldSearchText != searchText) {
      //   setSearchLoading(false);
      // }
    });
  }


  useEffect(() => {
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
      if (Role === 'member-admin' || Role === 'member') {
        dispatch(getEventList(Encryption_id)).then((action) => {
          setData(action.payload)
        });
      } else {
        setData(events);
      }
    }
  }, [events, searchText]);

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
    props.navigate(`/apps/events/${item.encryption_id}`);
  }

  function handleRemove(item) {
    setRowitem(item);

    setTimeout(() => {
      setOpen(true);
    }, 1)
  }
  function handleEdit(item) {
    props.navigate(`/apps/events/${item.encryption_id}`);
  }
  function handleDetails(item) {
    props.navigate(`/apps/events/details/${item.encryption_id}`);
  }

  function AttendEvent(item) {
    dispatch(AttendingEvent({ encryption_id: Encryption_id, event_id: item.id })).then((action) => {

      dispatch(showMessage({ message: action.payload.message }));
      handleSearch(searchText)
    });
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

  function handleChangePage(event, value) {
    setLoading(true);
    dispatch(getEvents({ page: value, rowsPerPage, searchText })).then((action) => {
      setPage(value);
      setData(action.payload);
      setLoading(false);
    });
  }

  function handleChangeRowsPerPage(event) {
    setLoading(true);
    dispatch(getEvents({ page: 0, rowsPerPage: event.target.value, searchText })).then((action) => {
      setPage(0);
      setRowsPerPage(event.target.value);
      setData(action.payload);
      setLoading(false);
    });
  }


  const handleClose = () => {
    setOpen(false);
  };
  function handleAttend(item) {
    props.navigate(`/apps/events/vote/${item.encryption_id}`);
  }

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
      <FuseScrollbars className="tablewraper overflow-x-auto">
        <Table stickyHeader className="min-w-xl" aria-labelledby="tableTitle">
          <ListTableHead
            selectedPositionIds={selected}
            order={order}
            onSelectAllClick={handleSelectAllClick}
            onRequestSort={handleRequestSort}
            rowCount={data.length}
            onMenuItemClick={handleDeselect}
          />


          <TableBody>
            {data && _.orderBy(
              data,
              [
                (o) => {
                  switch (order.id) {
                    case 'full_name': {
                      return o.full_name;
                    }
                    default: {
                      return o[order.id];
                    }
                  }
                },
              ],
              [order.direction]
            )
              .map((n, k) => {
                const isSelected = selected.indexOf(n.id) !== -1;
                return (

                  Role === 'member-admin' || Role === 'member' ? <TableRow
                    className="h-32 cursor-pointer"
                    hover
                    role="checkbox"
                    aria-checked={isSelected}
                    tabIndex={-1}
                    key={n.id}
                    selected={isSelected}
                    onClick={(event) => handleClick(n)}
                  >
                    <TableCell className="p-4 md:p-16 w10" component="th" scope="row">
                      {(k + 1) + (page * rowsPerPage)}
                    </TableCell>

                    <TableCell className="p-4 md:p-16" component="th" scope="row">
                      {n.event_name}
                    </TableCell>
                    <TableCell className="p-4 md:p-16" component="th" scope="row" align="right">
                      <Button

                        /* to={`/apps/elections/vote/${n.encryption_id}`} */
                        className="whitespace-nowrap"
                        variant="contained"
                        color="secondary"
                        onClick={(event) => { event.stopPropagation(); AttendEvent(n); }}
                      >
                        Attend
                      </Button>
                    </TableCell>

                  </TableRow> :
                    <TableRow
                      className="h-32 cursor-pointer"
                      hover
                      role="checkbox"
                      aria-checked={isSelected}
                      tabIndex={-1}
                      key={n.id}
                      selected={isSelected}
                      onClick={(event) => handleClick(n)}
                    >
                      {/*<TableCell className="w-40 md:w-64 text-center" padding="none">
                                          <Checkbox
                                            checked={isSelected}
                                            onClick={(event) => event.stopPropagation()}
                                            onChange={(event) => handleCheck(event, n.id)}
                                          />
                                        </TableCell>*/}

                      <TableCell className="p-4 md:p-16 w10" component="th" scope="row">
                        {(k + 1) + (page * rowsPerPage)}
                      </TableCell>

                      <TableCell className="p-4 md:p-16" component="th" scope="row">
                        {n.event_name}
                      </TableCell>
                      <TableCell className="p-4 md:p-16" component="th" scope="row">
                        {n.venue}
                      </TableCell>
                      <TableCell className="p-4 md:p-16" component="th" scope="row">
                        Start: <b>{n.start_date}</b><br />
                        End: <b>{n.end_date}</b>
                      </TableCell>
                      <TableCell className="p-4 md:p-16" component="th" scope="row">
                        {n.total_attendees}/{n.expected_attendees}
                      </TableCell>

                      <TableCell className="p-4 md:p-16" component="th" scope="row">
                        {(n.total_attendees === 0 || n.expected_attendees === 0) ? 0 :(n.total_attendees * 100)/n.expected_attendees}%
                      </TableCell>

                      <TableCell className="p-4 md:p-16" component="th" scope="row" align="right">
                        {n.is_active ? (
                          <Icon className="text-green text-20">check_circle</Icon>
                        ) : (
                          <Icon className="text-red text-20">remove_circle</Icon>
                        )}
                      </TableCell>

                      {(permissions.indexOf("events:edit") > -1 || permissions.indexOf("events:delete") > -1) &&
                        <TableCell className="p-4 md:p-16" component="th" scope="row" align="right">
                          {permissions.indexOf("events:read") > -1 && <Icon title="View Details" className="text-blue text-20 mx-8" onClick={(event) => { event.stopPropagation(); handleDetails(n); }}>visibility</Icon>}
                          {permissions.indexOf("events:edit") > -1 && <Icon title="Edit" className="text-black text-20 mr5" onClick={(event) => { event.stopPropagation(); handleEdit(n); }}>edit</Icon>}
                          {permissions.indexOf("events:delete") > -1 && <Icon title="Remove" className="text-red text-20" onClick={(event) => { event.stopPropagation(); handleRemove(n); }}>delete</Icon>}
                        </TableCell>}

                    </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </FuseScrollbars>

      <TablePagination
        className="shrink-0 border-t-1"
        component="div"
        count={data[0].totalRecords}
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

      <ConfirmationDialogRaw
        id="deleteDialog"
        keepMounted
        open={open}
        onClose={handleClose}
        value={rowItem}
      />

    </div>
  );
}

export default withRouter(ListTable);
