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
import ConfirmationDialogRaw from './ConfirmationDialogRaw';

const rows = [
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
    label: 'Title',
    sort: true,
  },

  {
    id: 'total_invoice_cost',
    align: 'left',
    disablePadding: false,
    label: 'Expected Payments',
    sort: true,
  },

  {
    id: 'invoice_total_cost',
    align: 'left',
    disablePadding: false,
    label: 'Amount',
    sort: true,
  },
  
  {
    id: 'percent_paid',
    align: 'right',
    disablePadding: false,
    label: 'Status',
    sort: true,
  },

  {
    id: 'action',
    align: 'right',
    disablePadding: false,
    label: 'Action',
    sort: false,
  },
];

function ListTableHead(props) {
  const { selectedInvoiceIds } = props;
  const numSelected = selectedInvoiceIds.length;

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
      <TableRow className="h-48 sm:h-64">
        {/*<TableCell padding="none" className="w-40 md:w-64 text-center z-99">
                  <ConfirmationDialogRaw
                    id="deleteDialog"
                    keepMounted
                    open={open}
                    onClose={handleClose}
                    value={selectedInvoiceIds.join(",")}
                  />
                  {<Checkbox
                              indeterminate={numSelected > 0 && numSelected < props.rowCount}
                              checked={props.rowCount !== 0 && numSelected === props.rowCount}
                              onChange={props.onSelectAllClick}
                            />}
                  {numSelected > 0 && (
                    <Box
                      className="flex items-center justify-center absolute w-64 top-0 ltr:left-0 rtl:right-0 mx-56 h-64 z-10 border-b-1"
                      sx={{
                        background: (theme) => theme.palette.background.paper,
                      }}
                    >
                      <IconButton
                        aria-owns={selectedInvoicesMenu ? 'selectedInvoicesMenu' : null}
                        aria-haspopup="true"
                        onClick={openSelectedInvoicesMenu}
                        size="large"
                      >
                        <Icon>more_horiz</Icon>
                      </IconButton>
                      <Menu
                        id="selectedInvoicesMenu"
                        anchorEl={selectedInvoicesMenu}
                        open={Boolean(selectedInvoicesMenu)}
                        onClose={closeSelectedInvoicesMenu}
                      >
                        <MenuList>
                          <MenuItem
                            onClick={() => {
                              handleRemove();
                              props.onMenuItemClick();
                              closeSelectedInvoicesMenu();
                            }}
                          >
                            <ListItemIcon className="min-w-40">
                              <Icon>delete</Icon>
                            </ListItemIcon>
                            <ListItemText primary="Remove" />
        
                            
        
                          </MenuItem>
                        </MenuList>
                      </Menu>
        
                    </Box>
        
        
                  )}
                </TableCell>*/}
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
