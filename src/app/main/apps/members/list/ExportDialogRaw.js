import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Dialog from '@mui/material/Dialog';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { showMessage } from 'app/store/fuse/messageSlice';
import { exportMembers, getLevels, getLevelsData } from '../store/membersSlice';

function ExportDialogRaw(props) {
  const dispatch = useDispatch();
  const { onClose, open, ...other } = props;

  const methods = useForm({
    mode: 'onChange',
    defaultValues: {},
  });
  const { reset, watch, control, onChange, formState, setValue, getValues } = methods;
  const { isValid, dirtyFields, errors } = formState;
  const form = watch();
  const [fileName, setFileName] = useState('');
  const [levels, setLevels] = useState([]);
  const [levelDataList, setLevelDataList] = useState([]);
  const [selectedDataIds, setSelectedDataIds] = useState({});

  useEffect(() => {
    dispatch(getLevels()).then((action) => {
      setLevels(action.payload);
      const top_level_id = action.payload[0].id;

      dispatch(getLevelsData({ level_id: top_level_id })).then((action) => {
        const datalist = [...levelDataList];
        datalist[top_level_id] = action.payload;
        setLevelDataList(datalist);
      });
    });
  }, [dispatch]);

  const handleCancel = () => {
    onClose();
  };

  const handleOk = () => {
    dispatch(exportMembers(getValues())).then((action) => {
      const link = document.createElement('a');
      if (action?.payload) {
        link.href = action.payload.data;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        dispatch(showMessage({ message: action.payload.message }));
        onClose(true);
      }
    });
  };

  function handleLevelChange(key, event) {
    const dataIds = { ...selectedDataIds };
    dataIds[levels[key].id] = `${event.target.value}`;
    setSelectedDataIds(dataIds);

    if (levels && key < levels.length) {
      const level_id = levels[key + 1] ? levels[key + 1].id : '';
      if (level_id) {
        dispatch(getLevelsData({ level_id, parent_id: event.target.value })).then((action) => {
          const datalist = [...levelDataList];
          datalist[level_id] = action.payload;
          setLevelDataList(datalist);
        });
      }
    }

    setValue('level_data_id', event.target.value);
  }

  return (
    <Dialog
      sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435 } }}
      maxWidth="xs"
      open={open}
      {...other}
    >
      <DialogTitle>Export Members</DialogTitle>
      <DialogContent dividers>
        {levels &&
          levels.length > 0 &&
          levels.map((level, k) => (
            <Controller
              name={`level_${level.id}`}
              key={k}
              control={control}
              render={({ field }) => (
                <FormControl fullWidth>
                  <InputLabel id={`level-simple-select-label_${level.id}`}>{level.name}</InputLabel>
                  <Select
                    {...field}
                    id={`level_${level.id}`}
                    labelId={`level-simple-select-label_${level.id}`}
                    label={level.name}
                    className="mt-8 mb-16 mx-4"
                    value={selectedDataIds[level.id] ? selectedDataIds[level.id] : ''}
                    onChange={(evnt) => handleLevelChange(k, evnt)}
                  >
                    <MenuItem key={`ld_${level.id}`} value="">
                      Select
                    </MenuItem>
                    {levelDataList &&
                      levelDataList[level.id] &&
                      levelDataList[level.id].length > 0 &&
                      levelDataList[level.id].map((levelData, k) => (
                        <MenuItem key={`el_${levelData.id}`} value={`${levelData.id}`}>
                          {levelData.name}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              )}
            />
          ))}
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleCancel}>
          Cancel
        </Button>
        <Button onClick={handleOk}>Export</Button>
      </DialogActions>
    </Dialog>
  );
}

ExportDialogRaw.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

export default ExportDialogRaw;
