import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import { isTokenExpired } from '../utils/token';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8898/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Proactive Refresh & Bearer Token Attachment
apiClient.interceptors.request.use(
  async (config) => {
    // 1. Ignore public authentication endpoints
    const isAuthRoute =
      config.url?.includes('/auth/login') || config.url?.includes('/auth/register');
    if (isAuthRoute) {
      return config;
    }

    const { accessToken, refreshToken, refreshSession, logout } = useAuthStore.getState();

    // 2. Proactive check: If token is expiring in the next 30s, refresh before sending
    if (accessToken && isTokenExpired(accessToken)) {
      if (refreshToken) {
        try {
          await refreshSession();
          config.headers.Authorization = `Bearer ${useAuthStore.getState().accessToken}`;
          return config;
        } catch {
          logout();
          return config;
        }
      } else {
        logout();
        return config;
      }
    }

    // 3. Attach current access token
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Reactive Refresh Safety Net
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const errorCode = error.response?.data?.error?.code;

    // 1. Never attempt a token refresh on public login or register requests
    const isAuthRoute =
      originalRequest?.url?.includes('/auth/login') ||
      originalRequest?.url?.includes('/auth/register');

    if (isAuthRoute) {
      return Promise.reject(error);
    }

    // 2. Only attempt refresh if the server specifically returned TOKEN_EXPIRED
    if (errorCode === 'TOKEN_EXPIRED' && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await useAuthStore.getState().refreshSession();
        const newAccessToken = useAuthStore.getState().accessToken;
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }

    // 3. If token is invalid or missing on a protected route, log out immediately
    if (errorCode === 'INVALID_TOKEN' || errorCode === 'NO_TOKEN') {
      useAuthStore.getState().logout();
    }

    return Promise.reject(error);
  }
);

export default apiClient;
