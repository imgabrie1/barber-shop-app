import { lazy, Suspense } from "react";
import { RequireRole } from "../providers/AuthProvider";

const AppointmentsPage = lazy(() => import("@/pages/app/Appointments"));
const SelectServicePage = lazy(() => import("@/pages/app/Dashboard/SelectService"));
const SelectBarberPage = lazy(() => import("@/pages/app/Dashboard/SelectBarber"));
const SelectAvailabilitiesDatePage = lazy(() => import("@/pages/app/Dashboard/SelectAvailabilitiesDate"));
const AppointmentSummaryPage = lazy(() => import("@/pages/app/Dashboard/AppointmentSummary"));
const AdminPage = lazy(() => import("@/pages/app/Admin"));
const BarberPage = lazy(() => import("@/pages/app/Barber"));
const ManagerPage = lazy(() => import("@/pages/app/Manager"));
const AdminUsersPage = lazy(() => import("@/pages/app/Admin/usersAdmin"));
const AdminServicesPage = lazy(() => import("@/pages/app/Admin/servicesAdmin"));
const AdminShopUnitsPage = lazy(() => import("@/pages/app/Admin/shopUnitsAdmin"));
const AdminWhatsappPage = lazy(() => import("@/pages/app/Admin/whatsappAdmin"));
const ClientProfilePage = lazy(() => import("@/pages/app/ClientProfile"));
const PlatformPage = lazy(() => import("@/pages/app/Platform/PlatformPage"));
import { PageLoader } from "@/components/ui/PageLoader";

export const privateRoutes = {
  children: [
    {
      index: true,
      element: <Suspense fallback={<PageLoader />}><SelectServicePage /></Suspense>,
    },
    {
      path: "appointments",
      element: <Suspense fallback={<PageLoader />}><AppointmentsPage /></Suspense>,
    },
    {
      path: "appointment/select-barber/:serviceId",
      element: <Suspense fallback={<PageLoader />}><SelectBarberPage /></Suspense>,
    },
    {
      path: "appointment/select-availabilityDate",
      element: <Suspense fallback={<PageLoader />}><SelectAvailabilitiesDatePage /></Suspense>,
    },
    {
      path: "appointment/summary",
      element: <Suspense fallback={<PageLoader />}><AppointmentSummaryPage /></Suspense>,
    },
    {
      path: "admin",
      element: (
        <RequireRole allowedRoles={["admin"]}>
          <Suspense fallback={<PageLoader />}><AdminPage /></Suspense>
        </RequireRole>
      ),
    },
    {
      path: "admin/users",
      element: (
        <RequireRole allowedRoles={["admin"]}>
          <Suspense fallback={<PageLoader />}><AdminUsersPage /></Suspense>
        </RequireRole>
      ),
    },
    {
      path: "admin/services",
      element: (
        <RequireRole allowedRoles={["admin"]}>
          <Suspense fallback={<PageLoader />}><AdminServicesPage /></Suspense>
        </RequireRole>
      ),
    },
    {
      path: "admin/shopUnits",
      element: (
        <RequireRole allowedRoles={["admin"]}>
          <Suspense fallback={<PageLoader />}><AdminShopUnitsPage /></Suspense>
        </RequireRole>
      ),
    },
    {
      path: "admin/whatsapp",
      element: (
        <RequireRole allowedRoles={["admin"]}>
          <Suspense fallback={<PageLoader />}><AdminWhatsappPage /></Suspense>
        </RequireRole>
      ),
    },
    {
      path: "barber",
      element: (
        <RequireRole allowedRoles={["barber"]}>
          <Suspense fallback={<PageLoader />}><BarberPage /></Suspense>
        </RequireRole>
      ),
    },
    {
      path: "manager",
      element: (
        <RequireRole allowedRoles={["manager"]}>
          <Suspense fallback={<PageLoader />}><ManagerPage /></Suspense>
        </RequireRole>
      ),
    },
    {
      path: "clientProfile",
      element: (
        <RequireRole allowedRoles={["client"]}>
          <Suspense fallback={<PageLoader />}><ClientProfilePage /></Suspense>
        </RequireRole>
      ),
    },
    {
      path: "platform",
      element: (
        <RequireRole allowedRoles={["super_admin"]}>
          <Suspense fallback={<PageLoader />}><PlatformPage /></Suspense>
        </RequireRole>
      ),
    },
  ],
};
