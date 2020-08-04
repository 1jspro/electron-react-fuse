import { authRoles } from 'app/auth';
import { lazy } from 'react';

const Profile = lazy(() => import('./Profile'));

const ProfileConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.user,
  routes: [
    {
      path: 'profile',
      element: <Profile />,
    },
  ],
};

export default ProfileConfig;
