import { useMutation } from "@tanstack/react-query";
import { createAppointmentService } from "../services/appointments.service";

export const useCreateAppointment = () => {
  return useMutation({
    mutationFn: createAppointmentService,

    onSuccess: (data) => {
      console.log("Agendamento criado:", data);
    },

    onError: (error) => {
      console.error("Erro ao criar:", error.message);
    },
  });
};
