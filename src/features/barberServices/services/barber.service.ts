import type { MultipleShopUnitsOutput } from "@/interfaces/admin.interface";
import type { PaginatedServicesInterface } from "@/interfaces/barber.interface";
import type { User } from "@/interfaces/user.interface";
import api from "@/services/api";
import type { AxiosError } from "axios";

export const getServices = async (shopId: string, page = 1, limit = 10) => {
  try {
    const response = await api.get<PaginatedServicesInterface>(
      `/service/perUnit/${shopId}`,
      {
        params: { page, limit },
      },
    );
    return response.data;
  } catch (err: unknown) {
    const currentError = err as AxiosError;
    if (currentError.response?.status === 404) {
      return { data: [], total: 0, page: 1, limit: 10 };
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
