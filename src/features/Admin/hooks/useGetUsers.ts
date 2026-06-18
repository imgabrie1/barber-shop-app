import { useQuery } from "@tanstack/react-query";
import { getUsersService } from "../services/admin.service";

export const useUsersToAdmin = (page = 1, enabled = true) => {
  return useQuery({
    queryKey: ["users", page],
    queryFn: () => getUsersService(page),
    enabled,
  });
};
