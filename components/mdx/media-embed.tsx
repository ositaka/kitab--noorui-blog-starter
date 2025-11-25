import { cn } from '@/lib/utils'

export type MediaPlatform = 'youtube' | 'vimeo' | 'unknown'

export interface MediaEmbedProps {
  /** Video URL (YouTube or Vimeo) */
  url: string
  /** Optional title for accessibility */
  title?: string
  /** Aspect ratio */
  aspectRatio?: '16:9' | '4:3' | '1:1' | '9:16'
  /** Caption below the video */
  caption?: string
  /** Additional CSS classes */
  className?: string
}

/**
 * Extract video ID and platform from URL
 */
function parseVideoUrl(url: string): { platform: MediaPlatform; videoId: string | null } {
  // YouTube patterns
  const youtubeRegex = /(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  const youtubeMatch = url.match(youtubeRegex)
  if (youtubeMatch) {
    return { platform: 'youtube', videoId: youtubeMatch[1] }
  }

  // Vimeo patterns
  const vimeoRegex = /(?:vimeo\.com\/)(\d+)/
  const vimeoMatch = url.match(vimeoRegex)
  if (vimeoMatch) {
    return { platform: 'vimeo', videoId: vimeoMatch[1] }
  }

  return { platform: 'unknown', videoId: null }
}

/**
 * Get embed URL for a video
 */
function getEmbedUrl(platform: MediaPlatform, videoId: string): string {
  switch (platform) {
    case 'youtube':
      return `https://www.youtube-nocookie.com/embed/${videoId}?rel=0`
    case 'vimeo':
      return `https://player.vimeo.com/video/${videoId}?dnt=1`
    default:
      return ''
  }
}

const aspectRatioClasses: Record<string, string> = {
  '16:9': 'aspect-video',
  '4:3': 'aspect-[4/3]',
  '1:1': 'aspect-square',
  '9:16': 'aspect-[9/16]',
}

/**
 * MediaEmbed - Responsive video embed for YouTube and Vimeo
 *
 * Usage in MDX:
 * <MediaEmbed url="https://www.youtube.com/watch?v=dQw4w9WgXcQ" />
 *
 * <MediaEmbed
 *   url="https://vimeo.com/123456789"
 *   caption="A beautiful video"
 *   aspectRatio="4:3"
 * />
 */
export function MediaEmbed({
  url,
  title = 'Video',
  aspectRatio = '16:9',
  caption,
  className,
}: MediaEmbedProps) {
  const { platform, videoId } = parseVideoUrl(url)

  if (platform === 'unknown' || !videoId) {
    return (
      <div className={cn('my-6 p-4 border border-border rounded-lg bg-muted/50', className)}>
        <p className="text-sm text-muted-foreground">
          Unable to embed video. <a href={url} target="_blank" rel="noopener noreferrer" className="text-primary underline">Watch on original site</a>
        </p>
      </div>
    )
  }

  const embedUrl = getEmbedUrl(platform, videoId)

  return (
    <figure className={cn('my-8 not-prose', className)}>
      <div
        className={cn(
          'relative w-full overflow-hidden rounded-lg bg-muted',
          aspectRatioClasses[aspectRatio],
        )}
      >
        <iframe
          src={embedUrl}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full border-0"
          loading="lazy"
        />
      </div>
      {caption && (
        <figcaption className="mt-3 text-center text-sm text-muted-foreground italic">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}

export interface YouTubeProps {
  /** YouTube video ID or full URL */
  id?: string
  url?: string
  title?: string
  caption?: string
  className?: string
}

/**
 * YouTube - Convenience component for YouTube embeds
 *
 * Usage in MDX:
 * <YouTube id="dQw4w9WgXcQ" />
 * or
 * <YouTube url="https://www.youtube.com/watch?v=dQw4w9WgXcQ" />
 */
export function YouTube({ id, url, title = 'YouTube video', caption, className }: YouTubeProps) {
  const videoUrl = url || (id ? `https://www.youtube.com/watch?v=${id}` : '')
  return <MediaEmbed url={videoUrl} title={title} caption={caption} className={className} />
}

export interface VimeoProps {
  /** Vimeo video ID or full URL */
  id?: string
  url?: string
  title?: string
  caption?: string
  className?: string
}

/**
 * Vimeo - Convenience component for Vimeo embeds
 *
 * Usage in MDX:
 * <Vimeo id="123456789" />
 * or
 * <Vimeo url="https://vimeo.com/123456789" />
 */
export function Vimeo({ id, url, title = 'Vimeo video', caption, className }: VimeoProps) {
  const videoUrl = url || (id ? `https://vimeo.com/${id}` : '')
  return <MediaEmbed url={videoUrl} title={title} caption={caption} className={className} />
}

export interface UrlEmbedProps {
  /** URL to embed */
  url: string
  /** Optional title */
  title?: string
  /** Additional CSS classes */
  className?: string
}

/**
 * UrlEmbed - Simple link embed for external resources
 *
 * Usage in MDX:
 * <UrlEmbed url="https://example.com/article" />
 */
export function UrlEmbed({ url, title, className }: UrlEmbedProps) {
  return (
    <div className={cn('my-6 p-4 border border-border rounded-lg bg-muted/50 hover:bg-muted transition-colors', className)}>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary hover:underline font-medium flex items-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
        {title || url}
      </a>
    </div>
  )
}
