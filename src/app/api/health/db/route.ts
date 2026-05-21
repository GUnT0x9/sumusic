import { NextResponse } from 'next/server'
import { readDb } from '@/lib/server/db'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const db = await readDb()
    return NextResponse.json({
      data: {
        ok: true,
        database: 'sumusic-file-db',
        users: db.users.length,
        teams: db.teams.length,
        teamInvites: db.teamInvites.length
      }
    })
  } catch (error) {
    console.error('File DB health check failed:', error)
    return NextResponse.json({ error: 'DB 상태를 확인할 수 없어요' }, { status: 500 })
  }
}
