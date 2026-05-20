export function normalizeEmail(email: unknown): string {
  if (typeof email !== 'string') return ''
  return email.trim().toLowerCase()
}

export function normalizeUsername(username: unknown): string {
  if (typeof username !== 'string') return ''
  return username.trim()
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function isValidUsername(username: string): boolean {
  return /^[a-zA-Z0-9가-힣_]{2,20}$/.test(username)
}

export function isValidPassword(password: unknown): password is string {
  return typeof password === 'string' && password.length >= 8 && password.length <= 72
}
