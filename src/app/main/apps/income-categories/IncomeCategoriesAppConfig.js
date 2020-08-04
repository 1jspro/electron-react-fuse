import { authRoles } from 'app/auth';
import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

const Add = lazy(() => import('./add/Add'));
const List = lazy(() => import('./list/List'));

const IncomeCategoriesAppConfig = {
  settings: {
    layout: {},
  },
  routes: [
    {
      path: 'apps/income-categories',
      element: <List />,
      permission: "income-categories:read",
    },
    {
      path: 'apps/income-categories/:categoryId/*',
      element: <Add />,
      permission: "income-categories:create",
    },
  ],
};

export default IncomeCategoriesAppConfig;
