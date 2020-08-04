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
import axios from "axios";
import useCardDownload from "./useCardDownload";
let rows = [
  /* {
    id: 'id',
    align: 'left',
    disablePadding: false,
    label: '',
    sort: false,
  }, */
  {
    id: 'id',
    align: 'left',
    disablePadding: false,
    label: '#',
    sort: true,
  },
  {
    id: 'id_card_number',
    align: 'left',
    disablePadding: false,
    label: 'ID',
    sort: true,
  },
  {
    id: 'first_name',
    align: 'left',
    disablePadding: false,
    label: 'Name',
    sort: true,
  },

  {
    id: 'valid_from',
    align: 'left',
    disablePadding: false,
    label: 'Valid From',
    sort: true,
  },

  {
    id: 'valid_to',
    align: 'left',
    disablePadding: false,
    label: 'Valid Upto',
    sort: true,
  },
  /* {
    id: 'download_count',
    align: 'left',
    disablePadding: false,
    label: 'Download Counter',
    sort: true,
  }, */

  {
    id: 'action',
    align: 'right',
    disablePadding: false,
    label: 'Action',
    sort: false,
  }
];

function ListTableHead(props) {
  const { selectedIdCardIds } = props;
  const { download } = useCardDownload();
  const numSelected = selectedIdCardIds.length;
  const user = useSelector(({ auth }) => auth.user);
  const permissions = (user && user.data && user.data.permissions) ? user.data.permissions : [];

  rows = rows.filter((r) => {
    if (r.id != 'action' || (r.id == 'action' && permissions.indexOf("id-cards:edit") > -1 || permissions.indexOf("id-cards:delete") > -1)) {
      return r;
    }
  });

  const [selectedIdCardsMenu, setSelectedIdCardsMenu] = useState(null);
  const [open, setOpen] = useState(false);

  const dispatch = useDispatch();

  const createSortHandler = (property) => (event) => {
    props.onRequestSort(event, property);
  };

  function openSelectedIdCardsMenu(event) {
    setSelectedIdCardsMenu(event.currentTarget);
  }

  function closeSelectedIdCardsMenu() {
    setSelectedIdCardsMenu(null);
  }

  async function MultiDownload() {
    /* setLoading(true); */
    try {
      const { data: response } = await axios.post("multiLoadIdCard", {
        card_id: selectedIdCardIds.join(','),
      })
      /* handleSearch(searchText) */
      response.data.map(async (n, k) => {
        await download(n.renderedFront, '', k);
      })
      /* download(response.data.renderedFront, item); */
      setTimeout(() => {
        /* setLoading(false); */
      }, 4000);
    } catch (error) {
      /* setLoading(false); */
      console.log("ERROR", error);
    }
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
        <TableCell padding="none" className="w-40 md:w-64 text-center z-99">
          <ConfirmationDialogRaw
            id="deleteDialog"
            keepMounted
            open={open}
            onClose={handleClose}
            value={selectedIdCardIds.join(",")}
          />
          {<Checkbox
            indeterminate={numSelected > 0 && numSelected < props.rowCount}
            checked={props.rowCount !== 0 && numSelected === props.rowCount}
            onChange={props.onSelectAllClick}
          />}

        </TableCell>
        {rows.map((row, ii) => {
          return (
            <TableCell
              className="p-4 md:p-16"
              key={row.id}
              align={row.align}
              padding={row.disablePadding ? 'none' : 'normal'}
              sortDirection={props.order.id === row.id ? props.order.direction : false}
            >
              {rows.length === (ii + 1) && numSelected > 0 ? (
                <Box
                  className="flex items-center justify-center absolute w-64 top-0 ltr:left-0 rtl:right-0 mx-56 h-64 z-10 border-b-1"
                  sx={{
                    background: (theme) => theme.palette.background.paper,
                  }}
                >
                  <IconButton
                    aria-owns={selectedIdCardsMenu ? 'selectedIdCardsMenu' : null}
                    aria-haspopup="true"
                    onClick={openSelectedIdCardsMenu}
                    size="large"
                  >
                    <Icon>more_horiz</Icon>
                  </IconButton>
                  <Menu
                    id="selectedIdCardsMenu"
                    anchorEl={selectedIdCardsMenu}
                    open={Boolean(selectedIdCardsMenu)}
                    onClose={closeSelectedIdCardsMenu}
                  >
                    <MenuList>
                      <MenuItem
                        onClick={MultiDownload}
                      >
                        <ListItemIcon className="min-w-40">
                          <Icon>get_app</Icon>
                        </ListItemIcon>
                        <ListItemText primary="Download" />
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </Box>
              ) : ''}
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
