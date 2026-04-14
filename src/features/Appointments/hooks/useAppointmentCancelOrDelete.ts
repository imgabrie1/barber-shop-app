import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { OutputGetAppoitmentInterface } from "@/interfaces/appointments.interface";
import {
  cancelMyAppointment,
  deleteAppointment,
} from "../services/appointments.service";

type MutationInput = {
  id: string;
  action: "cancel" | "delete";
};

export const useAppointmentCancelOrDelete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, action }: MutationInput) => {
      if (action === "cancel") {
        return cancelMyAppointment(id);
      }

      return deleteAppointment(id);
    },

    onSuccess: (_, { id, action }) => {
      console.log(`Agendamento ${action}:`, id);

      queryClient.setQueryData<OutputGetAppoitmentInterface>(
        ["myAppointments"],
        (oldData) => {
          if (!oldData) return oldData;

          if (action === "cancel") {
            return {
              ...oldData,
              data: oldData.data.map((item) =>
                item.id === id ? { ...item, status: "cancelled" } : item,
              ),
            };
          }

          return {
            ...oldData,
            data: oldData.data.filter((item) => item.id !== id),
          };
        },
      );
    },

    onError: (error: Error) => {
      console.error("Erro:", error.message);
    },
  });
};
