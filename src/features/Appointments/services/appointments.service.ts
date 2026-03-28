import type { TimeSlotsInterface } from "@/interfaces/appointments.interface";
import api from "@/services/api";
import type { AxiosError } from "axios";

export const getCheckAvailability = async (params: {
  date: string;
  barberId: string;
  barberName: string
}) => {
  try {
    const response = await api.get<TimeSlotsInterface>(
      "/appointment/availability",
      {
        params,
      },
    );

    return response.data;
  } catch (err: unknown) {
    const currentError = err as AxiosError;

    if (currentError.response?.status === 404) {
      return [];
    }

    const responseData = currentError.response?.data as { message?: string } | string | undefined;
    const msg =
      (typeof responseData === "object" ? responseData?.message : responseData) ||
      currentError.message ||
      "Erro ao carregar horários";

    throw new Error(String(msg));
  }
};
