import Button from '@mui/material/Button';
import Icon from '@mui/material/Icon';
import Input from '@mui/material/Input';
import Paper from '@mui/material/Paper';
import { ThemeProvider } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { selectMainTheme } from 'app/store/fuse/settingsSlice';
import { setGroupListSearchText, getAllGroup } from '../store/GroupDataListSlice';
import exportFromJSON from 'export-from-json';

function ListHeader(props) {
  const dispatch = useDispatch();
  const searchText = useSelector(({ GroupListApp }) => GroupListApp.groupListSlice.searchText);
  const mainTheme = useSelector(selectMainTheme);
  const user = useSelector(({ auth }) => auth.user);
  const permissions = (user && user.data && user.data.permissions) ? user.data.permissions : [];

  function mapObj(p) {
    return {
      "Name": p.name,
      "CreatedAt": p.created_at
    };
  };


  function handleExcelExport() {
    dispatch(getAllGroup()).then((action) => {
      const listItems = action.payload.map(function (p) {
        return mapObj(p);
      });
      exportFromJSON({ data: listItems, fileName: 'Branch Data', exportType: 'xls' });
    });
  }

  function handleCSVExport() {
    dispatch(getAllGroup()).then((action) => {
      const listItems = action.payload.map(function (p) {
        return mapObj(p);
      });
      exportFromJSON({ data: listItems, fileName: 'Branch Data', exportType: 'csv' });
    });
  }


  return (
    <div className="flex flex-1 w-full items-center justify-between">
      <div className="flex items-center">
        <Typography
          component={motion.span}
          initial={{ x: -20 }}
          animate={{ x: 0, transition: { delay: 0.2 } }}
          delay={300}
          className="hidden sm:flex text-16 md:text-24 mx-12 font-semibold"
        >
          Group
        </Typography>
      </div>

      <div className="flex flex-1 items-center justify-center px-12">
        <ThemeProvider theme={mainTheme}>
          <Paper
            component={motion.div}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
            className="flex items-center w-full max-w-512 px-8 py-4 rounded-16 shadow"
          >
            <Icon color="action">search</Icon>

            <Input
              placeholder="type text"
              className="flex flex-1 mx-8"
              disableUnderline
              fullWidth
              value={searchText}
              inputProps={{
                'aria-label': 'Search',
              }}
              onChange={(ev) => dispatch(setGroupListSearchText(ev))}
            />
          </Paper>
        </ThemeProvider>
      </div>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0, transition: { delay: 0.2 } }}
      >
        {permissions.indexOf("groups:create") > -1 && <Button
          component={Link}
          to="/apps/group/new"
          className="whitespace-nowrap"
          variant="contained"
          color="secondary"
        >
          <span className="hidden sm:flex">Add Group</span>
          <span className="flex sm:hidden">New</span>
        </Button>}
      </motion.div>
    </div>
  );
}

export default ListHeader;
