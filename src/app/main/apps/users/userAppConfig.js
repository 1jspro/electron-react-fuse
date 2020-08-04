import { lazy } from 'react';

const UserApp = lazy(() => import('./UserApp'));

const UserAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: 'apps/users',
      element: <UserApp />,
    },
  ],
};

export default UserAppConfig;
