import { authRoles } from 'app/auth';
import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

const Add = lazy(() => import('./add/Add'));
const List = lazy(() => import('./list/List'));
const Details = lazy(() => import('./details/Details'));

const InvoicesAppConfig = {
  settings: {
    layout: {},
  },
  routes: [
    {
      path: 'apps/invoices',
      element: <List />,
      permission: "invoices:read",
    },
    {
      path: 'apps/invoices/:invoiceId/*',
      element: <Add />,
      permission: "invoices:create",
    },
    {
      path: 'apps/invoices/details/:invoiceId/*',
      element: <Details />,
      permission: "invoices:read",
    },
  ],
};

export default InvoicesAppConfig;
