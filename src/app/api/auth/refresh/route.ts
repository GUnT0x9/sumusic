import { ObjectId } from 'mongodb'
import { NextResponse } from 'next/server'
import { createAccessToken, getRefreshCookie, getUsersCollection, setRefreshCookie, createRefreshToken, verifyRefreshToken, toAuthUser } from '@/lib/server/auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST() {
  try {
    const refreshToken = getRefreshCookie()
    if (!refreshToken) {
      return NextResponse.json({ error: '로그인이 필요해요' }, { status: 401 })
    }

    const payload = verifyRefreshToken(refreshToken)
    if (!payload.sub || !ObjectId.isValid(payload.sub)) {
      return NextResponse.json({ error: '로그인이 필요해요' }, { status: 401 })
    }

    const users = await getUsersCollection()
    const user = await users.findOne({ _id: new ObjectId(payload.sub) })
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
