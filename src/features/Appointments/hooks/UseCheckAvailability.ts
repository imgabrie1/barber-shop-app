import { useQuery } from "@tanstack/react-query";
import { getCheckAvailability } from "../services/appointments.service";

type UseAvailabilityProps = {
  date: string;
  barberId: string;
  barberName: string;
  enabled?: boolean;
};

export const useAvailability = ({
  date,
  barberId,
  barberName,
  enabled = true,
}: UseAvailabilityProps) => {
  return useQuery({
    queryKey: ["checkAvailability", date, barberId, barberName],
    queryFn: () => getCheckAvailability({ date, barberId, barberName }),
    enabled: enabled && !!date && !!barberId && !!barberName,
  });
};
