import { NextResponse } from 'next/server'
import { findUserById, getBearerToken, toAuthUser, verifyAccessToken } from '@/lib/server/auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const token = getBearerToken(request)
    if (!token) {
      return NextResponse.json({ error: '로그인이 필요해요' }, { status: 401 })
    }

    const payload = verifyAccessToken(token)
    const user = await findUserById(payload.sub)
    if (!user) {
      return NextResponse.json({ error: '로그인이 필요해요' }, { status: 401 })
    }

    return NextResponse.json({ data: toAuthUser(user) })
  } catch {
    return NextResponse.json({ error: '로그인이 필요해요' }, { status: 401 })
  }
}
