import { createClient } from './server'
import type {
  Locale,
  PostLocalized,
  AuthorLocalized,
  CategoryLocalized,
  PostWithRelations,
} from './types'

// ============================================
// POSTS
// ============================================

export async function getPosts(options?: {
  locale?: Locale
  limit?: number
  offset?: number
  featured?: boolean
  categoryId?: string
}): Promise<PostWithRelations[]> {
  const supabase = await createClient()
  const { locale = 'en', limit = 10, offset = 0, featured, categoryId } = options || {}

  // Fetch posts from the localized view
  let query = supabase
    .from('posts_localized')
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

  if (!data || data.length === 0) return []

  // Cast to PostLocalized[] since Supabase types for views may not be complete
  const posts = data as PostLocalized[]

  // Fetch authors and categories for enrichment
  const authorIds = [...new Set(posts.map((p) => p.author_id).filter(Boolean))]
  const categoryIds = [...new Set(posts.map((p) => p.category_id).filter(Boolean))]

  const [authorsData, categoriesData] = await Promise.all([
    authorIds.length > 0
      ? supabase
          .from('authors_localized')
          .select('*')
          .eq('locale', locale)
          .in('id', authorIds as string[])
          .then(({ data }) => (data || []) as AuthorLocalized[])
      : Promise.resolve([] as AuthorLocalized[]),
    categoryIds.length > 0
      ? supabase
          .from('categories_localized')
          .select('*')
          .eq('locale', locale)
          .in('id', categoryIds as string[])
          .then(({ data }) => (data || []) as CategoryLocalized[])
      : Promise.resolve([] as CategoryLocalized[]),
  ])

  const authorsMap = new Map(authorsData.map((a) => [a.id, a]))
  const categoriesMap = new Map(categoriesData.map((c) => [c.id, c]))

  // Enrich posts with author and category
  return posts.map((post) => ({
    ...post,
    author: post.author_id ? authorsMap.get(post.author_id) || null : null,
    category: post.category_id ? categoriesMap.get(post.category_id) || null : null,
  })) as PostWithRelations[]
}

export async function getPostBySlug(
  slug: string,
  locale: Locale = 'en'
): Promise<PostWithRelations | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('posts_localized')
    .select('*')
    .eq('slug', slug)
    .eq('locale', locale)
    .eq('is_published', true)
    .single()

  if (error || !data) {
    console.error('Error fetching post:', error)
    return null
  }

  // Cast to PostLocalized since Supabase types for views may not be complete
  const post = data as PostLocalized

  // Fetch author and category
  const [authorData, categoryData] = await Promise.all([
    post.author_id
      ? supabase
          .from('authors_localized')
          .select('*')
          .eq('id', post.author_id)
          .eq('locale', locale)
          .single()
          .then(({ data }) => data as AuthorLocalized | null)
      : Promise.resolve(null),
    post.category_id
      ? supabase
          .from('categories_localized')
          .select('*')
          .eq('id', post.category_id)
          .eq('locale', locale)
          .single()
          .then(({ data }) => data as CategoryLocalized | null)
      : Promise.resolve(null),
  ])

  return {
    ...post,
    author: authorData,
    category: categoryData,
  } as PostWithRelations
}

export async function getFeaturedPosts(
  locale: Locale = 'en',
  limit = 3
): Promise<PostWithRelations[]> {
  return getPosts({ locale, limit, featured: true })
}

export async function getRelatedPosts(
  currentSlug: string,
  categoryId: string,
  locale: Locale = 'en',
  limit = 3
): Promise<PostWithRelations[]> {
  const supabase = await createClient()

  const { data: posts, error } = await supabase
    .from('posts_localized')
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

  return (posts || []) as PostWithRelations[]
}

export async function getPostsByTag(
  tag: string,
  locale: Locale = 'en',
  limit = 10
): Promise<PostWithRelations[]> {
  const supabase = await createClient()

  const { data: posts, error } = await supabase
    .from('posts_localized')
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

  return (posts || []) as PostWithRelations[]
}

export async function searchPosts(
  query: string,
  locale: Locale = 'en',
  limit = 10
): Promise<PostWithRelations[]> {
  const supabase = await createClient()

  const { data: posts, error } = await supabase
    .from('posts_localized')
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

  return (posts || []) as PostWithRelations[]
}

export async function incrementPostViews(postId: string): Promise<void> {
  // This is a placeholder - in production, you'd use an RPC function
  // to atomically increment the view count
  // Example: await supabase.rpc('increment_post_views', { post_id: postId })
  console.log('View increment requested for post:', postId)
}

// ============================================
// AUTHORS
// ============================================

export async function getAuthors(locale: Locale = 'en'): Promise<AuthorLocalized[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('authors_localized')
    .select('*')
    .eq('locale', locale)
    .order('id')

  if (error) {
    console.error('Error fetching authors:', error)
    return []
  }

  return (data || []) as AuthorLocalized[]
}

export async function getAuthorById(
  id: string,
  locale: Locale = 'en'
): Promise<AuthorLocalized | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('authors_localized')
    .select('*')
    .eq('id', id)
    .eq('locale', locale)
    .single()

  if (error) {
    console.error('Error fetching author:', error)
    return null
  }

  return data as AuthorLocalized
}

export async function getPostsByAuthor(
  authorId: string,
  locale: Locale = 'en',
  limit = 10
): Promise<PostWithRelations[]> {
  return getPosts({ locale, limit, categoryId: undefined }).then((posts) =>
    posts.filter((p) => p.author_id === authorId).slice(0, limit)
  )
}

// ============================================
// CATEGORIES
// ============================================

export async function getCategories(locale: Locale = 'en'): Promise<CategoryLocalized[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('categories_localized')
    .select('*')
    .eq('locale', locale)
    .order('id')

  if (error) {
    console.error('Error fetching categories:', error)
    return []
  }

  return (data || []) as CategoryLocalized[]
}

export async function getCategoryBySlug(
  slug: string,
  locale: Locale = 'en'
): Promise<CategoryLocalized | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('categories_localized')
    .select('*')
    .eq('slug', slug)
    .eq('locale', locale)
    .single()

  if (error) {
    console.error('Error fetching category:', error)
    return null
  }

  return data as CategoryLocalized
}

export async function getPostsByCategory(
  categorySlug: string,
  locale: Locale = 'en',
  limit = 10
): Promise<PostWithRelations[]> {
  const category = await getCategoryBySlug(categorySlug, locale)
  if (!category) return []

  return getPosts({ locale, limit, categoryId: category.id })
}

// ============================================
// TRANSLATIONS
// ============================================

export async function getAvailableTranslations(slug: string): Promise<Locale[]> {
  const supabase = await createClient()

  // First get the post ID from the slug
  const { data: postData } = await supabase
    .from('posts')
    .select('id')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  const post = postData as { id: string } | null
  if (!post) return []

  // Then get all translations for this post
  const { data, error } = await supabase
    .from('post_translations')
    .select('locale')
    .eq('post_id', post.id)

  if (error) {
    console.error('Error fetching translations:', error)
    return []
  }

  return ((data || []) as { locale: string }[]).map((d) => d.locale) as Locale[]
}

// ============================================
// STATS
// ============================================

export async function getPostsCount(locale?: Locale): Promise<number> {
  const supabase = await createClient()

  let query = supabase
    .from('posts_localized')
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

// ============================================
// TAGS
// ============================================

export async function getAllTags(locale: Locale = 'en'): Promise<string[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('posts_localized')
    .select('tags')
    .eq('locale', locale)
    .eq('is_published', true)

  if (error) {
    console.error('Error fetching tags:', error)
    return []
  }

  // Cast data since Supabase types for views may not be complete
  const posts = (data || []) as { tags: string[] | null }[]

  // Flatten and dedupe tags
  const allTags = posts.flatMap((d) => d.tags || [])
  return [...new Set(allTags)]
}
