import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAppointmentService } from "../services/appointments.service";

export const useCreateAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAppointmentService,

    onSuccess: (data) => {
      console.log("Agendamento criado:", data);

      queryClient.invalidateQueries({
        queryKey: ["myAppointments"],
      });
    },

    onError: (error) => {
      console.error("Erro ao criar:", error.message);
    },
  });
};