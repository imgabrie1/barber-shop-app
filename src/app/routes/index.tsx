import { createBrowserRouter } from "react-router-dom";
import { globalPublicRoutes } from "./public.routes";
import { tenantRoutes } from "./tenant.routes";

export const appRouter = createBrowserRouter([
  globalPublicRoutes,
  {
    path: "/t/:tenantSlug",
    children: tenantRoutes,
  },
]);
