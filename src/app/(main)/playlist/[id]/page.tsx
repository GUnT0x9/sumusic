'use client'

import { useRouter } from 'next/navigation'
import { Check, Lock, Pencil, Plus, Search, Shuffle, Trash2, Users, X } from 'lucide-react'
import type { FormEvent } from 'react'
import { useMemo, useState } from 'react'
import { AlbumArt } from '@/components/music/AlbumArt'
import { TrackRow } from '@/components/music/TrackRow'
import { tracks } from '@/lib/mockData'
import { useLibraryStore } from '@/store/libraryStore'
import { usePlayerStore } from '@/store/playerStore'
import { useUIStore } from '@/store/uiStore'

export default function PlaylistPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const playlist = useLibraryStore((state) => state.playlists.find((item) => item.id === params.id))
  const { updatePlaylist, deletePlaylist, clearPlaylist, addTrackToPlaylist } = useLibraryStore()
  const { setQueue } = usePlayerStore()
  const { addToast } = useUIStore()
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState('')
  const [query, setQuery] = useState('')

  const suggestedTracks = useMemo(() => {
    const playlistTrackIds = new Set(playlist?.tracks.map((track) => track.id) ?? [])
    const normalized = query.trim().toLowerCase()
    return tracks
      .filter((track) => !playlistTrackIds.has(track.id))
      .filter((track) => {
        if (!normalized) return true
        return `${track.title} ${track.artistName} ${track.albumTitle}`.toLowerCase().includes(normalized)
      })
      .slice(0, 8)
  }, [playlist, query])

  const startEditing = () => {
    if (!playlist) return
    setTitle(playlist.title)
    setEditing(true)
  }

  const saveTitle = (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault()
    if (!playlist) return
    updatePlaylist(playlist.id, { title })
    setEditing(false)
    addToast('플레이리스트 이름을 변경했어요', 'success')
  }

  if (!playlist) {
    return (
      <div className="space-y-2">
        <h1 className="display text-5xl text-[var(--gray1)]">찾을 수 없어요</h1>
        <p className="text-sm text-[var(--gray2)]">플레이리스트가 삭제되었거나 존재하지 않아요.</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <section className="surface overflow-hidden p-5 md:p-6">
        <div className="flex flex-col gap-5 md:flex-row md:items-end">
          <div className="grid h-52 w-52 shrink-0 grid-cols-2 gap-1 overflow-hidden rounded-[12px] bg-[var(--bg2)] p-1">
            {playlist.tracks.slice(0, 4).map((track) => (
              <AlbumArt key={track.id} src={track.coverUrl} title={track.title} className="h-full w-full rounded-[6px] border-0" />
            ))}
            {playlist.tracks.length === 0 ? <AlbumArt src={playlist.coverUrl} title={playlist.title} className="col-span-2 h-full w-full rounded-[10px]" /> : null}
          </div>
          <div className="min-w-0 flex-1">
            <p className="inline-flex items-center gap-1 rounded-[7px] bg-[var(--bg4)] px-2 py-1 text-xs text-[var(--gray2)]">
              {playlist.isPublic ? <Users size={12} strokeWidth={1.5} /> : <Lock size={12} strokeWidth={1.5} />}
              {playlist.isPublic ? '공개 플레이리스트' : '비공개 플레이리스트'}
            </p>
            {editing ? (
              <form className="mt-4 flex max-w-xl gap-2" onSubmit={saveTitle}>
                <input
                  className="min-h-12 flex-1 rounded-[10px] border border-[var(--border)] bg-[var(--bg2)] px-3 text-2xl font-medium text-[var(--gray1)] outline-none placeholder:text-[var(--gray2)]"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  autoFocus
                />
                <button className="icon-button" type="submit" aria-label="이름 저장"><Check size={16} strokeWidth={1.5} /></button>
                <button className="icon-button" type="button" aria-label="이름 변경 취소" onClick={() => setEditing(false)}><X size={16} strokeWidth={1.5} /></button>
              </form>
            ) : (
              <button className="mt-4 block max-w-full text-left" type="button" onClick={startEditing}>
                <h1 className="display truncate text-6xl leading-none text-[var(--gray1)]">{playlist.title}</h1>
              </button>
            )}
            <p className="mt-3 text-sm text-[var(--gray2)]">{playlist.ownerName} · {playlist.tracks.length}곡</p>
            <div className="mt-5 flex flex-wrap gap-2">
              <button
                className="inline-flex min-h-10 items-center gap-2 rounded-full bg-[var(--white)] px-5 text-sm font-medium text-[var(--bg)] transition-opacity duration-150 ease-in hover:opacity-85"
                type="button"
                onClick={() => {
                  if (playlist.tracks.length > 0) setQueue(playlist.tracks, 0, 'playlist')
                }}
              >
                <Plus size={15} strokeWidth={1.5} />
                재생
              </button>
              <button className="inline-flex min-h-10 items-center gap-2 rounded-[10px] border border-[var(--border)] px-4 text-sm text-[var(--gray1)] transition-colors duration-150 ease-in hover:bg-[var(--bg4)]" type="button" onClick={startEditing}>
                <Pencil size={15} strokeWidth={1.5} />
                이름 변경
              </button>
              <button
                className="inline-flex min-h-10 items-center gap-2 rounded-[10px] border border-[var(--border)] px-4 text-sm text-[var(--gray1)] transition-colors duration-150 ease-in hover:bg-[var(--bg4)]"
                type="button"
                onClick={() => {
                  updatePlaylist(playlist.id, { isPublic: !playlist.isPublic })
                  addToast(playlist.isPublic ? '비공개로 변경했어요' : '공개로 변경했어요', 'success')
                }}
              >
                {playlist.isPublic ? <Lock size={15} strokeWidth={1.5} /> : <Users size={15} strokeWidth={1.5} />}
                {playlist.isPublic ? '비공개로 변경' : '공개로 변경'}
              </button>
              <button
                className="inline-flex min-h-10 items-center gap-2 rounded-[10px] border border-[var(--border)] px-4 text-sm text-[var(--gray2)] transition-colors duration-150 ease-in hover:bg-[var(--bg4)]"
                type="button"
                onClick={() => {
                  clearPlaylist(playlist.id)
                  addToast('플레이리스트를 비웠어요', 'success')
                }}
              >
                <Shuffle size={15} strokeWidth={1.5} />
                비우기
              </button>
              <button
                className="inline-flex min-h-10 items-center gap-2 rounded-[10px] border border-[var(--border)] px-4 text-sm text-[var(--gray2)] transition-colors duration-150 ease-in hover:bg-[var(--bg4)]"
                type="button"
                onClick={() => {
                  deletePlaylist(playlist.id)
                  addToast('플레이리스트를 삭제했어요', 'success')
                  router.push('/library')
                }}
              >
                <Trash2 size={15} strokeWidth={1.5} />
                삭제
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1fr_360px]">
        <div className="space-y-3">
          <div className="flex items-end justify-between">
            <h2 className="display text-4xl text-[var(--gray1)]">수록곡</h2>
            <span className="text-xs text-[var(--gray2)]">우클릭 또는 메뉴로 곡을 관리하세요</span>
          </div>
          <div className="space-y-1">
        {playlist.tracks.length > 0 ? playlist.tracks.map((track, index) => <TrackRow key={track.id} track={track} index={index} tracks={playlist.tracks} playlistId={playlist.id} />) : <p className="text-sm text-[var(--gray1)]">아직 추가된 트랙이 없어요</p>}
          </div>
        </div>

        <aside className="surface h-fit p-4">
          <h2 className="display text-3xl text-[var(--gray1)]">곡 추가</h2>
          <div className="mt-3 flex min-h-10 items-center gap-2 rounded-[10px] border border-[var(--border)] bg-[var(--bg2)] px-3 text-[var(--gray2)]">
            <Search size={14} strokeWidth={1.5} />
            <input
              className="w-full bg-transparent text-sm text-[var(--gray1)] outline-none placeholder:text-[var(--gray2)]"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="트랙, 아티스트 검색"
            />
          </div>
          <div className="mt-4 max-h-[480px] space-y-1 overflow-y-auto pr-1">
            {suggestedTracks.map((track) => (
              <button
                key={track.id}
                className="flex min-h-14 w-full items-center gap-3 rounded-[8px] p-2 text-left transition-colors duration-150 ease-in hover:bg-[var(--bg4)]"
                type="button"
                onClick={() => {
                  const added = addTrackToPlaylist(playlist.id, track)
                  addToast(added ? '플레이리스트에 추가했어요' : '이미 담긴 곡이에요', added ? 'success' : 'info')
                }}
              >
                <AlbumArt src={track.coverUrl} title={track.title} className="h-10 w-10 shrink-0 rounded-[4px]" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-[var(--gray1)]">{track.title}</span>
                  <span className="block truncate text-xs text-[var(--gray2)]">{track.artistName}</span>
                </span>
                <Plus size={14} strokeWidth={1.5} className="shrink-0 text-[var(--gray2)]" />
              </button>
            ))}
            {suggestedTracks.length === 0 ? <p className="py-8 text-center text-sm text-[var(--gray2)]">추가할 곡이 없어요</p> : null}
          </div>
        </aside>
      </section>
    </div>
  )
}
