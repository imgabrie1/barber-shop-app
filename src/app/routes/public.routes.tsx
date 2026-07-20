import { lazy, Suspense } from "react";
import { PageLoader } from "@/components/ui/PageLoader";

const LandingPage = lazy(() =>
  import("../../pages/public/LandingPage").then((m) => ({
    default: m.LandingPage,
  })),
);
const RegisterTenantPage = lazy(
  () => import("@/pages/public/RegisterTenant/RegisterTenantPage"),
);
const PlatformLoginPage = lazy(
  () => import("@/pages/public/PlatformLogin/PlatformLoginPage"),
);

export const globalPublicRoutes = {
  children: [
    {
      path: "/",
      element: (
        <Suspense fallback={<PageLoader />}>
          <LandingPage />
        </Suspense>
      ),
    },
    {
      path: "/register-tenant",
      element: (
        <Suspense fallback={<PageLoader />}>
          <RegisterTenantPage />
        </Suspense>
      ),
    },
    {
      path: "/platform-login",
      element: (
        <Suspense fallback={<PageLoader />}>
          <PlatformLoginPage />
        </Suspense>
      ),
    },
  ],
};
