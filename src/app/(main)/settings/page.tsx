'use client'

import { useRouter } from 'next/navigation'
import { Bell, Globe2, LogOut, PlayCircle, Plus, Send, Shield, UserRound, UsersRound, Volume2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useAuthUser } from '@/hooks/useAuthUser'
import { logout } from '@/lib/authClient'
import { createTeam, createTeamInvite, getTeamErrorMessage, listTeamInvites, listTeams } from '@/lib/teamClient'
import { useUIStore } from '@/store/uiStore'
import type { Team, TeamInvite } from '@/types/team'

export default function SettingsPage() {
  const router = useRouter()
  const { user, isLoading, refreshUser } = useAuthUser()
  const { addToast } = useUIStore()
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [autoplayEnabled, setAutoplayEnabled] = useState(true)
  const [normalizeVolume, setNormalizeVolume] = useState(false)
  const [teams, setTeams] = useState<Team[]>([])
  const [teamInvites, setTeamInvites] = useState<TeamInvite[]>([])
  const [selectedTeamId, setSelectedTeamId] = useState('')
  const [teamName, setTeamName] = useState('')
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState<'ADMIN' | 'MEMBER'>('MEMBER')
  const [teamBusy, setTeamBusy] = useState(false)

  useEffect(() => {
    if (!user) return
    listTeams()
      .then((items) => {
        setTeams(items)
        setSelectedTeamId((current) => current || items[0]?.id || '')
      })
      .catch((error) => addToast(getTeamErrorMessage(error), 'error'))
  }, [addToast, user])

  useEffect(() => {
    if (!selectedTeamId) {
      setTeamInvites([])
      return
    }
    listTeamInvites(selectedTeamId)
      .then(setTeamInvites)
      .catch(() => setTeamInvites([]))
  }, [selectedTeamId])

  const handleLogout = async () => {
    await logout()
    await refreshUser(undefined, { revalidate: false })
    addToast('로그아웃했어요', 'success')
    router.push('/login')
  }

  const handleCreateTeam = async () => {
    setTeamBusy(true)
    try {
      const team = await createTeam(teamName)
      setTeams((items) => [team, ...items])
      setSelectedTeamId(team.id)
      setTeamName('')
      addToast('팀을 만들었어요', 'success')
    } catch (error) {
      addToast(getTeamErrorMessage(error), 'error')
    } finally {
      setTeamBusy(false)
    }
  }

  const handleInvite = async () => {
    if (!selectedTeamId) return
    setTeamBusy(true)
    try {
      const invite = await createTeamInvite(selectedTeamId, inviteEmail, inviteRole)
      setTeamInvites((items) => [invite, ...items.filter((item) => item.id !== invite.id)])
      setInviteEmail('')
      addToast('초대를 만들었어요', 'success')
    } catch (error) {
      addToast(getTeamErrorMessage(error), 'error')
    } finally {
      setTeamBusy(false)
    }
  }

  return (
    <div className="max-w-4xl space-y-8">
      <section>
        <p className="text-[10px] font-medium uppercase tracking-[2px] text-[var(--gray2)]">Account</p>
        <h1 className="display mt-2 text-5xl text-[var(--gray1)]">설정</h1>
        <p className="mt-1 text-sm text-[var(--gray2)]">프로필, 계정 상태, 앱 환경을 관리합니다.</p>
      </section>

      <section className="surface grid gap-5 p-5 md:grid-cols-[220px_1fr] md:p-6">
        <div>
          <div className="flex h-24 w-24 items-center justify-center rounded-[12px] bg-[var(--bg4)] text-[var(--gray1)]">
            <UserRound size={34} strokeWidth={1.5} />
          </div>
          <p className="mt-4 text-lg font-medium text-[var(--gray1)]">{user?.username ?? (isLoading ? '확인 중' : '로그인이 필요해요')}</p>
          <p className="text-sm text-[var(--gray2)]">{user?.email ?? '-'}</p>
        </div>
        <div className="grid gap-3">
          <SettingRow label="사용자 이름" value={user?.username ?? '-'} />
          <SettingRow label="이메일" value={user?.email ?? '-'} />
          <SettingRow label="현재 플랜" value={user?.plan ?? '-'} />
          <SettingRow label="가입 상태" value={user ? '활성 계정' : '로그인 필요'} />
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="surface p-5 md:col-span-2">
          <SettingsCardHeader icon={UsersRound} title="팀 관리" description="팀을 만들고 이메일로 팀원을 초대합니다." />
          <div className="mt-5 grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  className="h-10 min-w-0 flex-1 rounded-[10px] border border-[var(--border)] bg-[var(--bg2)] px-3 text-sm text-[var(--gray1)] outline-none"
                  value={teamName}
                  onChange={(event) => setTeamName(event.target.value)}
                  placeholder="새 팀 이름"
                />
                <button
                  className="inline-flex h-10 items-center gap-2 rounded-[10px] border border-[var(--border)] px-3 text-sm text-[var(--gray1)] transition-colors duration-150 ease-in hover:bg-[var(--bg4)] disabled:opacity-50"
                  type="button"
                  onClick={handleCreateTeam}
                  disabled={!user || teamBusy || teamName.trim().length < 2}
                >
                  <Plus size={15} strokeWidth={1.5} />
                  생성
                </button>
              </div>
              <div className="space-y-2">
                {teams.length === 0 ? (
                  <p className="rounded-[10px] bg-[var(--bg2)] px-4 py-3 text-sm text-[var(--gray2)]">아직 팀이 없어요.</p>
                ) : (
                  teams.map((team) => (
                    <button
                      key={team.id}
                      className={`flex min-h-12 w-full items-center justify-between rounded-[10px] px-4 text-left text-sm transition-colors duration-150 ease-in ${selectedTeamId === team.id ? 'bg-[var(--bg5)] text-[var(--gray1)]' : 'bg-[var(--bg2)] text-[var(--gray2)] hover:bg-[var(--bg4)]'}`}
                      type="button"
                      onClick={() => setSelectedTeamId(team.id)}
                    >
                      <span className="truncate font-medium">{team.name}</span>
                      <span className="shrink-0 text-xs">{team.members.length}명</span>
                    </button>
                  ))
                )}
              </div>
            </div>
            <div className="space-y-3">
              <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_110px_auto]">
                <input
                  className="h-10 min-w-0 rounded-[10px] border border-[var(--border)] bg-[var(--bg2)] px-3 text-sm text-[var(--gray1)] outline-none"
                  value={inviteEmail}
                  onChange={(event) => setInviteEmail(event.target.value)}
                  placeholder="초대 이메일"
                />
                <select
                  className="h-10 rounded-[10px] border border-[var(--border)] bg-[var(--bg2)] px-3 text-sm text-[var(--gray1)] outline-none"
                  value={inviteRole}
                  onChange={(event) => setInviteRole(event.target.value === 'ADMIN' ? 'ADMIN' : 'MEMBER')}
                >
                  <option value="MEMBER">멤버</option>
                  <option value="ADMIN">관리자</option>
                </select>
                <button
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-[10px] border border-[var(--border)] px-3 text-sm text-[var(--gray1)] transition-colors duration-150 ease-in hover:bg-[var(--bg4)] disabled:opacity-50"
                  type="button"
                  onClick={handleInvite}
                  disabled={!selectedTeamId || teamBusy || !inviteEmail}
                >
                  <Send size={15} strokeWidth={1.5} />
                  초대
                </button>
              </div>
              <div className="space-y-2">
                {teamInvites.length === 0 ? (
                  <p className="rounded-[10px] bg-[var(--bg2)] px-4 py-3 text-sm text-[var(--gray2)]">대기 중인 초대가 없어요.</p>
                ) : (
                  teamInvites.map((invite) => (
                    <div key={invite.id} className="rounded-[10px] bg-[var(--bg2)] px-4 py-3">
                      <div className="flex items-center justify-between gap-3">
                        <p className="truncate text-sm font-medium text-[var(--gray1)]">{invite.email}</p>
                        <span className="shrink-0 text-xs text-[var(--gray2)]">{invite.status}</span>
                      </div>
                      <p className="mt-1 truncate text-xs text-[var(--gray2)]">초대 링크: /invite/{invite.token}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
        <SettingsCard icon={Shield} title="보안" description="JWT 세션과 httpOnly refresh cookie로 로그인 상태를 유지합니다." />
        <SettingsCard icon={Globe2} title="언어" description="현재 인터페이스 언어는 한국어입니다." />
        <div className="surface p-5">
          <SettingsCardHeader icon={Bell} title="알림 설정" description="추천과 라이브러리 업데이트 알림을 관리합니다." />
          <div className="mt-5 space-y-2">
            <SettingToggle label="추천 알림" checked={notificationsEnabled} onChange={setNotificationsEnabled} />
          </div>
        </div>
        <div className="surface p-5">
          <SettingsCardHeader icon={PlayCircle} title="재생 설정" description="다음 곡과 볼륨 동작을 조정합니다." />
          <div className="mt-5 space-y-2">
            <SettingToggle label="자동으로 다음 곡 재생" checked={autoplayEnabled} onChange={setAutoplayEnabled} />
            <SettingToggle label="트랙 간 볼륨 균일화" checked={normalizeVolume} onChange={setNormalizeVolume} />
          </div>
        </div>
        <SettingsCard icon={Volume2} title="오디오 품질" description="현재 스트리밍 품질은 기본 음원 파일을 기준으로 재생합니다." />
        <div className="surface p-5">
          <p className="text-sm font-medium text-[var(--gray1)]">계정 작업</p>
          <p className="mt-1 text-sm text-[var(--gray2)]">현재 기기에서 세션을 종료합니다.</p>
          <button
            className="mt-5 inline-flex min-h-10 items-center gap-2 rounded-[10px] border border-[var(--border)] px-4 text-sm text-[var(--gray1)] transition-colors duration-150 ease-in hover:bg-[var(--bg4)]"
            type="button"
            onClick={handleLogout}
          >
            <LogOut size={15} strokeWidth={1.5} />
            로그아웃
          </button>
        </div>
      </section>
    </div>
  )
}

function SettingRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex min-h-12 items-center justify-between rounded-[10px] bg-[var(--bg2)] px-4">
      <span className="text-sm text-[var(--gray2)]">{label}</span>
      <span className="max-w-[55%] truncate text-sm font-medium text-[var(--gray1)]">{value}</span>
    </div>
  )
}

function SettingsCard({ icon: Icon, title, description }: { icon: typeof Shield; title: string; description: string }) {
  return (
    <div className="surface p-5">
      <SettingsCardHeader icon={Icon} title={title} description={description} />
    </div>
  )
}

function SettingsCardHeader({ icon: Icon, title, description }: { icon: typeof Shield; title: string; description: string }) {
  return (
    <>
      <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[var(--bg4)] text-[var(--gray1)]">
        <Icon size={18} strokeWidth={1.5} />
      </div>
      <p className="mt-4 text-sm font-medium text-[var(--gray1)]">{title}</p>
      <p className="mt-1 text-sm text-[var(--gray2)]">{description}</p>
    </>
  )
}

function SettingToggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <label className="flex min-h-12 items-center justify-between rounded-[10px] bg-[var(--bg2)] px-4">
      <span className="text-sm text-[var(--gray1)]">{label}</span>
      <input className="sr-only" type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      <span className={`flex h-6 w-11 items-center rounded-full border border-[var(--border)] p-0.5 transition-colors duration-150 ease-in ${checked ? 'bg-[var(--bg5)]' : 'bg-[var(--bg3)]'}`} aria-hidden="true">
        <span className={`h-4 w-4 rounded-full bg-[var(--gray1)] transition-transform duration-150 ease-in ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
      </span>
    </label>
  )
}
