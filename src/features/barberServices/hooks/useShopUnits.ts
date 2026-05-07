import { useQuery } from "@tanstack/react-query";
import { getShopUnits } from "../services/barber.service";

export const useShopUnits = (enabled = true) => {
  return useQuery({
    queryKey: ["shopUnits"],
    queryFn: getShopUnits,
    enabled,
  });
};
