import { authRoles } from 'app/auth';
import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

const Add = lazy(() => import('./add/Add'));
const List = lazy(() => import('./list/List'));
const Details = lazy(() => import('./details/Details'));
const ProjectsAppConfig = {
  settings: {
    layout: {},
  },
  routes: [
    {
      path: 'apps/projects',
      element: <List />,
      permission: "projects:read",
    },
    {
      path: 'apps/projects/:projectId/*',
      element: <Add />,
      permission: "projects:create",
    },
    {
      path: 'apps/projects/details/:projectId/*',
      element: <Details />,
      permission: "projects:read",
    },
  ],
};

export default ProjectsAppConfig;
