'use client'

import Link from 'next/link'
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
  Avatar,
  AvatarImage,
  AvatarFallback,
  Button,
  Skeleton,
} from 'noorui-rtl'
import { Twitter, Globe, ArrowRight } from 'lucide-react'
import type { AuthorLocalized, Locale } from '@/lib/supabase/types'

interface AuthorCardProps {
  author: AuthorLocalized
  locale?: Locale
  postCount?: number
  compact?: boolean
}

export function AuthorCard({ author, locale = 'en', postCount, compact = false }: AuthorCardProps) {
  // AuthorLocalized already has localized name/bio from the database view
  const name = author.name || ''
  const bio = author.bio || ''
  const initials = name?.slice(0, 2).toUpperCase() || 'AU'

  if (compact) {
    return (
      <Link href={`/${locale}/author/${author.id}`}>
        <Card className="group transition-all hover:shadow-md">
          <CardContent className="flex items-center gap-4 p-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={author.avatar_url || undefined} alt={name} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate group-hover:text-primary transition-colors">
                {name}
              </p>
              <p className="text-sm text-muted-foreground truncate">{bio}</p>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </CardContent>
        </Card>
      </Link>
    )
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <Avatar className="h-20 w-20 mx-auto">
          <AvatarImage src={author.avatar_url || undefined} alt={name} />
          <AvatarFallback className="text-xl">{initials}</AvatarFallback>
        </Avatar>
        <CardTitle>{name}</CardTitle>
        <CardDescription>{bio}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {postCount !== undefined && (
          <p className="text-center text-sm text-muted-foreground">
            {postCount} {locale === 'ar' || locale === 'ur' ? 'مقالات' : 'articles'}
          </p>
        )}

        <div className="flex justify-center gap-2">
          {author.twitter && (
            <Button variant="outline" size="icon" asChild>
              <a href={`https://twitter.com/${author.twitter}`} target="_blank" rel="noopener noreferrer">
                <Twitter className="h-4 w-4" />
              </a>
            </Button>
          )}
          {author.website && (
            <Button variant="outline" size="icon" asChild>
              <a href={author.website} target="_blank" rel="noopener noreferrer">
                <Globe className="h-4 w-4" />
              </a>
            </Button>
          )}
        </div>

        <Button className="w-full" variant="outline" asChild>
          <Link href={`/${locale}/author/${author.id}`}>
            {locale === 'ar' ? 'عرض المقالات' : locale === 'ur' ? 'مضامین دیکھیں' : 'View Articles'}
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}

export function AuthorCardSkeleton({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <Card>
        <CardContent className="flex items-center gap-4 p-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-48" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="text-center space-y-4">
        <Skeleton className="h-20 w-20 rounded-full mx-auto" />
        <Skeleton className="h-5 w-32 mx-auto" />
        <Skeleton className="h-4 w-48 mx-auto" />
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-4 w-20 mx-auto" />
        <div className="flex justify-center gap-2">
          <Skeleton className="h-9 w-9" />
          <Skeleton className="h-9 w-9" />
        </div>
        <Skeleton className="h-9 w-full" />
      </CardContent>
    </Card>
  )
}
