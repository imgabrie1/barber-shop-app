import { useQuery } from "@tanstack/react-query";
import { getUsersService } from "../services/admin.service";
import { getTenant } from "@/services/auth.storage";

export const useUsersToAdmin = (page = 1, enabled = true) => {
  return useQuery({
    queryKey: [getTenant(), "users", page],
    queryFn: () => getUsersService(page),
    enabled,
  });
};
