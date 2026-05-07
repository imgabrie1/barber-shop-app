import { useQuery } from "@tanstack/react-query";
import { getServices } from "../services/barber.service";

export const useServices = (shopId: string, enabled = true) => {
  return useQuery({
    queryKey: ["service", shopId],

    queryFn: () => getServices(shopId),

    enabled: !!shopId && enabled,
  });
};
