import FuseLoading from '@fuse/core/FuseLoading';
import FusePageCarded from '@fuse/core/FusePageCarded';
import { useDeepCompareEffect } from '@fuse/hooks';
import Button from '@mui/material/Button';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import withReducer from 'app/store/withReducer';
import FormControl from '@mui/material/FormControl';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import InputLabel from '@mui/material/InputLabel';
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
import { resetForm, newForm, getForm, saveForm, getFields } from '../store/formSlice';
import reducer from '../store';
import PageHeader from './PageHeader';
import clsx from 'clsx';
import FuseUtils from '@fuse/utils';
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
    .required('You must enter form name'),
  label: yup
    .string()
    .required('You must enter input field label'),
  input_id: yup
    .string()
    .required('You must select input field'),
});

function Form(props) {
  const dispatch = useDispatch();
  const form_field = useSelector(({ formsApp }) => formsApp.form);
  const navigate = useNavigate();

  const routeParams = useParams();
  const [tabValue, setTabValue] = useState(0);
  const [noForm, setNoForm] = useState(false);
  const [checked, setChecked] = useState(true);
  const [inputFields, setInputFields] = useState([]);
  const [input_id, setInputId] = useState("");
  const [options, setOptions] = useState([]);



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
    dispatch(getFields()).then((action) => {
      setInputFields(action.payload);
    });
  }, [dispatch]);

  useDeepCompareEffect(() => {
    function updateFormFieldState() {
      const { formId } = routeParams;

      if (formId === 'new') {
        /**
         * Create New form field data
         */
        dispatch(newForm());
      } else {
        /**
         * Get form field data
         */
        dispatch(getForm(routeParams)).then((action) => {
          /**
           * If the requested form field is not exist show message
           */
          if (!action.payload) {
            setNoForm(true);
          } else {
            if (action.payload.input_id) {
              setInputId(action.payload.input_id);
            }

            if (action.payload.is_active) {
              setValue("is_active", "1");
            } else {
              setValue("is_active", "0");
            }

            if (action.payload.option && action.payload.option != 'null') {
              const Ops = JSON.parse(action.payload.option);
              setOptions(Ops);
              setValue("options", Ops);
            } 
          }
        });
      }
    }

    updateFormFieldState();
  }, [dispatch, routeParams]);

  useEffect(() => {
    if (!form_field) {
      return;
    }
    /**
     * Reset the form on form field state changes
     */
    reset(form_field);
  }, [form_field, reset]);

  useEffect(() => {
    return () => {
      /**
       * Reset form field on component unload
       */
      dispatch(resetForm());
      setNoForm(false);
    };
  }, [dispatch]);

  /**
   * Tab Change
   */
  function handleTabChange(event, value) {
    setTabValue(value);
  }



  function handleSaveForm() {
    dispatch(saveForm(getValues())).then((action) => {
      dispatch(showMessage({ message: action.payload.message }));
      navigate('/apps/dynamic-forms');
    });
  }

  function handleInputChange(event) {
    setInputId(event.target.value);
    setValue("input_id", event.target.value);
    let inputs = [...inputFields];
    let selectedInput = inputs.filter((f) => {
      if (f.id == event.target.value) {
        return f
      }
    })[0];
    if (selectedInput["tag"] == "select" || selectedInput["tag"] == "radio" || selectedInput["tag"] == "checkbox") {
      setOptions([{label: "", value: ""}]);
      setValue('options', "");
    } else {
      setOptions([]);
      setValue('options', "");
    }
  }

  const addMoreOption = () => {
    setOptions([...options, {label: "", value: ""}]);
  };

  const removeOption = (index)=>{
    const rows = [...options];
    rows.splice(index, 1);
    setOptions(rows);
    setValue('options', rows);
  }

  const handleOptionChange = (index, evnt)=>{
    const { name, value } = evnt.target;
    const list = [...options];
    list[index][name] = value;
    setOptions(list);
    setValue('options['+index+']['+name+']', value);
  }


  /**
   * Show Message if the requested fields is not exists
   */
  if (noForm) {
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
          to="/apps/dynamic-forms"
          color="inherit"
        >
          Go to Dynamic Forms Page
        </Button>
      </motion.div>
    );
  }

  /**
   * Wait while field data is loading and form is setted
   */
  if (
    _.isEmpty(form) ||
    (form_field && routeParams.formId !== form_field.encryption_id && routeParams.formId !== 'new')
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
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    className="mt-8 mb-16"
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
                name="label"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    className="mt-8 mb-16"
                    error={!!errors.label}
                    required
                    helperText={errors?.label?.message}
                    label="Label"
                    id="label"
                    variant="outlined"
                    fullWidth
                  />
                )}
              />

              <Controller
                name="input_id"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel id="input-simple-select-label">Input Field*</InputLabel>
                    <Select
                      {...field}
                      id="input_id"
                      labelId="input-simple-select-label"
                      label="Input Field*"
                      value={input_id}
                      required
                      className="mt-8 mb-16 mx-4"
                      onChange={(evnt)=>handleInputChange(evnt)} 
                      >
                        <MenuItem key={"0"} value={""}>Select</MenuItem>
                      {inputFields && inputFields.length > 0 && inputFields.map((inputField) => 
                        <MenuItem key={inputField.id+""} value={inputField.id+""} >{inputField.name}</MenuItem>
                      )}
                    </Select>
                  </FormControl>

                  )}
                />

                {options && options.map((option_val, k) => (
                  <div key={k} className="">
                    
                    <div className="flex -mx-3">
                      <Controller
                        name="label"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            className="mt-8 mb-16 mx-3"
                            label="Label"
                            id={"label_"+k}
                            variant="outlined"
                            value={option_val.label}
                            onChange={(evnt)=>handleOptionChange(k, evnt)} 
                            fullWidth
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                        )}
                      />
                      <Controller
                        name="value"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            className="mt-8 mb-16 mx-3"
                            label="Value"
                            id={"value_"+k}
                            variant="outlined"
                            value={option_val.value}
                            onChange={(evnt)=>handleOptionChange(k, evnt)} 
                            fullWidth
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                        )}
                      />
                      
                      {k != 0 && 
                      <motion.div
                        className="mt-8"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0, transition: { delay: 0.3 } }}
                      >  
                        <Button
                          className="whitespace-nowrap mx-4 pull-right"
                          variant="contained"
                          color="secondary"
                          onClick={(evnt)=>removeOption(k)} 
                        >
                          
                          Remove

                        </Button> 
                        <div className="clearfix"></div>
                        
                      </motion.div> }
                      {k == (options.length-1) && 
                      <motion.div
                        className="mt-8"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0, transition: { delay: 0.3 } }}
                      >  
                        <Button
                          className="whitespace-nowrap mx-4 pull-left"
                          variant="contained"
                          color="secondary"
                          onClick={addMoreOption}
                        >
                          
                          Add More

                        </Button> 

                        <div className="clearfix"></div>
                        
                      </motion.div> }
                    </div>
                    
                  </div>
                ))}

                <Controller
                name="is_active"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel status="input-simple-select-label">Status</InputLabel>
                    <Select
                      {...field}
                      id="is_active"
                      labelId="status-simple-select-label"
                      label="Status"
                      className="mt-8 mb-16 mx-4"
                      >
                        <MenuItem key={"0"} value={"1"}>Active</MenuItem>
                        <MenuItem key={"1"} value={"0"}>Inactive</MenuItem>
                    </Select>
                  </FormControl>

                  )}
                />

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
                onClick={handleSaveForm}
              >
                Save {isValid}
              </Button>
            </motion.div>
          </div>
        }
        innerScroll
      />
    </FormProvider>
  );
}

export default withReducer('formsApp', reducer)(Form);
