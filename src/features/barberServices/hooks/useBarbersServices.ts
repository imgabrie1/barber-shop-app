import { useQuery } from "@tanstack/react-query";
import { getServices } from "../services/barber.service";
import { getTenant } from "@/services/auth.storage";

export const useServices = (shopId: string, page = 1, enabled = true) => {
  return useQuery({
    queryKey: [getTenant(), "service", shopId, page],

    queryFn: () => getServices(shopId, page),

    enabled: !!shopId && enabled,
  });
};
