import { AxiosError } from "axios";
import api from "../../../services/api";
import { type User } from "../../../interfaces/user.interface";

export const getUsers = async () => {
  try {
    const response = await api.get<User[]>("/user");
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

export const getUserById = async (id: string) => {
  try {
    const response = await api.get<User>(`/user/${id}`);
    return response.data;
  } catch (err: unknown) {
    const currentError = err as AxiosError;
    if (currentError.response?.status === 404) {
      return null;
    }
    const msg =
      (currentError.response?.data as string | undefined) ||
      currentError.message ||
      "Erro ao carregar usuario";
    throw new Error(String(msg));
  }
};
