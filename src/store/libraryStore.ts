'use client'

import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { playlists as seedPlaylists } from '@/lib/mockData'
import type { Playlist, Track } from '@/types'

interface LibraryState {
  likedTrackIds: string[]
  playlists: Playlist[]
  isLiked: (trackId: string) => boolean
  toggleLikedTrack: (track: Track) => boolean
  createPlaylist: (title: string) => Playlist
  updatePlaylist: (playlistId: string, updates: Pick<Partial<Playlist>, 'title' | 'coverUrl' | 'isPublic'>) => void
  deletePlaylist: (playlistId: string) => void
  addTrackToPlaylist: (playlistId: string, track: Track) => boolean
  removeTrackFromPlaylist: (playlistId: string, trackId: string) => void
  clearPlaylist: (playlistId: string) => void
}

const createPlaylistId = () => `playlist-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

export const useLibraryStore = create<LibraryState>()(
  persist(
    (set, get) => ({
      likedTrackIds: [],
      playlists: seedPlaylists,
      isLiked: (trackId) => get().likedTrackIds.includes(trackId),
      toggleLikedTrack: (track) => {
        const liked = get().likedTrackIds.includes(track.id)
        set((state) => ({
          likedTrackIds: liked
            ? state.likedTrackIds.filter((trackId) => trackId !== track.id)
            : [track.id, ...state.likedTrackIds],
        }))
        return !liked
      },
      createPlaylist: (title) => {
        const trimmedTitle = title.trim() || '새 플레이리스트'
        const playlist: Playlist = {
          id: createPlaylistId(),
          title: trimmedTitle,
          coverUrl: '',
          isPublic: false,
          ownerName: '나',
          tracks: [],
        }
        set((state) => ({ playlists: [playlist, ...state.playlists] }))
        return playlist
      },
      updatePlaylist: (playlistId, updates) => {
        set((state) => ({
          playlists: state.playlists.map((playlist) =>
            playlist.id === playlistId
              ? {
                  ...playlist,
                  ...updates,
                  title: updates.title?.trim() || playlist.title,
                }
              : playlist
          ),
        }))
      },
      deletePlaylist: (playlistId) => {
        set((state) => ({ playlists: state.playlists.filter((playlist) => playlist.id !== playlistId) }))
      },
      addTrackToPlaylist: (playlistId, track) => {
        const playlist = get().playlists.find((item) => item.id === playlistId)
        if (!playlist || playlist.tracks.some((item) => item.id === track.id)) return false

        set((state) => ({
          playlists: state.playlists.map((item) =>
            item.id === playlistId
              ? {
                  ...item,
                  coverUrl: item.coverUrl || track.coverUrl,
                  tracks: [...item.tracks, track],
                }
              : item
          ),
        }))
        return true
      },
      removeTrackFromPlaylist: (playlistId, trackId) => {
        set((state) => ({
          playlists: state.playlists.map((playlist) =>
            playlist.id === playlistId
              ? {
                  ...playlist,
                  tracks: playlist.tracks.filter((track) => track.id !== trackId),
                }
              : playlist
          ),
        }))
      },
      clearPlaylist: (playlistId) => {
        set((state) => ({
          playlists: state.playlists.map((playlist) =>
            playlist.id === playlistId
              ? {
                  ...playlist,
                  tracks: [],
                }
              : playlist
          ),
        }))
      },
    }),
    {
      name: 'sumusic-library',
      storage: createJSONStorage(() => localStorage),
      version: 1,
    }
  )
)
