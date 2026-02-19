import type { LoginDTO } from "@/schemas/login.schemas";
import type { RegisterDTO } from "@/schemas/register.schemas";
import api, { registerLogoutCallback } from "./api";
import { setTokens, clearTokens, USER_STORAGE } from "./auth.storage";
import { storage } from "./storage";

export const login = async (data: LoginDTO) => {
  const response = await api.post("/login", data);

  const { token, refreshToken, user } = response.data;


  setTokens(token, refreshToken);

  if (user) {
    storage.set(USER_STORAGE, JSON.stringify(user));
  }

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
