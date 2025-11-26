import type { Locale } from '@/lib/supabase/types'
import { getAdminStats, getAdminPosts } from '@/lib/supabase/admin-api'
import { getRecentComments } from '@/lib/supabase/comments'
import { DashboardContent } from './dashboard-content'

interface AdminPageProps {
  params: Promise<{ locale: Locale }>
}

/**
 * Admin Dashboard Page - Shows overview stats and recent activity
 */
export default async function AdminDashboardPage({ params }: AdminPageProps) {
  const { locale } = await params

  const [stats, recentPosts, recentComments] = await Promise.all([
    getAdminStats(),
    getAdminPosts(locale),
    getRecentComments(5),
  ])

  return (
    <DashboardContent
      locale={locale}
      stats={stats}
      recentPosts={recentPosts.slice(0, 5)}
      recentComments={recentComments}
    />
  )
}
