'use client'

import { Heart, ListMusic, Pause, Play, Repeat, Shuffle, SkipBack, SkipForward, Volume2, VolumeX, X } from 'lucide-react'
import type { CSSProperties } from 'react'
import { useEffect, useState } from 'react'
import { usePlayerStore } from '@/store/playerStore'
import { AlbumArt } from '@/components/music/AlbumArt'
import { NowPlayingScreen } from '@/components/player/NowPlayingScreen'
import { formatTime } from '@/lib/formatTime'

export function PlayerBar() {
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
    toggle,
    next,
    previous,
    currentTime,
    duration,
    seek,
    setVolume,
    toggleMute,
    toggleLike,
    toggleShuffle,
    cycleRepeat,
    setQueue,
  } = usePlayerStore()
  const [queueOpen, setQueueOpen] = useState(false)
  const [nowPlayingOpen, setNowPlayingOpen] = useState(false)

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((event.target as HTMLElement).tagName)) return
      const state = usePlayerStore.getState()
      switch (event.key) {
        case ' ':
          event.preventDefault()
          state.toggle()
          break
        case 'ArrowLeft':
          if (event.shiftKey) state.previous()
          else state.seek(Math.max(0, state.currentTime - 10))
          break
        case 'ArrowRight':
          if (event.shiftKey) state.next()
          else state.seek(Math.min(state.duration, state.currentTime + 10))
          break
        case 'm':
        case 'M':
          state.toggleMute()
          break
        case 'l':
        case 'L':
          state.toggleLike()
          break
        case 's':
        case 'S':
          state.toggleShuffle()
          break
        case 'r':
        case 'R':
          state.cycleRepeat()
          break
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  return (
    <>
      <div className="fixed bottom-14 left-0 right-0 z-30 border-t border-[var(--border)] bg-[var(--bg2)] px-3 py-2 lg:hidden">
        <div className="flex min-h-12 items-center gap-3">
          <button
            className="flex min-w-0 flex-1 items-center gap-3 text-left"
            type="button"
            aria-label="노래 전용 화면 열기"
            onClick={() => {
              if (currentTrack) setNowPlayingOpen(true)
            }}
          >
            {currentTrack ? <AlbumArt src={currentTrack.coverUrl} title={currentTrack.title} className="h-10 w-10 shrink-0 rounded-[6px]" /> : <div className="h-10 w-10 shrink-0 rounded-[6px] bg-[var(--bg3)]" />}
            <span className="min-w-0">
              <span className="block truncate text-[13px] font-medium text-[var(--gray1)]">{currentTrack?.title ?? '재생 대기 중'}</span>
              <span className="block truncate text-[11px] font-light text-[var(--gray2)]">{currentTrack?.artistName ?? '트랙을 선택하세요'}</span>
            </span>
          </button>
          <button className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--white)] text-[var(--bg)]" type="button" aria-label={isPlaying ? '일시정지' : '재생'} onClick={toggle}>
            {isPlaying ? <Pause size={15} strokeWidth={1.5} /> : <Play size={15} strokeWidth={1.5} />}
          </button>
        </div>
      </div>
      <footer className="hidden h-20 grid-cols-[300px_1fr_320px] items-center border-t border-[var(--border)] bg-[var(--bg2)] px-[22px] lg:grid">
        <button
          className="flex min-w-0 items-center gap-3 rounded-[8px] text-left transition-opacity duration-150 ease-in hover:opacity-85"
          type="button"
          aria-label="노래 전용 화면 열기"
          onClick={() => {
            if (currentTrack) setNowPlayingOpen((open) => !open)
          }}
        >
          {currentTrack ? <AlbumArt src={currentTrack.coverUrl} title={currentTrack.title} className="h-11 w-11 shrink-0 rounded-[6px]" /> : <div className="h-11 w-11 rounded-[6px] bg-[var(--bg3)]" />}
          <div className="min-w-0">
            <p className="truncate text-[13px] font-medium text-[var(--gray1)]">{currentTrack?.title ?? '재생 대기 중'}</p>
            <p className="truncate text-[11px] font-light text-[var(--gray2)]">{currentTrack?.artistName ?? '트랙을 선택하세요'}</p>
          </div>
        </button>
        <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-2">
          <div className="flex items-center gap-2">
            <button className={`player-icon-button ${shuffle ? 'bg-[var(--bg3)] text-[var(--gray1)]' : ''}`} type="button" aria-label="셔플" onClick={toggleShuffle}><Shuffle size={15} strokeWidth={1.5} /></button>
            <button className="player-icon-button" type="button" aria-label="이전" onClick={previous}><SkipBack size={15} strokeWidth={1.5} /></button>
            <button className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-[var(--white)] text-[var(--bg)]" type="button" aria-label={isPlaying ? '일시정지' : '재생'} onClick={toggle}>
              {isPlaying ? <Pause size={15} strokeWidth={1.5} /> : <Play size={15} strokeWidth={1.5} />}
            </button>
            <button className="player-icon-button" type="button" aria-label="다음" onClick={next}><SkipForward size={15} strokeWidth={1.5} /></button>
            <button className={`player-icon-button ${repeat !== 'off' ? 'bg-[var(--bg3)] text-[var(--gray1)]' : ''}`} type="button" aria-label="반복" onClick={cycleRepeat}>
              <Repeat size={15} strokeWidth={1.5} />
              {repeat === 'one' ? <span className="ml-0.5 text-[10px]">1</span> : null}
            </button>
          </div>
          <div className="grid w-full grid-cols-[44px_1fr_44px] items-center gap-2 text-[10px] font-light text-[var(--gray2)]">
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
            <span>{formatTime(duration * 1000)}</span>
          </div>
        </div>
        <div className="flex items-center justify-end gap-1">
          <button className={`player-icon-button ${isLiked ? 'text-[var(--gray1)]' : ''}`} type="button" aria-label={isLiked ? '좋아요 해제' : '좋아요'} onClick={toggleLike}>
            <Heart size={15} strokeWidth={1.5} fill={isLiked ? 'currentColor' : 'none'} />
          </button>
          <button className="player-icon-button" type="button" aria-label={isMuted ? '음소거 해제' : '음소거'} onClick={toggleMute}>
            {isMuted ? <VolumeX size={15} strokeWidth={1.5} /> : <Volume2 size={15} strokeWidth={1.5} />}
          </button>
          <input
            className="range-control volume-range w-24"
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={isMuted ? 0 : volume}
            aria-label="볼륨 조절"
            onChange={(event) => setVolume(Number(event.target.value))}
            style={{ '--range-progress': `${(isMuted ? 0 : volume) * 100}%` } as CSSProperties}
          />
          <button className={`player-icon-button ${queueOpen ? 'bg-[var(--bg3)] text-[var(--gray1)]' : ''}`} type="button" aria-label="재생 목록" onClick={() => setQueueOpen((open) => !open)}>
            <ListMusic size={15} strokeWidth={1.5} />
          </button>
        </div>
      </footer>
      {queueOpen ? (
        <aside className="fixed bottom-20 right-5 z-40 hidden w-[360px] overflow-hidden rounded-[12px] border border-[var(--border)] bg-[var(--bg2)] lg:block">
          <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">
            <div>
              <p className="text-sm font-medium text-[var(--gray1)]">재생 목록</p>
              <p className="text-xs text-[var(--gray2)]">{queue.length}곡</p>
            </div>
            <button className="icon-button" type="button" aria-label="재생 목록 닫기" onClick={() => setQueueOpen(false)}>
              <X size={15} strokeWidth={1.5} />
            </button>
          </div>
          <div className="max-h-[420px] overflow-y-auto p-2">
            {queue.length > 0 ? queue.map((track, index) => (
              <button
                key={`${track.id}-${index}`}
                type="button"
                className={`flex w-full items-center gap-3 rounded-[10px] p-2 text-left transition-colors duration-150 ease-in hover:bg-[var(--bg3)] ${index === currentIndex ? 'bg-[var(--bg3)]' : ''}`}
                onClick={() => setQueue(queue, index)}
              >
                <AlbumArt src={track.coverUrl} title={track.title} className="h-10 w-10 shrink-0" />
                <span className="min-w-0">
                  <span className="block truncate text-sm text-[var(--gray1)]">{track.title}</span>
                  <span className="block truncate text-xs text-[var(--gray2)]">{track.artistName}</span>
                </span>
              </button>
            )) : <p className="px-3 py-6 text-center text-sm text-[var(--gray2)]">재생 목록이 비어 있어요</p>}
          </div>
        </aside>
      ) : null}
      <NowPlayingScreen open={nowPlayingOpen} onClose={() => setNowPlayingOpen(false)} />
    </>
  )
}
