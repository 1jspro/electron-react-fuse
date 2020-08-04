import { authRoles } from 'app/auth';
import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

const Add = lazy(() => import('./add/Add'));
const List = lazy(() => import('./list/List'));
const Details = lazy(() => import('./details/Details'));
const EventsAppConfig = {
  settings: {
    layout: {},
  },
  routes: [
    {
      path: 'apps/events',
      element: <List />,
      permission: "events:read",
    },
    {
      path: 'apps/events/:eventId/*',
      element: <Add />,
      permission: "events:create",
    },
    {
      path: 'apps/events/details/:eventId/*',
      element: <Details />,
      permission: "events:read",
    },
  ],
};

export default EventsAppConfig;
