import { AuthProvider } from "./AuthProvider";
import { QueryProvider } from "./QueryProvider";
import { RouterProvider } from "./RouterProvider";
import { AppointmentProvider } from "../../contexts/AppointmentContext";

export const AppProviders = () => {
  return (
    <QueryProvider>
      <AuthProvider>
        <AppointmentProvider>
          <RouterProvider />
        </AppointmentProvider>
      </AuthProvider>
    </QueryProvider>
  );
};
