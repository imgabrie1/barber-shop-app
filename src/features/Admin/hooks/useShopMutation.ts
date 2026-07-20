import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createShopService,
  updateShopService,
  deleteShopService,
} from "../services/admin.service";
import type { createShopType } from "@/interfaces/admin.interface";
import { getTenant } from "@/services/auth.storage";

export const useShopMutation = () => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data: createShopType) => createShopService(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [getTenant(), "shopUnits"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<createShopType> }) =>
      updateShopService(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [getTenant(), "shopUnits"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteShopService(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [getTenant(), "shopUnits"] });
    },
  });

  return {
    createMutation,
    updateMutation,
    deleteMutation,
  };
};
