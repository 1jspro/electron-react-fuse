import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Icon from '@mui/material/Icon';
import Checkbox from '@mui/material/Checkbox';
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
import { assignAdmin, getMembers } from '../store/levelDataListSlice';
import { motion } from 'framer-motion';
import Typography from '@mui/material/Typography';
import { showMessage } from 'app/store/fuse/messageSlice';
import FuseLoading from '@fuse/core/FuseLoading';

import { getPermissions } from '../../staff/store/staffSlice';

function AssignAdminDialogRaw(props) {
  const dispatch = useDispatch();
  const { onClose, open, level_data, ...other } = props;

  const methods = useForm({
    mode: 'onChange',
    defaultValues: {},
  });
  const { reset, watch, control, onChange, formState, setValue, getValues } = methods;
  const { isValid, dirtyFields, errors } = formState;
  const form = watch();
  const [members, setMembers] = useState([]);

  const [permissions, setPermissions] = useState([]);
  const [checked, setChecked] = useState({});
  const [permissionsValue, setPemissionsValue] = useState([]);
  const [childrenVisibility, setChildrenVisibility] = useState({});

  const [loadingMembers, setLoadingMembers] = useState(true);


  useEffect(() => {
    if (!open) {
      setValue('level_data_id', level_data.id);
      setValue('member_id', '');
    } else {
      setLoadingMembers(true);
      dispatch(getMembers({ level_data_id: level_data.id })).then((action) => {
        setMembers(action.payload);
        setLoadingMembers(false);

        action.payload.map((member, k) => {
          if (member.admin_for_level_data + '' === '' + level_data.id) {
            setValue('member_id', member.id + '');
          }
        })
      });

      dispatch(getPermissions()).then((act) => {
        setPermissions(act.payload);
      })
    }
  }, [level_data, open, dispatch]);

  const handleCancel = () => {
    onClose();
  };

  const handleOk = () => {
    /* console.log(getValues())
    return false; */
    dispatch(assignAdmin(getValues())).then((action) => {
      dispatch(showMessage({ message: action.payload.message }));
      onClose(true);
    });
  };

  const handleChange = (event) => {
    setValue('member_id', event.target.value);
  };

  const handleChangeChildren = (permission, index, event) => {
    const checkedParents = { ...checked };
    checkedParents[permission.parent][index] = event.target.checked;
    setChecked(checkedParents);

    let permissionsSelected = [...permissionsValue];
    let child = permission.children[index];
    if (event.target.checked) {
      if (permissionsSelected.indexOf(child) === -1) {
        permissionsSelected.push(child);
      }
    } else {
      if (permissionsSelected.indexOf(child) !== -1) {
        permissionsSelected.splice(permissionsSelected.indexOf(child), 1);
      }
    }
    setPemissionsValue(permissionsSelected);
    setValue("permission", permissionsSelected/* .join(",") */);
  };

  const handleChangeParent = (permission, event) => {
    const checkedParents = { ...checked };
    checkedParents[permission.parent] = permission.children.map((child) => {
      return event.target.checked;
    });
    setChecked(checkedParents);

    let permissionsSelected = [...permissionsValue];
    if (event.target.checked) {
      permission.children.forEach((child) => {
        if (permissionsSelected.indexOf(child) === -1) {
          permissionsSelected.push(child);
        }
      });
    } else {
      permission.children.forEach((child) => {
        if (permissionsSelected.indexOf(child) !== -1) {
          permissionsSelected.splice(permissionsSelected.indexOf(child), 1);
        }
      });
    }

    setPemissionsValue(permissionsSelected);
    setValue("permission", permissionsSelected/* .join(",") */);
  };

  const handleChildrenVisibility = (permission, event) => {
    const childrenVisibilityI = { ...childrenVisibility };
    childrenVisibilityI[permission.parent] = !childrenVisibilityI[permission.parent];
    setChildrenVisibility(childrenVisibilityI);
  };
  return (
    <Dialog
      sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435 } }}
      maxWidth="xs"
      open={open}
      {...other}
    >
      <DialogTitle>{level_data.has_admin ? 'Change' : 'Assign'} Admin</DialogTitle>
      
      <DialogContent dividers>
        {!loadingMembers && (members && members.length > 0) && <>
          <Controller
            name="member_id"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth>
                <InputLabel id={"member-simple-select-label"}>Member</InputLabel>
                {/* mt-8 mb-16 px-3 */}
                <Select
                  {...field}
                  id="member_id"
                  labelId={"member-simple-select-label"}
                  label="Select Member"
                  autoFocus
                  className="mb-16 "
                  onChange={(evnt) => handleChange(evnt)}
                  defaultValue=""
                >
                  <MenuItem key={"el_0"} value={""}>Select</MenuItem>
                  {members && members.length > 0 && members.map((member, k) => {
                    return (member.admin_for_level_data + '' === '' + level_data.id || member.is_member_admin === 0 ? <MenuItem key={"el_" + member.id + ""} value={member.id + ""} >{member.first_name} {member.last_name}</MenuItem> : '')
                  })}
                </Select>
              </FormControl>
            )}
          />

          <Typography className="mb-5" color="textSecondary" >
            Permissions:
          </Typography>
          {permissions && permissions.length > 0 && permissions.map((permission, k) =>
            <div key={"parent_" + k}>
              {!childrenVisibility[permission.parent] &&
                <Icon className="text-16 accordianIcon" onClick={(evnt) => handleChildrenVisibility(permission, evnt)}>
                  add
                </Icon>
              }
              {childrenVisibility[permission.parent] &&
                <Icon className="text-16 accordianIcon" onClick={(evnt) => handleChildrenVisibility(permission, evnt)}>
                  remove
                </Icon>
              }
              <FormControlLabel
                label={permission.parent}
                className="text-capitalize"
                control={
                  <Checkbox
                    checked={checked[permission.parent] && checked[permission.parent].filter((p) => {
                      if (p) {
                        return p;
                      }
                    }).length == permission.children.length}
                    indeterminate={(checked[permission.parent] && (checked[permission.parent].filter((p) => {
                      if (p) {
                        return p;
                      }
                    }).length < permission.children.length) && (checked[permission.parent].filter((p) => {
                      if (p) {
                        return p;
                      }
                    }).length > 0))}
                    onChange={(evnt) => handleChangeParent(permission, evnt)}
                  />
                }
              />
              {childrenVisibility[permission.parent] &&
                <Box sx={{ display: 'flex', flexDirection: 'column', ml: 3 }}>
                  {permission.children && permission.children.length > 0 && permission.children.map((child, ck) =>
                    <FormControlLabel
                      key={"child_" + ck}
                      className="text-capitalize"
                      label={child.replace(":", " ")}
                      control={<Checkbox checked={(checked[permission.parent] && checked[permission.parent][ck]) ? checked[permission.parent][ck] : false} onChange={(evnt) => handleChangeChildren(permission, ck, evnt)} />}
                    />
                  )}
                </Box>}
            </div>
          )}
        </>}

        {!loadingMembers && (!members || (members && members.length == 0)) && <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 0.1 } }}
          className=" mtb-30 flex flex-1 items-center justify-center h-full"
        >
          <Typography color="textSecondary" variant="h5">
            There are no members!
          </Typography>
        </motion.div>}


        {loadingMembers &&
          <FuseLoading />
        }

      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleCancel}>
          {(members && members.length > 0) ? 'Cancel' : "Close"}
        </Button>
        {members && members.length > 0 && <Button onClick={handleOk}>{level_data.has_admin ? 'Change' : 'Assign'}</Button>}
      </DialogActions>
    </Dialog>
  );
}

AssignAdminDialogRaw.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  level_data: PropTypes.object.isRequired,
};

export default AssignAdminDialogRaw;
