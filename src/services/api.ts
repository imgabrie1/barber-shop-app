/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, {
  AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";

import {
  getToken,
  getRefreshToken,
  setTokens,
  clearTokens,
} from "./auth.storage";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

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

const handleUnauthorized = async () => {
  clearTokens();
  delete api.defaults.headers.common["Authorization"];

  if (logoutCallback) {
    logoutCallback();
  }
};

const processTokenRefresh = async () => {
  try {
    const refreshToken = getRefreshToken();

    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await axios.post(
      `${API_BASE_URL}/login/refresh-token`,
      { refresh_token: refreshToken },
    );

    const { token, refresh_token } = response.data;

    setTokens(token, refresh_token);

    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    failedRequestsQueue.forEach((request) =>
      request.onSuccess(token),
    );
    failedRequestsQueue = [];
  } catch (error: any) {
    failedRequestsQueue.forEach((request) =>
      request.onFailure(error),
    );
    failedRequestsQueue = [];

    await handleUnauthorized();
  } finally {
    isRefreshing = false;
  }
};

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
            originalConfig.headers.Authorization = `Bearer ${token}`;
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

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken();

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

export default api;
