import { authRoles } from 'app/auth';
import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

const Add = lazy(() => import('./add/Add'));
const List = lazy(() => import('./list/List'));

const AssetAppConfig = {
  settings: {
    layout: {},
  },
  routes: [
    {
      path: 'apps/asset',
      element: <List />,
      permission: "assets:read",
    },
    {
      path: 'apps/asset/:assetId/*',
      element: <Add />,
      permission: "assets:create",
    },
  ],
};

export default AssetAppConfig;
