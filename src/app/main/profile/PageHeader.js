import Button from '@mui/material/Button';
import Icon from '@mui/material/Icon';
import { useTheme } from '@mui/material/styles';
import { showMessage } from 'app/store/fuse/messageSlice';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import _ from '@lodash';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import { updateProfile, getProfile, changePassword } from 'app/auth/store/profileSlice';
import { useEffect, useState } from 'react';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from "@mui/material/MenuItem";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};


const schema = yup.object().shape({
  current_password: yup
    .string()
    .required('Please enter your current password.'),
  password: yup
    .string()
    .required('Please enter your new password.')
    .min(5, 'Password is too short - should be 8 chars minimum.'),
  passwordConfirm: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match'),
});


const defaultValues = {
  current_password: '',
  password: '',
  passwordConfirm: '',
};


function PageHeader(props) {
  const dispatch = useDispatch();

  const { control, setValue, formState, handleSubmit, reset, trigger, setError } = useForm({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });


  const { isValid, dirtyFields, errors } = formState;


  const theme = useTheme();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  
  const user = useSelector(({ auth }) => auth.user);

  function onSubmit(model) {
    dispatch(changePassword(model)).then((action) => {
      dispatch(showMessage({ message: action.payload.message }));
      if (action.payload.success) {
        setOpen(false);
        setValue("current_password", "");
        setValue("password", "");
        setValue("passwordConfirm", "");
      }
    });
  }

  function openCPModal() {
    setOpen(true);
  }

  function closeCPModal() {
    setOpen(false);
    setValue("current_password", "");
    setValue("password", "");
    setValue("passwordConfirm", "");
  }



  return (
    <div className="flex flex-1 w-full items-center justify-between">
      <div className="flex flex-col items-start max-w-full min-w-0">
        
        <div className="flex items-center max-w-full">
          <motion.div
            className="hidden sm:flex"
            initial={{ scale: 0 }}
            animate={{ scale: 1, transition: { delay: 0.3 } }}
          >
              <Icon className="hidden sm:flex text-48 ">account_box</Icon>
          </motion.div>
          <div className="flex flex-col min-w-0 mx-8 sm:mc-16">
            <motion.div initial={{ x: -20 }} animate={{ x: 0, transition: { delay: 0.3 } }}>
              <Typography className="text-16 sm:text-20 truncate font-semibold">
                Update Profile
              </Typography>
              
            </motion.div>
          </div>
        </div>
      </div>
      <motion.div
        className="flex"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0, transition: { delay: 0.3 } }}
      >

        <Button
          className="whitespace-nowrap mx-4"
          variant="contained"
          color="secondary"
          onClick={openCPModal}
          startIcon={<Icon className="hidden sm:flex">vpn_key</Icon>}
        >
          Change Password
        </Button> 
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={open}
          onClose={closeCPModal}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={open}>
            <Box sx={style}>
              <Typography className="mb30 white-text" id="transition-modal-title" variant="h6" component="h2">
                Change Your Password
              </Typography>
              <form className="flex flex-col justify-center w-full" onSubmit={handleSubmit(onSubmit)}  >

                <Controller
                  name="current_password"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      className="mb-16"
                      type="password"
                      label="Current Password"
                      error={!!errors.current_password}
                      helperText={errors?.current_password?.message}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <Icon className="text-20" color="action">
                              vpn_key
                            </Icon>
                          </InputAdornment>
                        ),
                      }}
                      variant="outlined"
                      required
                    />
                  )}
                />

                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      className="mb-16"
                      type="password"
                      label="New Password"
                      error={!!errors.password}
                      helperText={errors?.password?.message}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <Icon className="text-20" color="action">
                              vpn_key
                            </Icon>
                          </InputAdornment>
                        ),
                      }}
                      variant="outlined"
                      required
                    />
                  )}
                />

                <Controller
                  name="passwordConfirm"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      className="mb-16"
                      type="password"
                      label="Confirm Password"
                      error={!!errors.passwordConfirm}
                      helperText={errors?.passwordConfirm?.message}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <Icon className="text-20" color="action">
                              vpn_key
                            </Icon>
                          </InputAdornment>
                        ),
                      }}
                      variant="outlined"
                      required
                    />
                  )}
                />

                
                <Button
                  type="submit"
                  className="whitespace-nowrap mx-4"
                  variant="contained"
                  color="secondary"
                  disabled={_.isEmpty(dirtyFields) || !isValid}
                  startIcon={<Icon className="hidden sm:flex">vpn_key</Icon>}
                >
                  Change
                </Button>

              </form>
            </Box>
          </Fade>
        </Modal>
        
      </motion.div>
    </div>
  );
}

export default PageHeader;
