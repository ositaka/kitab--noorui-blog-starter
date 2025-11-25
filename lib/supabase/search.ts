'use server'

import { createClient } from '@/lib/supabase/server'
import type { Locale, PostWithRelations } from './types'

export interface SearchFilters {
  category?: string
  tags?: string[]
  limit?: number
}

export interface SearchResult {
  posts: PostWithRelations[]
  error?: string
}

/**
 * Search posts using PostgreSQL full-text search
 *
 * @param query - Search query string
 * @param locale - Current locale (en, fr, ar, ur)
 * @param filters - Optional filters (category, tags, limit)
 * @returns Array of matching posts
 */
export async function searchPosts(
  query: string,
  locale: Locale,
  filters?: SearchFilters
): Promise<SearchResult> {
  if (!query || query.trim().length < 2) {
    return { posts: [] }
  }

  try {
    const supabase = await createClient()

    // Build the base query
    let queryBuilder = supabase
      .from('posts_localized')
      .select('*')
      .eq('locale', locale)
      .eq('is_published', true)
      .textSearch('search_vector', query, {
        type: 'websearch', // Supports "phrase search" and -exclusions
        config: 'simple', // Use simple for multilingual support
      })
      .order('created_at', { ascending: false })
      .limit(filters?.limit || 20)

    // Apply category filter
    if (filters?.category) {
      queryBuilder = queryBuilder.eq('category_id', filters.category)
    }

    // Apply tags filter (posts with ANY of the specified tags)
    if (filters?.tags && filters.tags.length > 0) {
      queryBuilder = queryBuilder.overlaps('tags', filters.tags)
    }

    const { data, error } = await queryBuilder

    if (error) {
      console.error('Search error:', error)
      return { posts: [], error: error.message }
    }

    return { posts: (data || []) as PostWithRelations[] }
  } catch (error) {
    console.error('Search error:', error)
    return {
      posts: [],
      error: error instanceof Error ? error.message : 'Search failed'
    }
  }
}
