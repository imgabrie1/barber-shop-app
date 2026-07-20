import { useQuery } from "@tanstack/react-query";
import { getBabrbers } from "../services/barber.service";
import { getTenant } from "@/services/auth.storage";

export const useBarbers = (shopId: string, enabled = true) => {
  return useQuery({
    queryKey: [getTenant(), "barbers", shopId],

    queryFn: () => getBabrbers(shopId),

    enabled: !!shopId && enabled,
  });
};
