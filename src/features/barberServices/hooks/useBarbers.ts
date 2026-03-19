import { useQuery } from "@tanstack/react-query";
import { getBabrbers } from "../services/barber.service";

export const useBarbers = (enabled = true) => {
  return useQuery({
    queryKey: ["barbers"],
    queryFn: getBabrbers,
    enabled,
  });
};
