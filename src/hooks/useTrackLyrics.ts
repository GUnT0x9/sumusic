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

function parseTimestampToMs(minutes: string, seconds: string, fraction = '0') {
  const fractionMs = Number(fraction.length === 3 ? fraction : fraction.padEnd(3, '0'))
  return Number(minutes) * 60_000 + Number(seconds) * 1000 + fractionMs
}

function parseLrcText(text: string, durationMs: number): TimedLyricLine[] {
  const lines = text
    .split(/\r?\n/)
    .flatMap((line) => {
      const timestampMatches = [...line.matchAll(/\[(\d{1,2}):(\d{2})(?:[.:](\d{1,3}))?\]/g)]
      const textLine = line.replace(/\[(\d{1,2}):(\d{2})(?:[.:](\d{1,3}))?\]/g, '').trim()

      if (timestampMatches.length === 0 || textLine.length === 0) return []

      return timestampMatches.map((match) => ({
        timestampMs: parseTimestampToMs(match[1], match[2], match[3]),
        text: textLine,
        language: 'ko' as const,
      }))
    })
    .filter((line) => Number.isFinite(line.timestampMs))
    .sort((a, b) => a.timestampMs - b.timestampMs)

  return lines.map((line, index) => ({
    ...line,
    endTimestampMs: index === lines.length - 1 ? durationMs : Math.max(line.timestampMs + 1, lines[index + 1].timestampMs),
  }))
}

function parsePlainLyricsText(text: string, durationMs: number): TimedLyricLine[] {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith('['))

  if (lines.length === 0) return []

  const startMs = Math.min(10_000, Math.floor(durationMs * 0.05))
  const endMs = Math.max(startMs + lines.length * 950, Math.floor(durationMs * 0.94))
  const weights = lines.map((line) => Math.max(0.8, Math.min(3.4, line.replace(/\s+/g, '').length / 14)))
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0)
  let cursor = 0

  return lines.map((textLine, index) => {
    const timestampMs = Math.floor(startMs + ((endMs - startMs) * cursor) / totalWeight)
    cursor += weights[index]
    const endTimestampMs =
      index === lines.length - 1
        ? durationMs
        : Math.floor(startMs + ((endMs - startMs) * cursor) / totalWeight)
    return {
      timestampMs,
      endTimestampMs,
      text: textLine,
      language: 'ko',
    }
  })
}

function parseLyricsText(text: string, durationMs: number): TimedLyricLine[] {
  const lrcLines = parseLrcText(text, durationMs)
  if (lrcLines.length > 0) return lrcLines
  return parsePlainLyricsText(text, durationMs)
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
