import { getPosts, getCategories } from '@/lib/supabase/api'
import type { Locale, PostWithRelations } from '@/lib/supabase/types'
import { HomePageClient } from './home-client'

interface Props {
  params: Promise<{ locale: string }>
}

export default async function HomePage({ params }: Props) {
  const { locale: localeParam } = await params
  const locale = localeParam as Locale

  // Fetch data on the server
  const [featuredPosts, latestPosts, categories] = await Promise.all([
    getPosts({ locale, limit: 3, featured: true }),
    getPosts({ locale, limit: 6 }),
    getCategories(locale),
  ])

  return (
    <HomePageClient
      locale={locale}
      featuredPosts={featuredPosts}
      latestPosts={latestPosts}
      categories={categories}
    />
  )
}
