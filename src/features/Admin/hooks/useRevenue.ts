import type { adminRevenueInterface } from "@/interfaces/admin.interface";
import { useQuery } from "@tanstack/react-query";
import { adminRevenueService } from "../services/admin.service";

type FilterType = "day" | "month" | "quarter";

interface UseRevenueParams {
  filterType?: FilterType;
  filterValue?: string;
  enabled?: boolean;
}

export const useRevenue = (
  admin: boolean,
  { filterType, filterValue, enabled = true }: UseRevenueParams = {},
) => {
  return useQuery<adminRevenueInterface>({
    queryKey: ["revenue", filterType, filterValue],
    queryFn: () =>
      adminRevenueService(admin, {
        filterType,
        filterValue,
      }),
    enabled,
    retry: false,
  });
};
