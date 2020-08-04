import Checkbox from '@mui/material/Checkbox';
import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Tooltip from '@mui/material/Tooltip';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box } from '@mui/system';
import TableHead from '@mui/material/TableHead';
import { showMessage } from 'app/store/fuse/messageSlice';
import ConfirmationDialogRaw from './ConfirmationDialogRaw';

let rows = [
  {
    id: 'id',
    align: 'left',
    disablePadding: false,
    label: '#',
    sort: true,
  },
  {
    id: 'name',
    align: 'left',
    disablePadding: false,
    label: 'Name',
    sort: true,
  },
  {
    id: 'start_date',
    align: 'left',
    disablePadding: false,
    label: 'Date',
    sort: true,
  },
  {
    id: 'is_active',
    align: 'right',
    disablePadding: false,
    label: 'Active',
    sort: true,
  },

  {
    id: 'action',
    align: 'right',
    disablePadding: false,
    label: 'Action',
    sort: false,
  }
];

function ListTableHead(props) {
  const { selectedPositionIds } = props;
  const numSelected = selectedPositionIds.length;
  const user = useSelector(({ auth }) => auth.user);
  const permissions = (user && user.data && user.data.permissions) ? user.data.permissions : [];

  if(JSON.parse(localStorage.getItem('sessionDatas')).roles === 'member-admin' || JSON.parse(localStorage.getItem('sessionDatas')).roles === 'member'){
    rows = [
      {
        id: 'id',
        align: 'left',
        disablePadding: false,
        label: '#',
        sort: true,
      },
      {
        id: 'name',
        align: 'left',
        disablePadding: false,
        label: 'Name',
        sort: true,
      },
      {
        id: 'id',
        align: 'right',
        disablePadding: false,
        label: 'Cast Vote',
        sort: false,
      }
    ];
  }

  rows = rows.filter((r) => {
    if (r.id != 'action' || (r.id == 'action' && permissions.indexOf("elections:edit") > -1 || permissions.indexOf("elections:delete") > -1)) {
      return r;
    }
  });

  const [selectedElectionsMenu, setSelectedElectionsMenu] = useState(null);
  const [open, setOpen] = useState(false);

  const dispatch = useDispatch();

  const createSortHandler = (property) => (event) => {
    props.onRequestSort(event, property);
  };

  function openSelectedElectionsMenu(event) {
    setSelectedElectionsMenu(event.currentTarget);
  }

  function closeSelectedElectionsMenu() {
    setSelectedElectionsMenu(null);
  }

  function handleRemove() {

      setOpen(true);
  }

  const handleClose = () => {
    setOpen(false);
  };


  return (
    <TableHead>
      <TableRow className="h-48 sm:h-64">
        {rows.map((row) => {
          return (
            <TableCell
              className="p-4 md:p-16"
              key={row.id}
              align={row.align}
              padding={row.disablePadding ? 'none' : 'normal'}
              sortDirection={props.order.id === row.id ? props.order.direction : false}
            >
              {row.sort ? (
                <Tooltip
                  title="Sort"
                  placement={row.align === 'right' ? 'bottom-end' : 'bottom-start'}
                  enterDelay={300}
                >
                  <TableSortLabel
                    active={props.order.id === row.id}
                    direction={props.order.direction}
                    onClick={createSortHandler(row.id)}
                    className="font-semibold"
                  >
                    {row.label}

                  </TableSortLabel>
                </Tooltip>
              ) : (
                <label className="font-semibold" >
                    {row.label}
                </label>
              )}
            </TableCell>
          );
        }, this)}
      </TableRow>
    </TableHead>
  );
}

export default ListTableHead;
