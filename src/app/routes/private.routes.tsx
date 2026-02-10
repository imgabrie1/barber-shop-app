import DashboardPage from "@/pages/app/Dashboard";
import { AppLayout } from "../layout/AppLayout";
import { RequireAuth } from "../providers/AuthProvider";
import AppointmentsPage from "@/pages/app/Appoitment";

export const privateRoutes = {
  element: (
    <RequireAuth>
      <AppLayout />
    </RequireAuth>
  ),
  children: [
    { path: "/app", element: <DashboardPage /> },
    { path: "/app/agenda", element: <AppointmentsPage /> },
  ],
};
