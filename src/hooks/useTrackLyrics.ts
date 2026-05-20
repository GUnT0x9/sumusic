'use client'

import { useMemo } from 'react'
import useSWR from 'swr'
import type { LyricLine, Track } from '@/types'

interface TimedLyricLine extends LyricLine {
  endTimestampMs: number
}

interface TrackLyricsState {
  lines: TimedLyricLine[]
  activeIndex: number
  lineProgress: number
  isLoading: boolean
  error: Error | undefined
}

const textFetcher = async (url: string) => {
  const response = await fetch(url)
  if (!response.ok) throw new Error('Failed to load lyrics')
  return response.text()
}

function parseLyricsText(text: string, durationMs: number): TimedLyricLine[] {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)

  if (lines.length === 0) return []

  const interval = Math.max(1200, Math.floor(durationMs / lines.length))

  return lines.map((textLine, index) => {
    const timestampMs = Math.min(index * interval, durationMs)
    const endTimestampMs = index === lines.length - 1 ? durationMs : Math.min((index + 1) * interval, durationMs)
    return {
      timestampMs,
      endTimestampMs,
      text: textLine,
      language: 'ko',
    }
  })
}

function findActiveIndex(lines: TimedLyricLine[], currentTimeMs: number) {
  if (lines.length === 0) return -1
  const index = lines.findIndex((line) => currentTimeMs >= line.timestampMs && currentTimeMs < line.endTimestampMs)
  if (index >= 0) return index
  return currentTimeMs >= lines[lines.length - 1].timestampMs ? lines.length - 1 : 0
}

export function useTrackLyrics(track: Track | null, currentTime: number, duration: number): TrackLyricsState {
  const durationMs = Math.max(0, Math.floor((duration || (track?.durationMs ?? 0) / 1000) * 1000))
  const { data, error, isLoading } = useSWR(track?.lyricsUrl ?? null, textFetcher)

  return useMemo(() => {
    const lines = data && durationMs > 0 ? parseLyricsText(data, durationMs) : []
    const currentTimeMs = Math.floor(currentTime * 1000)
    const activeIndex = findActiveIndex(lines, currentTimeMs)
    const activeLine = activeIndex >= 0 ? lines[activeIndex] : null
    const lineDuration = activeLine ? Math.max(1, activeLine.endTimestampMs - activeLine.timestampMs) : 1
    const lineProgress = activeLine
      ? Math.min(1, Math.max(0, (currentTimeMs - activeLine.timestampMs) / lineDuration))
      : 0

    return {
      lines,
      activeIndex,
      lineProgress,
      isLoading,
      error,
    }
  }, [currentTime, data, durationMs, error, isLoading])
}
