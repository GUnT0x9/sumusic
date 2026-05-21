import jwt, { type JwtPayload } from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { createId, readDb, updateDb, type DbUser } from '@/lib/server/db'
import type { AuthUser } from '@/types/auth'

export type UserDocument = DbUser

export interface AccessTokenPayload extends JwtPayload {
  sub: string
  email: string
  username: string
}

export class DuplicateUserError extends Error {
  constructor() {
    super('Duplicate user')
  }
}

export class UnauthorizedError extends Error {
  constructor() {
    super('Unauthorized')
  }
}

const refreshCookieName = 'sumusic_refresh_token'

function getSecret(name: 'JWT_ACCESS_SECRET' | 'JWT_REFRESH_SECRET'): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(`${name} is not configured`)
  }
  return value
}

export async function findUserById(id: string): Promise<UserDocument | null> {
  const db = await readDb()
  return db.users.find((user) => user.id === id) ?? null
}

export async function findUserByEmail(email: string): Promise<UserDocument | null> {
  const db = await readDb()
  return db.users.find((user) => user.email === email) ?? null
}

export async function createUser(input: {
  email: string
  username: string
  passwordHash: string
}): Promise<UserDocument> {
  return updateDb((db) => {
    const emailTaken = db.users.some((user) => user.email === input.email)
    const usernameTaken = db.users.some((user) => user.username === input.username)
    if (emailTaken || usernameTaken) {
      throw new DuplicateUserError()
    }

    const now = new Date().toISOString()
    const user: UserDocument = {
      id: createId(),
      email: input.email,
      username: input.username,
      passwordHash: input.passwordHash,
      plan: 'FREE',
      createdAt: now,
      updatedAt: now
    }
    db.users.push(user)
    return user
  })
}

export function toAuthUser(user: UserDocument): AuthUser {
  return {
    id: user.id,
    email: user.email,
    username: user.username,
    avatarUrl: user.avatarUrl,
    plan: user.plan,
    createdAt: user.createdAt
  }
}

export function createAccessToken(user: UserDocument): string {
  return jwt.sign(
    { email: user.email, username: user.username },
    getSecret('JWT_ACCESS_SECRET'),
    { subject: user.id, expiresIn: '15m' }
  )
}

export function createRefreshToken(user: UserDocument): string {
  return jwt.sign(
    { tokenType: 'refresh' },
    getSecret('JWT_REFRESH_SECRET'),
    { subject: user.id, expiresIn: '7d' }
  )
}

export function setRefreshCookie(refreshToken: string): void {
  cookies().set(refreshCookieName, refreshToken, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7
  })
}

export function clearRefreshCookie(): void {
  cookies().set(refreshCookieName, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0
  })
}

export function getRefreshCookie(): string | undefined {
  return cookies().get(refreshCookieName)?.value
}

export function verifyRefreshToken(token: string): JwtPayload {
  const payload = jwt.verify(token, getSecret('JWT_REFRESH_SECRET'))
  if (typeof payload === 'string') {
    throw new Error('Invalid refresh token')
  }
  return payload
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  const payload = jwt.verify(token, getSecret('JWT_ACCESS_SECRET'))
  if (typeof payload === 'string' || !payload.sub || !payload.email || !payload.username) {
    throw new Error('Invalid access token')
  }
  return payload as AccessTokenPayload
}

export function getBearerToken(request: Request): string | null {
  const header = request.headers.get('authorization')
  if (!header?.startsWith('Bearer ')) return null
  return header.slice('Bearer '.length)
}

export async function requireAuthUser(request: Request): Promise<UserDocument> {
  const token = getBearerToken(request)
  if (!token) {
    throw new UnauthorizedError()
  }

  const payload = verifyAccessToken(token)
  const user = await findUserById(payload.sub)
  if (!user) {
    throw new UnauthorizedError()
  }
  return user
}
