import { authRoles } from 'app/auth';
import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

const Add = lazy(() => import('./add/Add'));
const List = lazy(() => import('./list/List'));

const AdminsAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.user,
  routes: [
    {
      path: 'apps/admins',
      element: <List />,
      permission: "admins:read",
    },
    {
      path: 'apps/admins/:adminId/*',
      element: <Add />,
      permission: "admins:create",
    },
  ],
};

export default AdminsAppConfig;
