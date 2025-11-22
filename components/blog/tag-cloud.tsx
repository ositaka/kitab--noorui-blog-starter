'use client'

import Link from 'next/link'
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  Badge,
  useDirection,
} from 'noorui-rtl'
import { Tag } from 'lucide-react'
import type { Locale } from '@/lib/supabase/types'

interface TagCloudProps {
  tags: { tag: string; count: number }[]
  locale?: Locale
  title?: string
}

export function TagCloud({ tags, locale = 'en', title }: TagCloudProps) {
  const { direction } = useDirection()
  const isRTL = direction === 'rtl'

  const defaultTitle = isRTL ? 'الوسوم' : 'Tags'

  if (tags.length === 0) return null

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Tag className="h-4 w-4" />
          {title || defaultTitle}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-wrap gap-2">
          {tags.map(({ tag, count }) => (
            <Link key={tag} href={`/${locale}/tag/${encodeURIComponent(tag)}`}>
              <Badge variant="secondary" className="hover:bg-primary hover:text-primary-foreground transition-colors">
                {tag}
                <span className="ms-1.5 text-xs opacity-60">({count})</span>
              </Badge>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
