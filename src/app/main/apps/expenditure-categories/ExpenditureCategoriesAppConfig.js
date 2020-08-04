import { authRoles } from 'app/auth';
import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

const Add = lazy(() => import('./add/Add'));
const List = lazy(() => import('./list/List'));

const ExpenditureCategoriesAppConfig = {
  settings: {
    layout: {},
  },
  routes: [
    {
      path: 'apps/expenditure-categories',
      element: <List />,
      permission: "expenditure-categories:read",
    },
    {
      path: 'apps/expenditure-categories/:categoryId/*',
      element: <Add />,
      permission: "expenditure-categories:create",
    },
  ],
};

export default ExpenditureCategoriesAppConfig;
