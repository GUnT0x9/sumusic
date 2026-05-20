import { AlbumCard } from '@/components/music/AlbumCard'
import { RecommendBanner } from '@/components/music/RecommendBanner'
import { TrackRow } from '@/components/music/TrackRow'
import { mockApi } from '@/lib/api'

export default function HomePage() {
  const home = mockApi.getHome()

  return (
    <div className="space-y-8">
      <RecommendBanner tracks={home.dailyMix} />
      <section>
        <div className="mb-3 flex items-end justify-between">
          <h2 className="display text-4xl text-[var(--gray1)]">추천 앨범</h2>
          <span className="text-xs text-[var(--gray2)]">개인화 준비 중</span>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-6">
          {home.albums.map((album) => <AlbumCard key={album.id} album={album} />)}
        </div>
      </section>
      <section>
        <h2 className="display mb-3 text-4xl text-[var(--gray1)]">추천 트랙</h2>
        <div className="space-y-1">
          {home.recommended.map((track, index) => <TrackRow key={track.id} track={track} index={index} tracks={home.recommended} />)}
        </div>
      </section>
    </div>
  )
}
