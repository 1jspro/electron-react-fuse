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
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from "@mui/material/MenuItem";
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useForm, FormProvider, useFormContext, Controller } from 'react-hook-form';
import { importMembers, getLevels, getLevelsData, customExcel } from '../store/membersSlice';
import Typography from '@mui/material/Typography';
import { showMessage } from 'app/store/fuse/messageSlice';

function ImportDialogRaw(props) {
  const dispatch = useDispatch();
  const { onClose, open, ...other } = props;

  const methods = useForm({
    mode: 'onChange',
    defaultValues: {},
  });
  const { reset, watch, control, onChange, formState, setValue, getValues } = methods;
  const { isValid, dirtyFields, errors } = formState;
  const form = watch();
  const [fileName, setFileName] = useState("");
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
        setLevelDataList(datalist)
      });
    });
  }, [dispatch]);

  const handleSampleFile = () => {
    dispatch(customExcel()).then(async (action) => {

      let a = document.createElement('a');
      await fetch(action.payload, { method: "GET", headers: {} }).then(async response => await response.blob()).then(async blob => {
        let blobUrl = await window.URL.createObjectURL(blob);
        a.href = blobUrl;
        a.download = action.payload.replace(/^.*[\\\/]/, '');
        document.body.appendChild(a);
        a.click();
        await window.URL.revokeObjectURL(blobUrl);
        a.remove();
      })
    });
  }

  const handleCancel = () => {
    onClose();
  };

  const handleOk = () => {
    dispatch(importMembers(getValues())).then((action) => {
      dispatch(showMessage({ message: action?.payload?.message || 'Unable to add members' }))
      onClose(true);
    }).catch(e => {console.log(e)})
  };

  function handleLevelChange(key, event) {
    let dataIds = { ...selectedDataIds };
    dataIds[levels[key]['id']] = event.target.value + "";
    setSelectedDataIds(dataIds);

    if (levels && key < levels.length) {
      let level_id = levels[key + 1] ? levels[key + 1].id : "";
      if (level_id) {
        dispatch(getLevelsData({ level_id: level_id, parent_id: event.target.value })).then((action) => {
          const datalist = [...levelDataList];
          datalist[level_id] = action.payload;
          setLevelDataList(datalist)
        });
      }
    }

    if (key == levels.length - 1) {
      setValue('level_data_id', event.target.value);
    }
  }


  const handleFileRead = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      let files = event.target.files;
      setFileName(files[0].name);
      let reader = new FileReader();
      reader.readAsDataURL(files[0]);

      reader.onload = (e) => {
        setValue('file', e.target.result);
      }
    }
  };

  return (
    <Dialog
      sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435 } }}
      maxWidth="xs"
      open={open}
      {...other}
    >
      <DialogTitle>Import Members</DialogTitle>
      <DialogContent dividers>
        {levels && levels.length > 0 && levels.map((level, k) =>
          <Controller
            name={"level_" + level.id}
            key={k}
            control={control}
            render={({ field }) => (
              <FormControl fullWidth>
                <InputLabel id={"level-simple-select-label_" + level.id}>{level.name}</InputLabel>
                <Select
                  {...field}
                  id={"level_" + level.id}
                  labelId={"level-simple-select-label_" + level.id}
                  label={level.name}
                  className="mt-8 mb-16 mx-4"
                  value={selectedDataIds[level.id] ? selectedDataIds[level.id] : ""}
                  onChange={(evnt) => handleLevelChange(k, evnt)}
                >
                  <MenuItem key={"ld_" + level.id} value={""}>Select</MenuItem>
                  {levelDataList && levelDataList[level.id] && levelDataList[level.id].length > 0 && levelDataList[level.id].map((levelData, k) =>
                    <MenuItem key={"el_" + levelData.id + ""} value={levelData.id + ""} >{levelData.name}</MenuItem>
                  )}
                </Select>
              </FormControl>
            )}
          />
        )}
        <div style={{ display: 'flex' }}>
          <input
            color="primary"
            accept=".xlsx"
            type="file"
            onChange={e => handleFileRead(e)}
            id="icon-button-file"
            style={{ display: 'none', }}
          />
          <label htmlFor="icon-button-file">
            <Button
              variant="contained"
              component="span"
              size="large"
              color="primary"
            >
              Upload EXLS File
            </Button>
          </label>
          {fileName !== '' ? <p className="upldoadedFile">{fileName}</p> : ''}
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '5px' }}>
          {/* <p style={{}}><a href="demoexcelupload.xlsx" download={``} style={{ color: '#000' }}>Download Sample File</a></p> */}
          // <p style={{}}><a href="javascript:void(0);" onClick={handleSampleFile} style={{ color: '#000' }}>Dynamic File</a></p>
          <Button
            variant="contained"
            component="span"
            size="medium"
            color="secondary"
            onClick={handleSampleFile}
          >
            Dynamic File
          </Button>
          {/* <Button
            variant="contained"
            component="span"
            size="medium"
            color="secondary"
            type='button'

          >
            Dynamic File
          </Button> */}
        </div>

      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleCancel}>
          Cancel
        </Button>
        <Button onClick={handleOk}>Import</Button>
      </DialogActions>
    </Dialog>
  );
}

ImportDialogRaw.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired
};

export default ImportDialogRaw;
