import axios, {
  AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export const TOKEN_STORAGE = "@barbershop:token";
export const USER_STORAGE = "@barbershop:user";
export const REFRESH_TOKEN_STORAGE = "@barbershop:refreshToken";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let failedRequestsQueue: {
  onSuccess: (token: string) => void;
  onFailure: (err: AxiosError) => void;
}[] = [];

let logoutCallback: (() => void) | null = null;

export const registerLogoutCallback = (callback: () => void) => {
  logoutCallback = callback;
};

// Funções de armazenamento para Web (localStorage/sessionStorage)
const storage = {
  getItem: (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      return null;
    }
  },

  setItem: (key: string, value: string): void => {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error("Error writing to localStorage:", error);
    }
  },

  removeItem: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error("Error removing from localStorage:", error);
    }
  },

  multiRemove: (keys: string[]): void => {
    keys.forEach((key) => storage.removeItem(key));
  },
};

// Alternativa: usar sessionStorage se preferir
// const storage = sessionStorage;

const handleUnauthorized = async () => {
  if (logoutCallback) {
    logoutCallback();
    return;
  }

  // Remove tokens do storage
  storage.multiRemove([TOKEN_STORAGE, USER_STORAGE, REFRESH_TOKEN_STORAGE]);

  // Remove token do header padrão
  delete api.defaults.headers.common["Authorization"];

  // Redireciona para login - você precisará ajustar conforme sua roteirização
  window.location.href = "/login";
};

const processTokenRefresh = async () => {
  try {
    const refreshToken = storage.getItem(REFRESH_TOKEN_STORAGE);

    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await axios.post(`${API_BASE_URL}/login/refresh-token`, {
      refresh_token: refreshToken,
    });

    const { token, refresh_token } = response.data;

    storage.setItem(TOKEN_STORAGE, token);
    if (refresh_token) {
      storage.setItem(REFRESH_TOKEN_STORAGE, refresh_token);
    }

    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    failedRequestsQueue.forEach((request) => request.onSuccess(token));
    failedRequestsQueue = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (refreshError: any) {
    failedRequestsQueue.forEach((request) => request.onFailure(refreshError));
    failedRequestsQueue = [];

    console.error("Refresh token failed, logging out.", refreshError);
    await handleUnauthorized();
  } finally {
    isRefreshing = false;
  }
};

// interceptor de resposta
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalConfig = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalConfig._retry) {
      originalConfig._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;
        await processTokenRefresh();
      }

      return new Promise((resolve, reject) => {
        failedRequestsQueue.push({
          onSuccess: (token: string) => {
            originalConfig.headers = originalConfig.headers || {};
            originalConfig.headers["Authorization"] = `Bearer ${token}`;
            resolve(api(originalConfig));
          },
          onFailure: (err: AxiosError) => {
            reject(err);
          },
        });
      });
    }

    return Promise.reject(error);
  },
);

// interceptor de requisição
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = storage.getItem(TOKEN_STORAGE);
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

// funções auxiliares para gerenciamento de tokens
export const setAuthToken = (token: string, refreshToken?: string) => {
  storage.setItem(TOKEN_STORAGE, token);
  if (refreshToken) {
    storage.setItem(REFRESH_TOKEN_STORAGE, refreshToken);
  }
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

export const clearAuthTokens = () => {
  storage.multiRemove([TOKEN_STORAGE, USER_STORAGE, REFRESH_TOKEN_STORAGE]);
  delete api.defaults.headers.common["Authorization"];
};

export const getAuthToken = (): string | null => {
  return storage.getItem(TOKEN_STORAGE);
};

export const getRefreshToken = (): string | null => {
  return storage.getItem(REFRESH_TOKEN_STORAGE);
};

// export const getUserData = () => {
//   const userStr = storage.getItem(USER_STORAGE);
//   return userStr ? JSON.parse(userStr) : null;
// };

// export const setUserData = (user: any) => {
//   storage.setItem(USER_STORAGE, JSON.stringify(user));
// };

export default api;
