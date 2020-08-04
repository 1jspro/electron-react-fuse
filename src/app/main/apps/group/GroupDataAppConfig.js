import { authRoles } from 'app/auth';
import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

const Add = lazy(() => import('./add/Add'));
const List = lazy(() => import('./list/List'));
const Members = lazy(() => import('./list/Members'));

const LevelDataAppConfig = {
  settings: {
    layout: {},
  },
  routes: [
    {
      path: 'apps/group',
      element: <List />,
      permission: "groups:read",
    },
    {
      path: 'apps/groups/:id',
      element: <Members />,
      permission: "groups:read",
    },
    {
      path: 'apps/group/:dataId/*',
      element: <Add />,
      permission: "groups:create",
    },
  ],
};

export default LevelDataAppConfig;
