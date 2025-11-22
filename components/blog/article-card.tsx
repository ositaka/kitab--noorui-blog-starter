'use client'

import Link from 'next/link'
import { format } from 'date-fns'
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
  Badge,
  Avatar,
  AvatarImage,
  AvatarFallback,
  Skeleton,
  useDirection,
} from 'noorui-rtl'
import { Clock, Eye } from 'lucide-react'
import type { PostWithRelations, Locale } from '@/lib/supabase/types'

interface ArticleCardProps {
  post: PostWithRelations
  locale?: Locale
  featured?: boolean
}

export function ArticleCard({ post, locale = 'en', featured = false }: ArticleCardProps) {
  const { direction } = useDirection()
  const isRTL = direction === 'rtl'

  // Access nested author and category from PostWithRelations
  const authorName = post.author?.name || ''
  const categoryName = post.category?.name || ''
  const categoryColor = post.category?.color
  const authorAvatar = post.author?.avatar_url
  const authorInitials = authorName?.slice(0, 2).toUpperCase() || 'AU'

  return (
    <Link href={`/${locale}/blog/${post.slug}`}>
      <Card className={`group h-full transition-all hover:shadow-lg ${featured ? 'md:flex md:flex-row' : ''}`}>
        {post.featured_image && (
          <div className={`relative overflow-hidden ${featured ? 'md:w-2/5' : 'aspect-video'}`}>
            <img
              src={post.featured_image}
              alt={post.title}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
            />
            {post.is_featured && (
              <Badge className="absolute top-3 start-3" variant="default">
                {isRTL ? 'مميز' : 'Featured'}
              </Badge>
            )}
          </div>
        )}

        <div className={featured ? 'md:w-3/5' : ''}>
          <CardHeader>
            {categoryName && (
              <Badge
                variant="outline"
                style={{ borderColor: categoryColor || undefined }}
              >
                {categoryName}
              </Badge>
            )}
            <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
              {post.title}
            </CardTitle>
            <CardDescription className="line-clamp-2">
              {post.excerpt}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={authorAvatar || undefined} alt={authorName} />
                <AvatarFallback>{authorInitials}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{authorName}</p>
                <p className="text-xs text-muted-foreground">
                  {post.published_at && format(new Date(post.published_at), 'MMM d, yyyy')}
                </p>
              </div>
            </div>
          </CardContent>

          <CardFooter>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {post.reading_time} {isRTL ? 'دقائق' : 'min'}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                {post.view_count}
              </span>
            </div>
          </CardFooter>
        </div>
      </Card>
    </Link>
  )
}

export function ArticleCardSkeleton({ featured = false }: { featured?: boolean }) {
  return (
    <Card className={`h-full ${featured ? 'md:flex md:flex-row' : ''}`}>
      <Skeleton className={`${featured ? 'md:w-2/5 h-full' : 'aspect-video w-full'}`} />
      <div className={featured ? 'md:w-3/5' : ''}>
        <CardHeader>
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="space-y-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Skeleton className="h-3 w-32" />
        </CardFooter>
      </div>
    </Card>
  )
}
