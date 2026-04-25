import { useQuery } from "@tanstack/react-query";
import { getUsersService } from "../services/admin.service";

export const useUsersToAdmin = (enabled = true) => {
  return useQuery({
    queryKey: ["users"],
    queryFn: getUsersService,
    enabled,
  });
};
