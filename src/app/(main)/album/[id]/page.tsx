import { AlbumArt } from '@/components/music/AlbumArt'
import { TrackRow } from '@/components/music/TrackRow'
import { mockApi } from '@/lib/api'

export default function AlbumPage({ params }: { params: { id: string } }) {
  const album = mockApi.getAlbum(params.id)

  return (
    <div>
      <section className="flex flex-col gap-5 md:flex-row md:items-end">
        <AlbumArt src={album.coverUrl} title={album.title} className="h-52 w-52" />
        <div>
          <p className="text-xs uppercase text-[var(--gray2)]">{album.type}</p>
          <h1 className="display text-6xl leading-none text-[var(--gray1)]">{album.title}</h1>
          <p className="mt-3 text-sm text-[var(--gray2)]">{album.artistName} · {album.releaseYear} · {album.genre.join(', ')}</p>
        </div>
      </section>
      <section className="mt-8 space-y-1">
        {album.tracks.length > 0 ? album.tracks.map((track, index) => <TrackRow key={track.id} track={track} index={index} tracks={album.tracks} />) : <p className="text-sm text-[var(--gray1)]">수록곡이 없어요</p>}
      </section>
    </div>
  )
}
