import FuseLoading from '@fuse/core/FuseLoading';
import FusePageCarded from '@fuse/core/FusePageCarded';
import { useDeepCompareEffect } from '@fuse/hooks';
import Button from '@mui/material/Button';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import withReducer from 'app/store/withReducer';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams, useNavigate } from 'react-router-dom';
import _ from '@lodash';
import { useForm, FormProvider, useFormContext, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Switch from "@mui/material/Switch";
import MenuItem from "@mui/material/MenuItem";
import Select from '@mui/material/Select';
import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';
import FormControlLabel from '@mui/material/FormControlLabel';
import Autocomplete from '@mui/material/Autocomplete';
import { resetIncome, newIncome, getIncome, saveIncome, getCategories } from '../store/incomeSlice';
import reducer from '../store';
import PageHeader from './PageHeader';
import clsx from 'clsx';
import FuseUtils from '@fuse/utils';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { showMessage } from 'app/store/fuse/messageSlice';

const Root = styled(FusePageCarded)(({ theme }) => ({
  '& .FusePageCarded-header': {
    minHeight: 72,
    height: 72,
    alignItems: 'center',
    [theme.breakpoints.up('sm')]: {
      minHeight: 136,
      height: 136,
    },
  },


  


  '& .productImageUpload': {
    transitionProperty: 'box-shadow',
    transitionDuration: theme.transitions.duration.short,
    transitionTimingFunction: theme.transitions.easing.easeInOut,
  },

  '& .productImageItem': {
    transitionProperty: 'box-shadow',
    transitionDuration: theme.transitions.duration.short,
    transitionTimingFunction: theme.transitions.easing.easeInOut,
    '&:hover': {
      '& .productImageFeaturedStar': {
        opacity: 0.8,
      },
    },
    '&.featured': {
      pointerEvents: 'none',
      boxShadow: theme.shadows[3],
      '& .productImageFeaturedStar': {
        opacity: 1,
      },
      '&:hover .productImageFeaturedStar': {
        opacity: 1,
      },
    },
  },
}));

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  name: yup
    .string()
    .required('You must enter income name'),
});

function Income(props) {
  const dispatch = useDispatch();
  const income = useSelector(({ incomesApp }) => incomesApp.income);
  const navigate = useNavigate();

  const routeParams = useParams();
  const [tabValue, setTabValue] = useState(0);
  const [noIncome, setNoIncome] = useState(false);
  const [selectedImage, setSelectedImage] = useState();
  const [selectedUpdateImage, setSelectedUpdateImage] = useState();
  const [checked, setChecked] = useState(true);
  const [categories, setCategories] = useState([]);



  const methods = useForm({
    mode: 'onChange',
    defaultValues: {},
    resolver: yupResolver(schema),
  });
  const { reset, watch, control, onChange, formState, setValue, getValues } = methods;
  const { isValid, dirtyFields, errors } = formState;
  const form = watch();
  const name = watch('name');

  useEffect(() => {
    dispatch(getCategories()).then((action) => {
      setCategories(action.payload);
    });
  }, [dispatch]);

  useDeepCompareEffect(() => {
    function updateIncomeState() {
      const { incomeId } = routeParams;

      if (incomeId === 'new') {
        /**
         * Create New income data
         */
        dispatch(newIncome());
      } else {
        /**
         * Get income data
         */
        dispatch(getIncome(routeParams)).then((action) => {
          /**
           * If the requested income is not exist show message
           */
          if (!action.payload) {
            setNoIncome(true);
          } else {

          }
        });
      }
    }

    updateIncomeState();
  }, [dispatch, routeParams]);

  useEffect(() => {
    if (!income) {
      return;
    }
    /**
     * Reset the form on income state changes
     */
    reset(income);
  }, [income, reset]);

  useEffect(() => {
    return () => {
      /**
       * Reset income on component unload
       */
      dispatch(resetIncome());
      setNoIncome(false);
    };
  }, [dispatch]);

  /**
   * Tab Change
   */
  function handleTabChange(event, value) {
    setTabValue(value);
  }


  function handleSaveIncome() {
    dispatch(saveIncome(getValues())).then((action) => {
      dispatch(showMessage({ message: action.payload.message }));
      navigate('/apps/income');
    });
  }



  /**
   * Show Message if the requested incomes is not exists
   */
  if (noIncome) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.1 } }}
        className="flex flex-col flex-1 items-center justify-center h-full"
      >
        <Typography color="textSecondary" variant="h5">
          There is no such data!
        </Typography>
        <Button
          className="mt-24"
          component={Link}
          variant="outlined"
          to="/apps/income"
          color="inherit"
        >
          Go to Income Page
        </Button>
      </motion.div>
    );
  }

  /**
   * Wait while income data is loading and form is setted
   */
  if (
    _.isEmpty(form) ||
    (income && routeParams.incomeId !== income.encryption_id && routeParams.incomeId !== 'new')
  ) {
    return <FuseLoading />;
  }

  

  return (
    <FormProvider {...methods}>
      <Root
        header={<PageHeader />}
        content={
          <div className="p-16 sm:p-24">
            <div className={tabValue !== 0 ? 'hidden' : ''}>
              <div className="flex -mx-4">
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      className="mt-8 mb-16 mx-4"
                      error={!!errors.name}
                      required
                      helperText={errors?.name?.message}
                      label="Name"
                      autoFocus
                      id="name"
                      variant="outlined"
                      fullWidth
                    />
                  )}
                />
                <Controller
                  name="category_id"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel id="category-simple-select-label">Category*</InputLabel>
                      <Select
                        {...field}
                        id="category_id"
                        labelId="category-simple-select-label"
                        label="Category*"
                        required
                        className="mt-8 mb-16 mx-4"
                        defaultValue=""
                        >
                          <MenuItem key={"0"} value={""}>Select</MenuItem>
                        {categories && categories.length > 0 && categories.map((category) => 
                          <MenuItem key={category.id+""} value={category.id+""} >{category.name}</MenuItem>
                        )}
                      </Select>
                    </FormControl>

                  )}
                />

              </div>

              <div className="flex -mx-4">
                <Controller
                  name="amount"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      className="mt-8 mb-16 mx-4"
                      error={!!errors.amount}
                      required
                      helperText={errors?.amount?.message}
                      label="amount"
                      id="amount"
                      min="0"
                      type="number"
                      variant="outlined"
                      fullWidth
                    />
                  )}
                />
                 
                 <Controller
                    name="created_date"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        className="mt-8 mb-16 mx-4"
                        label="Created At"
                        type="date"
                        id="created_date" 
                        variant="outlined"
                        fullWidth
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    )}
                  />

              </div>

              <div className="flex -mx-4">
                <Controller
                  name="purpose"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      className="mt-8 mb-16"
                      id="purpose"
                      label="Purpose"
                      type="text"
                      multiline
                      rows={3}
                      variant="outlined"
                      fullWidth
                    />
                  )}
                />
              </div>

              <div className="clearfix"></div>
            </div>
            <motion.div
              className="mt30"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0, transition: { delay: 0.3 } }}
            >
              <Button
                className="whitespace-nowrap mx-4 pull-right"
                variant="contained"
                color="secondary"
                disabled={(!isValid)}
                onClick={handleSaveIncome}
              >
                Save
              </Button>
            </motion.div>
          </div>
        }
        innerScroll
      />
    </FormProvider>
  );
}

export default withReducer('incomesApp', reducer)(Income);
