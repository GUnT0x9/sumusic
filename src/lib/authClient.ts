import type { AxiosError } from 'axios'
import { api } from '@/lib/clientApi'
import type { AuthResponse } from '@/types/auth'

interface ApiErrorResponse {
  error?: string
}

export function getAuthErrorMessage(error: unknown): string {
  const axiosError = error as AxiosError<ApiErrorResponse>
  return axiosError.response?.data?.error ?? '오류가 발생했어요. 다시 시도해주세요'
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const response = await api.post<{ data: AuthResponse }>('/auth/login', { email, password })
  window.localStorage.setItem('sumusic_access_token', response.data.data.accessToken)
  return response.data.data
}

export async function register(email: string, username: string, password: string): Promise<AuthResponse> {
  const response = await api.post<{ data: AuthResponse }>('/auth/register', { email, username, password })
  window.localStorage.setItem('sumusic_access_token', response.data.data.accessToken)
  return response.data.data
}

export async function logout(): Promise<void> {
  await api.post('/auth/logout')
  window.localStorage.removeItem('sumusic_access_token')
}
