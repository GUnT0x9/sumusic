import Link from 'next/link'
import { Play } from 'lucide-react'
import type { Album } from '@/types'
import { AlbumArt } from '@/components/music/AlbumArt'

export function AlbumCard({ album }: { album: Album }) {
  return (
    <Link href={`/album/${album.id}`} className="group block rounded-[10px] border border-[var(--border)] bg-[var(--bg3)] p-[11px] transition-colors duration-150 ease-in hover:bg-[var(--bg4)]">
      <div className="relative overflow-hidden rounded-[6px]">
        <AlbumArt src={album.coverUrl} title={album.title} className="aspect-square w-full border-0" />
        <span className="absolute inset-0 flex items-center justify-center bg-[var(--bg)] opacity-0 transition-opacity duration-150 ease-in group-hover:opacity-85">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--white)] text-[var(--bg)]">
            <Play size={13} strokeWidth={1.5} />
          </span>
        </span>
      </div>
      <p className="mt-3 truncate text-xs font-medium text-[var(--gray1)]">{album.title}</p>
      <p className="truncate text-[11px] font-light text-[var(--gray2)]">{album.artistName}</p>
    </Link>
  )
}
