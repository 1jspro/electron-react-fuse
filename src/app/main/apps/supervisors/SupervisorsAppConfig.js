import { authRoles } from 'app/auth';
import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

const Add = lazy(() => import('./add/Add'));
const List = lazy(() => import('./list/List'));

const SupervisorsAppConfig = {
  settings: {
    layout: {},
  },
  routes: [
    {
      path: 'apps/supervisors',
      element: <List />,
      permission: "supervisor:read",
    },
    {
      path: 'apps/supervisors/:supervisorId/*',
      element: <Add />,
      permission: "supervisor:create",
    },
  ],
};

export default SupervisorsAppConfig;
