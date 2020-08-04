import { authRoles } from 'app/auth';
import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

const Add = lazy(() => import('./add/Add'));
const List = lazy(() => import('./list/List'));

const LevelsAppConfig = {
  settings: {
    layout: {},
  },
  routes: [
    {
      path: 'apps/levels',
      element: <List />,
      permission: "levels:read",
    },
    {
      path: 'apps/levels/:levelId/*',
      element: <Add />,
      permission: "levels:create",
    },
  ],
};

export default LevelsAppConfig;
