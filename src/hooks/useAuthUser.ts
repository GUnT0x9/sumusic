'use client'

import useSWR from 'swr'
import { api } from '@/lib/clientApi'
import type { AuthResponse, AuthUser } from '@/types/auth'

async function refreshAuth(): Promise<AuthUser> {
  const response = await api.post<{ data: AuthResponse }>('/auth/refresh')
  const { accessToken, user } = response.data.data
  window.localStorage.setItem('sumusic_access_token', accessToken)
  return user
}

export function useAuthUser() {
  const { data, error, isLoading, mutate } = useSWR('auth-user', refreshAuth, {
    shouldRetryOnError: false
  })

  return {
    user: data,
    error,
    isLoading,
    refreshUser: mutate
  }
}
