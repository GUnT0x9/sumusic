import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { MainHeader } from '@/components/layout/MainHeader'
import { MobileTabBar } from '@/components/layout/MobileTabBar'
import { PlayerBar } from '@/components/layout/PlayerBar'
import { Sidebar } from '@/components/layout/Sidebar'
import { ToastViewport } from '@/components/ui/Toast'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const hasRefreshCookie = Boolean(cookies().get('sumusic_refresh_token')?.value)

  if (!hasRefreshCookie) {
    redirect('/login')
  }

  return (
    <div className="grid h-screen grid-cols-1 grid-rows-[1fr] overflow-hidden bg-[var(--bg)] lg:grid-cols-[230px_1fr] lg:grid-rows-[1fr_80px]">
      <Sidebar />
      <div className="min-h-0 overflow-y-auto pb-28 lg:pb-0">
        <MainHeader />
        <main className="mx-auto w-full max-w-7xl px-4 py-5 md:px-6">{children}</main>
      </div>
      <div className="hidden border-t border-[var(--border)] bg-[var(--bg2)] lg:block" />
      <PlayerBar />
      <MobileTabBar />
      <ToastViewport />
    </div>
  )
}
