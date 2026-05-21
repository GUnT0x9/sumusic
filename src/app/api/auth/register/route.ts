import bcrypt from 'bcryptjs'
import { NextResponse } from 'next/server'
import { createAccessToken, createRefreshToken, createUser, DuplicateUserError, setRefreshCookie, toAuthUser } from '@/lib/server/auth'
import { isValidEmail, isValidPassword, isValidUsername, normalizeEmail, normalizeUsername } from '@/lib/server/validation'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const email = normalizeEmail(body.email)
    const username = normalizeUsername(body.username)
    const password = body.password

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: '유효한 이메일을 입력해주세요' }, { status: 400 })
    }
    if (!isValidUsername(username)) {
      return NextResponse.json({ error: '사용자 이름은 2~20자의 한글, 영문, 숫자, 밑줄만 사용할 수 있어요' }, { status: 400 })
    }
    if (!isValidPassword(password)) {
      return NextResponse.json({ error: '비밀번호는 8자 이상이어야 해요' }, { status: 400 })
    }

    const passwordHash = await bcrypt.hash(password, 12)
    const user = await createUser({
      email,
      username,
      passwordHash
    })

    const accessToken = createAccessToken(user)
    setRefreshCookie(createRefreshToken(user))

    return NextResponse.json({ data: { user: toAuthUser(user), accessToken } }, { status: 201 })
  } catch (error) {
    if (error instanceof DuplicateUserError) {
      return NextResponse.json({ error: '이미 사용 중인 이메일 또는 사용자 이름이에요' }, { status: 409 })
    }
    console.error('Register failed:', error)
    return NextResponse.json({ error: '회원가입 중 오류가 발생했어요' }, { status: 500 })
  }
}
