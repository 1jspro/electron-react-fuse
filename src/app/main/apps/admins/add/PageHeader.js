import Button from '@mui/material/Button';
import Icon from '@mui/material/Icon';
import { useTheme } from '@mui/material/styles';
import { showMessage } from 'app/store/fuse/messageSlice';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import { useFormContext } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import _ from '@lodash';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import { saveAdmin, removeAdmin, getLevels } from '../store/adminSlice';
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


function PageHeader(props) {
  const dispatch = useDispatch();
  const methods = useFormContext();
  const { formState, watch, getValues } = methods;
  const { isValid, dirtyFields } = formState;
  const name = watch('name');
  const breed_id = watch('breed_id');
  const id = watch('id');
  const theme = useTheme();
  const navigate = useNavigate();
  const [levels, setLevels] = useState([]);
  const [open, setOpen] = useState(false);
  
  const user = useSelector(({ auth }) => auth.user);

  useEffect(() => {
    dispatch(getLevels()).then((action) => {
      setLevels(action.payload);
    });
  }, [dispatch]);

  function handleSaveAdmin() {
    dispatch(saveAdmin(getValues())).then((action) => {
      if (action.payload && action.payload.error && action.payload.error[0]) {
        dispatch(showMessage({ message: action.payload.error[0].message }));
      } else {
        dispatch(showMessage({ message: action.payload.message }));
        navigate('/apps/admins');
      }
    });
  }

  function handleRemoveAdmin() {
    dispatch(removeAdmin()).then(() => {
      navigate('/apps/admins');
    });
  }


  function openTransferModal() {
    setOpen(true);
  }

  function closeTransferModal() {
    setOpen(false);
  }

  const handleProducerChange = (event) => {
    setProducer(event.target.value);
  };



  return (
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
            to="/apps/admins"
            color="inherit"
          >
            <Icon className="text-20">
              {theme.direction === 'ltr' ? 'arrow_back' : 'arrow_forward'}
            </Icon>
            <span className="hidden sm:flex mx-4 font-medium">Admins</span>
          </Typography>
        </motion.div>

        <div className="flex items-center max-w-full">
          <motion.div
            className="hidden sm:flex"
            initial={{ scale: 0 }}
            animate={{ scale: 1, transition: { delay: 0.3 } }}
          >
            
              <img
                className="w-32 sm:w-48 rounded"
                src="assets/images/ecommerce/product-image-placeholder.png"
                alt={name}
              />
          </motion.div>
          <div className="flex flex-col min-w-0 mx-8 sm:mc-16">
            <motion.div initial={{ x: -20 }} animate={{ x: 0, transition: { delay: 0.3 } }}>
              <Typography className="text-16 sm:text-20 truncate font-semibold">
                {name || 'New Admin'}
              </Typography>
              <Typography variant="caption" className="font-medium">
                Admin Detail
              </Typography>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PageHeader;
