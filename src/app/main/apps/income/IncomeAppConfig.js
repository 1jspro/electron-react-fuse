import { authRoles } from 'app/auth';
import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

const Add = lazy(() => import('./add/Add'));
const List = lazy(() => import('./list/List'));

const IncomeAppConfig = {
  settings: {
    layout: {},
  },
  routes: [
    {
      path: 'apps/income',
      element: <List />,
      permission: "incomes:read",
    },
    {
      path: 'apps/income/:incomeId/*',
      element: <Add />,
      permission: "incomes:create",
    },
  ],
};

export default IncomeAppConfig;
