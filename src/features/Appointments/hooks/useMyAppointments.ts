import { useQuery } from "@tanstack/react-query";
import { getMyAppointments } from "../services/appointments.service";
import type { OutputGetAppoitmentInterface } from "@/interfaces/appointments.interface";

export const useMyAppointments = (enabled = true) => {
  return useQuery<OutputGetAppoitmentInterface>({
    queryKey: ["myAppointments"],
    queryFn: getMyAppointments,
    enabled,
    retry: false,
  });
};
