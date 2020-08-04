import { authRoles } from 'app/auth';
import { lazy } from 'react';

const CommunicationApp = lazy(() => import('./CommunicationApp'));

const CommunicationAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.user,
  routes: [
    {
      path: 'apps/Communication',
      element: <CommunicationApp />,
      permission: "communications:read",
    },
  ],
};

export default CommunicationAppConfig;