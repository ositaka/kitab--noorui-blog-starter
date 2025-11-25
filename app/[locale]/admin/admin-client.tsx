'use client'

import * as React from 'react'
import Link from 'next/link'
import {
  DashboardShell,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  EmptyState,
} from 'noorui-rtl'
import { FileText, Eye, TrendingUp, Plus, Settings, BookOpen } from 'lucide-react'
import { toast } from 'sonner'
import type { Locale, PostWithRelations, AuthorLocalized, CategoryLocalized } from '@/lib/supabase/types'
import type { AdminStats } from '@/lib/supabase/admin-api'
import { adminTranslations } from '@/lib/i18n/admin'
import { StatsCard, PostsTable, PostFilters, PostEditor, type PostEditorData } from '@/components/admin'
import type { TwitterCardType } from '@/components/admin/seo-section'
import { uploadImageAction } from './posts/actions'

interface AdminClientProps {
  locale: Locale
  initialPosts: PostWithRelations[]
  authors: AuthorLocalized[]
  categories: CategoryLocalized[]
  stats: AdminStats
}

const emptyEditorData: PostEditorData = {
  slug: '',
  categoryId: '',
  authorId: '',
  isPublished: false,
  isFeatured: false,
  featuredImage: null,
  titles: { en: '', fr: '', ar: '', ur: '' },
  excerpts: { en: '', fr: '', ar: '', ur: '' },
  contents: { en: '', fr: '', ar: '', ur: '' },
  seoData: {
    en: {},
    fr: {},
    ar: {},
    ur: {},
  },
}

export function AdminClient({
  locale,
  initialPosts,
  authors,
  categories,
  stats,
}: AdminClientProps) {
  const t = adminTranslations[locale]
  const [activeView, setActiveView] = React.useState<'posts' | 'create' | 'analytics'>('posts')
  const [selectedPost, setSelectedPost] = React.useState<PostWithRelations | null>(null)
  const [posts] = React.useState(initialPosts)
  const [editorData, setEditorData] = React.useState<PostEditorData>(emptyEditorData)

  // Navigation items
  const navItems = [
    { title: 'Posts', titleAr: t.nav.posts, href: '#posts', icon: <FileText className="h-5 w-5" /> },
    { title: 'Create New', titleAr: t.nav.create, href: '#create', icon: <Plus className="h-5 w-5" /> },
    { title: 'Analytics', titleAr: t.nav.analytics, href: '#analytics', icon: <TrendingUp className="h-5 w-5" /> },
    { title: 'Settings', titleAr: t.nav.settings, href: '#settings', icon: <Settings className="h-5 w-5" /> },
  ]

  // Notifications
  const notifications = [
    {
      id: '1',
      title: t.notifications.postPublished,
      description: locale === 'ar' || locale === 'ur' ? 'منشورك الآن متاح' : 'Your post is now live',
      time: locale === 'ar' || locale === 'ur' ? 'منذ ساعة' : '1 hour ago',
      read: false,
      type: 'success' as const,
    },
  ]

  // Handle hash navigation
  React.useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1)
      if (hash === 'posts' || !hash) setActiveView('posts')
      else if (hash === 'create') setActiveView('create')
      else if (hash === 'analytics') setActiveView('analytics')
    }
    if (!window.location.hash) window.location.hash = '#posts'
    handleHashChange()
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  // Load post into editor
  const handleEditPost = (post: PostWithRelations) => {
    setSelectedPost(post)
    setEditorData({
      slug: post.slug,
      categoryId: post.category_id || '',
      authorId: post.author_id || '',
      isPublished: post.is_published,
      isFeatured: post.is_featured,
      featuredImage: post.featured_image,
      titles: { en: post.title, fr: '', ar: '', ur: '' },
      excerpts: { en: post.excerpt || '', fr: '', ar: '', ur: '' },
      contents: { en: post.content || '', fr: '', ar: '', ur: '' },
      seoData: {
        en: {
          meta_title: post.meta_title || undefined,
          meta_description: post.meta_description || undefined,
          og_image: post.og_image || undefined,
          focus_keyword: post.focus_keyword || undefined,
          twitter_card: (post.twitter_card as TwitterCardType) || undefined,
        },
        fr: {},
        ar: {},
        ur: {},
      },
    })
    window.location.hash = '#create'
  }

  const handleNewPost = () => {
    setSelectedPost(null)
    setEditorData(emptyEditorData)
    window.location.hash = '#create'
  }

  const handleCancelEdit = () => {
    setSelectedPost(null)
    setEditorData(emptyEditorData)
    window.location.hash = '#posts'
  }

  const handleUploadImage = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('file', file)

    const result = await uploadImageAction(formData)

    if ('error' in result && result.error) {
      toast.error(result.error)
      throw new Error(result.error)
    }

    if ('url' in result) {
      return result.url
    }

    throw new Error('Upload failed')
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardShell
        navItems={navItems}
        user={{ name: locale === 'ar' || locale === 'ur' ? 'مدير النظام' : 'Admin', email: 'admin@kitab.blog' }}
        notifications={notifications}
        relative={true}
        logo={
          <Link href={`/${locale}`} className="flex items-center gap-2">
            <BookOpen className="h-6 w-6" />
            <span className="font-bold">Kitab</span>
          </Link>
        }
      >
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold tracking-tight">{t.title}</h1>
              <p className="text-sm text-muted-foreground">{t.description}</p>
            </div>
            {activeView === 'posts' && (
              <Button onClick={handleNewPost} size="lg" className="gap-2">
                <Plus className="h-5 w-5" />
                {t.create.newPost}
              </Button>
            )}
          </div>

          {/* Analytics View */}
          {activeView === 'analytics' && (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatsCard icon={<FileText className="h-4 w-4" />} label={t.stats.totalPosts} value={stats.totalPosts} trend={12} trendLabel={t.stats.thisMonth} />
                <StatsCard icon={<Eye className="h-4 w-4" />} label={t.stats.totalViews} value={stats.totalViews.toLocaleString()} trend={8} trendLabel={t.stats.thisWeek} />
                <StatsCard icon={<FileText className="h-4 w-4" />} label={t.stats.publishedPosts} value={stats.publishedPosts} />
                <StatsCard icon={<FileText className="h-4 w-4" />} label={t.stats.draftPosts} value={stats.draftPosts} />
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>{locale === 'ar' || locale === 'ur' ? 'أفضل المنشورات' : 'Top Posts'}</CardTitle>
                  <CardDescription>{locale === 'ar' || locale === 'ur' ? 'المنشورات الأكثر مشاهدة' : 'Most viewed posts'}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {posts
                      .filter((p) => p.is_published)
                      .sort((a, b) => (b.view_count || 0) - (a.view_count || 0))
                      .slice(0, 5)
                      .map((post, index) => (
                        <div key={post.id} className="flex items-center gap-4">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">{index + 1}</div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{post.title}</p>
                            <p className="text-sm text-muted-foreground">{post.author?.name || 'Unknown'}</p>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Eye className="h-4 w-4" />
                            <span>{(post.view_count || 0).toLocaleString()}</span>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Posts View */}
          {activeView === 'posts' && (
            <div className="space-y-6">
              <PostFilters
                categories={categories}
                translations={{
                  search: t.filters.search,
                  searchPosts: t.filters.searchPosts,
                  status: t.filters.status,
                  category: t.filters.category,
                  all: t.filters.all,
                  published: t.status.published,
                  draft: t.status.draft,
                }}
              />

              <Card>
                <CardContent className="p-0">
                  {posts.length > 0 ? (
                    <PostsTable
                      posts={posts}
                      locale={locale}
                      translations={{
                        title: t.table.title,
                        author: t.table.author,
                        status: t.table.status,
                        category: t.table.category,
                        views: t.table.views,
                        date: t.table.date,
                        published: t.status.published,
                        draft: t.status.draft,
                        edit: t.actions.edit,
                        preview: t.actions.preview,
                        delete: t.actions.delete,
                        openMenu: t.actions.openMenu,
                        searchPosts: t.filters.searchPosts,
                        noPosts: t.empty.noPosts,
                      }}
                      onEdit={handleEditPost}
                    />
                  ) : (
                    <EmptyState
                      icon={<FileText className="h-12 w-12" />}
                      title={t.empty.noPosts}
                      description={t.empty.createFirst}
                      action={
                        <Button onClick={handleNewPost}>
                          <Plus className="h-4 w-4 me-2" />
                          {t.create.newPost}
                        </Button>
                      }
                    />
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Create/Edit View */}
          {activeView === 'create' && (
            <PostEditor
              data={editorData}
              authors={authors}
              categories={categories}
              isEditing={!!selectedPost}
              onChange={setEditorData}
              onUploadImage={handleUploadImage}
              onCancel={handleCancelEdit}
              onSaveDraft={() => console.log('Save draft:', editorData)}
              onPublish={() => console.log('Publish:', editorData)}
              translations={{
                postDetails: t.create.postDetails,
                title: t.create.title,
                excerpt: t.create.excerpt,
                content: t.create.content,
                category: t.create.category,
                author: t.table.author,
                status: t.create.status,
                draft: t.status.draft,
                published: t.status.published,
                cancel: t.create.cancel,
                saveDraft: t.create.saveDraft,
                publish: t.create.publish,
                all: t.filters.all,
                featuredImage: t.create.featuredImage,
                uploadImage: t.create.uploadImage,
                removeImage: t.create.removeImage,
                imagePlaceholder: t.create.imagePlaceholder,
                languages: t.languages,
              }}
            />
          )}
        </div>
      </DashboardShell>
    </div>
  )
}
