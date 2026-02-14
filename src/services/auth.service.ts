import type { LoginDTO } from "@/schemas/login.schemas";
import type { RegisterDTO } from "@/schemas/register.schemas";
import api, { registerLogoutCallback } from "./api";
import { setTokens, clearTokens } from "./auth.storage";

export const login = async (data: LoginDTO) => {
  const response = await api.post("/login", data);

  const { token, refresh_token } = response.data;

  setTokens(token, refresh_token);

  return response.data;
};

export const register = async (data: RegisterDTO) => {
  const response = await api.post("/user", data);
  return response.data;
};

export const logout = () => {
  clearTokens();
};

export const setupLogoutHandler = (callback: () => void) => {
  registerLogoutCallback(callback);
};
