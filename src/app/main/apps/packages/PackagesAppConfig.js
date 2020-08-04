import { authRoles } from 'app/auth';
import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

const Add = lazy(() => import('./add/Add'));
const List = lazy(() => import('./list/List'));

const PackagesAppConfig = {
  settings: {
    layout: {},
  },
  routes: [
    {
      path: 'apps/packages',
      element: <List />,
      permission: "packages:read",
    },
    {
      path: 'apps/packages/:packageId/*',
      element: <Add />,
      permission: "packages:create",
    },
  ],
};

export default PackagesAppConfig;
