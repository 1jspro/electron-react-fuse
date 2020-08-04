import DemoContent from '@fuse/core/DemoContent';
import { styled } from '@mui/material/styles';
import FusePageSimple from '@fuse/core/FusePageSimple';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Icon from '@mui/material/Icon';
import Radio from '@mui/material/Radio';
import { motion } from 'framer-motion';
import { useEffect, useRef, memo, useState } from 'react';
import { useForm, FormProvider, useFormContext, Controller } from 'react-hook-form';
import { getInvoices, selectInvoiceDetails, payInvoices } from '../store/invoiceDetailsSlice';
import { useDispatch, useSelector } from 'react-redux';
import Moment from 'moment';
import Button from '@mui/material/Button';
import FuseLoading from '@fuse/core/FuseLoading';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import ListTableHead from './ListTableHead';
import FuseScrollbars from '@fuse/core/FuseScrollbars';
import withReducer from 'app/store/withReducer';
import TextField from '@mui/material/TextField';
import reducer from '../store';
import { showMessage } from 'app/store/fuse/messageSlice';

const Root = styled(FusePageSimple)({
  '& .FusePageSimple-header': {},
  '& .FusePageSimple-toolbar': {},
  '& .FusePageSimple-content': {},
  '& .FusePageSimple-sidebarHeader': {},
  '& .FusePageSimple-sidebarContent': {},
});

function Details(props) {
  const dispatch = useDispatch();
  const theme = useTheme();
  const routeParams = useParams();
  const { invoiceId } = routeParams;

  const invoices = useSelector(selectInvoiceDetails);
  const searchText = useSelector(({ invoicesApp }) => invoicesApp.invoiceDetails.searchText);

  const methods = useForm({
    mode: 'onChange',
    defaultValues: {},
  });
  const { reset, watch, control, onChange, formState, setValue, getValues } = methods;
  const { isValid, dirtyFields, errors } = formState;
  const form = watch();

  const [packages, setPackages] = useState({});
  const [data, setData] = useState({});
  const [invoicePayments, setInvoicePayments] = useState({});
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [oldSearchText, setOldSearchText] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState({
    direction: 'desc',
    id: 'created_at',
  });

  useEffect(() => {
    dispatch(getInvoices({ page, rowsPerPage, searchText, invoiceId })).then(() => setLoading(false));
  }, [dispatch]);

  function handleSearch(search) {
    dispatch(getInvoices({ page, rowsPerPage, searchText: search, invoiceId })).then((action) => {
      setData(action.payload);
      let invoiceList = {};
      action.payload.map((e) => {
        invoiceList[e.id] = e.payable_amount;
      })
      setInvoicePayments(invoiceList);
      // if (oldSearchText != searchText) {
      //   setSearchLoading(false);
      // }
    });
  }



  function handlePaymentAmountChange(event, n) {
    let invoiceList = { ...invoicePayments };
    invoiceList[n.id] = event.target.value;
    setInvoicePayments(invoiceList);
  }

  function handlePayment(item) {

    if (invoicePayments[item.id]) {
      dispatch(payInvoices({ id: item.id, amount_to_pay: invoicePayments[item.id], amount_pending: item.amount_pending, amount_paid: item.amount_paid, payable_amount: item.payable_amount })).then((action) => {
        dispatch(showMessage({ message: action.payload.message }));
        if (action.payload && action.payload.status === true) {
          let invoiceList = { ...invoicePayments };
          invoiceList[item.id] = action.payload.payable_amount;
          setInvoicePayments(invoiceList);
        }
      });
    }
  }

  const container = {
    show: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

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
      setData(invoices);
      let invoiceList = {};
      invoices.map((e) => {
        invoiceList[e.id] = e.payable_amount;
      })
      setInvoicePayments(invoiceList);
    }
  }, [invoices, searchText]);

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


  function handleChangePage(event, value) {
    setLoading(true);
    dispatch(getInvoices({ page: value, rowsPerPage, searchText, invoiceId })).then((action) => {
      setPage(value);
      setData(action.payload);
      let invoiceList = {};
      action.payload.map((e) => {
        invoiceList[e.id] = e.payable_amount;
      })
      setInvoicePayments(invoiceList);
      setLoading(false);
    });
  }

  function handleChangeRowsPerPage(event) {
    setLoading(true);
    dispatch(getInvoices({ page: 0, rowsPerPage: event.target.value, searchText, invoiceId })).then((action) => {
      setPage(0);
      setRowsPerPage(event.target.value);
      setData(action.payload);
      let invoiceList = {};
      action.payload.map((e) => {
        invoiceList[e.id] = e.payable_amount;
      })
      setInvoicePayments(invoiceList);
      setLoading(false);
    });
  }

  if (loading) {
    return <FuseLoading />;
  }

  return (
    <Root
      header={
        <div className="flex flex-1 w-full items-center justify-between">
          <div className="flex flex-col items-start max-w-full min-w-0">
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1, transition: { delay: 0.3 } }}
            >
              <Typography
                className="flex items-center sm:mb-12"
                component={Link}
                role="button"
                to="/apps/invoices"
                color="inherit"
              >
                <Icon className="text-20">
                  {theme.direction === 'ltr' ? 'arrow_back' : 'arrow_forward'}
                </Icon>
                <span className="hidden sm:flex mx-4 font-medium">Invoices</span>
              </Typography>
            </motion.div>
            <div className="flex items-center max-w-full">

              <Typography
                component={motion.span}
                initial={{ x: -20 }}
                animate={{ x: 0, transition: { delay: 0.2 } }}
                delay={300}
                className="hidden sm:flex text-16 md:text-24 mx-12 font-semibold"
              >
                Invoice Detail
              </Typography>
            </div>
          </div>
        </div>
      }
      content={
        <div className="p-12 lg:ltr:pr-0 lg:rtl:pl-0">
          <motion.div className="flex flex-wrap" variants={container} initial="hidden" animate="show">



            <motion.div variants={item} className="widget flex sm:w-1/2 md:w-1/2   p-12 ">
              <Paper className="w-full p-16 rounded-20 shadow flex flex-col justify-between ptb-50">

                <div className="text-left">
                  <Typography className="text-18 text-blue-800 font-normal">
                    Details of New invoice 14-9
                  </Typography>

                  <div className="w-full mt-30 min-h-420 h-420">
                    <table className="table w-full table-bordered">
                      <thead>
                        <tr >
                          <td className="sm:w-1/2 md:w-1/2">Title:</td>
                          <th className="text-blue-800 font-semibold sm:w-1/2 md:w-1/2">
                            {data[0].invoice_name}
                          </th>
                        </tr>
                        <tr>
                          <td className="sm:w-1/2 md:w-1/2">
                            Total Cost:
                          </td>
                          <th className="text-blue-800 font-semibold sm:w-1/2 md:w-1/2">
                            ₵{data[0].total_invoice_cost}
                          </th>
                        </tr>
                      </thead>
                    </table>
                  </div>
                </div>
              </Paper>
            </motion.div>

            <motion.div variants={item} className="widget flex w-full  sm:w-1/1 md:w-1/1 p-12 ">
              <Paper className="w-full p-16 rounded-20 shadow flex flex-col justify-between ptb-50">

                <div className="text-left">
                  <Typography className="text-18 text-blue-800 font-normal">
                    Invoice Item of New invoice 14-9
                  </Typography>

                  <div className="w-full mt-30 min-h-420 h-420">
                    <table className="table w-full table-bordered">
                      <thead>
                        <tr >
                          <th className="text-blue-800 font-semibold sm:w-1/4 md:w-1/4">
                            Item name
                          </th>
                          <th className="text-blue-800 font-semibold sm:w-1/4 md:w-1/4">
                            Description
                          </th>
                          <th className="text-blue-800 font-semibold sm:w-1/4 md:w-1/4">
                            Quantity
                          </th>
                          <th className="text-blue-800 font-semibold sm:w-1/4 md:w-1/4">
                            Cost
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {data && data[0] && data[0]["invoice_item"] && data[0]["invoice_item"].length > 0 && _.orderBy(
                          data[0]["invoice_item"],
                          ['id'],
                          ['asc']
                        ).map((n, key) =>
                          <tr key={"k_" + key}>
                            <td>
                              {n.item}
                            </td>
                            <td>
                              {n.description}
                            </td>
                            <td>
                              {n.quantity}
                            </td>
                            <td>
                              ₵{n.cost}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </Paper>
            </motion.div>


            <motion.div variants={item} className="widget flex w-full  sm:w-1/1 md:w-1/1 p-12 ">
              <Paper className="w-full p-16 rounded-20 shadow flex flex-col justify-between ptb-50">

                <div className="text-left">
                  <Typography className="text-18 text-blue-800 font-normal">
                    Invoices
                  </Typography>

                  <div className="w-full mt-30 invoiceDetailsTable">
                    <div className="w-full flex flex-col">
                      <FuseScrollbars className="tablewraper overflow-x-auto">
                        <Table stickyHeader className="min-w-xl" aria-labelledby="tableTitle">
                          <ListTableHead
                            order={order}
                            onRequestSort={handleRequestSort}
                            rowCount={data.length}
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
                                return (
                                  <TableRow
                                    className="h-32 "
                                    hover
                                    role="checkbox"
                                    tabIndex={-1}
                                    key={k}
                                  >

                                    <TableCell className="p-4 md:p-16" component="th" scope="row">
                                      {n.first_name} {n.last_name}
                                    </TableCell>

                                    <TableCell className="p-4 md:p-16" component="th" scope="row">
                                      {!n.is_paid ? (
                                        <div className="inline text-12 font-semibold py-4 px-12 rounded-full truncate bg-red-700 text-white" >
                                          Pending
                                        </div>
                                      ) : (
                                        <div className="inline text-12 font-semibold py-4 px-12 rounded-full truncate bg-green-700 text-white" >
                                          Paid
                                        </div>
                                      )}
                                    </TableCell>

                                    <TableCell className="p-4 md:p-16" component="th" scope="row">
                                      ₵{n.amount_pending}
                                    </TableCell>

                                    <TableCell className="p-4 md:p-16" component="th" scope="row">
                                      ₵{n.amount_paid}
                                    </TableCell>

                                    <TableCell className="p-4 md:p-16" component="th" scope="row">
                                      {n.is_paid ? (
                                        <strong>Amount Paid</strong>
                                      ) : (
                                        <>
                                          <Controller
                                            name={"payment_" + n.id}
                                            control={control}
                                            render={({ field }) => (
                                              <TextField
                                                {...field}
                                                className="mt-8 mb-16 mx-3 sm:w-1/2 md:w-1/2"
                                                label="Amount"
                                                type="text"
                                                min="0"
                                                id={"payment_" + n.id}
                                                variant="outlined"
                                                value={invoicePayments[n.id]/* invoicePayments[n.id] ? invoicePayments[n.id] : n.payable_amount */}
                                                defaultValue={n.payable_amount}
                                                onChange={(evnt) => handlePaymentAmountChange(evnt, n)}
                                                fullWidth
                                                InputLabelProps={{
                                                  shrink: true,
                                                }}
                                              />
                                            )}
                                          />
                                          <Button
                                            className="whitespace-nowrap mx-4 mt-10"
                                            variant="contained"
                                            onClick={(event) => { event.stopPropagation(); handlePayment(n); }}
                                          >
                                            Pay
                                          </Button>
                                        </>
                                      )}
                                    </TableCell>

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
                    </div>
                  </div>
                </div>
              </Paper>
            </motion.div>
          </motion.div>
        </div>
      }
    />
  );
}

export default withReducer('invoicesApp', reducer)(Details);
