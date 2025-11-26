'use client'

import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Badge,
  Button,
  ButtonArrow,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  EmptyState,
} from 'noorui-rtl'
import {
  FileText,
  Eye,
  Send,
  FileEdit,
  Plus,
} from 'lucide-react'
import { StatsCard } from '@/components/admin/stats-card'
import type { Locale, PostWithRelations } from '@/lib/supabase/types'
import type { AdminStats } from '@/lib/supabase/admin-api'
import type { RecentComment } from '@/lib/supabase/comments'
import { Avatar, AvatarFallback, AvatarImage } from 'noorui-rtl'
import { MessageSquare } from 'lucide-react'

const translations: Record<Locale, {
  dashboard: string
  overview: string
  totalPosts: string
  publishedPosts: string
  draftPosts: string
  totalViews: string
  recentPosts: string
  recentPostsDescription: string
  recentComments: string
  recentCommentsDescription: string
  title: string
  status: string
  date: string
  published: string
  draft: string
  viewAll: string
  createNew: string
  noPosts: string
  noComments: string
  on: string
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
    recentComments: 'Recent Comments',
    recentCommentsDescription: 'Latest comments from readers',
    title: 'Title',
    status: 'Status',
    date: 'Date',
    published: 'Published',
    draft: 'Draft',
    viewAll: 'View All Posts',
    createNew: 'Create New Post',
    noPosts: 'No posts yet. Create your first post to get started.',
    noComments: 'No comments yet.',
    on: 'on',
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
    recentComments: 'Commentaires récents',
    recentCommentsDescription: 'Derniers commentaires des lecteurs',
    title: 'Titre',
    status: 'Statut',
    date: 'Date',
    published: 'Publié',
    draft: 'Brouillon',
    viewAll: 'Voir tous les articles',
    createNew: 'Créer un nouvel article',
    noPosts: 'Aucun article. Créez votre premier article pour commencer.',
    noComments: 'Aucun commentaire encore.',
    on: 'sur',
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
    recentComments: 'التعليقات الأخيرة',
    recentCommentsDescription: 'أحدث تعليقات القراء',
    title: 'العنوان',
    status: 'الحالة',
    date: 'التاريخ',
    published: 'منشور',
    draft: 'مسودة',
    viewAll: 'عرض جميع المنشورات',
    createNew: 'إنشاء منشور جديد',
    noPosts: 'لا توجد منشورات بعد. أنشئ منشورك الأول للبدء.',
    noComments: 'لا توجد تعليقات بعد.',
    on: 'على',
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
    recentComments: 'حالیہ تبصرے',
    recentCommentsDescription: 'قارئین کے تازہ ترین تبصرے',
    title: 'عنوان',
    status: 'حیثیت',
    date: 'تاریخ',
    published: 'شائع',
    draft: 'مسودہ',
    viewAll: 'تمام پوسٹس دیکھیں',
    createNew: 'نئی پوسٹ بنائیں',
    noPosts: 'ابھی کوئی پوسٹس نہیں۔ شروع کرنے کے لیے اپنی پہلی پوسٹ بنائیں۔',
    noComments: 'ابھی کوئی تبصرے نہیں۔',
    on: 'پر',
  },
}

interface DashboardContentProps {
  locale: Locale
  stats: AdminStats
  recentPosts: PostWithRelations[]
  recentComments: RecentComment[]
}

/**
 * DashboardContent - Admin dashboard main content
 * Shows stats overview, recent posts, and recent comments
 */
export function DashboardContent({
  locale,
  stats,
  recentPosts,
  recentComments,
}: DashboardContentProps) {
  const t = translations[locale]

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t.dashboard}</h1>
          <p className="text-muted-foreground">{t.overview}</p>
        </div>
        <Button asChild>
          <Link href={`/${locale}/admin/posts/new`} className="inline-flex items-center">
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
          <ButtonArrow variant="outline" size="sm" direction="forward" icon="arrow" asChild>
            <Link href={`/${locale}/admin/posts`}>
              {t.viewAll}
            </Link>
          </ButtonArrow>
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
                        ? formatDate(post.created_at, locale, { format: 'short' })
                        : '-'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Recent Comments */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            <div>
              <CardTitle>{t.recentComments}</CardTitle>
              <CardDescription>{t.recentCommentsDescription}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {recentComments.length === 0 ? (
            <EmptyState
              icon={<MessageSquare className="h-12 w-12" />}
              title={t.noComments}
            />
          ) : (
            <div className="space-y-4">
              {recentComments.map((comment) => (
                <div key={comment.id} className="flex gap-4 pb-4 border-b border-border last:border-0 last:pb-0">
                  <Avatar className="flex-shrink-0">
                    {comment.user_avatar && <AvatarImage src={comment.user_avatar} alt={comment.user_name} />}
                    <AvatarFallback>{comment.user_name[0]?.toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 mb-1">
                      <p className="font-medium text-sm">{comment.user_name}</p>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(comment.created_at, locale, { format: 'short' })}
                      </span>
                    </div>
                    <p className="text-sm text-foreground/80 line-clamp-2 mb-2">{comment.content}</p>
                    <Link
                      href={`/${locale}/blog/${comment.post_slug}`}
                      className="text-xs font-medium text-primary hover:text-primary/80 transition-colors inline-flex items-center gap-1"
                    >
                      <span className="text-muted-foreground">{t.on}</span>
                      <span>{comment.post_title}</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
