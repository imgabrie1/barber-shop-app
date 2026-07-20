import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateAppointmentStatus,
  deleteAppointment,
} from "../services/appointments.service";
import { getTenant } from "@/services/auth.storage";

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

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [getTenant(), "myAppointments"] });
    },

    onError: (error) => {
      console.error("Erro:", error.message);
    },
  });
};
