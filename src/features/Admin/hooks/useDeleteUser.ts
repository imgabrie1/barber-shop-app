import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteUserService } from "../services/admin.service";

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteUserService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => {
      console.error("Erro ao deletar usuário:", error);
    },
  });
};
