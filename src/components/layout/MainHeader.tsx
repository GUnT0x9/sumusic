'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Bell, ChevronLeft, ChevronRight, LogIn, LogOut, Search, Settings, UserRound, UserPlus } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useAuthUser } from '@/hooks/useAuthUser'
import { logout } from '@/lib/authClient'
import { useUIStore } from '@/store/uiStore'

export function MainHeader() {
  const router = useRouter()
  const { user, error, isLoading, refreshUser } = useAuthUser()
  const { addToast } = useUIStore()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement | null>(null)
  const displayName = user?.username ?? (isLoading ? '확인 중' : '계정')
  const loggedIn = Boolean(user && !error)

  useEffect(() => {
    const handler = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setMenuOpen(false)
    }
    window.addEventListener('mousedown', handler)
    return () => window.removeEventListener('mousedown', handler)
  }, [])

  const handleLogout = async () => {
    await logout()
    await refreshUser(undefined, { revalidate: false })
    setMenuOpen(false)
    addToast('로그아웃했어요', 'success')
    router.push('/login')
  }

  return (
    <header className="sticky top-0 z-20 flex min-h-[64px] items-center justify-between bg-[var(--bg)] px-4 md:px-6">
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <button className="hidden h-[26px] w-[26px] items-center justify-center rounded-full bg-[var(--bg3)] text-[var(--gray2)] transition-opacity duration-150 ease-in hover:opacity-85 md:inline-flex" type="button" aria-label="뒤로">
          <ChevronLeft size={14} strokeWidth={1.5} />
        </button>
        <button className="hidden h-[26px] w-[26px] items-center justify-center rounded-full bg-[var(--bg3)] text-[var(--gray2)] transition-opacity duration-150 ease-in hover:opacity-85 md:inline-flex" type="button" aria-label="앞으로">
          <ChevronRight size={14} strokeWidth={1.5} />
        </button>
      <div className="flex h-9 w-full max-w-md items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg3)] px-3.5 text-[var(--gray2)]">
        <Search size={14} strokeWidth={1.5} />
        <input className="w-full bg-transparent text-sm text-[var(--gray1)] outline-none placeholder:text-[var(--gray2)]" placeholder="아티스트, 트랙, 앨범 검색" />
      </div>
      </div>
      <div className="ml-4 flex items-center gap-2">
        <span className="hidden text-[11px] font-medium uppercase tracking-[2px] text-[var(--gray2)] md:inline">Premium</span>
        <button className="icon-button" type="button" aria-label="알림">
          <Bell size={15} strokeWidth={1.5} />
        </button>
        <div ref={menuRef} className="relative">
          <button
            className="flex min-h-9 items-center gap-2 rounded-full bg-[var(--bg3)] px-2.5 transition-colors duration-150 ease-in hover:bg-[var(--bg4)]"
            type="button"
            aria-label="프로필 메뉴"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[var(--bg5)] text-[var(--gray1)]">
              <UserRound size={15} strokeWidth={1.5} />
            </span>
            <span className="hidden max-w-28 truncate text-sm text-[var(--gray1)] md:block">{displayName}</span>
          </button>
          {menuOpen ? (
            <div className="absolute right-0 top-11 z-50 w-56 rounded-[10px] border border-[var(--border)] bg-[var(--bg3)] p-1 text-sm text-[var(--gray1)]">
              {loggedIn ? (
                <>
                  <div className="border-b border-[var(--border)] px-3 py-3">
                    <p className="truncate font-medium text-[var(--gray1)]">{user?.username}</p>
                    <p className="truncate text-xs text-[var(--gray2)]">{user?.email}</p>
                  </div>
                  <Link className="context-menu-item" href="/settings" onClick={() => setMenuOpen(false)}>
                    <UserRound size={14} strokeWidth={1.5} /> 프로필
                  </Link>
                  <Link className="context-menu-item" href="/settings" onClick={() => setMenuOpen(false)}>
                    <Settings size={14} strokeWidth={1.5} /> 설정
                  </Link>
                  <button className="context-menu-item w-full" type="button" onClick={handleLogout}>
                    <LogOut size={14} strokeWidth={1.5} /> 로그아웃
                  </button>
                </>
              ) : (
                <>
                  <Link className="context-menu-item" href="/login" onClick={() => setMenuOpen(false)}>
                    <LogIn size={14} strokeWidth={1.5} /> 로그인
                  </Link>
                  <Link className="context-menu-item" href="/register" onClick={() => setMenuOpen(false)}>
                    <UserPlus size={14} strokeWidth={1.5} /> 회원가입
                  </Link>
                </>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </header>
  )
}
