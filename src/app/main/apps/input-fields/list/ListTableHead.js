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
    id: 'tag',
    align: 'left',
    disablePadding: false,
    label: 'Tag',
    sort: true,
  },
  
  {
    id: 'type',
    align: 'left',
    disablePadding: false,
    label: 'Type',
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
  const { selectedFieldIds } = props;
  const numSelected = selectedFieldIds.length;

  const [selectedFieldsMenu, setSelectedFieldsMenu] = useState(null);
  const [open, setOpen] = useState(false);
  const user = useSelector(({ auth }) => auth.user);
  const permissions = (user && user.data && user.data.permissions) ? user.data.permissions : [];

  rows = rows.filter((r) => {
    if (r.id != 'action' || (r.id == 'action' && permissions.indexOf("input-fields:edit") > -1 || permissions.indexOf("input-fields:delete") > -1)) {
      return r;
    }
  });

  const dispatch = useDispatch();

  const createSortHandler = (property) => (event) => {
    props.onRequestSort(event, property);
  };

  function openSelectedFieldsMenu(event) {
    setSelectedFieldsMenu(event.currentTarget);
  }

  function closeSelectedFieldsMenu() {
    setSelectedFieldsMenu(null);
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
                    value={selectedFieldIds.join(",")}
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
                        aria-owns={selectedFieldsMenu ? 'selectedFieldsMenu' : null}
                        aria-haspopup="true"
                        onClick={openSelectedFieldsMenu}
                        size="large"
                      >
                        <Icon>more_horiz</Icon>
                      </IconButton>
                      <Menu
                        id="selectedFieldsMenu"
                        anchorEl={selectedFieldsMenu}
                        open={Boolean(selectedFieldsMenu)}
                        onClose={closeSelectedFieldsMenu}
                      >
                        <MenuList>
                          <MenuItem
                            onClick={() => {
                              handleRemove();
                              props.onMenuItemClick();
                              closeSelectedFieldsMenu();
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
