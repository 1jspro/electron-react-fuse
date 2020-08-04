import React from "react";
import { authRoles } from "app/auth";
import { lazy } from "react";

const DashboardApp = lazy(() => import("./DashboardApp"));

const DashboardAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.user,
  routes: [
    {
      path: "apps/dashboard",
      element: <DashboardApp />,
    },
  ],
};

export default DashboardAppConfig;
