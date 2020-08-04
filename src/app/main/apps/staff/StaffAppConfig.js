import { authRoles } from 'app/auth';
import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

const Add = lazy(() => import('./add/Add'));
const List = lazy(() => import('./list/List'));
/*const Details = lazy(() => import('./details/Details'));*/

const StaffAppConfig = {
  settings: {
    layout: {},
  },
  routes: [
    {
      path: 'apps/staff',
      element: <List />,
      permission: "staffs:read",
    },
    {
      path: 'apps/staff/:staffId/*',
      element: <Add />,
      permission: "staffs:create",
    },
    /*{
      path: 'apps/staff/details/:staffId/*',
      element: <Details />,
      permission: "staffs:read",
    },*/
  ],
};

export default StaffAppConfig;
