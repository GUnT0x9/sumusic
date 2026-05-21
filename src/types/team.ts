export interface TeamMember {
  userId: string
  role: 'OWNER' | 'ADMIN' | 'MEMBER'
  joinedAt: string
}

export interface Team {
  id: string
  name: string
  ownerId: string
  members: TeamMember[]
  createdAt: string
  updatedAt: string
}

export interface TeamInvite {
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
