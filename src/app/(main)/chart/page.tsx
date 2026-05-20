import { TrackRow } from '@/components/music/TrackRow'
import { tracks } from '@/lib/mockData'

export default function ChartPage() {
  const chartTracks = [...tracks].sort((a, b) => b.playsCount - a.playsCount)

  return (
    <div>
      <h1 className="display text-5xl text-[var(--gray1)]">차트</h1>
      <p className="mt-1 text-sm text-[var(--gray2)]">최근 재생량 기준으로 정렬된 SUMUSIC 차트입니다.</p>
      <div className="mt-6 space-y-1">
        {chartTracks.map((track, index) => <TrackRow key={track.id} track={track} index={index} tracks={chartTracks} />)}
      </div>
    </div>
  )
}
