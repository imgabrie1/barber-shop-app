import { useQuery } from "@tanstack/react-query";
import { getUserByIDservice } from "../services/admin.service";

export const useUserToAdmin = (id: string) => {
  return useQuery({
    queryKey: ["userToAdmin", id],
    queryFn: () => getUserByIDservice(id),
    enabled: Boolean(id),
  });
};
