import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAppointmentService } from "../services/appointments.service";
import { getTenant } from "@/services/auth.storage";

export const useCreateAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAppointmentService,

    onSuccess: (data) => {
      console.log("Agendamento criado:", data);

      queryClient.invalidateQueries({
        queryKey: [getTenant(), "myAppointments"],
      });
    },

    onError: (error) => {
      console.error("Erro ao criar:", error.message);
    },
  });
};