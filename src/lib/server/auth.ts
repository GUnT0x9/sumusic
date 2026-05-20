import jwt, { type JwtPayload } from 'jsonwebtoken'
import { ObjectId, type Collection } from 'mongodb'
import { cookies } from 'next/headers'
import { getMongoDb } from '@/lib/server/mongodb'
import type { AuthUser } from '@/types/auth'

export interface UserDocument {
  _id: ObjectId
  email: string
  username: string
  passwordHash: string
  avatarUrl?: string
  plan: 'FREE' | 'PREMIUM'
  createdAt: Date
  updatedAt: Date
}

export interface AccessTokenPayload extends JwtPayload {
  sub: string
  email: string
  username: string
}

const refreshCookieName = 'sumusic_refresh_token'

function getSecret(name: 'JWT_ACCESS_SECRET' | 'JWT_REFRESH_SECRET'): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(`${name} is not configured`)
  }
  return value
}

export async function getUsersCollection(): Promise<Collection<UserDocument>> {
  const db = await getMongoDb()
  const collection = db.collection<UserDocument>('users')
  await collection.createIndex({ email: 1 }, { unique: true })
  await collection.createIndex({ username: 1 }, { unique: true })
  return collection
}

export function toAuthUser(user: UserDocument): AuthUser {
  return {
    id: user._id.toHexString(),
    email: user.email,
    username: user.username,
    avatarUrl: user.avatarUrl,
    plan: user.plan,
    createdAt: user.createdAt.toISOString()
  }
}

export function createAccessToken(user: UserDocument): string {
  return jwt.sign(
    { email: user.email, username: user.username },
    getSecret('JWT_ACCESS_SECRET'),
    { subject: user._id.toHexString(), expiresIn: '15m' }
  )
}

export function createRefreshToken(user: UserDocument): string {
  return jwt.sign(
    { tokenType: 'refresh' },
    getSecret('JWT_REFRESH_SECRET'),
    { subject: user._id.toHexString(), expiresIn: '7d' }
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
