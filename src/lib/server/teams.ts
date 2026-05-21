import { createId, createInviteToken, readDb, updateDb, type DbTeam, type DbTeamInvite } from '@/lib/server/db'
import type { UserDocument } from '@/lib/server/auth'

export class TeamNotFoundError extends Error {}
export class TeamForbiddenError extends Error {}
export class InviteNotFoundError extends Error {}
export class InviteEmailMismatchError extends Error {}

function canManageTeam(team: DbTeam, userId: string): boolean {
  const member = team.members.find((item) => item.userId === userId)
  return member?.role === 'OWNER' || member?.role === 'ADMIN'
}

export async function listTeamsForUser(userId: string): Promise<DbTeam[]> {
  const db = await readDb()
  return db.teams.filter((team) => team.members.some((member) => member.userId === userId))
}

export async function createTeam(owner: UserDocument, name: string): Promise<DbTeam> {
  return updateDb((db) => {
    const now = new Date().toISOString()
    const team: DbTeam = {
      id: createId(),
      name,
      ownerId: owner.id,
      members: [{ userId: owner.id, role: 'OWNER', joinedAt: now }],
      createdAt: now,
      updatedAt: now
    }
    db.teams.push(team)
    return team
  })
}

export async function listTeamInvites(teamId: string, userId: string): Promise<DbTeamInvite[]> {
  const db = await readDb()
  const team = db.teams.find((item) => item.id === teamId)
  if (!team) throw new TeamNotFoundError()
  if (!canManageTeam(team, userId)) throw new TeamForbiddenError()
  return db.teamInvites.filter((invite) => invite.teamId === teamId)
}

export async function createTeamInvite(input: {
  teamId: string
  email: string
  role: 'ADMIN' | 'MEMBER'
  invitedBy: string
}): Promise<DbTeamInvite> {
  return updateDb((db) => {
    const team = db.teams.find((item) => item.id === input.teamId)
    if (!team) throw new TeamNotFoundError()
    if (!canManageTeam(team, input.invitedBy)) throw new TeamForbiddenError()

    const now = new Date().toISOString()
    const existingPendingInvite = db.teamInvites.find(
      (invite) => invite.teamId === input.teamId && invite.email === input.email && invite.status === 'PENDING'
    )
    if (existingPendingInvite) {
      existingPendingInvite.role = input.role
      existingPendingInvite.updatedAt = now
      return existingPendingInvite
    }

    const invite: DbTeamInvite = {
      id: createId(),
      teamId: input.teamId,
      email: input.email,
      role: input.role,
      token: createInviteToken(),
      invitedBy: input.invitedBy,
      status: 'PENDING',
      createdAt: now,
      updatedAt: now
    }
    db.teamInvites.push(invite)
    return invite
  })
}

export async function acceptTeamInvite(token: string, user: UserDocument): Promise<{ team: DbTeam; invite: DbTeamInvite }> {
  return updateDb((db) => {
    const invite = db.teamInvites.find((item) => item.token === token && item.status === 'PENDING')
    if (!invite) throw new InviteNotFoundError()
    if (invite.email !== user.email) throw new InviteEmailMismatchError()

    const team = db.teams.find((item) => item.id === invite.teamId)
    if (!team) throw new TeamNotFoundError()

    const now = new Date().toISOString()
    const member = team.members.find((item) => item.userId === user.id)
    if (member) {
      member.role = invite.role
    } else {
      team.members.push({ userId: user.id, role: invite.role, joinedAt: now })
    }
    team.updatedAt = now
    invite.status = 'ACCEPTED'
    invite.acceptedBy = user.id
    invite.acceptedAt = now
    invite.updatedAt = now
    return { team, invite }
  })
}
