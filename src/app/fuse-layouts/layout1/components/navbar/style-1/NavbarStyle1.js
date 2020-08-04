import Button from '@mui/material/Button';
import Icon from '@mui/material/Icon';
import Hidden from '@mui/material/Hidden';
import { motion } from 'framer-motion';
import { styled } from '@mui/material/styles';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { useDispatch, useSelector } from 'react-redux';
import { navbarCloseMobile, getProfileData } from 'app/store/fuse/navbarSlice';
import { exitMirrorUser } from 'app/auth/store/userSlice';
import { showMessage } from 'app/store/fuse/messageSlice';
import NavbarStyle1Content from './NavbarStyle1Content';

const navbarWidth = 280;

const StyledNavBar = styled('div')(({ theme, open, position }) => ({
  minWidth: navbarWidth,
  width: navbarWidth,
  maxWidth: navbarWidth,
  ...(!open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.leavingScreen,
    }),
    ...(position === 'left' && {
      marginLeft: `-${navbarWidth}px`,
    }),
    ...(position === 'right' && {
      marginRight: `-${navbarWidth}px`,
    }),
  }),
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const StyledNavBarMobile = styled(SwipeableDrawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    minWidth: navbarWidth,
    width: navbarWidth,
    maxWidth: navbarWidth,
  },
}));

function NavbarStyle1(props) {
  const dispatch = useDispatch();
  const config = useSelector(({ fuse }) => fuse.settings.current.layout.config);
  const navbar = useSelector(({ fuse }) => fuse.navbar);
  const user = useSelector(({ auth }) => auth.user);

  
  function handleExitMirror() {
    dispatch(getProfileData({user_id: user.muid})).then((action) => { 
      if (action.payload.success && action.payload.user) {
        dispatch(exitMirrorUser({user: action.payload.user, access_token: action.payload.access_token}));
        dispatch(showMessage({ message: "Exited from "+user.data.displayName+"'s dashboard" }));
        props.navigate(`/apps/dashboard`);
      }
    });
  }

  return (
    <>
      <Hidden lgDown>
        <StyledNavBar
          className="flex-col flex-auto sticky top-0 overflow-hidden h-screen shrink-0 z-20 shadow-5"
          open={navbar.open}
          position={config.navbar.position}
        >
          <NavbarStyle1Content />
        </StyledNavBar>
      </Hidden>

      <Hidden lgUp>
        <StyledNavBarMobile
          classes={{
            paper: 'flex-col flex-auto h-full',
          }}
          anchor={config.navbar.position}
          variant="temporary"
          open={navbar.mobileOpen}
          onClose={() => dispatch(navbarCloseMobile())}
          onOpen={() => {}}
          disableSwipeToOpen
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
        >
          <NavbarStyle1Content />
        </StyledNavBarMobile>
      </Hidden>

      {user.muid &&
        <motion.div
          className="mt30 pb30"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0, transition: { delay: 0.3 } }}
        >
          <Button
            className="whitespace-nowrap mx-4 exitMirrorButton"
            variant="contained"
            color="secondary"
            onClick={handleExitMirror}
          >
            
            <Icon>exit_to_app</Icon> Exit From Mirror

          </Button>
        </motion.div>
      }
    </>
  );
}

export default NavbarStyle1;
