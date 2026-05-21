import { NextResponse } from 'next/server'
import { requireAuthUser, UnauthorizedError } from '@/lib/server/auth'
import { acceptTeamInvite, InviteEmailMismatchError, InviteNotFoundError, TeamNotFoundError } from '@/lib/server/teams'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: Request, { params }: { params: { token: string } }) {
  try {
    const user = await requireAuthUser(request)
    const result = await acceptTeamInvite(params.token, user)
    return NextResponse.json({ data: result })
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: '로그인이 필요해요' }, { status: 401 })
    }
    if (error instanceof InviteNotFoundError || error instanceof TeamNotFoundError) {
      return NextResponse.json({ error: '초대를 찾을 수 없어요' }, { status: 404 })
    }
    if (error instanceof InviteEmailMismatchError) {
      return NextResponse.json({ error: '초대받은 이메일 계정으로 로그인해주세요' }, { status: 403 })
    }
    return NextResponse.json({ error: '초대를 수락할 수 없어요' }, { status: 500 })
  }
}
