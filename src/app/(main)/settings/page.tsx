'use client'

import { useRouter } from 'next/navigation'
import { Bell, Globe2, LogOut, Shield, UserRound } from 'lucide-react'
import { useAuthUser } from '@/hooks/useAuthUser'
import { logout } from '@/lib/authClient'
import { useUIStore } from '@/store/uiStore'

export default function SettingsPage() {
  const router = useRouter()
  const { user, isLoading, refreshUser } = useAuthUser()
  const { addToast } = useUIStore()

  const handleLogout = async () => {
    await logout()
    await refreshUser(undefined, { revalidate: false })
    addToast('로그아웃했어요', 'success')
    router.push('/login')
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
        <SettingsCard icon={Shield} title="보안" description="JWT 세션과 httpOnly refresh cookie로 로그인 상태를 유지합니다." />
        <SettingsCard icon={Globe2} title="언어" description="현재 인터페이스 언어는 한국어입니다." />
        <SettingsCard icon={Bell} title="알림" description="신규 추천과 플레이리스트 업데이트 알림을 준비 중입니다." />
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
      <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[var(--bg4)] text-[var(--gray1)]">
        <Icon size={18} strokeWidth={1.5} />
      </div>
      <p className="mt-4 text-sm font-medium text-[var(--gray1)]">{title}</p>
      <p className="mt-1 text-sm text-[var(--gray2)]">{description}</p>
    </div>
  )
}
