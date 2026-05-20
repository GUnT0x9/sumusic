import { albums, artists, lyrics, playlists, tracks } from '@/lib/mockData'

export const mockApi = {
  getHome() {
    return {
      dailyMix: tracks.slice(0, 3),
      recommended: tracks,
      albums,
      recent: tracks.slice(1, 5)
    }
  },
  getTrack(id: string) {
    return tracks.find((track) => track.id === id) ?? tracks[0]
  },
  getAlbum(id: string) {
    const album = albums.find((item) => item.id === id) ?? albums[0]
    return { ...album, tracks: tracks.filter((track) => track.albumId === album.id) }
  },
  getArtist(id: string) {
    const artist = artists.find((item) => item.id === id) ?? artists[0]
    return {
      ...artist,
      topTracks: tracks.filter((track) => track.artistId === artist.id).slice(0, 5),
      albums: albums.filter((album) => album.artistId === artist.id)
    }
  },
  getPlaylist(id: string) {
    return playlists.find((playlist) => playlist.id === id) ?? playlists[0]
  },
  search(query: string) {
    const normalized = query.trim().toLowerCase()
    if (!normalized) return { tracks: [], artists: [], albums: [] }
    return {
      tracks: tracks.filter((track) => `${track.title} ${track.artistName}`.toLowerCase().includes(normalized)),
      artists: artists.filter((artist) => artist.name.toLowerCase().includes(normalized)),
      albums: albums.filter((album) => album.title.toLowerCase().includes(normalized))
    }
  },
  getLyrics() {
    return lyrics
  }
}
