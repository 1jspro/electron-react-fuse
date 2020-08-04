import { authRoles } from 'app/auth';
import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

const Add = lazy(() => import('./add/Add'));
const List = lazy(() => import('./list/List'));

const IndustriesAppConfig = {
  settings: {
    layout: {},
  },
  routes: [
    {
      path: 'apps/industries',
      element: <List />,
      permission: "industries:read",
    },
    {
      path: 'apps/industries/:industryId/*',
      element: <Add />,
      permission: "industries:create",
    },
  ],
};

export default IndustriesAppConfig;
