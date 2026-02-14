import { PublicLayout } from "../layout/PublicLayout";
import { LandingPage } from "../../pages/public/LandingPage";
import LoginPage from "@/pages/public/Login/LoginPage";
import RegisterPage from "@/pages/public/Register/RegisterPage";

export const publicRoutes = {
  element: <PublicLayout />,
  children: [
    { path: "/", element: <LandingPage /> },
    { path: "/login", element: <LoginPage /> },
    { path: "/register", element: <RegisterPage /> },
  ],
};
