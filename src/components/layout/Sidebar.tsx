'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BarChart3, Home, Library, Search, Settings } from 'lucide-react'
import { useMemo } from 'react'
import { Logo } from '@/components/ui/Logo'
import { AlbumArt } from '@/components/music/AlbumArt'
import { useLibraryStore } from '@/store/libraryStore'

const navItems = [
  { href: '/', label: '홈', icon: Home },
  { href: '/search', label: '탐색', icon: Search },
  { href: '/chart', label: '차트', icon: BarChart3 },
  { href: '/library', label: '라이브러리', icon: Library },
  { href: '/settings', label: '설정', icon: Settings }
]

export function Sidebar() {
  const pathname = usePathname()
  const allPlaylists = useLibraryStore((state) => state.playlists)
  const playlists = useMemo(() => allPlaylists.slice(0, 5), [allPlaylists])

  return (
    <aside className="hidden border-r border-[var(--border)] bg-[var(--bg2)] lg:block">
      <div className="flex h-full w-[230px] flex-col">
        <div className="flex border-b border-[var(--border)] px-[18px] pb-[18px] pt-[22px]">
          <Link
            href="/"
            className="mx-auto inline-flex min-h-10 items-center justify-center rounded-[8px] px-2 transition-colors duration-150 ease-in hover:bg-[var(--bg3)]"
            aria-label="SUMUSIC 홈으로 이동"
          >
            <Logo />
          </Link>
        </div>
        <nav className="space-y-1 px-4 py-4">
          {navItems.map((item) => {
            const active = pathname === item.href
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex min-h-9 items-center gap-3 rounded-[7px] px-2.5 text-sm transition-colors duration-150 ease-in hover:bg-[var(--bg3)] ${active ? 'bg-[var(--bg3)] text-[var(--gray1)]' : 'text-[var(--gray2)]'}`}
              >
                <Icon size={15} strokeWidth={1.5} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>
        <div className="border-t border-[var(--border)] px-4 py-4">
          <p className="mb-2 text-[9px] font-medium uppercase tracking-[2px] text-[var(--gray2)]">MY PLAYLISTS</p>
          <div className="space-y-1">
            {playlists.map((playlist) => (
              <Link
                key={playlist.id}
                href={`/playlist/${playlist.id}`}
                className="flex min-h-10 items-center gap-2 rounded-[7px] px-2 py-1.5 transition-colors duration-150 ease-in hover:bg-[var(--bg3)]"
              >
                <AlbumArt src={playlist.coverUrl} title={playlist.title} className="h-8 w-8 shrink-0 rounded-[4px]" />
                <span className="min-w-0">
                  <span className="block truncate text-xs text-[var(--gray1)]">{playlist.title}</span>
                  <span className="block text-[10px] text-[var(--gray2)]">{playlist.tracks.length}곡</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
        <Link href="/premium" className="mx-4 mb-4 mt-auto block rounded-[10px] border border-[var(--border)] bg-[var(--bg3)] p-4 transition-colors duration-150 ease-in hover:bg-[var(--bg4)]">
          <p className="display text-2xl text-[var(--gray1)]">PREMIUM</p>
          <p className="mt-1 text-xs text-[var(--gray2)]">무손실 스트리밍과 더 긴 추천 큐를 준비 중입니다.</p>
        </Link>
      </div>
    </aside>
  )
}
