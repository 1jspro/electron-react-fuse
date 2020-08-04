import { authRoles } from 'app/auth';
import { lazy } from 'react';

const Settings = lazy(() => import('./Settings'));

const SettingsConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.user,
  routes: [
    {
      path: 'apps/settings',
      element: <Settings />,
    },
  ],
};

export default SettingsConfig;
