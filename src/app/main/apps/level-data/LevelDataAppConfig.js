import { authRoles } from 'app/auth';
import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

const Add = lazy(() => import('./add/Add'));
const List = lazy(() => import('./list/List'));

const LevelDataAppConfig = {
  settings: {
    layout: {},
  },
  routes: [
    {
      path: 'apps/level-data',
      element: <List />,
      permission: "level-data:read",
    },
    {
      path: 'apps/level-data/:dataId/*',
      element: <Add />,
      permission: "level-data:create",
    },
  ],
};

export default LevelDataAppConfig;
