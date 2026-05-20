import { NextResponse } from 'next/server'
import { getMongoDb } from '@/lib/server/mongodb'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const db = await getMongoDb()
    await db.command({ ping: 1 })
    return NextResponse.json({ data: { ok: true, database: db.databaseName } })
  } catch (error) {
    console.error('MongoDB health check failed:', error)
    return NextResponse.json({ error: 'MongoDB 연결에 실패했어요' }, { status: 500 })
  }
}
