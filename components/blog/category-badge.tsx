'use client'

import Link from 'next/link'
import { Badge } from 'noorui-rtl'
import type { CategoryLocalized, Locale } from '@/lib/supabase/types'

interface CategoryBadgeProps {
  category: CategoryLocalized
  locale?: Locale
  asLink?: boolean
  size?: 'default' | 'lg'
}

export function CategoryBadge({
  category,
  locale = 'en',
  asLink = true,
  size = 'default'
}: CategoryBadgeProps) {
  // CategoryLocalized already has localized name from the database view
  const name = category.name || ''

  const badge = (
    <Badge
      variant="outline"
      className={`
        transition-colors hover:bg-accent
        ${size === 'lg' ? 'text-sm px-3 py-1' : ''}
      `}
      style={{
        borderColor: category.color,
        color: category.color
      }}
    >
      {name}
    </Badge>
  )

  if (asLink) {
    return (
      <Link href={`/${locale}/category/${category.slug}`}>
        {badge}
      </Link>
    )
  }

  return badge
}
