import Icon from '@mui/material/Icon';
import Input from '@mui/material/Input';
import Paper from '@mui/material/Paper';
import { ThemeProvider } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { selectMainTheme } from 'app/store/fuse/settingsSlice';
import { setFieldsSearchText } from '../store/summarySlice';
function ListHeader(props) {
  const dispatch = useDispatch();
  const searchText = useSelector(({ dynamicFieldsSummary }) => dynamicFieldsSummary.summary.searchText);;
  const mainTheme = useSelector(selectMainTheme); 
  const user = useSelector(({ auth }) => auth.user);
  const permissions = (user && user.data && user.data.permissions) ? user.data.permissions : [];


  function mapObj(p) {
    return {
      "Name": p.name,
      "Category": p.category_name,
      "Type": p.type,
      "Brand": p.brand,
      "Serial Number": p.serial_no,
      "Status": p.is_active == '1' ? "Active" : "Inactive"
    };
  };
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
          {props.dynamicName}
        </Typography>
      </div>

      <div className="flex flex-1 items-center justify-end px-12">
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
              onChange={(ev) => dispatch(setFieldsSearchText(ev))}
            />
          </Paper>
        </ThemeProvider>
      </div>
    </div>
  );
}

export default ListHeader;
