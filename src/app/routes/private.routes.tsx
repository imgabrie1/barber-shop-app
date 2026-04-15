import { AppLayout } from "../layout/AppLayout";
import { RequireAuth, RequireRole } from "../providers/AuthProvider";
import AppointmentsPage from "@/pages/app/Appointments";
import SelectServicePage from "@/pages/app/Dashboard/SelectService";
import SelectBarberPage from "@/pages/app/Dashboard/SelectBarber";
import SelectAvailabilitiesDatePage from "@/pages/app/Dashboard/SelectAvailabilitiesDate";
import AppointmentSummaryPage from "@/pages/app/Dashboard/AppointmentSummary";
import AdminPage from "@/pages/app/Admin";
import BarberPage from "@/pages/app/Barber";

export const privateRoutes = {
  element: (
    <RequireAuth>
      <AppLayout />
    </RequireAuth>
  ),
  children: [
    { path: "/app", element: <SelectServicePage /> },
    { path: "/app/appointments", element: <AppointmentsPage /> },
    { path: "/app/appointment/select-barber/:serviceId", element: <SelectBarberPage /> },
    { path: "/app/appointment/select-availabilityDate", element: <SelectAvailabilitiesDatePage /> },
    { path: "/app/appointment/summary", element: <AppointmentSummaryPage /> },
    {
      path: "/app/admin",
      element: (
        <RequireRole allowedRoles={["admin"]}>
          <AdminPage />
        </RequireRole>
      ),
    },
    {
      path: "/app/barber",
      element: (
        <RequireRole allowedRoles={["barber"]}>
          <BarberPage />
        </RequireRole>
      ),
    },
  ],
};
