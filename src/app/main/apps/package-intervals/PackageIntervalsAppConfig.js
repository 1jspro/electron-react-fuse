import { authRoles } from 'app/auth';
import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

const Add = lazy(() => import('./add/Add'));
const List = lazy(() => import('./list/List'));

const PackageIntervalsAppConfig = {
  settings: {
    layout: {},
  },
  routes: [
    {
      path: 'apps/package-intervals',
      element: <List />,
      permission: "package-intervals:read",
    },
    {
      path: 'apps/package-intervals/:intervalId/*',
      element: <Add />,
      permission: "package-intervals:create",
    },
  ],
};

export default PackageIntervalsAppConfig;
