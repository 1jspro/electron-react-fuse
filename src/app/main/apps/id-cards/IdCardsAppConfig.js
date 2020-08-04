import { authRoles } from "app/auth";
import { lazy } from "react";
import { Navigate } from "react-router-dom";

const Add = lazy(() => import("./add/Add"));
// const Details = lazy(() => import('./details/Details'));
const List = lazy(() => import("./list/List"));

const IdCardsAppConfig = {
  settings: {
    layout: {},
  },
  routes: [
    {
      path: "apps/id-cards",
      element: <List />,
      // permission: "id-cards:read",
    },
    {
      path: "apps/id-cards/:cardId/*",
      element: <Add />,
      // permission: "id-cards:create",
    },
    // {
    //   path: 'apps/id-cards/preview/:cardId/*',
    //   element: <Add />,
    //   permission: "id-cards:read",
    // },
  ],
};

export default IdCardsAppConfig;
