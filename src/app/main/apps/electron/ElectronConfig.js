import { authRoles } from "app/auth";
import { lazy } from "react";

const ElectronApp = lazy(() => import("./ElectronApp"));

const ElectronAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      auth: authRoles.onlyGuest,
      path: "apps/electron",
      element: <ElectronApp />,
    },
  ],
};

export default ElectronAppConfig;
