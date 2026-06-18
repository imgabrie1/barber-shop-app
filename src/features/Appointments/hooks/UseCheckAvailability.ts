import { useQuery } from "@tanstack/react-query";
import { getCheckAvailability } from "../services/appointments.service";

type UseAvailabilityProps = {
  date: string;
  barberId: string;
  barberName: string;
  shopId: string;
  enabled?: boolean;
};

export const useAvailability = ({
  date,
  barberId,
  barberName,
  shopId,
  enabled = true,
}: UseAvailabilityProps) => {
  return useQuery({
    queryKey: ["checkAvailability", date, barberId, barberName, shopId],
    queryFn: () => getCheckAvailability({ date, barberId, barberName, shopId }),
    enabled: enabled && !!date && !!barberId && !!barberName && !!shopId,
    staleTime: 1000 * 60 * 2,
  });
};
