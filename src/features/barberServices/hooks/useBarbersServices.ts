import { useQuery } from "@tanstack/react-query";
import { getServices } from "../services/barber.service";

export const useServices = (shopId: string, page = 1, enabled = true) => {
  return useQuery({
    queryKey: ["service", shopId, page],

    queryFn: () => getServices(shopId, page),

    enabled: !!shopId && enabled,
  });
};
