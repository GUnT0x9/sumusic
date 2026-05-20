'use client'

import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { AlbumCard } from '@/components/music/AlbumCard'
import { TrackRow } from '@/components/music/TrackRow'
import { mockApi } from '@/lib/api'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const results = useMemo(() => mockApi.search(query), [query])
  const hasQuery = query.trim().length > 0

  return (
    <div>
      <h1 className="display text-5xl text-[var(--gray1)]">탐색</h1>
      <div className="mt-5 flex h-12 max-w-2xl items-center gap-3 rounded-[10px] border border-[var(--border)] bg-[var(--bg3)] px-4 text-[var(--gray2)]">
        <Search size={15} strokeWidth={1.5} />
        <input value={query} onChange={(event) => setQuery(event.target.value)} className="w-full bg-transparent text-sm outline-none placeholder:text-[var(--gray2)]" placeholder="아티스트, 트랙, 앨범 검색" />
      </div>
      {!hasQuery ? (
        <div className="mt-8 grid gap-3 md:grid-cols-4">
          {['R&B', 'Indie', 'Alternative', 'K-Pop'].map((genre) => (
            <div key={genre} className="surface p-5">
              <p className="display text-3xl text-[var(--gray1)]">{genre}</p>
              <p className="mt-1 text-xs text-[var(--gray2)]">장르 탐색</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-8 space-y-8">
          {results.tracks.length === 0 && results.albums.length === 0 && results.artists.length === 0 ? (
            <p className="text-sm text-[var(--gray1)]">'{query}'에 대한 결과가 없어요</p>
          ) : null}
          {results.tracks.length > 0 ? (
            <section>
              <h2 className="display mb-3 text-4xl text-[var(--gray1)]">트랙</h2>
              {results.tracks.map((track, index) => <TrackRow key={track.id} track={track} index={index} tracks={results.tracks} />)}
            </section>
          ) : null}
          {results.albums.length > 0 ? (
            <section>
              <h2 className="display mb-3 text-4xl text-[var(--gray1)]">앨범</h2>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
                {results.albums.map((album) => <AlbumCard key={album.id} album={album} />)}
              </div>
            </section>
          ) : null}
        </div>
      )}
    </div>
  )
}
