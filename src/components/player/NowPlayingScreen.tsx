'use client'

import { ChevronDown, Heart, ListMusic, Pause, Play, Repeat, Shuffle, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react'
import type { CSSProperties } from 'react'
import { useEffect, useMemo, useState } from 'react'
import { AlbumArt } from '@/components/music/AlbumArt'
import { NowPlayingLyrics } from '@/components/player/NowPlayingLyrics'
import { formatTime } from '@/lib/formatTime'
import { usePlayerStore } from '@/store/playerStore'

type NowPlayingTab = 'queue' | 'lyrics' | 'related'

interface NowPlayingScreenProps {
  open: boolean
  onClose: () => void
}

const tabs: Array<{ id: NowPlayingTab; label: string }> = [
  { id: 'queue', label: '다음 트랙' },
  { id: 'lyrics', label: '가사' },
  { id: 'related', label: '관련 항목' },
]

export function NowPlayingScreen({ open, onClose }: NowPlayingScreenProps) {
  const {
    currentTrack,
    queue,
    currentIndex,
    isPlaying,
    isLiked,
    shuffle,
    repeat,
    volume,
    isMuted,
    currentTime,
    duration,
    toggle,
    next,
    previous,
    seek,
    setVolume,
    toggleMute,
    toggleLike,
    toggleShuffle,
    cycleRepeat,
    setQueue,
  } = usePlayerStore()
  const [tab, setTab] = useState<NowPlayingTab>('lyrics')

  const relatedTracks = useMemo(() => {
    if (!currentTrack) return []
    return queue.filter((track) => track.id !== currentTrack.id && (track.artistId === currentTrack.artistId || track.albumId === currentTrack.albumId))
  }, [currentTrack, queue])

  useEffect(() => {
    if (!open) return
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose, open])

  if (!open) return null

  return (
    <section className="fixed inset-0 z-50 flex flex-col bg-[var(--bg)] text-[var(--gray1)]">
      <header className="flex min-h-16 items-center justify-between border-b border-[var(--border)] bg-[var(--bg2)] px-4 md:px-6">
        <button className="icon-button" type="button" aria-label="재생 화면 닫기" onClick={onClose}>
          <ChevronDown size={18} strokeWidth={1.5} />
        </button>
        <div className="min-w-0 text-center">
          <p className="text-[10px] font-medium uppercase tracking-[2px] text-[var(--gray2)]">NOW PLAYING</p>
          <p className="truncate text-sm text-[var(--gray1)]">{currentTrack?.title ?? '재생 대기 중'}</p>
        </div>
        <button className="icon-button" type="button" aria-label={isLiked ? '좋아요 해제' : '좋아요'} onClick={toggleLike}>
          <Heart size={16} strokeWidth={1.5} fill={isLiked ? 'currentColor' : 'none'} />
        </button>
      </header>

      <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[minmax(0,1fr)_420px]">
        <main className="flex min-h-0 flex-col items-center justify-center gap-7 overflow-y-auto px-5 py-8">
          <AlbumArt src={currentTrack?.coverUrl ?? ''} title={currentTrack?.title ?? 'SUMUSIC'} className="aspect-square w-full max-w-[520px] rounded-[12px]" />
          <div className="w-full max-w-[620px] text-center">
            <h1 className="truncate text-xl font-medium text-[var(--gray1)] md:text-2xl">{currentTrack?.title ?? '트랙을 선택하세요'}</h1>
            <p className="mt-1 truncate text-sm font-light text-[var(--gray2)]">{currentTrack?.artistName ?? 'SUMUSIC'}</p>
          </div>
        </main>

        <aside className="min-h-0 border-t border-[var(--border)] bg-[var(--bg2)] lg:border-l lg:border-t-0">
          <div className="grid grid-cols-3 border-b border-[var(--border)]">
            {tabs.map((item) => (
              <button
                key={item.id}
                className={`min-h-12 text-sm font-medium transition-colors duration-150 ease-in hover:bg-[var(--bg3)] ${tab === item.id ? 'text-[var(--gray1)]' : 'text-[var(--gray2)]'}`}
                type="button"
                onClick={() => setTab(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="h-[42vh] min-h-[300px] overflow-hidden p-5 lg:h-[calc(100vh-177px)]">
            {tab === 'lyrics' ? <NowPlayingLyrics track={currentTrack} currentTime={currentTime} duration={duration} /> : null}
            {tab === 'queue' ? <TrackPanel tracks={queue} currentIndex={currentIndex} onSelect={(index) => setQueue(queue, index)} /> : null}
            {tab === 'related' ? <TrackPanel tracks={relatedTracks} currentIndex={-1} onSelect={(index) => setQueue(relatedTracks, index)} emptyText="관련 트랙을 준비 중입니다" /> : null}
          </div>
        </aside>
      </div>

      <footer className="border-t border-[var(--border)] bg-[var(--bg2)] px-4 py-3 md:px-6">
        <div className="mx-auto flex max-w-5xl flex-col gap-3">
          <div className="grid grid-cols-[44px_1fr_44px] items-center gap-3 text-[10px] font-light text-[var(--gray2)]">
            <span>{formatTime(currentTime * 1000)}</span>
            <input
              className="range-control progress-range"
              type="range"
              min={0}
              max={duration || 0}
              step={1}
              value={Math.min(currentTime, duration || currentTime)}
              aria-label="재생 위치"
              onChange={(event) => seek(Number(event.target.value))}
              style={{ '--range-progress': `${duration ? (currentTime / duration) * 100 : 0}%` } as CSSProperties}
            />
            <span className="text-right">{formatTime(duration * 1000)}</span>
          </div>
          <div className="flex items-center justify-center gap-3">
            <button className={`player-icon-button ${shuffle ? 'bg-[var(--bg3)] text-[var(--gray1)]' : ''}`} type="button" aria-label="셔플" onClick={toggleShuffle}><Shuffle size={16} strokeWidth={1.5} /></button>
            <button className="player-icon-button" type="button" aria-label="이전" onClick={previous}><SkipBack size={18} strokeWidth={1.5} /></button>
            <button className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--white)] text-[var(--bg)] md:h-14 md:w-14" type="button" aria-label={isPlaying ? '일시정지' : '재생'} onClick={toggle}>
              {isPlaying ? <Pause size={20} strokeWidth={1.5} /> : <Play size={20} strokeWidth={1.5} />}
            </button>
            <button className="player-icon-button" type="button" aria-label="다음" onClick={next}><SkipForward size={18} strokeWidth={1.5} /></button>
            <button className={`player-icon-button ${repeat !== 'off' ? 'bg-[var(--bg3)] text-[var(--gray1)]' : ''}`} type="button" aria-label="반복" onClick={cycleRepeat}><Repeat size={16} strokeWidth={1.5} /></button>
            <button className="player-icon-button ml-2" type="button" aria-label={isMuted ? '음소거 해제' : '음소거'} onClick={toggleMute}>
              {isMuted ? <VolumeX size={16} strokeWidth={1.5} /> : <Volume2 size={16} strokeWidth={1.5} />}
            </button>
            <input
              className="range-control volume-range hidden w-24 md:block"
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={isMuted ? 0 : volume}
              aria-label="볼륨 조절"
              onChange={(event) => setVolume(Number(event.target.value))}
              style={{ '--range-progress': `${(isMuted ? 0 : volume) * 100}%` } as CSSProperties}
            />
          </div>
        </div>
      </footer>
    </section>
  )
}

function TrackPanel({
  tracks,
  currentIndex,
  onSelect,
  emptyText = '재생 목록이 비어 있어요',
}: {
  tracks: ReturnType<typeof usePlayerStore.getState>['queue']
  currentIndex: number
  onSelect: (index: number) => void
  emptyText?: string
}) {
  if (tracks.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center text-center">
        <ListMusic size={40} strokeWidth={1.5} className="text-[var(--gray3)]" />
        <p className="mt-4 text-[15px] font-medium text-[var(--gray1)]">{emptyText}</p>
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto pr-2">
      {tracks.map((track, index) => (
        <button
          key={`${track.id}-${index}`}
          type="button"
          className={`flex min-h-[58px] w-full items-center gap-3 rounded-[7px] px-2 text-left transition-colors duration-150 ease-in hover:bg-[var(--bg3)] ${index === currentIndex ? 'bg-[var(--bg3)]' : ''}`}
          onClick={() => onSelect(index)}
        >
          <AlbumArt src={track.coverUrl} title={track.title} className="h-10 w-10 shrink-0 rounded-[4px]" />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-medium text-[var(--gray1)]">{track.title}</span>
            <span className="block truncate text-xs font-light text-[var(--gray2)]">{track.artistName}</span>
          </span>
          <span className="text-xs font-light text-[var(--gray2)]">{formatTime(track.durationMs)}</span>
        </button>
      ))}
    </div>
  )
}
