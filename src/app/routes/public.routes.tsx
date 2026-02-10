import { PublicLayout } from "../layout/PublicLayout";
import { LandingPage } from "../../pages/public/LandingPage";
import { LoginPage } from "../../pages/public/LoginPage";

export const publicRoutes = {
  element: <PublicLayout />,
  children: [
    { path: "/", element: <LandingPage /> },
    { path: "/login", element: <LoginPage /> },
  ],
};
