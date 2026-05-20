import { Headphones } from 'lucide-react'

export function Logo() {
  return (
    <div className="inline-flex items-center justify-center gap-2 text-[var(--gray1)]">
      <Headphones size={18} strokeWidth={1.5} />
      <span className="display text-2xl tracking-[3px]">SUMUSIC</span>
    </div>
  )
}
