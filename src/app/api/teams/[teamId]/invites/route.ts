import { NextResponse } from 'next/server'
import { requireAuthUser, UnauthorizedError } from '@/lib/server/auth'
import { isValidEmail, normalizeEmail } from '@/lib/server/validation'
import { createTeamInvite, listTeamInvites, TeamForbiddenError, TeamNotFoundError } from '@/lib/server/teams'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function normalizeRole(value: unknown): 'ADMIN' | 'MEMBER' {
  return value === 'ADMIN' ? 'ADMIN' : 'MEMBER'
}

function inviteError(error: unknown) {
  if (error instanceof UnauthorizedError) {
    return NextResponse.json({ error: '로그인이 필요해요' }, { status: 401 })
  }
  if (error instanceof TeamNotFoundError) {
    return NextResponse.json({ error: '팀을 찾을 수 없어요' }, { status: 404 })
  }
  if (error instanceof TeamForbiddenError) {
    return NextResponse.json({ error: '팀 초대 권한이 없어요' }, { status: 403 })
  }
  return NextResponse.json({ error: '팀 초대를 처리할 수 없어요' }, { status: 500 })
}

export async function GET(request: Request, { params }: { params: { teamId: string } }) {
  try {
    const user = await requireAuthUser(request)
    const invites = await listTeamInvites(params.teamId, user.id)
    return NextResponse.json({ data: invites })
  } catch (error) {
    return inviteError(error)
  }
}

export async function POST(request: Request, { params }: { params: { teamId: string } }) {
  try {
    const user = await requireAuthUser(request)
    const body = await request.json()
    const email = normalizeEmail(body.email)
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: '유효한 이메일을 입력해주세요' }, { status: 400 })
    }

    const invite = await createTeamInvite({
      teamId: params.teamId,
      email,
      role: normalizeRole(body.role),
      invitedBy: user.id
    })
    return NextResponse.json({ data: invite }, { status: 201 })
  } catch (error) {
    return inviteError(error)
  }
}
