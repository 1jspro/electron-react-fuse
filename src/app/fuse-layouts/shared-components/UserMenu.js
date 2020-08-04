import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Icon from '@mui/material/Icon';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { logoutUser, exitMirrorUser, setUserData } from 'app/auth/store/userSlice';
import { showMessage } from 'app/store/fuse/messageSlice';
import { getAdminProfile } from 'app/main/apps/admins/store/adminsSlice';
import jwtService from 'app/services/jwtService';
import ConfirmationDialogRaw from './ConfirmationDialogRaw';

function UserMenu(props) {
  const dispatch = useDispatch();
  const user = useSelector(({ auth }) => auth.user);
  const permissions = user && user.data && user.data.permissions ? user.data.permissions : [];
  const location = useLocation();

  const navigate = useNavigate();

  const [userMenu, setUserMenu] = useState(null);
  const [open, setOpen] = useState(false);
  const [operation, setOperation] = useState('');

  const userMenuClick = (event) => {
    setUserMenu(event.currentTarget);
  };

  const userMenuClose = () => {
    setUserMenu(null);
  };

  function handleExitMirror() {
    dispatch(exitMirrorUser({})).then((data) => {
      dispatch(getAdminProfile()).then((userAction) => {
        const userData = userAction.payload;
        console.log(userData, 'userData');
        if (userData.user_data) {
          const muid = window.localStorage.getItem('muid');
          if (muid) {
            userData.user_data.muid = muid;
          } else {
            userData.user_data.muid = '';
          }

          let { permissions } = userData.user_data;
          const read_only_permissions = userData.user_data['read-only']
            ? userData.user_data['read-only']
            : [];
          if (read_only_permissions.length > 0) {
            permissions = permissions.filter((p) => {
              if (read_only_permissions.indexOf(p) === -1) {
                return p;
              }
            });
          }

          if (userData.user_data.show_id_card === 0) {
            const arr = ['id-cards:create', 'id-cards:edit', 'id-cards:delete', 'id-cards:read'];
            permissions = permissions.filter((p) => {
              if (arr.indexOf(p) === -1) {
                return p;
              }
            });
          }

          userData.user_data.permissions = permissions;
          jwtService.setPermissions(permissions);

          const user = {
            muid: userData.user_data.muid ? userData.user_data.muid : '',
            role: userData.user_data.roles, // guest
            data: {
              displayName: userData.user_data.first_name
                ? `${userData.user_data.first_name} ${userData.user_data.last_name}`
                : '',
              photoURL: userData.user_data.profile_pic,
              email: userData.user_data.email,
              permissions: userData.user_data.permissions,
              level_id: userData.user_data.level_id ? userData.user_data.level_id : '',
            },
          };
          dispatch(setUserData(user));
          if (location.pathname == '/apps/dashboard') {
            window.location.reload();
            dispatch(showMessage({ message: `Exited from ${user.data.displayName}'s dashboard` }));
          } else {
            dispatch(showMessage({ message: `Exited from ${user.data.displayName}'s dashboard` }));
            navigate(`/apps/dashboard`);
            window.location.reload();
          }
        } else {
          dispatch(showMessage({ message: 'Something went wrong......!' }));
        }
      });
    });
  }

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Button
        className="min-h-40 min-w-40 px-0 md:px-16 py-0 md:py-6"
        onClick={userMenuClick}
        color="inherit"
      >
        <div className="hidden md:flex flex-col mx-4 items-end">
          <Typography component="span" className="font-semibold text-16 md:text-16 flex capitalize">
            {user.data.displayName}
          </Typography>
          {/* <Typography className="text-11 font-medium capitalize" color="textSecondary">
                      {user.role.toString()}
                      {(!user.role || (Array.isArray(user.role) && user.role.length === 0)) && 'Guest'}
                    </Typography> */}
          <Typography className="text-11 font-medium " color="textSecondary">
            {user.data.email}
          </Typography>
        </div>

        {user.data.photoURL ? (
          <Avatar className="md:mx-4" alt="user photo" src={user.data.photoURL} />
        ) : (
          <Avatar className="md:mx-4 capitalize">{user.data.displayName[0]}</Avatar>
        )}
      </Button>

      <Popover
        open={Boolean(userMenu)}
        anchorEl={userMenu}
        onClose={userMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        classes={{
          paper: 'py-8',
        }}
      >
        {!user.role || user.role.length === 0 ? (
          <>
            <MenuItem component={Link} to="/login" role="button">
              <ListItemIcon className="min-w-40">
                <Icon>lock</Icon>
              </ListItemIcon>
              <ListItemText primary="Login" />
            </MenuItem>
            <MenuItem component={Link} to="/register" role="button">
              <ListItemIcon className="min-w-40">
                <Icon>person_add</Icon>
              </ListItemIcon>
              <ListItemText primary="Register" />
            </MenuItem>
          </>
        ) : (
          <>
            <MenuItem component={Link} to="/profile" onClick={userMenuClose} role="button">
              <ListItemIcon className="min-w-40">
                <Icon>account_circle</Icon>
              </ListItemIcon>
              <ListItemText primary="My Profile" />
            </MenuItem>

            {user.muid && (
              <MenuItem onClick={handleExitMirror}>
                <ListItemIcon className="min-w-40">
                  <Icon>exit_to_app</Icon>
                </ListItemIcon>
                <ListItemText primary="Exit From Admin Dashboard" />
              </MenuItem>
            )}

            {permissions.indexOf('subscriptions:create') > -1 && (
              <MenuItem
                component={Link}
                to="/apps/subscriptions"
                onClick={userMenuClose}
                role="button"
              >
                <ListItemIcon className="min-w-40">
                  <Icon>subscriptions</Icon>
                </ListItemIcon>
                <ListItemText primary="Subscriptions" />
              </MenuItem>
            )}

            <MenuItem
              onClick={() => {
                dispatch(logoutUser());
                userMenuClose();
              }}
            >
              <ListItemIcon className="min-w-40">
                <Icon>exit_to_app</Icon>
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </MenuItem>
          </>
        )}
      </Popover>

      <ConfirmationDialogRaw
        id="approvalDialog"
        keepMounted
        open={open}
        onClose={handleClose}
        operation={operation}
      />
    </>
  );
}

export default UserMenu;
