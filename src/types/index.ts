export type Source = 'recommend' | 'search' | 'playlist' | 'chart' | 'artist_page'

export interface Artist {
  id: string
  name: string
  imageUrl: string
  verified: boolean
  monthlyListeners: number
  bio: string
}

export interface Album {
  id: string
  title: string
  artistId: string
  artistName: string
  coverUrl: string
  releaseYear: number
  genre: string[]
  type: 'SINGLE' | 'EP' | 'ALBUM'
}

export interface Track {
  id: string
  title: string
  artistId: string
  artistName: string
  albumId: string
  albumTitle: string
  coverUrl: string
  audioUrl: string
  lyricsUrl?: string
  durationMs: number
  playsCount: number
  likesCount: number
  isExplicit: boolean
}

export interface Playlist {
  id: string
  title: string
  coverUrl: string
  isPublic: boolean
  ownerName: string
  tracks: Track[]
}

export interface LyricLine {
  timestampMs: number
  text: string
  language: 'ko' | 'en'
}

export interface UserProfile {
  id: string
  username: string
  email: string
  avatarUrl: string
  plan: 'FREE' | 'PREMIUM'
}
