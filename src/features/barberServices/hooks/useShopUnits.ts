import { useQuery } from "@tanstack/react-query";
import { getShopUnits } from "../services/barber.service";
import { getTenant } from "@/services/auth.storage";

export const useShopUnits = (enabled = true) => {
  return useQuery({
    queryKey: [getTenant(), "shopUnits"],
    queryFn: getShopUnits,
    enabled,
  });
};
