import type { AxiosError } from 'axios'
import { api } from '@/lib/clientApi'
import type { Team, TeamInvite } from '@/types/team'

interface ApiErrorResponse {
  error?: string
}

export function getTeamErrorMessage(error: unknown): string {
  const axiosError = error as AxiosError<ApiErrorResponse>
  return axiosError.response?.data?.error ?? '팀 작업 중 오류가 발생했어요'
}

export async function listTeams(): Promise<Team[]> {
  const response = await api.get<{ data: Team[] }>('/teams')
  return response.data.data
}

export async function createTeam(name: string): Promise<Team> {
  const response = await api.post<{ data: Team }>('/teams', { name })
  return response.data.data
}

export async function listTeamInvites(teamId: string): Promise<TeamInvite[]> {
  const response = await api.get<{ data: TeamInvite[] }>(`/teams/${teamId}/invites`)
  return response.data.data
}

export async function createTeamInvite(teamId: string, email: string, role: 'ADMIN' | 'MEMBER'): Promise<TeamInvite> {
  const response = await api.post<{ data: TeamInvite }>(`/teams/${teamId}/invites`, { email, role })
  return response.data.data
}

export async function acceptTeamInvite(token: string): Promise<{ team: Team; invite: TeamInvite }> {
  const response = await api.post<{ data: { team: Team; invite: TeamInvite } }>(`/team-invites/${token}/accept`)
  return response.data.data
}
