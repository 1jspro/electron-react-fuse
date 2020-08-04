import { authRoles } from 'app/auth';
import { lazy } from 'react';

const MemberDetails = lazy(() => import('./MemberDetails'));

const MemberDetailsConfig = {
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
      path: 'member-details/:memberId/*',
      element: <MemberDetails />,
    },
  ],
};

export default MemberDetailsConfig;
