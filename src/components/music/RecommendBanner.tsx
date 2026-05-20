'use client'

import { Play } from 'lucide-react'
import type { Track } from '@/types'
import { AlbumArt } from '@/components/music/AlbumArt'
import { usePlayerStore } from '@/store/playerStore'

export function RecommendBanner({ tracks }: { tracks: Track[] }) {
  const { setQueue } = usePlayerStore()

  return (
    <section className="surface grid min-h-[188px] grid-cols-1 overflow-hidden md:grid-cols-[1fr_300px]">
      <div className="p-5 md:p-[22px]">
        <p className="text-[9px] font-medium uppercase tracking-[2px] text-[var(--gray2)]">YOUR DAILY MIX</p>
        <h1 className="display mt-3 text-[34px] leading-none tracking-[1px] text-[var(--gray1)] md:text-[42px]">당신만을 위한 믹스</h1>
        <p className="mt-3 max-w-xl text-xs text-[var(--gray1)]">청취 패턴 기반으로 선별한 32곡</p>
        <p className="mt-2 max-w-xl text-sm text-[var(--gray2)]">UI는 조용히 물러나고, 앨범 아트와 재생 흐름만 남도록 정리했습니다.</p>
        <button
          type="button"
          className="mt-5 inline-flex min-h-9 items-center gap-2 rounded-full bg-[var(--white)] px-5 text-xs font-medium text-[var(--bg)] transition-opacity duration-150 ease-in hover:opacity-85"
          onClick={() => setQueue(tracks, 0, 'recommend')}
        >
          <Play size={14} strokeWidth={1.5} />
          지금 재생
        </button>
      </div>
      <div className="flex items-center justify-center border-t border-[var(--border)] bg-[var(--bg2)] p-5 md:border-l md:border-t-0">
        <div className="relative h-[86px] w-[156px]">
          {tracks.slice(0, 3).map((track, index) => (
            <AlbumArt
              key={track.id}
              src={track.coverUrl}
              title={track.title}
              className="absolute h-[72px] w-[72px] rounded-[6px]"
              style={{
                left: `${index * 42}px`,
                top: `${index % 2 === 0 ? 4 : 14}px`,
              }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
