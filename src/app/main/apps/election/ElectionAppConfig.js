import { authRoles } from 'app/auth';
import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

const Add = lazy(() => import('./add/Add'));
const List = lazy(() => import('./list/List'));
const Vote = lazy(() => import('./vote/List'));
const Details = lazy(() => import('./details/Details'));
const ElectionAppConfig = {
  settings: {
    layout: {},
  },
  routes: [
    {
      path: 'apps/elections',
      element: <List />,
      permission: "elections:read",
    },
    {
      path: 'apps/elections/vote/:electionId',
      element: <Details />,
      permission: "elections:read",
    },
    {
      path: 'apps/elections/details/:electionId',
      element: <Details />,
      permission: "elections:read",
    },
    {
      path: 'apps/elections/:electionId/*',
      element: <Add />,
      permission: "elections:create",
    },
    
  ],
};

export default ElectionAppConfig;
