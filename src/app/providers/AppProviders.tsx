import { AuthProvider } from "./AuthProvider";
import { QueryProvider } from "./QueryProvider";
import { RouterProvider } from "./RouterProvider";

export const AppProviders = () => {
  return (
    <QueryProvider>
      <AuthProvider>
        <RouterProvider />
      </AuthProvider>
    </QueryProvider>
  );
};
