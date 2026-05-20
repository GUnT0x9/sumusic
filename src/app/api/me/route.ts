import { ObjectId } from 'mongodb'
import { NextResponse } from 'next/server'
import { getUsersCollection, toAuthUser, verifyAccessToken } from '@/lib/server/auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function getBearerToken(request: Request): string | null {
  const header = request.headers.get('authorization')
  if (!header?.startsWith('Bearer ')) return null
  return header.slice('Bearer '.length)
}

export async function GET(request: Request) {
  try {
    const token = getBearerToken(request)
    if (!token) {
      return NextResponse.json({ error: '로그인이 필요해요' }, { status: 401 })
    }

    const payload = verifyAccessToken(token)
    if (!ObjectId.isValid(payload.sub)) {
      return NextResponse.json({ error: '로그인이 필요해요' }, { status: 401 })
    }

    const users = await getUsersCollection()
    const user = await users.findOne({ _id: new ObjectId(payload.sub) })
    if (!user) {
      return NextResponse.json({ error: '로그인이 필요해요' }, { status: 401 })
    }

    return NextResponse.json({ data: toAuthUser(user) })
  } catch {
    return NextResponse.json({ error: '로그인이 필요해요' }, { status: 401 })
  }
}
