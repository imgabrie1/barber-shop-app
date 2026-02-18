import type { BarberService } from "@/interfaces/barber.interface";
import api from "@/services/api";
import type { AxiosError } from "axios";

export const getServices = async () => {
  try {
    const response = await api.get<BarberService[]>("/service");
    return response.data;
  } catch (err: unknown) {
    const currentError = err as AxiosError;
    if (currentError.response?.status === 404) {
      return [];
    }
    const msg =
      (currentError.response?.data as string | undefined) ||
      currentError.message ||
      "Erro ao carregar usuarios";
    throw new Error(String(msg));
  }
};