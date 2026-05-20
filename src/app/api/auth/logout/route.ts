import { NextResponse } from 'next/server'
import { clearRefreshCookie } from '@/lib/server/auth'

export const runtime = 'nodejs'

export async function POST() {
  clearRefreshCookie()
  return NextResponse.json({ data: { ok: true } })
}
