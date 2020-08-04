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
import { setExpendituresSearchText, selectExpenditures, getAllExpenditures } from '../store/expendituresSlice';
import exportFromJSON from 'export-from-json';

function ListHeader(props) {
  const dispatch = useDispatch();
  const searchText = useSelector(({ expendituresApp }) => expendituresApp.expenditures.searchText);
  const mainTheme = useSelector(selectMainTheme);
  const user = useSelector(({ auth }) => auth.user);
  const permissions = (user && user.data && user.data.permissions) ? user.data.permissions : [];

  function mapObj(p) {
    return {
      "Name": p.name,
      "Category": p.category_name,
      "Purpose": p.purpose,
      "Amount": p.amount,
      "Created At": p.created_date,
      "Status": p.is_active == '1' ? "Active" : "Inactive"
    };
  };


  function handleExcelExport() {
    dispatch(getAllExpenditures()).then((action) => {
      const listItems = action.payload.map(function (p) {
        return mapObj(p);
      });
      exportFromJSON({ data: listItems, fileName: 'Expenditures', exportType: 'xls' });
    });
  }

  function handleCSVExport() {
    dispatch(getAllExpenditures()).then((action) => {
      const listItems = action.payload.map(function (p) {
        return mapObj(p);
      });
      exportFromJSON({ data: listItems, fileName: 'Expenditures', exportType: 'csv' });
    });
  }


  return (
    <div className="flex flex-1 w-full items-center justify-between">
      <div className="flex items-center">
        {/*<Icon
                  component={motion.span}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1, transition: { delay: 0.2 } }}
                  className="text-24 md:text-32"
                >
                  dehaze
                </Icon>*/}
        <Typography
          component={motion.span}
          initial={{ x: -20 }}
          animate={{ x: 0, transition: { delay: 0.2 } }}
          delay={300}
          className="hidden sm:flex text-16 md:text-24 mx-12 font-semibold"
        >
          Expenditures
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
              onChange={(ev) => dispatch(setExpendituresSearchText(ev))}
            />
          </Paper>
        </ThemeProvider>
      </div>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0, transition: { delay: 0.2 } }}
      >
        {permissions.indexOf("expenditures:create") > -1 && <Button
          component={Link}
          to="/apps/expenditure/new"
          className="whitespace-nowrap"
          variant="contained"
          color="secondary"
        >
          <span className="hidden sm:flex">Add Expenditure</span>
          <span className="flex sm:hidden">New</span>
        </Button>}
        <Button
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
        </Button>
      </motion.div>
    </div>
  );
}

export default ListHeader;
