'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BarChart3, Home, Library, Search } from 'lucide-react'

const items = [
  { href: '/', label: '홈', icon: Home },
  { href: '/search', label: '탐색', icon: Search },
  { href: '/chart', label: '차트', icon: BarChart3 },
  { href: '/library', label: '보관함', icon: Library }
]

export function MobileTabBar() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 grid h-14 grid-cols-4 border-t border-[var(--border)] bg-[var(--bg2)] lg:hidden">
      {items.map((item) => {
        const Icon = item.icon
        const active = pathname === item.href
        return (
          <Link key={item.href} href={item.href} className={`flex flex-col items-center justify-center gap-0.5 text-[11px] ${active ? 'text-[var(--gray1)]' : 'text-[var(--gray2)]'}`}>
            <Icon size={20} strokeWidth={1.5} />
            <span>{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
