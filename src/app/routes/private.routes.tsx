import { AppLayout } from "../layout/AppLayout";
import { RequireAuth } from "../providers/AuthProvider";
import AppointmentsPage from "@/pages/app/Appointments";
import SelectServicePage from "@/pages/app/Dashboard/SelectService";
import SelectBarberPage from "@/pages/app/Dashboard/SelectBarber";
import SelectAvailabilitiesDatePage from "@/pages/app/Dashboard/SelectAvailabilitiesDate";

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
  ],
};
