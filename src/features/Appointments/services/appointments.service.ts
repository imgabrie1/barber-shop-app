import type {
  CreateAppointmentInterface,
  OutputAppoitmentInterface,
  TimeSlotsInterface,
} from "@/interfaces/appointments.interface";
import api from "@/services/api";
import type { AxiosError } from "axios";

export const getCheckAvailability = async (params: {
  date: string;
  barberId: string;
  barberName: string;
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

    const responseData = currentError.response?.data as
      | { message?: string }
      | string
      | undefined;
    const msg =
      (typeof responseData === "object"
        ? responseData?.message
        : responseData) ||
      currentError.message ||
      "Erro ao carregar horários";

    throw new Error(String(msg));
  }
};

export const createAppointmentService = async (
  data: CreateAppointmentInterface,
): Promise<OutputAppoitmentInterface> => {
  try {
    const response = await api.post("/appointment", data);
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
      "Erro ao criar agendamento";

    throw new Error(String(msg));
  }
};
