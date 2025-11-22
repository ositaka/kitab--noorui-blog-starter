'use client'

import {
  Card,
  CardContent,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  useDirection,
} from 'noorui-rtl'
import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { CategoryLocalized } from '@/lib/supabase/types'

export interface PostFiltersProps {
  categories: CategoryLocalized[]
  translations: {
    search: string
    searchPosts: string
    status: string
    category: string
    all: string
    published: string
    draft: string
  }
  onSearchChange?: (value: string) => void
  onStatusChange?: (value: string) => void
  onCategoryChange?: (value: string) => void
}

/**
 * PostFilters - Filter controls for posts list
 * Candidate for migration to noorui-rtl (Phase 7)
 */
export function PostFilters({
  categories,
  translations: t,
  onSearchChange,
  onStatusChange,
  onCategoryChange,
}: PostFiltersProps) {
  const { direction } = useDirection()
  const isRTL = direction === 'rtl'

  return (
    <Card className="border-2">
      <CardContent className="pt-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end">
          <div className="flex-1">
            <Label
              htmlFor="search"
              className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
            >
              {t.search}
            </Label>
            <div className="relative mt-2">
              <Search className="absolute start-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder={t.searchPosts}
                className={cn('h-11', isRTL ? 'pe-9' : 'ps-9')}
                onChange={(e) => onSearchChange?.(e.target.value)}
              />
            </div>
          </div>
          <div className="w-full md:w-[180px]">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t.status}
            </Label>
            <Select defaultValue="all" onValueChange={onStatusChange}>
              <SelectTrigger className="mt-2 h-11">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t.all}</SelectItem>
                <SelectItem value="published">{t.published}</SelectItem>
                <SelectItem value="draft">{t.draft}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-full md:w-[180px]">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t.category}
            </Label>
            <Select defaultValue="all" onValueChange={onCategoryChange}>
              <SelectTrigger className="mt-2 h-11">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t.all}</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
