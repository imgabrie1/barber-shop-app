import { useQuery } from "@tanstack/react-query";
// import { getCheckAvailability } from "../services/barber.service";

export const useBarbers = (enabled = true) => {
  return useQuery({
    queryKey: ["checkAvailability"],
    // queryFn: getCheckAvailability,
    enabled,
  });
};
