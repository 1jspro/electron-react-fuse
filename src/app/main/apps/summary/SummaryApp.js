import DemoContent from '@fuse/core/DemoContent';
import { styled } from '@mui/material/styles';
import FusePageSimple from '@fuse/core/FusePageSimple';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Icon from '@mui/material/Icon';
import { motion } from 'framer-motion';
import { useEffect, useRef, memo, useState } from 'react';
import { getSummaryData, getLevelSummaryData, getIncomeSummary, getExpenditureSummary } from './store/summarySlice';
import TextField from '@mui/material/TextField';
import {
  getLevels,
  getLevelsData,
} from '../members/store/memberSlice';
import { useForm, FormProvider, useFormContext, Controller } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import ReactApexChart from 'react-apexcharts';
import { getLevelDataList } from "../level-data/store/levelDataListSlice";
import { useNavigate } from 'react-router-dom';

const Root = styled(FusePageSimple)({
  '& .FusePageSimple-header': {},
  '& .FusePageSimple-toolbar': {},
  '& .FusePageSimple-content': {},
  '& .FusePageSimple-sidebarHeader': {},
  '& .FusePageSimple-sidebarContent': {},
});

function SummaryPage(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [LevelData, setLevelData] = useState(null);
  const [levelDataList, setLevelDataList] = useState([]);
  const [levels, setLevels] = useState([]);
  const methods = useForm({
    mode: 'onChange',
    defaultValues: {},
  });
  const { reset, watch, control, onChange, formState, setValue, getValues } = methods;
  const { isValid, dirtyFields, errors } = formState;
  const form = watch();
  const [ranges, setRanges] = useState({
    "DT": "Today",
    "DTM": "Tomorrow",
    "DY": "Yesterday"
  });
  const [currentRange, setCurrentRange] = useState("DT");
  const [loading, setLoading] = useState(true);
  const [genderChart, setGenderChart] = useState({
    options: {},
    series: [],
    chart_type: "bar",
    chart_height: 200
  });

  const [educationLevelChart, setEducationLevelChart] = useState({
    options: {},
    series: [],
    chart_type: "bar",
    chart_height: 300
  });

  const [levelChart, setLevelChart] = useState({
    options: {},
    series: [],
    chart_type: "bar",
    chart_height: 300,
    level_name: ''
  });

  const [industryChart, setIndustryChart] = useState({
    options: {},
    series: [],
    chart_type: "bar",
    chart_height: 300
  });

  const [professionChart, setProfessionChart] = useState({
    options: {},
    series: [],
    chart_type: "bar",
    chart_height: 300
  });

  const [incomeChart, setIncomeChart] = useState({
    options: {},
    series: [],
    chart_type: "bar",
    chart_height: 300
  });

  const [expenditureChart, setExpenditureChart] = useState({
    options: {},
    series: [],
    chart_type: "bar",
    chart_height: 300
  });

  const [Dynamicfield, setDynamicfield] = useState({
    options: {},
    series: [],
    chart_type: "bar",
    chart_height: 300,
    level_name: ''
  });

  const [aa, setaa] = useState({

  })
  useEffect(() => {
    dispatch(getLevelDataList({ page: 0, rowsPerPage: 10000000000, searchText: '' })).then((action) => {
      setLevelData(action.payload);
    });

    dispatch(getLevels()).then((action) => {
      setLevels(action.payload);
      const top_level_id = action.payload[0].id;

      dispatch(getLevelsData({ level_id: top_level_id })).then((action) => {
        const datalist = [...levelDataList];
        datalist[top_level_id] = action.payload;
        setLevelDataList(datalist);
      });
    });
  }, [dispatch])

  useEffect(() => {
    dispatch(getSummaryData({ levelId: (getValues('level_id') !== undefined) ? getValues('level_id') : '' })).then((action) => {
      if (action.payload.gender) {
        let categories = [];
        let series_data = [];
        for (const k in action.payload.gender) {
          categories.push(k);
          series_data.push(action.payload.gender[k]);
        }

        setGenderChart({
          options: {
            chart: {
              id: "basic-bar",
              events: {
                dataPointSelection: (event, chartContext, config) => {
                  /* console.log(event, chartContext, config) */
                },
                xAxisLabelClick: (event, chartContext, config) => {
                  /* console.log(event, chartContext, config, categories[config.labelIndex]) */
                }
              }
            },
            xaxis: {
              categories: categories
            }
          },
          series: [
            {
              name: "Number Of Registration",
              data: series_data
            }
          ],
          chart_type: "bar",
          chart_height: 200
        })
      }

      if (action.payload.education_level) {
        setEducationLevelChart({
          options: {
            chart: {
              id: "basic-bar"
            },
            xaxis: {
              categories: action.payload.education_level.education_level_name
            }
          },
          series: [
            {
              name: "Number Of Registration",
              data: action.payload.education_level.level_has_member_count
            }
          ],
          chart_type: "bar",
          chart_height: 200
        })
      }

      if (action.payload.industry) {
        setIndustryChart({
          options: {
            chart: {
              id: "basic-bar"
            },
            xaxis: {
              categories: action.payload.industry.industries_name
            }
          },
          series: [
            {
              name: "Number Of Registration",
              data: action.payload.industry.industry_has_member_count
            }
          ],
          chart_type: "bar",
          chart_height: 200
        })
      }

      if (action.payload.profession) {
        setProfessionChart({
          options: {
            chart: {
              type: 'bar',
              height: 200,
              zoom: {
                enabled: true,
                type: 'x',
                autoScaleYaxis: false,
                zoomedArea: {
                  fill: {
                    color: '#90CAF9',
                    opacity: 0.4
                  },
                  stroke: {
                    color: '#0D47A1',
                    opacity: 0.4,
                    width: 1
                  }
                }
              }
            },
            stroke: {
              width: [0]
            },
            dataLabels: {
              enabled: true,
              style: {
                border: '0px',
                background: 'transparent'
              },
              background: {
                enabled: true,
                foreColor: '#fff',
                borderWidth: 0,
              }
            },
            xaxis: {
              categories: action.payload.profession.profession_name,
            },
          },
          series: [
            {
              name: "Number Of Registration",
              type: "column",
              data: action.payload.profession.profession_has_member_count
            }
          ],
          chart_type: "bar",
          chart_height: 350
        })
      }

      dispatch(getLevelSummaryData()).then((action_) => {
        if (action_.payload.levels) {
          setLevelChart({
            options: {
              chart: {
                id: "basic-bar",
                type: 'bar',
                height: 200,
                zoom: {
                  enabled: true,
                  type: 'x',
                  autoScaleYaxis: false,
                  zoomedArea: {
                    fill: {
                      color: '#90CAF9',
                      opacity: 0.4
                    },
                    stroke: {
                      color: '#0D47A1',
                      opacity: 0.4,
                      width: 1
                    }
                  }
                }
              },
              stroke: {
                width: [0]
              },
              dataLabels: {
                enabled: true,
                style: {
                  border: '0px',
                  background: 'transparent'
                },
                background: {
                  enabled: true,
                  foreColor: '#fff',
                  borderWidth: 0,
                }
              },
              xaxis: {
                categories: action.payload.levels.level_name
              }
            },
            series: [
              {
                name: "Number Of Registration",
                data: action.payload.levels.level_has_member_count,
                type: "column",
              }
            ],
            level_name: action.payload.level_name,
            chart_type: "bar",
            chart_height: 200
          })
        }
      })

      if (action.payload.dynamic_field) {

        var series_names = [];
        var series_count = [];
        action.payload.dynamic_field.forEach((data, j) => {
          series_names.push(data.label)
          series_count.push(data.count)
        })
        setDynamicfield({
          options: {
            chart: {
              id: "dynamic_field_bar",
              events: {
                dataPointSelection: (event, chartContext, config) => {
                  /* console.log(event, chartContext, config) */
                },
                xAxisLabelClick: (event, chartContext, config) => {
                  /* console.log(event, chartContext, config, action.payload.dynamic_field[config.labelIndex]) */
                  navigate(`/apps/dynamic_field_details/${action.payload.dynamic_field[config.labelIndex].id}/${action.payload.dynamic_field[config.labelIndex].label}`);
                }
              },
              type: 'bar',
              height: 200,
              zoom: {
                enabled: true,
                type: 'x',
                autoScaleYaxis: false,
                zoomedArea: {
                  fill: {
                    color: '#90CAF9',
                    opacity: 0.4
                  },
                  stroke: {
                    color: '#0D47A1',
                    opacity: 0.4,
                    width: 1
                  }
                }
              }
            },
            stroke: {
              width: [0]
            },
            dataLabels: {
              enabled: true,
              style: {
                border: '0px',
                background: 'transparent'
              },
              background: {
                enabled: true,
                foreColor: '#fff',
                borderWidth: 0,
              }
            },

            xaxis: {
              categories: series_names
            }
          },
          series: [
            {
              name: "Dynamic Field",
              type: "column",
              data: series_count
            }
          ],
          level_name: 'Dynamic Field',
          chart_type: "bar",
          chart_height: 200
        })
      }
      setLoading(false);
    });
  }, [dispatch, getValues('level_id')]);

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

  function handleIncomeDateChange(event, field) {
    setValue(field, event.target.value)
    dispatch(getIncomeSummary({ start_date: getValues('start_date'), end_date: getValues('end_Date') })).then((action) => {
      var xaxisCat = []
      var series = []
      action.payload.map((e) => {
        xaxisCat.push(e.date + ' (' + e.count + ')')
        series.push(e.total_amount)
      })

      setIncomeChart({
        options: {
          chart: {
            id: "basic-bar"
          },
          xaxis: {
            categories: xaxisCat
          }
        },
        series: [
          {
            name: "Income",
            data: series
          }
        ],
        chart_type: "bar",
        chart_height: 300
      })
    });

  }

  function handleExpenditureDateChange(event, field) {
    setValue(field, event.target.value)
    dispatch(getExpenditureSummary({ start_date: getValues('expenditure_start_date'), end_date: getValues('expenditure_end_Date') })).then((action) => {
      var xaxisCat = []
      var series = []
      action.payload.map((e) => {
        xaxisCat.push(e.date + ' (' + e.count + ')')
        series.push(e.total_amount)
      })

      setExpenditureChart({
        options: {
          chart: {
            id: "basic-bar"
          },
          xaxis: {
            categories: xaxisCat
          }
        },
        series: [
          {
            name: "Expenditure",
            data: series
          }
        ],
        chart_type: "bar",
        chart_height: 300
      })
    })

  }

  function handleLevelChange(key, event) {
    setValue('level_' + levels[key]['id'], event.target.value + '');
    setValue('level_id', event.target.value)
    if (levels && key < levels.length) {
      let level_id = levels[key + 1] ? levels[key + 1].id : '';
      if (level_id) {
        dispatch(getLevelsData({ level_id: level_id, parent_id: event.target.value })).then((action) => {
          const datalist = [...levelDataList];
          datalist[level_id] = action.payload;
          setLevelDataList(datalist);
        });
      }
    }
  }

  return (
    <Root
      header={
        <Typography
          component={motion.span}
          initial={{ x: -20 }}
          animate={{ x: 0, transition: { delay: 0.2 } }}
          delay={300}
          className="hidden p40 sm:flex text-16 md:text-24 mx-12 font-semibold"
        >
          Summary Page
        </Typography>
      }
      content={
        <div className="p-12 ">

          <FormProvider {...methods}>
            <div className="p-16 sm:p-24">
              <div>

                {/* <Controller
                name="level_id"
                control={control}
                className="px-3"
                render={({ field }) => (
                  <FormControl fullWidth className='px-3'>
                    <InputLabel id={"member-simple-select-label"}>Level</InputLabel>
                    <Select
                      {...field}
                      id="level_id"
                      labelId={"member-simple-select-label"}
                      label="Select Level"
                      className="mb-16 px-3 sm:w-1/2 lg:w-1/2"
                      placeholder='Select Level'
                    >
                      <MenuItem key={"el_0"} value={""}>Select</MenuItem>
                      {LevelData && LevelData.length > 0 && LevelData.map((level, k) => {
                        return (<MenuItem key={"el_" + level.id + ""} value={level.id + ""} >{level.name}</MenuItem>)
                      })}
                    </Select>
                  </FormControl>
                )}
              /> */}
                <div className='flex -mx-4'>
                  {levels && levels.length > 0 && levels.map((level, k) =>
                    <Controller
                      name={'level_' + level.id}
                      key={k}
                      control={control}
                      render={({ field }) => (
                        <FormControl fullWidth>
                          <InputLabel id={'level-simple-select-label_' + level.id}>{level.name}</InputLabel>
                          <Select
                            {...field}
                            id={'level_' + level.id}
                            labelId={'level-simple-select-label_' + level.id}
                            label={level.name}
                            className='mt-8 mb-16 mx-4'
                            onChange={(evnt) => handleLevelChange(k, evnt)}
                          >
                            <MenuItem key={'ld_' + level.id} value={''}>Select</MenuItem>
                            {levelDataList && levelDataList[level.id] && levelDataList[level.id].length > 0 && levelDataList[level.id].map((levelData, k) =>
                              <MenuItem key={'el_' + levelData.id + ''}
                                value={levelData.id + ''}>{levelData.name}</MenuItem>,
                            )}
                          </Select>
                        </FormControl>
                      )}
                    />,
                  )}
                </div>
              </div>
            </div>
          </FormProvider>
          <motion.div className="flex flex-wrap p-16" variants={container} initial="hidden" animate="show">

            <motion.div variants={item} className="widget flex w-full sm:w-1/2 md:w-1/2 p-12 ">
              <Paper className="w-full rounded-20   p-16 shadow flex flex-col justify-between ptb-50">

                <div className="text-left">
                  <Typography className="text-18 text-blue-800 font-normal">
                    Gender
                  </Typography>

                  <div className="w-full min-h-420 h-420">
                    <ReactApexChart
                      options={genderChart.options}
                      series={genderChart.series}
                      type={genderChart.chart_type}
                      height={genderChart.chart_height}
                    />
                  </div>
                </div>
              </Paper>
            </motion.div>

            <motion.div variants={item} className="widget flex w-full sm:w-1/1 md:w-1/1 p-12 ">
              <Paper className="w-full p-16 rounded-20 shadow flex flex-col justify-between ptb-50">

                <div className="text-left">
                  <Typography className="text-18 text-blue-800 font-normal">
                    Education Level
                  </Typography>

                  <div className="w-full   min-h-420 h-420">
                    <ReactApexChart
                      options={educationLevelChart.options}
                      series={educationLevelChart.series}
                      type={educationLevelChart.chart_type}
                      height={educationLevelChart.chart_height}
                    />
                  </div>
                </div>
              </Paper>
            </motion.div>

            <motion.div variants={item} className="widget flex w-full sm:w-1/1 md:w-1/1 p-12 ">
              <Paper className="w-full p-16 rounded-20 shadow flex flex-col justify-between ptb-50">

                <div className="text-left">
                  <Typography className="text-18 text-blue-800 font-normal">
                    Industry
                  </Typography>

                  <div className="w-full   min-h-420 h-420">
                    <ReactApexChart
                      options={industryChart.options}
                      series={industryChart.series}
                      type={industryChart.chart_type}
                      height={industryChart.chart_height}
                    />
                  </div>
                </div>
              </Paper>
            </motion.div>


            <motion.div variants={item} className="widget flex w-full sm:w-1/1 md:w-1/1 p-12 ">
              <Paper className="w-full p-16 rounded-20 shadow flex flex-col justify-between ptb-50">

                <div className="text-left">
                  <Typography className="text-18 text-blue-800 font-normal">
                    Profession
                  </Typography>

                  <div className="w-full   min-h-420 h-420">
                    <ReactApexChart
                      /* zoomEnabled={true} */
                      options={professionChart.options}
                      series={professionChart.series}
                    /* type={professionChart.chart_type}
                    height={professionChart.chart_height} */
                    />
                  </div>
                </div>
              </Paper>
            </motion.div>


            <motion.div variants={item} className="widget flex w-full sm:w-1/1 md:w-1/1 p-12 ">
              <Paper className="w-full p-16 rounded-20 shadow flex flex-col justify-between ptb-50">

                <div className="text-left">
                  <Typography className="text-18 text-blue-800 font-normal">
                    Income
                  </Typography>

                  <div className="w-full min-h-420 h-420">
                    <div className="flex mt-30 -mx-4">
                      <Controller
                        name="start_date"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            className="mt-8 mb-16 mx-4"
                            label="Start Date"
                            type="date"
                            id="start_date"
                            variant="outlined"
                            fullWidth
                            onChange={(evnt) => handleIncomeDateChange(evnt, 'start_date')}
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                        )}
                      />

                      <Controller
                        name="end_Date"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            className="mt-8 mb-16 mx-4"
                            label="End Date"
                            type="date"
                            id="end_Date"
                            variant="outlined"
                            fullWidth
                            onChange={(evnt) => handleIncomeDateChange(evnt, 'end_Date')}
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                        )}
                      />
                    </div>
                    {incomeChart.options.chart &&
                      <ReactApexChart
                        options={incomeChart.options}
                        series={incomeChart.series}
                        type={incomeChart.chart_type}
                        height={incomeChart.chart_height}
                      />}
                  </div>
                </div>
              </Paper>
            </motion.div>

            <motion.div variants={item} className="widget flex w-full sm:w-1/1 md:w-1/1 p-12 ">
              <Paper className="w-full p-16 rounded-20 shadow flex flex-col justify-between ptb-50">

                <div className="text-left">
                  <Typography className="text-18 text-blue-800 font-normal">
                    Expenditure
                  </Typography>

                  <div className="w-full min-h-420 h-420">
                    <div className="flex mt-30 -mx-4">
                      <Controller
                        name="expenditure_start_date"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            className="mt-8 mb-16 mx-4"
                            label="Start Date"
                            type="date"
                            id="expenditure_start_date"
                            variant="outlined"
                            fullWidth
                            onChange={(evnt) => handleExpenditureDateChange(evnt, 'expenditure_start_date')}
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                        )}
                      />

                      <Controller
                        name="expenditure_end_Date"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            className="mt-8 mb-16 mx-4"
                            label="End Date"
                            type="date"
                            id="expenditure_end_Date"
                            variant="outlined"
                            fullWidth
                            onChange={(evnt) => handleExpenditureDateChange(evnt, 'expenditure_end_Date')}
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                        )}
                      />
                    </div>
                    {expenditureChart.options.chart &&
                      <ReactApexChart
                        options={expenditureChart.options}
                        series={expenditureChart.series}
                        type={expenditureChart.chart_type}
                        height={expenditureChart.chart_height}
                      />}
                  </div>
                </div>
              </Paper>
            </motion.div>


            <motion.div variants={item} className="widget flex w-full sm:w-1/1 md:w-1/1 p-12 ">
              <Paper className="w-full p-16 rounded-20 shadow flex flex-col justify-between ptb-50">

                <div className="text-left">
                  <Typography className="text-18 text-blue-800 font-normal">
                    {levelChart.level_name}
                  </Typography>

                  <div className="w-full mt-30 min-h-420 h-420">
                    <ReactApexChart
                      options={levelChart.options}
                      series={levelChart.series}
                    /* type={levelChart.chart_type}
                    height={levelChart.chart_height} */
                    />
                  </div>
                </div>
              </Paper>
            </motion.div>

            <motion.div variants={item} className="widget flex w-full sm:w-1/1 md:w-1/1 p-12 ">
              <Paper className="w-full p-16 rounded-20 shadow flex flex-col justify-between ptb-50">

                <div className="text-left">
                  <Typography className="text-18 text-blue-800 font-normal">
                    {Dynamicfield.level_name}
                  </Typography>

                  <div className="w-full mt-30 min-h-420 h-420">
                    <ReactApexChart
                      options={Dynamicfield.options}
                      series={Dynamicfield.series}
                    /* type={Dynamicfield.chart_type}
                    height={Dynamicfield.chart_height} */
                    />
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

export default SummaryPage;
