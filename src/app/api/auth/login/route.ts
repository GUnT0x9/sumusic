import bcrypt from 'bcryptjs'
import { NextResponse } from 'next/server'
import { createAccessToken, createRefreshToken, findUserByEmail, setRefreshCookie, toAuthUser } from '@/lib/server/auth'
import { isValidEmail, normalizeEmail } from '@/lib/server/validation'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const email = normalizeEmail(body.email)
    const password = typeof body.password === 'string' ? body.password : ''

    if (!isValidEmail(email) || !password) {
      return NextResponse.json({ error: '이메일과 비밀번호를 확인해주세요' }, { status: 400 })
    }

    const user = await findUserByEmail(email)
    if (!user) {
      return NextResponse.json({ error: '이메일 또는 비밀번호가 올바르지 않아요' }, { status: 401 })
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash)
    if (!passwordMatches) {
      return NextResponse.json({ error: '이메일 또는 비밀번호가 올바르지 않아요' }, { status: 401 })
    }

    const accessToken = createAccessToken(user)
    setRefreshCookie(createRefreshToken(user))

    return NextResponse.json({ data: { user: toAuthUser(user), accessToken } })
  } catch (error) {
    console.error('Login failed:', error)
    return NextResponse.json({ error: '로그인 중 오류가 발생했어요' }, { status: 500 })
  }
}
