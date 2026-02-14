import { storage } from "./storage";

export const TOKEN_STORAGE = "@barbershop:token";
export const REFRESH_TOKEN_STORAGE = "@barbershop:refreshToken";
export const USER_STORAGE = "@barbershop:user";

export const getToken = (): string | null =>
  storage.get(TOKEN_STORAGE);

export const getRefreshToken = (): string | null =>
  storage.get(REFRESH_TOKEN_STORAGE);

export const setTokens = (token: string, refreshToken?: string) => {
  storage.set(TOKEN_STORAGE, token);
  if (refreshToken) {
    storage.set(REFRESH_TOKEN_STORAGE, refreshToken);
  }
};

export const clearTokens = () => {
  storage.multiRemove([
    TOKEN_STORAGE,
    REFRESH_TOKEN_STORAGE,
    USER_STORAGE,
  ]);
};
