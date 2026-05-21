import { promises as fs } from 'fs'
import path from 'path'
import { randomUUID } from 'crypto'

export interface DbUser {
  id: string
  email: string
  username: string
  passwordHash: string
  avatarUrl?: string
  plan: 'FREE' | 'PREMIUM'
  createdAt: string
  updatedAt: string
}

export interface DbTeamMember {
  userId: string
  role: 'OWNER' | 'ADMIN' | 'MEMBER'
  joinedAt: string
}

export interface DbTeam {
  id: string
  name: string
  ownerId: string
  members: DbTeamMember[]
  createdAt: string
  updatedAt: string
}

export interface DbTeamInvite {
  id: string
  teamId: string
  email: string
  role: 'ADMIN' | 'MEMBER'
  token: string
  invitedBy: string
  acceptedBy?: string
  status: 'PENDING' | 'ACCEPTED' | 'CANCELLED'
  createdAt: string
  updatedAt: string
  acceptedAt?: string
}

export interface SumusicDb {
  users: DbUser[]
  teams: DbTeam[]
  teamInvites: DbTeamInvite[]
}

const defaultDb: SumusicDb = {
  users: [],
  teams: [],
  teamInvites: []
}

const dbFilePath = process.env.SUMUSIC_DB_PATH
  ? path.resolve(process.env.SUMUSIC_DB_PATH)
  : path.join(process.cwd(), 'data', 'sumusic-db.json')

let writeQueue = Promise.resolve()

async function ensureDbFile(): Promise<void> {
  await fs.mkdir(path.dirname(dbFilePath), { recursive: true })
  try {
    await fs.access(dbFilePath)
  } catch {
    await fs.writeFile(dbFilePath, JSON.stringify(defaultDb, null, 2), 'utf8')
  }
}

function normalizeDb(value: Partial<SumusicDb>): SumusicDb {
  return {
    users: Array.isArray(value.users) ? value.users : [],
    teams: Array.isArray(value.teams) ? value.teams : [],
    teamInvites: Array.isArray(value.teamInvites) ? value.teamInvites : []
  }
}

export async function readDb(): Promise<SumusicDb> {
  await ensureDbFile()
  const raw = await fs.readFile(dbFilePath, 'utf8')
  if (!raw.trim()) return { ...defaultDb }
  return normalizeDb(JSON.parse(raw) as Partial<SumusicDb>)
}

async function writeDb(db: SumusicDb): Promise<void> {
  await ensureDbFile()
  const tmpPath = `${dbFilePath}.${process.pid}.${Date.now()}.tmp`
  await fs.writeFile(tmpPath, JSON.stringify(db, null, 2), 'utf8')
  await fs.rename(tmpPath, dbFilePath)
}

export async function updateDb<T>(mutator: (db: SumusicDb) => T | Promise<T>): Promise<T> {
  const run = writeQueue.then(async () => {
    const db = await readDb()
    const result = await mutator(db)
    await writeDb(db)
    return result
  })
  writeQueue = run.then(
    () => undefined,
    () => undefined
  )
  return run
}

export function createId(): string {
  return randomUUID()
}

export function createInviteToken(): string {
  return randomUUID().replace(/-/g, '')
}
