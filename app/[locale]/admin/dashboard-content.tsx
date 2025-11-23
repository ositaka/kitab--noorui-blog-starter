'use client'

import Link from 'next/link'
import { format } from 'date-fns'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Badge,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from 'noorui-rtl'
import {
  FileText,
  Eye,
  Send,
  FileEdit,
  ArrowRight,
  ArrowLeft,
  Plus,
} from 'lucide-react'
import { StatsCard } from '@/components/admin/stats-card'
import type { Locale, PostWithRelations } from '@/lib/supabase/types'
import type { AdminStats } from '@/lib/supabase/admin-api'

const localeConfig: Record<Locale, { dir: 'ltr' | 'rtl' }> = {
  en: { dir: 'ltr' },
  fr: { dir: 'ltr' },
  ar: { dir: 'rtl' },
  ur: { dir: 'rtl' },
}

const translations: Record<Locale, {
  dashboard: string
  overview: string
  totalPosts: string
  publishedPosts: string
  draftPosts: string
  totalViews: string
  recentPosts: string
  recentPostsDescription: string
  title: string
  status: string
  date: string
  published: string
  draft: string
  viewAll: string
  createNew: string
  noPosts: string
}> = {
  en: {
    dashboard: 'Dashboard',
    overview: 'Blog overview and statistics',
    totalPosts: 'Total Posts',
    publishedPosts: 'Published',
    draftPosts: 'Drafts',
    totalViews: 'Total Views',
    recentPosts: 'Recent Posts',
    recentPostsDescription: 'Your most recently created posts',
    title: 'Title',
    status: 'Status',
    date: 'Date',
    published: 'Published',
    draft: 'Draft',
    viewAll: 'View All Posts',
    createNew: 'Create New Post',
    noPosts: 'No posts yet. Create your first post to get started.',
  },
  fr: {
    dashboard: 'Tableau de bord',
    overview: 'Apercu et statistiques du blog',
    totalPosts: 'Total des articles',
    publishedPosts: 'Publiés',
    draftPosts: 'Brouillons',
    totalViews: 'Vues totales',
    recentPosts: 'Articles récents',
    recentPostsDescription: 'Vos articles les plus récemment créés',
    title: 'Titre',
    status: 'Statut',
    date: 'Date',
    published: 'Publié',
    draft: 'Brouillon',
    viewAll: 'Voir tous les articles',
    createNew: 'Créer un nouvel article',
    noPosts: 'Aucun article. Créez votre premier article pour commencer.',
  },
  ar: {
    dashboard: 'لوحة التحكم',
    overview: 'نظرة عامة وإحصائيات المدونة',
    totalPosts: 'إجمالي المنشورات',
    publishedPosts: 'منشور',
    draftPosts: 'مسودات',
    totalViews: 'إجمالي المشاهدات',
    recentPosts: 'المنشورات الأخيرة',
    recentPostsDescription: 'أحدث المنشورات التي قمت بإنشائها',
    title: 'العنوان',
    status: 'الحالة',
    date: 'التاريخ',
    published: 'منشور',
    draft: 'مسودة',
    viewAll: 'عرض جميع المنشورات',
    createNew: 'إنشاء منشور جديد',
    noPosts: 'لا توجد منشورات بعد. أنشئ منشورك الأول للبدء.',
  },
  ur: {
    dashboard: 'ڈیش بورڈ',
    overview: 'بلاگ کا جائزہ اور اعداد و شمار',
    totalPosts: 'کل پوسٹس',
    publishedPosts: 'شائع شدہ',
    draftPosts: 'مسودات',
    totalViews: 'کل ملاحظات',
    recentPosts: 'حالیہ پوسٹس',
    recentPostsDescription: 'آپ کی حال ہی میں بنائی گئی پوسٹس',
    title: 'عنوان',
    status: 'حیثیت',
    date: 'تاریخ',
    published: 'شائع',
    draft: 'مسودہ',
    viewAll: 'تمام پوسٹس دیکھیں',
    createNew: 'نئی پوسٹ بنائیں',
    noPosts: 'ابھی کوئی پوسٹس نہیں۔ شروع کرنے کے لیے اپنی پہلی پوسٹ بنائیں۔',
  },
}

interface DashboardContentProps {
  locale: Locale
  stats: AdminStats
  recentPosts: PostWithRelations[]
}

/**
 * DashboardContent - Admin dashboard main content
 * Shows stats overview and recent posts
 */
export function DashboardContent({
  locale,
  stats,
  recentPosts,
}: DashboardContentProps) {
  const t = translations[locale]
  const config = localeConfig[locale]
  const isRTL = config.dir === 'rtl'
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t.dashboard}</h1>
          <p className="text-muted-foreground">{t.overview}</p>
        </div>
        <Button>
          <Link href={`/${locale}/admin/posts/new`}>
            <Plus className="h-4 w-4 me-2" />
            {t.createNew}
          </Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          icon={<FileText className="h-4 w-4" />}
          label={t.totalPosts}
          value={stats.totalPosts}
        />
        <StatsCard
          icon={<Send className="h-4 w-4" />}
          label={t.publishedPosts}
          value={stats.publishedPosts}
        />
        <StatsCard
          icon={<FileEdit className="h-4 w-4" />}
          label={t.draftPosts}
          value={stats.draftPosts}
        />
        <StatsCard
          icon={<Eye className="h-4 w-4" />}
          label={t.totalViews}
          value={stats.totalViews.toLocaleString()}
        />
      </div>

      {/* Recent Posts */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>{t.recentPosts}</CardTitle>
            <CardDescription>{t.recentPostsDescription}</CardDescription>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/${locale}/admin/posts`}>
              {t.viewAll}
              <ArrowIcon className="h-4 w-4 ms-2" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {recentPosts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">{t.noPosts}</p>
              <Button className="mt-4" asChild>
                <Link href={`/${locale}/admin/posts/new`}>
                  <Plus className="h-4 w-4 me-2" />
                  {t.createNew}
                </Link>
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t.title}</TableHead>
                  <TableHead>{t.status}</TableHead>
                  <TableHead>{t.date}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentPosts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell>
                      <Link
                        href={`/${locale}/admin/posts/${post.id}`}
                        className="font-medium hover:underline"
                      >
                        {post.title}
                      </Link>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        /{post.slug}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          post.is_published
                            ? 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20'
                            : 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20'
                        }
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full me-1.5 ${
                            post.is_published ? 'bg-green-500' : 'bg-yellow-500'
                          }`}
                        />
                        {post.is_published ? t.published : t.draft}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {post.created_at
                        ? format(new Date(post.created_at), 'MMM d, yyyy')
                        : '-'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
