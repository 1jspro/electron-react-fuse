import { authRoles } from 'app/auth';
import Callback from './Callback';

const CallbackConfig = {
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
  auth: authRoles.admin,
  routes: [
    {
      path: 'callback',
      element: <Callback />,
    },
  ],
};

export default CallbackConfig;
