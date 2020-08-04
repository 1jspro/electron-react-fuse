import { authRoles } from "app/auth";
import { lazy } from "react";
import { Navigate } from "react-router-dom";

const Add = lazy(() => import("./add/Add"));
const List = lazy(() => import("./list/List"));
const Details = lazy(() => import("./details/Details"));

const MembersAppConfig = {
  settings: {
    layout: {},
  },
  routes: [
    {
      path: "apps/members",
      element: <List />,
      // permission: "members:read",
    },
    {
      path: "apps/members/:memberId/*",
      element: <Add />,
      // permission: "members:create",
    },
    {
      path: "apps/members/details/:memberId/*",
      element: <Details />,
      // permission: "members:read",
    },
  ],
};

export default MembersAppConfig;
