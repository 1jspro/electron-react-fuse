import { authRoles } from 'app/auth';
import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

const List = lazy(() => import('./list/List'));

const ExecutivesAppConfig = {
  settings: {
    layout: {},
  },
  routes: [
    {
      path: 'apps/executives',
      element: <List />,
      permission: "executive:read",
    },
    /*
    {
      path: 'apps/executives/details/:memberId/*',
      element: <Details />,
      permission: "executives:read",
    },*/
  ],
};

export default ExecutivesAppConfig;
