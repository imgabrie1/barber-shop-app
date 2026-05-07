import type { MultipleShopUnitsOutput } from "@/interfaces/admin.interface";
import type { BarberService } from "@/interfaces/barber.interface";
import type { User } from "@/interfaces/user.interface";
import api from "@/services/api";
import type { AxiosError } from "axios";

export const getServices = async (shopId: string) => {
  try {
    const response = await api.get<BarberService[]>(`/service/perUnit/${shopId}`);
    return response.data;
  } catch (err: unknown) {
    const currentError = err as AxiosError;
    if (currentError.response?.status === 404) {
      return [];
    }
    const msg =
      (currentError.response?.data as string | undefined) ||
      currentError.message ||
      "Erro ao carregar serviços";
    throw new Error(String(msg));
  }
};

export const getBabrbers = async (shopId: string) => {
  try {
    const response = await api.get<User[]>(`/user/barber/${shopId}`);
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

export const getShopUnits = async () => {
  try {
    const response = await api.get<MultipleShopUnitsOutput>("/service/shops");
    return response.data;
  } catch (err: unknown) {
    const currentError = err as AxiosError;
    if (currentError.response?.status === 404) {
      return [];
    }
    const msg =
      (currentError.response?.data as string | undefined) ||
      currentError.message ||
      "Erro ao carregar unidades de loja";
    throw new Error(String(msg));
  }
};
