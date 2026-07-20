import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteUserService } from "../services/admin.service";
import { getTenant } from "@/services/auth.storage";

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteUserService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [getTenant(), "users"] });
    },
    onError: (error) => {
      console.error("Erro ao deletar usuário:", error);
    },
  });
};
