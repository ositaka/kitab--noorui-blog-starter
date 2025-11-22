import { getPosts, getCategories } from '@/lib/supabase/api'
import type { Locale } from '@/lib/supabase/types'
import { BlogPageClient } from './blog-client'

interface Props {
  params: Promise<{ locale: string }>
}

export default async function BlogPage({ params }: Props) {
  const { locale: localeParam } = await params
  const locale = localeParam as Locale

  const [posts, categories] = await Promise.all([
    getPosts({ locale, limit: 50 }),
    getCategories(locale),
  ])

  return (
    <BlogPageClient
      locale={locale}
      posts={posts}
      categories={categories}
    />
  )
}
