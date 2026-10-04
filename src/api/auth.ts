import apiClient from './client';

export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    accessToken: string;
    refreshToken: string;
    user?: User;
  };
}

export async function loginUser(email: string, password: string): Promise<AuthResponse['data']> {
  const res = await apiClient.post<AuthResponse>('/auth/login', {
    email,
    password,
  });
  return res.data.data;
}

export async function registerUser(
  email: string,
  password: string,
  name?: string
): Promise<AuthResponse['data']> {
  const res = await apiClient.post<AuthResponse>('/auth/register', { email, password, name });
  return res.data.data;
}
export async function refreshAccessToken(
  refreshToken: string
): Promise<{ accessToken: string; refreshToken: string }> {
  const res = await apiClient.post<AuthResponse>('/auth/refresh', { refreshToken });
  return res.data.data;
}
export async function logoutUser(refreshToken: string): Promise<void> {
  await apiClient.post('/auth/logout', { refreshToken });
}
