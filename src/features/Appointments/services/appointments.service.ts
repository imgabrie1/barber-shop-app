import type { User } from "@/interfaces/user.interface";
import api from "@/services/api";
import type { AxiosError } from "axios";

export const getCheckAvailability = async () => {
  try {
    const response = await api.get<User[]>("/user/barber");
    return response.data;
  } catch (err: unknown) {
    const currentError = err as AxiosError;
    if (currentError.response?.status === 404) {
      return [];
    }
    const msg =
      (currentError.response?.data as string | undefined) ||
      currentError.message ||
      "Erro ao carregar barbeiros";
    throw new Error(String(msg));
  }
};