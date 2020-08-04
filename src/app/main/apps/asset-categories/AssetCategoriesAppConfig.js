import { authRoles } from 'app/auth';
import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

const Add = lazy(() => import('./add/Add'));
const List = lazy(() => import('./list/List'));

const AssetCategoriesAppConfig = {
  settings: {
    layout: {},
  },
  routes: [
    {
      path: 'apps/asset-categories',
      element: <List />,
      permission: "asset-categories:read",
    },
    {
      path: 'apps/asset-categories/:categoryId/*',
      element: <Add />,
      permission: "asset-categories:create",
    },
  ],
};

export default AssetCategoriesAppConfig;
