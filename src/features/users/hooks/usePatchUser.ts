import type { User } from "@/interfaces/user.interface";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchUser } from "../services/users.service";

export const usePatchUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<User> }) =>
      patchUser(id, data),

    onSuccess: (response, variables) => {
      if (response) {
        queryClient.invalidateQueries({ queryKey: ["user", variables.id] });

        queryClient.invalidateQueries({ queryKey: ["users"] });
      }
    },
    onError: (error) => {
      console.error("Erro ao atualizar usuário:", error.message);
    },
  });
};
