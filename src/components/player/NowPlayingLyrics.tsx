'use client'

import { Music2 } from 'lucide-react'
import type { CSSProperties } from 'react'
import { useEffect, useRef } from 'react'
import { useTrackLyrics } from '@/hooks/useTrackLyrics'
import type { Track } from '@/types'

interface NowPlayingLyricsProps {
  track: Track | null
  currentTime: number
  duration: number
}

export function NowPlayingLyrics({ track, currentTime, duration }: NowPlayingLyricsProps) {
  const { lines, activeIndex, lineProgress, isLoading, error } = useTrackLyrics(track, currentTime, duration)
  const activeRef = useRef<HTMLParagraphElement | null>(null)

  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: 'center', behavior: 'smooth' })
  }, [activeIndex])

  if (!track) {
    return <LyricsEmpty title="재생 중인 곡이 없어요" description="곡을 재생하면 가사가 여기에 표시돼요." />
  }

  if (isLoading) {
    return (
      <div className="space-y-4 px-1 py-8">
        <div className="h-4 w-2/3 rounded-[6px] bg-[var(--bg3)]" />
        <div className="h-5 w-4/5 rounded-[6px] bg-[var(--bg3)]" />
        <div className="h-4 w-1/2 rounded-[6px] bg-[var(--bg3)]" />
      </div>
    )
  }

  if (error || lines.length === 0) {
    return <LyricsEmpty title="가사를 준비 중입니다" description="이 곡에 연결된 가사 파일이 아직 없어요." />
  }

  return (
    <div className="h-full overflow-y-auto py-24 pr-2">
      <div className="space-y-5">
        {lines.map((line, index) => {
          const active = index === activeIndex
          const passed = index < activeIndex

          return (
            <p
              key={`${line.timestampMs}-${line.text}`}
              ref={active ? activeRef : undefined}
              className={`lyric-line ${active ? 'lyric-line-active' : passed ? 'text-[var(--gray3)] opacity-70' : 'text-[var(--gray2)]'}`}
              style={active ? { '--lyric-progress': `${lineProgress * 100}%` } as CSSProperties : undefined}
            >
              {line.text}
            </p>
          )
        })}
      </div>
    </div>
  )
}

function LyricsEmpty({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex h-full min-h-[280px] flex-col items-center justify-center text-center">
      <Music2 size={40} strokeWidth={1.5} className="text-[var(--gray3)]" />
      <p className="mt-4 text-[15px] font-medium text-[var(--gray1)]">{title}</p>
      <p className="mt-1 text-[13px] font-light text-[var(--gray2)]">{description}</p>
    </div>
  )
}
