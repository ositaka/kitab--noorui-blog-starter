import type { Locale } from '@/lib/supabase/types'
import { getAdminStats, getAdminPosts } from '@/lib/supabase/admin-api'
import { DashboardContent } from './dashboard-content'

interface AdminPageProps {
  params: Promise<{ locale: Locale }>
}

/**
 * Admin Dashboard Page - Shows overview stats and recent activity
 */
export default async function AdminDashboardPage({ params }: AdminPageProps) {
  const { locale } = await params

  const [stats, recentPosts] = await Promise.all([
    getAdminStats(),
    getAdminPosts(locale),
  ])

  return (
    <DashboardContent
      locale={locale}
      stats={stats}
      recentPosts={recentPosts.slice(0, 5)}
    />
  )
}
