import { lazy, Suspense } from "react";
import { TenantSync } from "../components/TenantSync";
import { AppLayout } from "../layout/AppLayout";
import { RequireAuth } from "../providers/AuthProvider";
import { privateRoutes } from "./private.routes";
import { PageLoader } from "@/components/ui/PageLoader";

const TenantResolverPage = lazy(
  () => import("@/pages/public/TenantResolver/TenantResolverPage"),
);
const LoginPage = lazy(() => import("@/pages/public/Login/LoginPage"));
const RegisterPage = lazy(
  () => import("@/pages/public/Register/RegisterPage"),
);

export const tenantRoutes = [
  {
    element: <TenantSync />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<PageLoader />}>
            <TenantResolverPage />
          </Suspense>
        ),
      },
      {
        path: "login",
        element: (
          <Suspense fallback={<PageLoader />}>
            <LoginPage />
          </Suspense>
        ),
      },
      {
        path: "register",
        element: (
          <Suspense fallback={<PageLoader />}>
            <RegisterPage />
          </Suspense>
        ),
      },
      {
        path: "app",
        element: (
          <RequireAuth>
            <AppLayout />
          </RequireAuth>
        ),
        children: privateRoutes.children,
      },
    ],
  },
];
