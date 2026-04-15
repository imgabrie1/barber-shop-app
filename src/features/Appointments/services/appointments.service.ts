import type {
  CreateAppointmentInterface,
  OutputAppoitmentInterface,
  OutputGetAppoitmentInterface,
  TimeSlotsInterface,
} from "@/interfaces/appointments.interface";
import { outputGetAppoitmentSchema } from "@/schemas/appointments.schema";
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

export const getMyAppointments = async () => {
  try {
    const response =
      await api.get<OutputGetAppoitmentInterface>("/appointment/me");

    const parsed = outputGetAppoitmentSchema.parse(response.data);

    return parsed;
  } catch (err: unknown) {
    const currentError = err as AxiosError;

    if (currentError.response?.status === 404) {
      return { data: [], total: 0, page: 1, limit: 10 };
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
      "Erro carregar agendamentos";

    throw new Error(String(msg));
  }
};

export const deleteAppointment = async (appointmentID: string) => {
  try {
    const response = await api.delete(`/appointment/delete/${appointmentID}`);
    return response;
  } catch (err: unknown) {
    const currentError = err as AxiosError;

    if (currentError.response?.status === 404) {
      throw new Error("Agendamento não encontrado");
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
      "Erro ao deletar agendamentos";

    throw new Error(String(msg));
  }
};

export const updateAppointmentStatus = async (
  appointmentID: string,
  status: "cancelled" | "confirmed" | "completed" | "no_show",
) => {
  try {
    const response = await api.patch(`/appointment/status/${appointmentID}`, {
      status,
    });

    return response.data;
  } catch (err: unknown) {
    const currentError = err as AxiosError;

    if (currentError.response?.status === 404) {
      throw new Error("Agendamento não encontrado");
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
      "Erro ao atualizar status";

    throw new Error(String(msg));
  }
};
