import { useQuery } from "@tanstack/react-query";
import { getMyAppointments } from "../services/appointments.service";
import type { OutputGetAppoitmentInterface } from "@/interfaces/appointments.interface";

export const useMyAppointments = (page = 1, enabled = true) => {
  return useQuery<OutputGetAppoitmentInterface>({
    queryKey: ["myAppointments", page],
    queryFn: () => getMyAppointments(page),
    enabled,
    retry: false,
  });
};
