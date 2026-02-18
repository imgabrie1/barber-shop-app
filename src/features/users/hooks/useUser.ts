import { useQuery } from "@tanstack/react-query";
import { getUserById } from "../services/users.service";

export const useUser = (id: string) => {
  return useQuery({
    queryKey: ["user", id],
    queryFn: () => getUserById(id),
    enabled: Boolean(id),
  });
};
