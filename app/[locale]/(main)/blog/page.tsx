import { getPosts, getCategories } from '@/lib/supabase/api'
import type { Locale } from '@/lib/supabase/types'
import { BlogPageClient } from './blog-client'

interface Props {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ page?: string; category?: string }>
}

const POSTS_PER_PAGE = 12

export default async function BlogPage({ params, searchParams }: Props) {
  const { locale: localeParam } = await params
  const { page: pageParam, category: categoryParam } = await searchParams
  const locale = localeParam as Locale
  const page = parseInt(pageParam || '1', 10)
  const offset = (page - 1) * POSTS_PER_PAGE

  const [result, categories] = await Promise.all([
    getPosts({
      locale,
      limit: POSTS_PER_PAGE,
      offset,
      categoryId: categoryParam,
      withCount: true
    }),
    getCategories(locale),
  ])

  // Type guard to handle the return type
  const { posts, total } = result as { posts: any[]; total: number }

  return (
    <BlogPageClient
      locale={locale}
      posts={posts}
      categories={categories}
      currentPage={page}
      totalPosts={total}
      postsPerPage={POSTS_PER_PAGE}
    />
  )
}
