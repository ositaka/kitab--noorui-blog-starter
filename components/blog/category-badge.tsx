'use client'

import Link from 'next/link'
import { Badge } from 'noorui-rtl'
import type { Category, Locale, LocalizedString } from '@/lib/supabase/types'

interface CategoryBadgeProps {
  category: Category
  locale?: Locale
  asLink?: boolean
  size?: 'default' | 'lg'
}

function getLocalizedValue(obj: LocalizedString | null, locale: Locale): string {
  if (!obj) return ''
  return obj[locale] || obj['en'] || ''
}

export function CategoryBadge({
  category,
  locale = 'en',
  asLink = true,
  size = 'default'
}: CategoryBadgeProps) {
  const name = getLocalizedValue(category.name, locale)

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
