import { useQuery } from "@tanstack/react-query";
import { getBabrbers } from "../services/barber.service";

export const useBarbers = (shopId: string, enabled = true) => {
  return useQuery({
    queryKey: ["barbers", shopId],

    queryFn: () => getBabrbers(shopId),

    enabled: !!shopId && enabled,
  });
};
