import { authRoles } from 'app/auth';
import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

const Add = lazy(() => import('./add/Add'));
const List = lazy(() => import('./list/List'));

const ProfessionsAppConfig = {
  settings: {
    layout: {},
  },
  routes: [
    {
      path: 'apps/professions',
      element: <List />,
      permission: "professions:read",
    },
    {
      path: 'apps/professions/:professionId/*',
      element: <Add />,
      permission: "professions:create",
    },
  ],
};

export default ProfessionsAppConfig;
