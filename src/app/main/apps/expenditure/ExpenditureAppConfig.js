import { authRoles } from 'app/auth';
import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

const Add = lazy(() => import('./add/Add'));
const List = lazy(() => import('./list/List'));

const ExpenditureAppConfig = {
  settings: {
    layout: {},
  },
  routes: [
    {
      path: 'apps/expenditure',
      element: <List />,
      permission: "expenditures:read",
    },
    {
      path: 'apps/expenditure/:expenditureId/*',
      element: <Add />,
      permission: "expenditures:create",
    },
  ],
};

export default ExpenditureAppConfig;
