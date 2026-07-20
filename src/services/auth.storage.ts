import { storage } from "./storage";

export const TOKEN_STORAGE = "@barbershop:token";
export const REFRESH_TOKEN_STORAGE = "@barbershop:refreshToken";
export const USER_STORAGE = "@barbershop:user";
export const TENANT_STORAGE = "@barbershop:tenant";

export const getToken = (): string | null =>
  storage.get(TOKEN_STORAGE);

export const getRefreshToken = (): string | null =>
  storage.get(REFRESH_TOKEN_STORAGE);

export const getTenant = (): string | null =>
  storage.get(TENANT_STORAGE);

export const setTenant = (tenantSlug: string) => {
  storage.set(TENANT_STORAGE, tenantSlug);
};

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

export const clearTenant = () => {
  storage.remove(TENANT_STORAGE);
};
