import { useQuery } from "@tanstack/react-query";
import { getUserByIDservice } from "../services/admin.service";
import { getTenant } from "@/services/auth.storage";

export const useUserToAdmin = (id: string) => {
  return useQuery({
    queryKey: [getTenant(), "userToAdmin", id],
    queryFn: () => getUserByIDservice(id),
    enabled: Boolean(id),
  });
};
