import { lazy, Suspense } from "react";
import { AppLayout } from "../layout/AppLayout";
import { RequireAuth, RequireRole } from "../providers/AuthProvider";
import IsFetchingAndLoading from "@/components/ui/IsFetchingAndLoading";

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
const ClientProfilePage = lazy(() => import("@/pages/app/ClientProfile"));

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <IsFetchingAndLoading />
  </div>
);

export const privateRoutes = {
  element: (
    <RequireAuth>
      <AppLayout />
    </RequireAuth>
  ),
  children: [
    {
      path: "/app",
      element: <Suspense fallback={<PageLoader />}><SelectServicePage /></Suspense>,
    },
    {
      path: "/app/appointments",
      element: <Suspense fallback={<PageLoader />}><AppointmentsPage /></Suspense>,
    },
    {
      path: "/app/appointment/select-barber/:serviceId",
      element: <Suspense fallback={<PageLoader />}><SelectBarberPage /></Suspense>,
    },
    {
      path: "/app/appointment/select-availabilityDate",
      element: <Suspense fallback={<PageLoader />}><SelectAvailabilitiesDatePage /></Suspense>,
    },
    {
      path: "/app/appointment/summary",
      element: <Suspense fallback={<PageLoader />}><AppointmentSummaryPage /></Suspense>,
    },
    {
      path: "/app/admin",
      element: (
        <RequireRole allowedRoles={["admin"]}>
          <Suspense fallback={<PageLoader />}><AdminPage /></Suspense>
        </RequireRole>
      ),
    },
    {
      path: "/app/admin/users",
      element: (
        <RequireRole allowedRoles={["admin"]}>
          <Suspense fallback={<PageLoader />}><AdminUsersPage /></Suspense>
        </RequireRole>
      ),
    },
    {
      path: "/app/admin/services",
      element: (
        <RequireRole allowedRoles={["admin"]}>
          <Suspense fallback={<PageLoader />}><AdminServicesPage /></Suspense>
        </RequireRole>
      ),
    },
    {
      path: "/app/admin/shopUnits",
      element: (
        <RequireRole allowedRoles={["admin"]}>
          <Suspense fallback={<PageLoader />}><AdminShopUnitsPage /></Suspense>
        </RequireRole>
      ),
    },
    {
      path: "/app/barber",
      element: (
        <RequireRole allowedRoles={["barber"]}>
          <Suspense fallback={<PageLoader />}><BarberPage /></Suspense>
        </RequireRole>
      ),
    },
    {
      path: "/app/manager",
      element: (
        <RequireRole allowedRoles={["manager"]}>
          <Suspense fallback={<PageLoader />}><ManagerPage /></Suspense>
        </RequireRole>
      ),
    },
    {
      path: "/app/clientProfile",
      element: (
        <RequireRole allowedRoles={["client"]}>
          <Suspense fallback={<PageLoader />}><ClientProfilePage /></Suspense>
        </RequireRole>
      ),
    },
  ],
};
