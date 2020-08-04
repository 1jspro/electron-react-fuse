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
import { useDispatch } from 'react-redux';
import { Box } from '@mui/system';
import TableHead from '@mui/material/TableHead';
import { showMessage } from 'app/store/fuse/messageSlice';

const rows = [
  {
    id: 'name',
    align: 'left',
    disablePadding: false,
    label: 'Name',
    sort: true,
  },

  {
    id: 'paid',
    align: 'left',
    disablePadding: false,
    label: 'Paid',
    sort: true,
  },

  {
    id: 'pending_amount',
    align: 'left',
    disablePadding: false,
    label: 'Pending Amount',
    sort: true,
  },
  
  {
    id: 'paid_amount',
    align: 'left',
    disablePadding: false,
    label: 'Paid Amount',
    sort: true,
  },

  {
    id: 'action',
    align: 'left',
    disablePadding: false,
    label: 'Action',
    sort: false,
  },
];

function ListTableHead(props) {
  const [selectedInvoicesMenu, setSelectedInvoicesMenu] = useState(null);
  const [open, setOpen] = useState(false);

  const dispatch = useDispatch();

  const createSortHandler = (property) => (event) => {
    props.onRequestSort(event, property);
  };

  function openSelectedInvoicesMenu(event) {
    setSelectedInvoicesMenu(event.currentTarget);
  }

  function closeSelectedInvoicesMenu() {
    setSelectedInvoicesMenu(null);
  }

  function handleRemove() {

      setOpen(true);
  }

  const handleClose = () => {
    setOpen(false);
  };


  return (
    <TableHead>
      <TableRow className="">
        {rows.map((row) => {
          return (
            <TableCell
              className="p-4 md:p-16 text-blue-800 font-normal"
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
