import { NextResponse } from 'next/server'
import { requireAuthUser, UnauthorizedError } from '@/lib/server/auth'
import { createTeam, listTeamsForUser } from '@/lib/server/teams'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function normalizeTeamName(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

export async function GET(request: Request) {
  try {
    const user = await requireAuthUser(request)
    const teams = await listTeamsForUser(user.id)
    return NextResponse.json({ data: teams })
  } catch {
    return NextResponse.json({ error: '로그인이 필요해요' }, { status: 401 })
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireAuthUser(request)
    const body = await request.json()
    const name = normalizeTeamName(body.name)
    if (name.length < 2 || name.length > 40) {
      return NextResponse.json({ error: '팀 이름은 2~40자로 입력해주세요' }, { status: 400 })
    }

    const team = await createTeam(user, name)
    return NextResponse.json({ data: team }, { status: 201 })
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: '로그인이 필요해요' }, { status: 401 })
    }
    return NextResponse.json({ error: '팀을 만들 수 없어요' }, { status: 500 })
  }
}
