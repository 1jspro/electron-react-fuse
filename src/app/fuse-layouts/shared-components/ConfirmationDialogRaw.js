import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Dialog from '@mui/material/Dialog';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import { showMessage } from 'app/store/fuse/messageSlice';


function ConfirmationDialogRaw(props) {
  const dispatch = useDispatch();
  const { onClose, open, operation, ...other } = props;

  const user = useSelector(({ auth }) => auth.user);

  const [title, setTitle] = useState('');
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) {
      if (operation == 'advertiser') {
        setTitle("Request for Advertiser's Role");
      } else if (operation == 'producer') {
        setTitle("Request for Producer's Role");
      }
    }
  }, [operation, open]);

  const handleCancel = () => {
    onClose();
  };

  const handleOk = () => {
    setLoading(true);
    
    /*if (operation == 'advertiser') {
      dispatch(requestForAdvertiser({user_id: user.uuid})).then((action) => {
        dispatch(showMessage({ message: action.payload.message }));
        setLoading(false);
        onClose();
      });
    } else {
      dispatch(requestForProducer({user_id: user.uuid})).then((action) => {
        dispatch(showMessage({ message: action.payload.message }));
        setLoading(false);
        onClose();
      });
    }*/
  };


  return (
    <Dialog
      sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435 } }}
      maxWidth="xs"
      open={open}
      {...other}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent dividers>
        <Typography color="textSecondary" variant="h6">
          Are you sure you want to perform this operation?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleCancel}>
          Cancel
        </Button>
        <Button onClick={handleOk}>{isLoading ? "Please wait..." : "Send Request"}</Button>
      </DialogActions>
    </Dialog>
  );
}

ConfirmationDialogRaw.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

export default ConfirmationDialogRaw;
