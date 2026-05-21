import { NextResponse } from 'next/server'
import { createAccessToken, createRefreshToken, findUserById, getRefreshCookie, setRefreshCookie, toAuthUser, verifyRefreshToken } from '@/lib/server/auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST() {
  try {
    const refreshToken = getRefreshCookie()
    if (!refreshToken) {
      return NextResponse.json({ error: '로그인이 필요해요' }, { status: 401 })
    }

    const payload = verifyRefreshToken(refreshToken)
    if (!payload.sub || typeof payload.sub !== 'string') {
      return NextResponse.json({ error: '로그인이 필요해요' }, { status: 401 })
    }

    const user = await findUserById(payload.sub)
    if (!user) {
      return NextResponse.json({ error: '로그인이 필요해요' }, { status: 401 })
    }

    const accessToken = createAccessToken(user)
    setRefreshCookie(createRefreshToken(user))

    return NextResponse.json({ data: { user: toAuthUser(user), accessToken } })
  } catch {
    return NextResponse.json({ error: '로그인이 필요해요' }, { status: 401 })
  }
}
