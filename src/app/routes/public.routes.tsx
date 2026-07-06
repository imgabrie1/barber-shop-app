import { lazy, Suspense } from "react";
import { PublicLayout } from "../layout/PublicLayout";
import IsFetchingAndLoading from "@/components/ui/IsFetchingAndLoading";

const LandingPage = lazy(() => import("../../pages/public/LandingPage").then(m => ({ default: m.LandingPage })));
const LoginPage = lazy(() => import("@/pages/public/Login/LoginPage"));
const RegisterPage = lazy(() => import("@/pages/public/Register/RegisterPage"));

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <IsFetchingAndLoading />
  </div>
);

export const publicRoutes = {
  element: <PublicLayout />,
  children: [
    { path: "/", element: <Suspense fallback={<PageLoader />}><LandingPage /></Suspense> },
    { path: "/login", element: <Suspense fallback={<PageLoader />}><LoginPage /></Suspense> },
    { path: "/register", element: <Suspense fallback={<PageLoader />}><RegisterPage /></Suspense> },
  ],
};
