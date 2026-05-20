import type { CSSProperties } from 'react'

interface AlbumArtProps {
  src: string
  title: string
  className?: string
  style?: CSSProperties
}

export function AlbumArt({ src, title, className = '', style }: AlbumArtProps) {
  const isImage = src.startsWith('/')

  return (
    <div
      className={`flex items-end overflow-hidden border border-[var(--border)] bg-[var(--bg3)] ${isImage ? '' : 'p-3'} ${className}`}
      style={{
        background: isImage ? undefined : src,
        backgroundImage: isImage ? `url("${src}")` : undefined,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        borderRadius: 6,
        ...style,
      }}
      aria-label={`${title} cover`}
    >
      {isImage ? null : <span className="display text-xl text-[var(--gray1)]">{title.slice(0, 2).toUpperCase()}</span>}
    </div>
  )
}
