import { authRoles } from 'app/auth';
import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

const Add = lazy(() => import('./add/Add'));
const List = lazy(() => import('./list/List'));

const EducationLevelsAppConfig = {
  settings: {
    layout: {},
  },
  routes: [
    {
      path: 'apps/education-levels',
      element: <List />,
      permission: "education-levels:read",
    },
    {
      path: 'apps/education-levels/:levelId/*',
      element: <Add />,
      permission: "education-levels:create",
    },
  ],
};

export default EducationLevelsAppConfig;
