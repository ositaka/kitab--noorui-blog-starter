import { createClient } from './server'
import type { Locale, Post, PostWithRelations, Author, Category } from './types'

// ============================================
// POSTS
// ============================================

export async function getPosts(options?: {
  locale?: Locale
  limit?: number
  offset?: number
  featured?: boolean
  categoryId?: string
}) {
  const supabase = await createClient()
  const { locale = 'en', limit = 10, offset = 0, featured, categoryId } = options || {}

  let query = supabase
    .from('posts_with_relations')
    .select('*')
    .eq('locale', locale)
    .eq('is_published', true)
    .order('published_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (featured !== undefined) {
    query = query.eq('is_featured', featured)
  }

  if (categoryId) {
    query = query.eq('category_id', categoryId)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching posts:', error)
    return []
  }

  return data as PostWithRelations[]
}

export async function getPostBySlug(slug: string, locale: Locale = 'en') {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('posts_with_relations')
    .select('*')
    .eq('slug', slug)
    .eq('locale', locale)
    .eq('is_published', true)
    .single()

  if (error) {
    console.error('Error fetching post:', error)
    return null
  }

  return data as PostWithRelations
}

export async function getFeaturedPosts(locale: Locale = 'en', limit = 3) {
  return getPosts({ locale, limit, featured: true })
}

export async function getRelatedPosts(
  currentSlug: string,
  categoryId: string,
  locale: Locale = 'en',
  limit = 3
) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('posts_with_relations')
    .select('*')
    .eq('locale', locale)
    .eq('category_id', categoryId)
    .eq('is_published', true)
    .neq('slug', currentSlug)
    .order('published_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching related posts:', error)
    return []
  }

  return data as PostWithRelations[]
}

export async function getPostsByTag(tag: string, locale: Locale = 'en', limit = 10) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('posts_with_relations')
    .select('*')
    .eq('locale', locale)
    .eq('is_published', true)
    .contains('tags', [tag])
    .order('published_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching posts by tag:', error)
    return []
  }

  return data as PostWithRelations[]
}

export async function searchPosts(query: string, locale: Locale = 'en', limit = 10) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('posts_with_relations')
    .select('*')
    .eq('locale', locale)
    .eq('is_published', true)
    .or(`title.ilike.%${query}%,excerpt.ilike.%${query}%,content.ilike.%${query}%`)
    .order('published_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error searching posts:', error)
    return []
  }

  return data as PostWithRelations[]
}

export async function incrementPostViews(postId: string) {
  const supabase = await createClient()

  const { error } = await supabase.rpc('increment_view_count', { post_id: postId })

  if (error) {
    console.error('Error incrementing views:', error)
  }
}

// ============================================
// AUTHORS
// ============================================

export async function getAuthors() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('authors')
    .select('*')
    .order('id')

  if (error) {
    console.error('Error fetching authors:', error)
    return []
  }

  return data as Author[]
}

export async function getAuthorById(id: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('authors')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching author:', error)
    return null
  }

  return data as Author
}

export async function getPostsByAuthor(authorId: string, locale: Locale = 'en', limit = 10) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('posts_with_relations')
    .select('*')
    .eq('author_id', authorId)
    .eq('locale', locale)
    .eq('is_published', true)
    .order('published_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching author posts:', error)
    return []
  }

  return data as PostWithRelations[]
}

// ============================================
// CATEGORIES
// ============================================

export async function getCategories() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('id')

  if (error) {
    console.error('Error fetching categories:', error)
    return []
  }

  return data as Category[]
}

export async function getCategoryBySlug(slug: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) {
    console.error('Error fetching category:', error)
    return null
  }

  return data as Category
}

export async function getPostsByCategory(categorySlug: string, locale: Locale = 'en', limit = 10) {
  const category = await getCategoryBySlug(categorySlug)
  if (!category) return []

  return getPosts({ locale, limit, categoryId: category.id })
}

// ============================================
// TRANSLATIONS
// ============================================

export async function getAvailableTranslations(slug: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('posts')
    .select('locale')
    .eq('slug', slug)
    .eq('is_published', true)

  if (error) {
    console.error('Error fetching translations:', error)
    return []
  }

  return data.map((d) => d.locale) as Locale[]
}

// ============================================
// STATS
// ============================================

export async function getPostsCount(locale?: Locale) {
  const supabase = await createClient()

  let query = supabase
    .from('posts')
    .select('*', { count: 'exact', head: true })
    .eq('is_published', true)

  if (locale) {
    query = query.eq('locale', locale)
  }

  const { count, error } = await query

  if (error) {
    console.error('Error fetching posts count:', error)
    return 0
  }

  return count || 0
}
