import { authRoles } from 'app/auth';
import { lazy } from 'react';

const SubscriptionApp = lazy(() => import('./SubscriptionApp'));
const SubscriptionPaymentApp = lazy(() => import('./SubscriptionPaymentApp'));

const SubscriptionAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.user,
  routes: [
    {
      path: 'apps/subscriptions',
      element: <SubscriptionApp />,
    },
    {
      path: 'apps/subscriptions/payment-status',
      element: <SubscriptionPaymentApp />,
    },
  ],
};

export default SubscriptionAppConfig;