import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Tooltip from '@mui/material/Tooltip';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import TableHead from '@mui/material/TableHead';

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
    label: 'Name',
    sort: true,
  },
  {
    id: 'value',
    align: 'left',
    disablePadding: false,
    label: 'Value',
    sort: true,
  },

  /* {
    id: 'category',
    align: 'left',
    disablePadding: false,
    label: 'Category',
    sort: true,
  },

  {
    id: 'type',
    align: 'left',
    disablePadding: false,
    label: 'Type of Assets',
    sort: true,
  },
  
  {
    id: 'brand',
    align: 'left',
    disablePadding: false,
    label: 'Brand',
    sort: true,
  },

  {
    id: 'serial_no',
    align: 'left',
    disablePadding: false,
    label: 'Serial Number',
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
  }, */
];

function ListTableHead(props) {
  const { selectedAssetIds } = props;
  const numSelected = selectedAssetIds.length;

  const [selectedAssetsMenu, setSelectedAssetsMenu] = useState(null);
  const [open, setOpen] = useState(false);

  const dispatch = useDispatch();

  const createSortHandler = (property) => (event) => {
    props.onRequestSort(event, property);
  };

  function openSelectedAssetsMenu(event) {
    setSelectedAssetsMenu(event.currentTarget);
  }

  function closeSelectedAssetsMenu() {
    setSelectedAssetsMenu(null);
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
