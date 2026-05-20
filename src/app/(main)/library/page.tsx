'use client'

import Link from 'next/link'
import { Lock, Plus, Trash2, Users } from 'lucide-react'
import type { FormEvent } from 'react'
import { useMemo, useState } from 'react'
import { AlbumArt } from '@/components/music/AlbumArt'
import { TrackRow } from '@/components/music/TrackRow'
import { tracks } from '@/lib/mockData'
import { useLibraryStore } from '@/store/libraryStore'
import { useUIStore } from '@/store/uiStore'

export default function LibraryPage() {
  const { playlists, likedTrackIds, createPlaylist, deletePlaylist } = useLibraryStore()
  const { addToast } = useUIStore()
  const [title, setTitle] = useState('')
  const likedTracks = useMemo(() => tracks.filter((track) => likedTrackIds.includes(track.id)), [likedTrackIds])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const playlist = createPlaylist(title)
    setTitle('')
    addToast(`${playlist.title} 플레이리스트를 만들었어요`, 'success')
  }

  return (
    <div className="space-y-8">
      <section>
        <h1 className="display text-5xl text-[var(--gray1)]">라이브러리</h1>
        <p className="mt-1 text-sm text-[var(--gray2)]">플레이리스트와 좋아요한 트랙을 모았습니다.</p>
      </section>
      <form className="surface flex flex-col gap-3 p-4 md:flex-row md:items-center" onSubmit={handleSubmit}>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-[var(--gray1)]">새 플레이리스트</p>
          <p className="text-xs text-[var(--gray2)]">이름을 정하고 곡 메뉴에서 바로 추가할 수 있어요.</p>
        </div>
        <input
          className="min-h-10 rounded-[10px] border border-[var(--border)] bg-[var(--bg3)] px-3 text-sm text-[var(--gray1)] outline-none placeholder:text-[var(--gray2)] md:w-72"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="플레이리스트 이름"
        />
        <button className="inline-flex min-h-10 items-center justify-center gap-2 rounded-[10px] border border-[var(--border)] bg-[var(--bg4)] px-4 text-sm font-medium text-[var(--gray1)] transition-colors duration-150 ease-in hover:bg-[var(--bg5)]" type="submit">
          <Plus size={14} strokeWidth={1.5} />
          만들기
        </button>
      </form>
      <section>
        <div className="mb-3 flex items-end justify-between">
          <h2 className="display text-4xl text-[var(--gray1)]">플레이리스트</h2>
          <span className="text-xs text-[var(--gray2)]">{playlists.length}개</span>
        </div>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {playlists.length > 0 ? playlists.map((playlist) => (
          <article key={playlist.id} className="surface group relative overflow-hidden p-3 transition-colors duration-150 ease-in hover:bg-[var(--bg4)]">
            <Link href={`/playlist/${playlist.id}`} className="flex items-center gap-4">
              <div className="grid h-20 w-20 shrink-0 grid-cols-2 gap-1 overflow-hidden rounded-[8px] bg-[var(--bg2)] p-1">
                {playlist.tracks.slice(0, 4).map((track) => (
                  <AlbumArt key={track.id} src={track.coverUrl} title={track.title} className="h-full w-full rounded-[4px] border-0" />
                ))}
                {playlist.tracks.length === 0 ? <AlbumArt src={playlist.coverUrl} title={playlist.title} className="col-span-2 h-full w-full rounded-[6px]" /> : null}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-[var(--gray1)]">{playlist.title}</p>
                <p className="mt-1 text-sm text-[var(--gray2)]">{playlist.tracks.length}곡 · {playlist.ownerName}</p>
                <p className="mt-2 inline-flex items-center gap-1 rounded-[7px] bg-[var(--bg4)] px-2 py-1 text-[11px] text-[var(--gray2)]">
                  {playlist.isPublic ? <Users size={12} strokeWidth={1.5} /> : <Lock size={12} strokeWidth={1.5} />}
                  {playlist.isPublic ? '공개' : '비공개'}
                </p>
              </div>
            </Link>
            <button
              className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-[8px] text-[var(--gray2)] opacity-0 transition-opacity duration-150 ease-in hover:bg-[var(--bg3)] group-hover:opacity-100"
              type="button"
              aria-label={`${playlist.title} 삭제`}
              onClick={() => {
                deletePlaylist(playlist.id)
                addToast('플레이리스트를 삭제했어요', 'success')
              }}
            >
              <Trash2 size={14} strokeWidth={1.5} />
            </button>
          </article>
        )) : <p className="text-sm text-[var(--gray1)]">아직 만든 플레이리스트가 없어요</p>}
            </div>
      </section>
      <section>
        <h2 className="display mb-3 text-4xl text-[var(--gray1)]">좋아요한 트랙</h2>
        {likedTracks.length > 0 ? (
          <div className="space-y-1">
            {likedTracks.map((track, index) => <TrackRow key={track.id} track={track} index={index} tracks={likedTracks} />)}
          </div>
        ) : <p className="text-sm text-[var(--gray1)]">좋아요한 트랙이 없어요</p>}
      </section>
    </div>
  )
}
