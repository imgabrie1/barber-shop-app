import type { User } from "@/interfaces/user.interface";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchUser } from "../services/users.service";
import { getTenant } from "@/services/auth.storage";

export const usePatchUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<User> }) =>
      patchUser(id, data),

    onSuccess: (response, variables) => {
      if (response) {
        queryClient.invalidateQueries({ queryKey: [getTenant(), "user", variables.id] });

        queryClient.invalidateQueries({ queryKey: [getTenant(), "users"] });
      }
    },
    onError: (error) => {
      console.error("Erro ao atualizar usuário:", error.message);
    },
  });
};
