import { authRoles } from 'app/auth';
import { lazy } from 'react';

const SummaryApp = lazy(() => import('./SummaryApp'));
const List = lazy(() => import('./dynamic_fields/List'));

const SummaryAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.user,
  routes: [
    {
      path: 'apps/summary',
      element: <SummaryApp />,
    },
    {
      path: 'apps/dynamic_field_details/:dynamicId/:dynamicName/*',
      element: <List />,
    },
    {
      path: 'apps/dynamic_field_details/:dynamicId/:dynamicName/:valueName/*',
      element: <List />,
    },
  ],
};

export default SummaryAppConfig;