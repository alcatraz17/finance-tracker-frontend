import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import * as authApi from '../api/auth';

interface AuthState {
  user: authApi.User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  refreshSession: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const data = await authApi.loginUser(email, password);
          set({
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
            user: data.user || null,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (email, password, name) => {
        set({ isLoading: true });
        try {
          await authApi.registerUser(email, password, name);
          // Automatically log in following registration
          const loginData = await authApi.loginUser(email, password);
          set({
            accessToken: loginData.accessToken,
            refreshToken: loginData.refreshToken,
            user: loginData.user || null,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      refreshSession: async () => {
        const currentRefreshToken = get().refreshToken;
        if (!currentRefreshToken) throw new Error('No refresh token available');
        const data = await authApi.refreshAccessToken(currentRefreshToken);
        set({
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          isAuthenticated: true,
        });
      },

      logout: async () => {
        const token = get().refreshToken;
        if (token) {
          try {
            await authApi.logoutUser(token);
          } catch {
            // Ignore API network errors during logout
          }
        }
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: 'finance-tracker-auth',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
