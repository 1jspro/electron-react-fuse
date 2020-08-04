import { authRoles } from 'app/auth';
import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

const Add = lazy(() => import('./add/Add'));
const List = lazy(() => import('./list/List'));

const DynamicFormsAppConfig = {
  settings: {
    layout: {},
  },
  routes: [
    {
      path: 'apps/dynamic-forms',
      element: <List />,
      permission: "dynamic-forms:read",
    },
    {
      path: 'apps/dynamic-forms/:formId/*',
      element: <Add />,
      permission: "dynamic-forms:create",
    },
  ],
};

export default DynamicFormsAppConfig;
