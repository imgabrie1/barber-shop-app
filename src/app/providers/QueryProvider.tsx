import {
  QueryClient,
  QueryClientProvider,
  type QueryClientConfig,
} from "@tanstack/react-query";
import { type ReactNode, useMemo } from "react";

const defaultQueryConfig: QueryClientConfig = {
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 30_000,
    },
  },
};

export const QueryProvider = ({ children }: { children: ReactNode }) => {
  const client = useMemo(() => new QueryClient(defaultQueryConfig), []);

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
};
