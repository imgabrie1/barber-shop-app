import type {
  adminRevenueInterface,
  createServiceOutput,
  createServiceType,
} from "@/interfaces/admin.interface";
import api from "@/services/api";
import type { AxiosError } from "axios";

type FilterType = "day" | "month" | "quarter";

interface AdminRevenueParams {
  filterType?: FilterType;
  filterValue?: string;
}

export const adminRevenueService = async (
  params?: AdminRevenueParams,
): Promise<adminRevenueInterface> => {
  try {
    const response = await api.get<adminRevenueInterface>("/admin/revenue", {
      params: {
        filterType: params?.filterType,
        filterValue: params?.filterValue,
      },
    });

    return response.data;
  } catch (err: unknown) {
    const currentError = err as AxiosError;

    if (currentError.response?.status === 404) {
      return {
        totalRevenue: 0,
        filteredRevenue: 0,
      };
    }

    const responseData = currentError.response?.data as
      | { message?: string }
      | string
      | undefined;

    const msg =
      (typeof responseData === "object"
        ? responseData?.message
        : responseData) ||
      currentError.message ||
      "Erro ao carregar valores de renda";

    throw new Error(String(msg));
  }
};

export const createBarberServiceService = async (data: createServiceType) => {
  try {
    const response = await api.post<createServiceOutput>("/service", data);

    return response;
  } catch (err: unknown) {
    const currentError = err as AxiosError;

    const responseData = currentError.response?.data as
      | { message?: string }
      | string
      | undefined;

    const msg =
      (typeof responseData === "object"
        ? responseData?.message
        : responseData) ||
      currentError.message ||
      "Erro ao criar serviço";

    throw new Error(String(msg));
  }
};

export const updateBarberServiceService = async (
  id: string,
  data: createServiceType,
) => {
  try {
    const response = await api.patch(`/service/${id}`, data);
    return response.data;
  } catch (err: unknown) {
    const currentError = err as AxiosError;
    const responseData = currentError.response?.data as
      | { message?: string }
      | string
      | undefined;
    const msg =
      (typeof responseData === "object"
        ? responseData?.message
        : responseData) ||
      currentError.message ||
      "Erro ao atualizar serviço";
    throw new Error(String(msg));
  }
};

export const deleteBarberServiceService = async (id: string) => {
  try {
    const response = await api.delete(`/service/${id}`);
    return response.data;
  } catch (err: unknown) {
    const currentError = err as AxiosError;
    const responseData = currentError.response?.data as
      | { message?: string }
      | string
      | undefined;
    const msg =
      (typeof responseData === "object"
        ? responseData?.message
        : responseData) ||
      currentError.message ||
      "Erro ao deletar serviço";
    throw new Error(String(msg));
  }
};
