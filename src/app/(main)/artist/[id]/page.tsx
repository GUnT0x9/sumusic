import { AlbumCard } from '@/components/music/AlbumCard'
import { AlbumArt } from '@/components/music/AlbumArt'
import { TrackRow } from '@/components/music/TrackRow'
import { mockApi } from '@/lib/api'

export default function ArtistPage({ params }: { params: { id: string } }) {
  const artist = mockApi.getArtist(params.id)

  return (
    <div className="space-y-8">
      <section className="surface flex flex-col gap-5 p-5 md:flex-row md:items-end">
        <AlbumArt src={artist.imageUrl} title={artist.name} className="h-40 w-40 rounded-full" />
        <div>
          <p className="text-xs text-[var(--gray2)]">{artist.verified ? '인증된 아티스트' : '아티스트'}</p>
          <h1 className="display text-6xl leading-none text-[var(--gray1)]">{artist.name}</h1>
          <p className="mt-3 max-w-xl text-sm text-[var(--gray2)]">{artist.bio}</p>
          <p className="mt-2 text-xs text-[var(--gray2)]">{artist.monthlyListeners.toLocaleString('ko-KR')} monthly listeners</p>
        </div>
      </section>
      <section>
        <h2 className="display mb-3 text-4xl text-[var(--gray1)]">인기 트랙</h2>
        {artist.topTracks.map((track, index) => <TrackRow key={track.id} track={track} index={index} tracks={artist.topTracks} />)}
      </section>
      <section>
        <h2 className="display mb-3 text-4xl text-[var(--gray1)]">앨범</h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
          {artist.albums.map((album) => <AlbumCard key={album.id} album={album} />)}
        </div>
      </section>
    </div>
  )
}
