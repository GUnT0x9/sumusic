export interface AuthUser {
  id: string
  email: string
  username: string
  avatarUrl?: string
  plan: 'FREE' | 'PREMIUM'
  createdAt: string
}

export interface AuthResponse {
  user: AuthUser
  accessToken: string
}
