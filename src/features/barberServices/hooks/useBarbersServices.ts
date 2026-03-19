import { useQuery } from "@tanstack/react-query";
import { getServices } from "../services/barber.service";

export const useServices = (enabled = true) => {
  return useQuery({
    queryKey: ["service"],
    queryFn: getServices,
    enabled,
  });
};
