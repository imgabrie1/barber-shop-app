import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { OutputGetAppoitmentInterface } from "@/interfaces/appointments.interface";
import {
  updateAppointmentStatus,
  deleteAppointment,
} from "../services/appointments.service";

type MutationInput = {
  id: string;
  action: "cancel" | "delete" | "confirm" | "complete";
};

export const useMutationAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, MutationInput>({
    mutationFn: async ({ id, action }) => {
      if (action === "cancel") {
        await updateAppointmentStatus(id, "cancelled");
        return;
      }

      if (action === "confirm") {
        await updateAppointmentStatus(id, "confirmed");
        return;
      }

      if (action === "complete") {
        await updateAppointmentStatus(id, "completed");
        return;
      }

      await deleteAppointment(id);
    },

    onSuccess: (_, { id, action }) => {
      queryClient.setQueryData<OutputGetAppoitmentInterface>(
        ["myAppointments"],
        (oldData) => {
          if (!oldData) return oldData;

          if (
            action === "confirm" ||
            action === "complete" ||
            action === "cancel"
          ) {
            const newStatus =
              action === "confirm"
                ? "confirmed"
                : action === "complete"
                  ? "completed"
                  : "cancelled";

            return {
              ...oldData,
              data: oldData.data.map((item) =>
                item.id === id ? { ...item, status: newStatus } : item,
              ),
            };
          }

          if (action === "delete") {
            return {
              ...oldData,
              data: oldData.data.filter((item) => item.id !== id),
            };
          }

          return oldData;
        },
      );
    },

    onError: (error) => {
      console.error("Erro:", error.message);
    },
  });
};
