'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from 'noorui-rtl'
import { FileText, Clock, Search } from 'lucide-react'
import { searchPosts } from '@/lib/supabase/search'
import type { Locale, PostWithRelations } from '@/lib/supabase/types'
import { formatDate } from '@/lib/utils'

interface SearchModalProps {
  locale: Locale
}

const translations: Record<Locale, {
  searchPlaceholder: string
  noResults: string
  recentPosts: string
  searchResults: string
  minRead: string
}> = {
  en: {
    searchPlaceholder: 'Search posts...',
    noResults: 'No posts found.',
    recentPosts: 'Recent Posts',
    searchResults: 'Search Results',
    minRead: 'min read',
  },
  fr: {
    searchPlaceholder: 'Rechercher des articles...',
    noResults: 'Aucun article trouvé.',
    recentPosts: 'Articles récents',
    searchResults: 'Résultats de recherche',
    minRead: 'min de lecture',
  },
  ar: {
    searchPlaceholder: 'البحث عن المنشورات...',
    noResults: 'لم يتم العثور على منشورات.',
    recentPosts: 'المنشورات الأخيرة',
    searchResults: 'نتائج البحث',
    minRead: 'دقيقة للقراءة',
  },
  ur: {
    searchPlaceholder: 'پوسٹس تلاش کریں...',
    noResults: 'کوئی پوسٹ نہیں ملی۔',
    recentPosts: 'حالیہ پوسٹس',
    searchResults: 'تلاش کے نتائج',
    minRead: 'منٹ پڑھنے کا وقت',
  },
}

/**
 * SearchModal - Command palette for searching posts
 *
 * Features:
 * - Cmd+K / Ctrl+K keyboard shortcut
 * - Real-time search with debouncing
 * - Multilingual support (en, fr, ar, ur)
 * - RTL-aware layout
 * - Recent posts when no query
 * - Loading states
 */
export function SearchModal({ locale }: SearchModalProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<PostWithRelations[]>([])
  const [recentPosts, setRecentPosts] = useState<PostWithRelations[]>([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const t = translations[locale]
  const isRTL = locale === 'ar' || locale === 'ur'

  // Load recent posts when modal opens
  useEffect(() => {
    if (open && recentPosts.length === 0) {
      searchPosts('', locale, { limit: 5 }).then(({ posts }) => {
        setRecentPosts(posts)
      })
    }
  }, [open, locale, recentPosts.length])

  // Keyboard shortcut: Cmd+K / Ctrl+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  // Debounced search
  useEffect(() => {
    if (query.length < 2) {
      setResults([])
      setLoading(false)
      return
    }

    setLoading(true)
    const timer = setTimeout(async () => {
      const { posts } = await searchPosts(query, locale, { limit: 10 })
      setResults(posts)
      setLoading(false)
    }, 300)

    return () => clearTimeout(timer)
  }, [query, locale])

  const handleSelect = useCallback((slug: string) => {
    router.push(`/${locale}/blog/${slug}`)
    setOpen(false)
    setQuery('')
  }, [router, locale])

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput
        placeholder={t.searchPlaceholder}
        value={query}
        onValueChange={setQuery}
        dir={isRTL ? 'rtl' : 'ltr'}
      />
      <CommandList>
        {loading && (
          <div className="py-6 text-center text-sm text-muted-foreground">
            <Search className="mx-auto h-6 w-6 animate-pulse mb-2" />
            Searching...
          </div>
        )}

        {!loading && query.length < 2 && recentPosts.length > 0 && (
          <>
            <CommandEmpty>{t.noResults}</CommandEmpty>
            <CommandGroup heading={t.recentPosts}>
              {recentPosts.map((post) => (
                <CommandItem
                  key={post.id}
                  onSelect={() => handleSelect(post.slug)}
                  className="cursor-pointer"
                >
                  <FileText className="me-2 h-4 w-4 text-muted-foreground" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{post.title}</div>
                    <div className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                      <Clock className="h-3 w-3" />
                      {post.reading_time} {t.minRead}
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}

        {!loading && query.length >= 2 && (
          <>
            <CommandEmpty>{t.noResults}</CommandEmpty>
            {results.length > 0 && (
              <CommandGroup heading={t.searchResults}>
                {results.map((post) => (
                  <CommandItem
                    key={post.id}
                    onSelect={() => handleSelect(post.slug)}
                    className="cursor-pointer"
                  >
                    <FileText className="me-2 h-4 w-4 text-muted-foreground" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{post.title}</div>
                      {post.excerpt && (
                        <div className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                          {post.excerpt}
                        </div>
                      )}
                      <div className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                        <Clock className="h-3 w-3" />
                        {post.reading_time} {t.minRead}
                      </div>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </>
        )}
      </CommandList>
    </CommandDialog>
  )
}
