import { styled } from "@mui/material/styles";
import FusePageSimple from "@fuse/core/FusePageSimple";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getHomeData } from "./store/dashboardSlice";

const Root = styled(FusePageSimple)({
  "& .FusePageSimple-header": {},
  "& .FusePageSimple-toolbar": {},
  "& .FusePageSimple-content": {},
  "& .FusePageSimple-sidebarHeader": {},
  "& .FusePageSimple-sidebarContent": {},
});

function DashboardPage(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [ranges, setRanges] = useState({
    DT: "Today",
    DTM: "Tomorrow",
    DY: "Yesterday",
  });
  const [currentRange, setCurrentRange] = useState("DT");
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dispatch(getHomeData()).then((action) => {
      setData(action.payload);
      setLoading(false);
    });
  }, [dispatch]);

  function handleChangeRange(ev) {
    setCurrentRange(ev.target.value);
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

  function formatNumberAbbreviation(number) {
    const abbreviations = {
      K: 1000,
      M: 1000000,
      B: 1000000000,
      T: 1000000000000,
    };

    for (const key in abbreviations) {
      if (number >= abbreviations[key]) {
        const formattedNumber = (number / abbreviations[key]).toFixed(1);
        return formattedNumber + key;
      }
    }

    return number.toString();
  }

  return (
    <Root
      header={
        <Typography
          component={motion.span}
          initial={{ x: -20 }}
          animate={{ x: 0, transition: { delay: 0.2 } }}
          delay={300}
          className="p40 sm:flex text-16 md:text-24 mx-12 font-semibold"
        >
          Dashboard Page
        </Typography>
      }
      content={
        <div className="p-12 lg:ltr:pr-0 lg:rtl:pl-0">
          <motion.div
            className="flex flex-wrap"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {data && data.hasOwnProperty("admins") && (
              <motion.div
                variants={item}
                className="widget flex w-full sm:w-1/2 md:w-1/4 p-12 "
              >
                <Paper className="w-full rounded-20 shadow flex flex-col justify-between ptb-50">
                  {/* <div className="flex items-center justify-between px-4 pt-8">
                                    <Select
                                      className="mx-16"
                                      classes={{ select: 'py-8 ' }}
                                      value={currentRange}
                                      onChange={handleChangeRange}
                                      inputProps={{
                                        name: 'currentRange',
                                      }}
                                      variant="filled"
                                    >
                                      {Object.entries(ranges).map(([key, n]) => {
                                        return (
                                          <MenuItem key={key} value={key}>
                                            {n}
                                          </MenuItem>
                                        );
                                      })}
                                    </Select>
                                    <IconButton aria-label="more" size="large">
                                      <Icon>more_vert</Icon>
                                    </IconButton>
                                  </div> */}
                  <div className="text-center py-12">
                    <Typography
                      title={data.admins}
                      className="text-52 font-semibold leading-none text-blue tracking-tighter"
                    >
                      {formatNumberAbbreviation(data.admins)}
                    </Typography>
                    <Typography className="text-16 text-blue-800 font-normal">
                      Admins
                    </Typography>
                  </div>
                  {/* <Typography
                                    className="p-20 pt-0 h-56 flex justify-center items-end text-13 font-medium"
                                    color="textSecondary"
                                  >
                                    <span className="truncate">{data.extra.name}</span>:
                                    <b className="px-8">{data.extra.count[currentRange]}</b>
                                  </Typography> */}
                </Paper>
              </motion.div>
            )}
            {data && data.hasOwnProperty("members") && (
              <motion.div
                variants={item}
                className="widget flex w-full sm:w-1/2 md:w-1/4 p-12 "
              >
                <Paper
                  role="button"
                  onClick={() => navigate("/apps/members")}
                  className="w-full rounded-20 shadow flex flex-col justify-between ptb-50"
                >
                  {/* <div className="flex items-center justify-between px-4 pt-8">
                                  <Typography className="text-16 px-16 font-medium" color="textSecondary">
                                    {props.widget.title}
                                  </Typography>
                                  <IconButton aria-label="more" size="large">
                                    <Icon>more_vert</Icon>
                                  </IconButton>
                                </div> */}
                  <div className="text-center py-12">
                    <Typography
                      title={data.members}
                      className="text-52 font-semibold leading-none text-red tracking-tighter"
                    >
                      {formatNumberAbbreviation(data.members)}
                    </Typography>
                    <Typography className="text-16 font-normal text-red-800">
                      Members
                    </Typography>
                  </div>
                </Paper>
              </motion.div>
            )}
            {data && data.hasOwnProperty("expenditure") && (
              <motion.div
                variants={item}
                className="widget flex w-full sm:w-1/2 md:w-1/4 p-12 "
              >
                <Paper
                  role="button"
                  onClick={() => navigate("/apps/expenditure")}
                  className="w-full rounded-20 shadow flex flex-col justify-between ptb-50"
                >
                  {/* <div className="flex items-center justify-between px-4 pt-8">
                                  <Typography className="text-16 px-16 font-medium" color="textSecondary">
                                    {props.widget.title}
                                  </Typography>
                                  <IconButton aria-label="more" size="large">
                                    <Icon>more_vert</Icon>
                                  </IconButton>
                                </div> */}
                  <div className="text-center py-12">
                    <Typography
                      title={data.expenditure}
                      className="text-52 font-semibold leading-none text-orange tracking-tighter"
                    >
                      {formatNumberAbbreviation(data.expenditure)}
                    </Typography>
                    <Typography className="text-16 font-normal text-orange-800">
                      Expenditure
                    </Typography>
                  </div>
                </Paper>
              </motion.div>
            )}

            {data && data.hasOwnProperty("income") && (
              <motion.div
                variants={item}
                className="widget flex w-full sm:w-1/2 md:w-1/4 p-12 "
              >
                <Paper
                  role="button"
                  onClick={() => navigate("/apps/income")}
                  className="w-full rounded-20 shadow flex flex-col justify-between ptb-50"
                >
                  {/* <div className="flex items-center justify-between px-4 pt-8">
                                  <Typography className="text-16 px-16 font-medium" color="textSecondary">
                                    {props.widget.title}
                                  </Typography>
                                  <IconButton aria-label="more" size="large">
                                    <Icon>more_vert</Icon>
                                  </IconButton>
                                </div> */}
                  <div className="text-center py-12">
                    <Typography
                      title={data.income}
                      className="text-52 font-semibold leading-none text-green tracking-tighter"
                    >
                      {`₵${formatNumberAbbreviation(data.income)}`}
                    </Typography>
                    <Typography className="text-16 font-normal text-green-800">
                      Income
                    </Typography>
                  </div>
                </Paper>
              </motion.div>
            )}

            {data && data.hasOwnProperty("assets") && (
              <motion.div
                variants={item}
                className="widget flex w-full sm:w-1/2 md:w-1/4 p-12 "
              >
                <Paper
                  role="button"
                  onClick={() => navigate("/apps/asset")}
                  className="w-full rounded-20 shadow flex flex-col justify-between ptb-50"
                >
                  <div className="text-center py-12">
                    <Typography
                      title={data.assets}
                      className="text-52 font-semibold leading-none text-blue tracking-tighter"
                    >
                      {formatNumberAbbreviation(data.assets)}
                    </Typography>
                    <Typography className="text-16 font-normal text-blue-800">
                      Assets
                    </Typography>
                  </div>
                </Paper>
              </motion.div>
            )}
            {data && data.hasOwnProperty("branches") && (
              <motion.div
                variants={item}
                className="widget flex w-full sm:w-1/2 md:w-1/4 p-12 "
              >
                <Paper
                  role="button"
                  onClick={() => navigate("/apps/level-data")}
                  className="w-full rounded-20 shadow flex flex-col justify-between ptb-50"
                >
                  <div className="text-center py-12">
                    <Typography
                      title={data.branches}
                      className="text-52 font-semibold leading-none text-black tracking-tighter"
                    >
                      {formatNumberAbbreviation(data.branches)}
                    </Typography>
                    <Typography className="text-16 font-normal text-gray-800">
                      Branches
                    </Typography>
                  </div>
                </Paper>
              </motion.div>
            )}
            {data && data.hasOwnProperty("events") && (
              <motion.div
                variants={item}
                className="widget flex w-full sm:w-1/2 md:w-1/4 p-12 "
              >
                <Paper
                  role="button"
                  onClick={() => navigate("/apps/events")}
                  className="w-full rounded-20 shadow flex flex-col justify-between ptb-50"
                >
                  <div className="text-center py-12">
                    <Typography
                      title={data.events}
                      className="text-52 font-semibold leading-none text-red tracking-tighter"
                    >
                      {formatNumberAbbreviation(data.events)}
                    </Typography>
                    <Typography className="text-16 font-normal text-red-800">
                      Events
                    </Typography>
                  </div>
                </Paper>
              </motion.div>
            )}
            {data && data.hasOwnProperty("executives") && (
              <motion.div
                variants={item}
                className="widget flex w-full sm:w-1/2 md:w-1/4 p-12 "
              >
                <Paper
                  role="button"
                  onClick={() => navigate("/apps/executives")}
                  className="w-full rounded-20 shadow flex flex-col justify-between ptb-50"
                >
                  <div className="text-center py-12">
                    <Typography
                      title={data.executives}
                      className="text-52 font-semibold leading-none text-sky-blue tracking-tighter"
                    >
                      {formatNumberAbbreviation(data.executives)}
                    </Typography>
                    <Typography className="text-16 font-normal text-sky-blue-800">
                      Executives
                    </Typography>
                  </div>
                </Paper>
              </motion.div>
            )}
            {data && data.hasOwnProperty("groups") && (
              <motion.div
                variants={item}
                className="widget flex w-full sm:w-1/2 md:w-1/4 p-12 "
              >
                <Paper
                  role="button"
                  onClick={() => navigate("/apps/group")}
                  className="w-full rounded-20 shadow flex flex-col justify-between ptb-50"
                >
                  <div className="text-center py-12">
                    <Typography
                      title={data.groups}
                      className="text-52 font-semibold leading-none text-black tracking-tighter"
                    >
                      {formatNumberAbbreviation(data.groups)}
                    </Typography>
                    <Typography className="text-16 font-normal text-gray-800">
                      Groups
                    </Typography>
                  </div>
                </Paper>
              </motion.div>
            )}
            {data && data.hasOwnProperty("positions") && (
              <motion.div
                variants={item}
                className="widget flex w-full sm:w-1/2 md:w-1/4 p-12 "
              >
                <Paper
                  role="button"
                  onClick={() => navigate("/apps/positions")}
                  className="w-full rounded-20 shadow flex flex-col justify-between ptb-50"
                >
                  <div className="text-center py-12">
                    <Typography
                      title={data.positions}
                      className="text-52 font-semibold leading-none text-black tracking-tighter"
                    >
                      {formatNumberAbbreviation(data.positions)}
                    </Typography>
                    <Typography className="text-16 font-normal text-gray-800">
                      Positions
                    </Typography>
                  </div>
                </Paper>
              </motion.div>
            )}
            {data && data.hasOwnProperty("projects") && (
              <motion.div
                variants={item}
                className="widget flex w-full sm:w-1/2 md:w-1/4 p-12 "
              >
                <Paper
                  role="button"
                  onClick={() => navigate("/apps/projects")}
                  className="w-full rounded-20 shadow flex flex-col justify-between ptb-50"
                >
                  <div className="text-center py-12">
                    <Typography
                      title={data.projects}
                      className="text-52 font-semibold leading-none text-black tracking-tighter"
                    >
                      {formatNumberAbbreviation(data.projects)}
                    </Typography>
                    <Typography className="text-16 font-normal text-gray-800">
                      Projects
                    </Typography>
                  </div>
                </Paper>
              </motion.div>
            )}
            {data && data.hasOwnProperty("staffs") && (
              <motion.div
                variants={item}
                className="widget flex w-full sm:w-1/2 md:w-1/4 p-12 "
              >
                <Paper
                  role="button"
                  onClick={() => navigate("/apps/staff")}
                  className="w-full rounded-20 shadow flex flex-col justify-between ptb-50"
                >
                  <div className="text-center py-12">
                    <Typography
                      title={data.staffs}
                      className="text-52 font-semibold leading-none text-black tracking-tighter"
                    >
                      {formatNumberAbbreviation(data.staffs)}
                    </Typography>
                    <Typography className="text-16 font-normal text-gray-800">
                      Staffs
                    </Typography>
                  </div>
                </Paper>
              </motion.div>
            )}
            {data && data.hasOwnProperty("total_member_count") && (
              <motion.div
                variants={item}
                className="widget flex w-full sm:w-1/2 md:w-1/4 p-12 "
              >
                <Paper className="w-full rounded-20 shadow flex flex-col justify-between ptb-50">
                  {/* <div className="flex items-center justify-between px-4 pt-8">
                                  <Typography className="text-16 px-16 font-medium" color="textSecondary">
                                    {props.widget.title}
                                  </Typography>
                                  <IconButton aria-label="more" size="large">
                                    <Icon>more_vert</Icon>
                                  </IconButton>
                                </div> */}
                  <div className="text-center py-12">
                    <Typography
                      title={data.total_member_count}
                      className="text-52 font-semibold leading-none text-red tracking-tighter"
                    >
                      {formatNumberAbbreviation(data.total_member_count)}
                    </Typography>
                    <Typography className="text-16 font-normal text-red-800">
                      Members
                    </Typography>
                  </div>
                </Paper>
              </motion.div>
            )}
            {data && data.hasOwnProperty("total_invoices") && (
              <motion.div
                variants={item}
                className="widget flex w-full sm:w-1/2 md:w-1/4 p-12 "
              >
                <Paper className="w-full rounded-20 shadow flex flex-col justify-between ptb-50">
                  {/* <div className="flex items-center justify-between px-4 pt-8">
                                  <Typography className="text-16 px-16 font-medium" color="textSecondary">
                                    {props.widget.title}
                                  </Typography>
                                  <IconButton aria-label="more" size="large">
                                    <Icon>more_vert</Icon>
                                  </IconButton>
                                </div> */}
                  <div className="text-center py-12">
                    <Typography
                      title={data.total_invoices}
                      className="text-52 font-semibold leading-none text-blue tracking-tighter"
                    >
                      {formatNumberAbbreviation(data.total_invoices)}
                    </Typography>
                    <Typography className="text-16 font-normal text-blue-800">
                      Total Invoices
                    </Typography>
                  </div>
                </Paper>
              </motion.div>
            )}
            {data && data.hasOwnProperty("total_invoice_cost") && (
              <motion.div
                variants={item}
                className="widget flex w-full sm:w-1/2 md:w-1/4 p-12 "
              >
                <Paper className="w-full rounded-20 shadow flex flex-col justify-between ptb-50">
                  {/* <div className="flex items-center justify-between px-4 pt-8">
                                  <Typography className="text-16 px-16 font-medium" color="textSecondary">
                                    {props.widget.title}
                                  </Typography>
                                  <IconButton aria-label="more" size="large">
                                    <Icon>more_vert</Icon>
                                  </IconButton>
                                </div> */}
                  <div className="text-center py-12">
                    <Typography
                      title={data.total_invoice_cost}
                      className="text-52 font-semibold leading-none text-green tracking-tighter"
                    >
                      {`₵${formatNumberAbbreviation(data.total_invoice_cost)}`}
                    </Typography>
                    <Typography className="text-16 font-normal text-green-800">
                      Total Invoice Cost
                    </Typography>
                  </div>
                </Paper>
              </motion.div>
            )}
          </motion.div>
        </div>
      }
    />
  );
}

export default DashboardPage;
