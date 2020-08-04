import { authRoles } from 'app/auth';
import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

const Add = lazy(() => import('./add/Add'));
const List = lazy(() => import('./list/List'));

const PositionsAppConfig = {
  settings: {
    layout: {},
  },
  routes: [
    {
      path: 'apps/positions',
      element: <List />,
      permission: "positions:read",
    },
    {
      path: 'apps/positions/:positionId/*',
      element: <Add />,
      permission: "positions:create",
    },
  ],
};

export default PositionsAppConfig;
