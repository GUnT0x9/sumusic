'use client'

import * as ContextMenu from '@radix-ui/react-context-menu'
import { Heart, ListPlus, MoreHorizontal, Play, Share2, SkipForward } from 'lucide-react'
import { useState } from 'react'
import type { Track } from '@/types'
import { formatTime } from '@/lib/formatTime'
import { usePlayerStore } from '@/store/playerStore'
import { useLibraryStore } from '@/store/libraryStore'
import { useUIStore } from '@/store/uiStore'
import { AlbumArt } from '@/components/music/AlbumArt'
import { EqualizerBars } from '@/components/music/EqualizerBars'

interface TrackRowProps {
  track: Track
  index: number
  tracks: Track[]
  playlistId?: string
}

export function TrackRow({ track, index, tracks, playlistId }: TrackRowProps) {
  const { currentTrack, setQueue, addToQueue, playNext } = usePlayerStore()
  const { playlists, isLiked, toggleLikedTrack, addTrackToPlaylist, removeTrackFromPlaylist } = useLibraryStore()
  const { addToast } = useUIStore()
  const [menuOpen, setMenuOpen] = useState(false)
  const active = currentTrack?.id === track.id
  const liked = isLiked(track.id)

  const playNow = () => setQueue(tracks, index)
  const toggleLike = () => {
    const nextLiked = toggleLikedTrack(track)
    addToast(nextLiked ? '좋아요에 추가했어요' : '좋아요를 해제했어요', 'success')
  }

  const addPlaylistTrack = (targetPlaylistId: string) => {
    const added = addTrackToPlaylist(targetPlaylistId, track)
    addToast(added ? '플레이리스트에 추가했어요' : '이미 담긴 곡이에요', added ? 'success' : 'info')
  }

  const shareTrack = async () => {
    const url = `https://sumusic.kr/track/${track.id}`
    if (navigator.share) {
      await navigator.share({ url })
      return
    }
    await navigator.clipboard.writeText(url)
    addToast('링크가 복사됐어요', 'success')
  }

  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger asChild>
        <div className={`group relative grid min-h-[50px] grid-cols-[26px_1fr_58px_78px] items-center gap-2 rounded-[7px] px-2.5 py-[7px] text-sm text-[var(--gray2)] transition-colors duration-150 ease-in hover:bg-[var(--bg3)] md:grid-cols-[26px_1fr_80px_86px] ${active ? 'bg-[var(--bg3)]' : ''}`}>
          <button className="flex h-9 w-9 items-center justify-center rounded-[7px] text-[var(--gray3)] transition-colors duration-150 ease-in group-hover:text-[var(--gray1)]" type="button" aria-label={`${track.title} 재생`} onClick={playNow}>
            {active ? <EqualizerBars /> : (
              <>
                <span className="text-xs group-hover:hidden">{index + 1}</span>
                <Play className="hidden group-hover:block" size={14} strokeWidth={1.5} />
              </>
            )}
          </button>
          <div className="flex min-w-0 items-center gap-2.5">
            <AlbumArt src={track.coverUrl} title={track.title} className="h-9 w-9 shrink-0 rounded-[4px]" />
            <div className="min-w-0">
              <p className={`truncate text-[13px] font-medium ${active ? 'text-[var(--white)]' : 'text-[var(--gray1)]'}`}>{track.title}</p>
              <p className="truncate text-[11px] font-light text-[var(--gray2)]">{track.artistName}</p>
            </div>
          </div>
          <span className="text-right text-xs font-light text-[var(--gray2)] md:text-left">{formatTime(track.durationMs)}</span>
          <div className="flex justify-end gap-1">
            <button className={`icon-button ${liked ? 'text-[var(--gray1)]' : ''}`} type="button" aria-label={liked ? '좋아요 해제' : '좋아요'} onClick={toggleLike}>
              <Heart size={14} strokeWidth={1.5} fill={liked ? 'currentColor' : 'none'} />
            </button>
            <ContextMenu.Root>
              <ContextMenu.Trigger asChild>
                <button className="icon-button" type="button" aria-label="더 보기" onClick={(event) => {
                  event.preventDefault()
                  setMenuOpen((open) => !open)
                }}>
                  <MoreHorizontal size={14} strokeWidth={1.5} />
                </button>
              </ContextMenu.Trigger>
              <TrackMenu
                liked={liked}
                playlists={playlists}
                canRemove={Boolean(playlistId)}
                onPlayNow={playNow}
                onPlayNext={() => {
                  playNext(track)
                  addToast('다음 재생에 추가했어요', 'success')
                }}
                onAddQueue={() => {
                  addToQueue(track)
                  addToast('재생 목록에 추가했어요', 'success')
                }}
                onToggleLike={toggleLike}
                onAddPlaylist={addPlaylistTrack}
                onRemove={() => {
                  if (!playlistId) return
                  removeTrackFromPlaylist(playlistId, track.id)
                  addToast('플레이리스트에서 제거했어요', 'success')
                }}
                onShare={shareTrack}
              />
            </ContextMenu.Root>
          </div>
          {menuOpen ? (
            <div className="absolute right-3 top-12 z-40 w-56 rounded-[10px] border border-[var(--border)] bg-[var(--bg3)] p-1 text-sm text-[var(--gray1)]">
              <button className="context-menu-item w-full" type="button" onClick={() => { playNow(); setMenuOpen(false) }}><Play size={14} strokeWidth={1.5} /> 바로 재생</button>
              <button className="context-menu-item w-full" type="button" onClick={() => { playNext(track); addToast('다음 재생에 추가했어요', 'success'); setMenuOpen(false) }}><SkipForward size={14} strokeWidth={1.5} /> 다음 재생</button>
              <button className="context-menu-item w-full" type="button" onClick={() => { addToQueue(track); addToast('재생 목록에 추가했어요', 'success'); setMenuOpen(false) }}><ListPlus size={14} strokeWidth={1.5} /> 재생 목록에 추가</button>
              <div className="my-1 h-px bg-[var(--border)]" />
              {playlists.slice(0, 4).map((playlist) => (
                <button key={playlist.id} className="context-menu-item w-full" type="button" onClick={() => { addPlaylistTrack(playlist.id); setMenuOpen(false) }}>
                  {playlist.title}
                </button>
              ))}
              <div className="my-1 h-px bg-[var(--border)]" />
              <button className="context-menu-item w-full" type="button" onClick={() => { toggleLike(); setMenuOpen(false) }}><Heart size={14} strokeWidth={1.5} fill={liked ? 'currentColor' : 'none'} /> {liked ? '좋아요 해제' : '좋아요'}</button>
              <button className="context-menu-item w-full" type="button" onClick={() => { void shareTrack(); setMenuOpen(false) }}><Share2 size={14} strokeWidth={1.5} /> 공유</button>
            </div>
          ) : null}
        </div>
      </ContextMenu.Trigger>
      <TrackMenu
        liked={liked}
        playlists={playlists}
        canRemove={Boolean(playlistId)}
        onPlayNow={playNow}
        onPlayNext={() => {
          playNext(track)
          addToast('다음 재생에 추가했어요', 'success')
        }}
        onAddQueue={() => {
          addToQueue(track)
          addToast('재생 목록에 추가했어요', 'success')
        }}
        onToggleLike={toggleLike}
        onAddPlaylist={addPlaylistTrack}
        onRemove={() => {
          if (!playlistId) return
          removeTrackFromPlaylist(playlistId, track.id)
          addToast('플레이리스트에서 제거했어요', 'success')
        }}
        onShare={shareTrack}
      />
    </ContextMenu.Root>
  )
}

interface TrackMenuProps {
  liked: boolean
  playlists: Array<{ id: string; title: string }>
  canRemove: boolean
  onPlayNow: () => void
  onPlayNext: () => void
  onAddQueue: () => void
  onToggleLike: () => void
  onAddPlaylist: (playlistId: string) => void
  onRemove: () => void
  onShare: () => void
}

function TrackMenu({
  liked,
  playlists,
  canRemove,
  onPlayNow,
  onPlayNext,
  onAddQueue,
  onToggleLike,
  onAddPlaylist,
  onRemove,
  onShare,
}: TrackMenuProps) {
  return (
    <ContextMenu.Portal>
      <ContextMenu.Content className="z-50 min-w-52 rounded-[10px] border border-[var(--border)] bg-[var(--bg3)] p-1 text-sm text-[var(--gray1)]">
        <ContextMenu.Item className="context-menu-item" onSelect={onPlayNow}>
          <Play size={14} strokeWidth={1.5} /> 바로 재생
        </ContextMenu.Item>
        <ContextMenu.Item className="context-menu-item" onSelect={onPlayNext}>
          <SkipForward size={14} strokeWidth={1.5} /> 다음 재생
        </ContextMenu.Item>
        <ContextMenu.Item className="context-menu-item" onSelect={onAddQueue}>
          <ListPlus size={14} strokeWidth={1.5} /> 재생 목록에 추가
        </ContextMenu.Item>
        <ContextMenu.Sub>
          <ContextMenu.SubTrigger className="context-menu-item">플레이리스트에 추가</ContextMenu.SubTrigger>
          <ContextMenu.Portal>
            <ContextMenu.SubContent className="z-50 min-w-48 rounded-[10px] border border-[var(--border)] bg-[var(--bg3)] p-1 text-sm text-[var(--gray1)]">
              {playlists.map((playlist) => (
                <ContextMenu.Item key={playlist.id} className="context-menu-item" onSelect={() => onAddPlaylist(playlist.id)}>
                  {playlist.title}
                </ContextMenu.Item>
              ))}
            </ContextMenu.SubContent>
          </ContextMenu.Portal>
        </ContextMenu.Sub>
        <ContextMenu.Separator className="my-1 h-px bg-[var(--border)]" />
        <ContextMenu.Item className="context-menu-item" onSelect={onToggleLike}>
          <Heart size={14} strokeWidth={1.5} fill={liked ? 'currentColor' : 'none'} /> {liked ? '좋아요 해제' : '좋아요'}
        </ContextMenu.Item>
        {canRemove ? <ContextMenu.Item className="context-menu-item" onSelect={onRemove}>플레이리스트에서 제거</ContextMenu.Item> : null}
        <ContextMenu.Item className="context-menu-item" onSelect={onShare}>
          <Share2 size={14} strokeWidth={1.5} /> 공유
        </ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu.Portal>
  )
}
