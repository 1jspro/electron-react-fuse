import { authRoles } from 'app/auth';
import { lazy } from 'react';

const RegisterMember = lazy(() => import('./RegisterMember'));

const RegisterMemberConfig = {
  settings: {
    layout: {
      config: {
        navbar: {
          display: false,
        },
        toolbar: {
          display: false,
        },
        footer: {
          display: false,
        },
        leftSidePanel: {
          display: false,
        },
        rightSidePanel: {
          display: false,
        },
      },
    },
  },
  routes: [
    {
      path: 'register-member/:adminId/*',
      element: <RegisterMember />,
    },
  ],
};

export default RegisterMemberConfig;
