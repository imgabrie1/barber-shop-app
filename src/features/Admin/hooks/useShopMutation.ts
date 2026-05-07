import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createShopService,
  updateShopService,
  deleteShopService,
} from "../services/admin.service";
import type { createShopType } from "@/interfaces/admin.interface";

export const useShopMutation = () => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data: createShopType) => createShopService(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shopUnits"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<createShopType> }) =>
      updateShopService(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shopUnits"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteShopService(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shopUnits"] });
    },
  });

  return {
    createMutation,
    updateMutation,
    deleteMutation,
  };
};
