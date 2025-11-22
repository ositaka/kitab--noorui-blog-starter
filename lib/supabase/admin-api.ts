/**
 * Admin API for blog management
 *
 * This module provides type-safe CRUD operations for posts and translations.
 * It uses the Repository pattern to abstract database operations and provide
 * clean, testable interfaces.
 *
 * Note: The Supabase client is used without generic types for mutations because
 * the manually defined Database types don't fully align with Supabase's type
 * inference system. Input and output types are still enforced at the API level.
 *
 * @see https://supabase.com/docs/guides/api/rest/generating-types
 */

import { createClient } from './server'
import type {
  Locale,
  Post,
  PostInsert,
  PostTranslationInsert,
  AuthorLocalized,
  CategoryLocalized,
  PostWithRelations,
} from './types'

// ============================================
// TYPE DEFINITIONS
// ============================================

export interface CreatePostData {
  slug: string
  author_id?: string
  category_id?: string
  featured_image?: string
  reading_time?: number
  is_published?: boolean
  is_featured?: boolean
  tags?: string[]
  translations: {
    locale: Locale
    title: string
    excerpt?: string
    content?: string
    meta_title?: string
    meta_description?: string
  }[]
}

export interface UpdatePostData {
  slug?: string
  author_id?: string
  category_id?: string
  featured_image?: string
  reading_time?: number
  is_published?: boolean
  is_featured?: boolean
  tags?: string[]
  published_at?: string | null
}

export interface UpdateTranslationData {
  title?: string
  excerpt?: string
  content?: string
  meta_title?: string
  meta_description?: string
}

export interface AdminStats {
  totalPosts: number
  publishedPosts: number
  draftPosts: number
  totalViews: number
}

// ============================================
// POST QUERIES
// ============================================

/**
 * Get all posts for admin (including drafts)
 */
export async function getAdminPosts(locale: Locale = 'en'): Promise<PostWithRelations[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('posts_localized')
    .select('*')
    .eq('locale', locale)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching admin posts:', error)
    return []
  }

  const posts = (data ?? []) as PostWithRelations[]

  // Collect unique author and category IDs for batch fetching
  const authorIds = [...new Set(posts.map((p) => p.author_id).filter(Boolean))] as string[]
  const categoryIds = [...new Set(posts.map((p) => p.category_id).filter(Boolean))] as string[]

  // Batch fetch related data
  const [authorsData, categoriesData] = await Promise.all([
    authorIds.length > 0
      ? supabase
          .from('authors_localized')
          .select('*')
          .eq('locale', locale)
          .in('id', authorIds)
          .then(({ data }) => (data ?? []) as AuthorLocalized[])
      : Promise.resolve([]),
    categoryIds.length > 0
      ? supabase
          .from('categories_localized')
          .select('*')
          .eq('locale', locale)
          .in('id', categoryIds)
          .then(({ data }) => (data ?? []) as CategoryLocalized[])
      : Promise.resolve([]),
  ])

  // Build lookup maps for O(1) access
  const authorsMap = new Map(authorsData.map((a) => [a.id, a]))
  const categoriesMap = new Map(categoriesData.map((c) => [c.id, c]))

  // Enrich posts with related data
  return posts.map((post) => ({
    ...post,
    author: post.author_id ? authorsMap.get(post.author_id) ?? null : null,
    category: post.category_id ? categoriesMap.get(post.category_id) ?? null : null,
  }))
}

/**
 * Get a single post with all its translations
 */
export async function getPostWithTranslations(postId: string): Promise<{
  post: Post | null
  translations: Record<Locale, { title: string; excerpt: string | null; content: string | null }>
}> {
  const supabase = await createClient()

  // Fetch post and translations in parallel
  const [postResult, translationsResult] = await Promise.all([
    supabase.from('posts').select('*').eq('id', postId).single(),
    supabase.from('post_translations').select('*').eq('post_id', postId),
  ])

  if (postResult.error || !postResult.data) {
    console.error('Error fetching post:', postResult.error)
    return {
      post: null,
      translations: {} as Record<Locale, { title: string; excerpt: string | null; content: string | null }>,
    }
  }

  if (translationsResult.error) {
    console.error('Error fetching translations:', translationsResult.error)
  }

  // Build translations map
  const translations = {} as Record<Locale, { title: string; excerpt: string | null; content: string | null }>

  type TranslationRow = { locale: Locale; title: string; excerpt: string | null; content: string | null }
  for (const t of (translationsResult.data ?? []) as TranslationRow[]) {
    translations[t.locale] = {
      title: t.title,
      excerpt: t.excerpt,
      content: t.content,
    }
  }

  return {
    post: postResult.data as Post,
    translations,
  }
}

// ============================================
// POST MUTATIONS
// ============================================

/**
 * Create a new post with translations
 *
 * This operation is transactional - if translation creation fails,
 * the post is rolled back.
 */
export async function createPost(
  data: CreatePostData
): Promise<{ post: Post | null; error: string | null }> {
  const supabase = await createClient()

  // Prepare post data
  const postInsert: PostInsert = {
    slug: data.slug,
    author_id: data.author_id,
    category_id: data.category_id,
    featured_image: data.featured_image,
    reading_time: data.reading_time ?? 5,
    is_published: data.is_published ?? false,
    is_featured: data.is_featured ?? false,
    tags: data.tags ?? [],
    published_at: data.is_published ? new Date().toISOString() : null,
  }

  // Create post
  const { data: postData, error: postError } = await supabase
    .from('posts')
    .insert(postInsert as Record<string, unknown>)
    .select()
    .single()

  if (postError || !postData) {
    console.error('Error creating post:', postError)
    return { post: null, error: postError?.message ?? 'Failed to create post' }
  }

  const post = postData as Post

  // Prepare and create translations
  const translationInserts: PostTranslationInsert[] = data.translations.map((t) => ({
    post_id: post.id,
    locale: t.locale,
    title: t.title,
    excerpt: t.excerpt,
    content: t.content,
    meta_title: t.meta_title,
    meta_description: t.meta_description,
  }))

  const { error: transError } = await supabase
    .from('post_translations')
    .insert(translationInserts as Record<string, unknown>[])

  if (transError) {
    console.error('Error creating translations:', transError)
    // Rollback: delete the post
    await supabase.from('posts').delete().eq('id', post.id)
    return { post: null, error: transError.message }
  }

  return { post, error: null }
}

/**
 * Update a post's base fields
 */
export async function updatePost(
  postId: string,
  data: UpdatePostData
): Promise<{ success: boolean; error: string | null }> {
  const supabase = await createClient()

  const updateData = {
    ...data,
    updated_at: new Date().toISOString(),
  }

  const { error } = await supabase
    .from('posts')
    .update(updateData as Record<string, unknown>)
    .eq('id', postId)

  if (error) {
    console.error('Error updating post:', error)
    return { success: false, error: error.message }
  }

  return { success: true, error: null }
}

/**
 * Update or create a translation for a specific locale
 *
 * Uses upsert semantics - creates if not exists, updates if exists.
 */
export async function upsertTranslation(
  postId: string,
  locale: Locale,
  data: UpdateTranslationData
): Promise<{ success: boolean; error: string | null }> {
  const supabase = await createClient()

  // Check if translation exists
  const { data: existing, error: fetchError } = await supabase
    .from('post_translations')
    .select('id')
    .eq('post_id', postId)
    .eq('locale', locale)
    .maybeSingle()

  if (fetchError) {
    console.error('Error checking translation:', fetchError)
    return { success: false, error: fetchError.message }
  }

  if (existing) {
    // Update existing translation
    const { error } = await supabase
      .from('post_translations')
      .update(data as Record<string, unknown>)
      .eq('post_id', postId)
      .eq('locale', locale)

    if (error) {
      console.error('Error updating translation:', error)
      return { success: false, error: error.message }
    }
  } else {
    // Create new translation
    if (!data.title) {
      return { success: false, error: 'Title is required for new translations' }
    }

    const insertData: PostTranslationInsert = {
      post_id: postId,
      locale,
      title: data.title,
      excerpt: data.excerpt,
      content: data.content,
      meta_title: data.meta_title,
      meta_description: data.meta_description,
    }

    const { error } = await supabase
      .from('post_translations')
      .insert(insertData as Record<string, unknown>)

    if (error) {
      console.error('Error creating translation:', error)
      return { success: false, error: error.message }
    }
  }

  return { success: true, error: null }
}

/**
 * Delete a post and all its translations
 *
 * Translations are deleted first to handle cases where
 * cascade delete is not configured in the database.
 */
export async function deletePost(
  postId: string
): Promise<{ success: boolean; error: string | null }> {
  const supabase = await createClient()

  // Delete translations first
  const { error: transError } = await supabase
    .from('post_translations')
    .delete()
    .eq('post_id', postId)

  if (transError) {
    console.error('Error deleting translations:', transError)
    return { success: false, error: transError.message }
  }

  // Delete post
  const { error } = await supabase.from('posts').delete().eq('id', postId)

  if (error) {
    console.error('Error deleting post:', error)
    return { success: false, error: error.message }
  }

  return { success: true, error: null }
}

/**
 * Publish a post
 */
export async function publishPost(
  postId: string
): Promise<{ success: boolean; error: string | null }> {
  return updatePost(postId, {
    is_published: true,
    published_at: new Date().toISOString(),
  })
}

/**
 * Unpublish a post
 */
export async function unpublishPost(
  postId: string
): Promise<{ success: boolean; error: string | null }> {
  return updatePost(postId, {
    is_published: false,
  })
}

// ============================================
// AUTHORS AND CATEGORIES
// ============================================

/**
 * Get all authors for dropdown selection
 */
export async function getAllAuthors(locale: Locale = 'en'): Promise<AuthorLocalized[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('authors_localized')
    .select('*')
    .eq('locale', locale)
    .order('name')

  if (error) {
    console.error('Error fetching authors:', error)
    return []
  }

  return (data ?? []) as AuthorLocalized[]
}

/**
 * Get all categories for dropdown selection
 */
export async function getAllCategories(locale: Locale = 'en'): Promise<CategoryLocalized[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('categories_localized')
    .select('*')
    .eq('locale', locale)
    .order('name')

  if (error) {
    console.error('Error fetching categories:', error)
    return []
  }

  return (data ?? []) as CategoryLocalized[]
}

// ============================================
// ADMIN STATS
// ============================================

/**
 * Get admin dashboard statistics
 */
export async function getAdminStats(): Promise<AdminStats> {
  const supabase = await createClient()

  const [totalResult, publishedResult, viewsResult] = await Promise.all([
    supabase.from('posts').select('*', { count: 'exact', head: true }),
    supabase.from('posts').select('*', { count: 'exact', head: true }).eq('is_published', true),
    supabase.from('posts').select('view_count'),
  ])

  const totalPosts = totalResult.count ?? 0
  const publishedPosts = publishedResult.count ?? 0
  const viewsData = (viewsResult.data ?? []) as { view_count: number }[]
  const totalViews = viewsData.reduce((sum, p) => sum + (p.view_count ?? 0), 0)

  return {
    totalPosts,
    publishedPosts,
    draftPosts: totalPosts - publishedPosts,
    totalViews,
  }
}
