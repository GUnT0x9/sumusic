'use client'

import { Howl } from 'howler'
import { create } from 'zustand'
import { useLibraryStore } from '@/store/libraryStore'
import type { Source, Track } from '@/types'

type RepeatMode = 'off' | 'one' | 'all'

interface PlayerState {
  currentTrack: Track | null
  queue: Track[]
  currentIndex: number
  isPlaying: boolean
  currentTime: number
  duration: number
  volume: number
  isMuted: boolean
  isLiked: boolean
  shuffle: boolean
  repeat: RepeatMode
  currentSource: Source
  howler: Howl | null
  progressTimer: number | null
  setQueue: (tracks: Track[], index?: number, source?: Source) => void
  play: (track?: Track) => void
  toggle: () => void
  next: () => void
  previous: () => void
  seek: (seconds: number) => void
  setVolume: (volume: number) => void
  toggleMute: () => void
  toggleLike: () => void
  addToQueue: (track: Track) => void
  playNext: (track: Track) => void
  toggleShuffle: () => void
  cycleRepeat: () => void
}

function readHowlerTime(howler: Howl): number {
  const seek = howler.seek()
  return typeof seek === 'number' ? seek : 0
}

function stopProgressTimer(timer: number | null) {
  if (timer) window.clearInterval(timer)
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentTrack: null,
  queue: [],
  currentIndex: 0,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 0.8,
  isMuted: false,
  isLiked: false,
  shuffle: false,
  repeat: 'off',
  currentSource: 'recommend',
  howler: null,
  progressTimer: null,
  setQueue: (tracks, index = 0, source = 'recommend') => {
    set({ queue: tracks, currentIndex: index, currentSource: source })
    get().play(tracks[index])
  },
  play: (track) => {
    const selectedTrack = track ?? get().currentTrack
    if (!selectedTrack) return

    stopProgressTimer(get().progressTimer)
    get().howler?.unload()
    const howler = new Howl({
      src: [selectedTrack.audioUrl],
      html5: true,
      format: ['mp3'],
      volume: get().isMuted ? 0 : get().volume,
      onplay: () => {
        stopProgressTimer(get().progressTimer)
        const progressTimer = window.setInterval(() => {
          const currentHowler = get().howler
          if (currentHowler?.playing()) set({ currentTime: readHowlerTime(currentHowler) })
        }, 500)
        set({ isPlaying: true, progressTimer })
      },
      onpause: () => {
        stopProgressTimer(get().progressTimer)
        set({ isPlaying: false, progressTimer: null, currentTime: readHowlerTime(howler) })
      },
      onend: () => get().next(),
      onload: () => {
        const loadedDuration = howler.duration()
        set({ duration: Number.isFinite(loadedDuration) ? loadedDuration : selectedTrack.durationMs / 1000 })
      }
    })

    set({
      currentTrack: selectedTrack,
      howler,
      isPlaying: false,
      currentTime: 0,
      duration: selectedTrack.durationMs / 1000,
      isLiked: useLibraryStore.getState().isLiked(selectedTrack.id),
      progressTimer: null,
    })
    howler.play()
  },
  toggle: () => {
    const { howler, currentTrack } = get()
    if (!currentTrack) return
    if (!howler) {
      get().play(currentTrack)
      return
    }
    if (howler.playing()) howler.pause()
    else howler.play()
  },
  next: () => {
    const { queue, currentIndex, repeat, shuffle, howler, progressTimer } = get()
    if (queue.length === 0) return
    if (repeat === 'one') {
      get().play(queue[currentIndex])
      return
    }
    const nextIndex = shuffle ? Math.floor(Math.random() * queue.length) : (currentIndex + 1) % queue.length
    if (repeat === 'off' && currentIndex === queue.length - 1) {
      stopProgressTimer(progressTimer)
      howler?.stop()
      set({ isPlaying: false, progressTimer: null, currentTime: 0 })
      return
    }
    set({ currentIndex: nextIndex })
    get().play(queue[nextIndex])
  },
  previous: () => {
    const { queue, currentIndex } = get()
    if (queue.length === 0) return
    const previousIndex = currentIndex === 0 ? queue.length - 1 : currentIndex - 1
    set({ currentIndex: previousIndex })
    get().play(queue[previousIndex])
  },
  seek: (seconds) => {
    get().howler?.seek(seconds)
    set({ currentTime: seconds })
  },
  setVolume: (volume) => {
    const normalizedVolume = Math.min(1, Math.max(0, volume))
    get().howler?.volume(normalizedVolume)
    set({ volume: normalizedVolume, isMuted: normalizedVolume === 0 })
  },
  toggleMute: () => {
    const nextMuted = !get().isMuted
    get().howler?.volume(nextMuted ? 0 : get().volume)
    set({ isMuted: nextMuted })
  },
  toggleLike: () => {
    const track = get().currentTrack
    if (!track) return
    const liked = useLibraryStore.getState().toggleLikedTrack(track)
    set({ isLiked: liked })
  },
  addToQueue: (track) => set((state) => ({ queue: [...state.queue, track] })),
  playNext: (track) => {
    const { queue, currentIndex } = get()
    const nextQueue = [...queue]
    nextQueue.splice(currentIndex + 1, 0, track)
    set({ queue: nextQueue })
  },
  toggleShuffle: () => set((state) => ({ shuffle: !state.shuffle })),
  cycleRepeat: () => set((state) => ({ repeat: state.repeat === 'off' ? 'all' : state.repeat === 'all' ? 'one' : 'off' }))
}))
