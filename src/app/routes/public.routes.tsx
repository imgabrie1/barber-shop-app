import { lazy, Suspense } from "react";
import { PublicLayout } from "../layout/PublicLayout";

const LandingPage = lazy(() =>
  import("../../pages/public/LandingPage").then((m) => ({
    default: m.LandingPage,
  })),
);
const LoginPage = lazy(() => import("@/pages/public/Login/LoginPage"));
const RegisterPage = lazy(() => import("@/pages/public/Register/RegisterPage"));
import { PageLoader } from "@/components/ui/PageLoader";

export const publicRoutes = {
  element: <PublicLayout />,
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
      path: "/login",
      element: (
        <Suspense fallback={<PageLoader />}>
          <LoginPage />
        </Suspense>
      ),
    },
    {
      path: "/register",
      element: (
        <Suspense fallback={<PageLoader />}>
          <RegisterPage />
        </Suspense>
      ),
    },
  ],
};
