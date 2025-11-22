import type { Locale } from '@/lib/supabase/types'
import { getAdminPosts } from '@/lib/supabase/admin-api'
import { PostsListContent } from './posts-list-content'

interface PostsPageProps {
  params: Promise<{ locale: Locale }>
}

/**
 * Admin Posts Page - Lists all posts with filtering and actions
 */
export default async function AdminPostsPage({ params }: PostsPageProps) {
  const { locale } = await params
  const posts = await getAdminPosts(locale)

  return <PostsListContent locale={locale} posts={posts} />
}
