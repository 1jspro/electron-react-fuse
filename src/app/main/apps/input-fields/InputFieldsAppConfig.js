import { authRoles } from 'app/auth';
import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

const Add = lazy(() => import('./add/Add'));
const List = lazy(() => import('./list/List'));

const InputFieldsAppConfig = {
  settings: {
    layout: {},
  },
  routes: [
    {
      path: 'apps/input-fields',
      element: <List />,
      permission: "input-fields:read",
    },
    {
      path: 'apps/input-fields/:fieldId/*',
      element: <Add />,
      permission: "input-fields:create",
    },
  ],
};

export default InputFieldsAppConfig;
