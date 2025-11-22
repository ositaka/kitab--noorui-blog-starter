'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Button,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  Badge,
  Separator,
} from 'noorui-rtl'
import { Plus, Eye, Edit, ExternalLink, Calendar, User, Tag, Clock } from 'lucide-react'
import { format } from 'date-fns'
import { PostsTable } from '@/components/admin/posts-table'
import type { Locale, PostWithRelations } from '@/lib/supabase/types'

const localeConfig: Record<Locale, { dir: 'ltr' | 'rtl' }> = {
  en: { dir: 'ltr' },
  fr: { dir: 'ltr' },
  ar: { dir: 'rtl' },
  ur: { dir: 'rtl' },
}

const translations: Record<Locale, {
  posts: string
  manageAllPosts: string
  createNew: string
  postDetails: string
  postPreview: string
  edit: string
  viewOnSite: string
  published: string
  draft: string
  author: string
  category: string
  readingTime: string
  minutes: string
  views: string
  createdAt: string
  publishedAt: string
  tags: string
  noTags: string
  excerpt: string
  noExcerpt: string
  tableTranslations: {
    title: string
    author: string
    status: string
    category: string
    views: string
    date: string
    published: string
    draft: string
    edit: string
    preview: string
    delete: string
    openMenu: string
    searchPosts: string
    noPosts: string
  }
}> = {
  en: {
    posts: 'Posts',
    manageAllPosts: 'Manage all your blog posts',
    createNew: 'Create New',
    postDetails: 'Post Details',
    postPreview: 'Preview and manage this post',
    edit: 'Edit Post',
    viewOnSite: 'View on Site',
    published: 'Published',
    draft: 'Draft',
    author: 'Author',
    category: 'Category',
    readingTime: 'Reading Time',
    minutes: 'minutes',
    views: 'Views',
    createdAt: 'Created',
    publishedAt: 'Published',
    tags: 'Tags',
    noTags: 'No tags',
    excerpt: 'Excerpt',
    noExcerpt: 'No excerpt provided',
    tableTranslations: {
      title: 'Title',
      author: 'Author',
      status: 'Status',
      category: 'Category',
      views: 'Views',
      date: 'Date',
      published: 'Published',
      draft: 'Draft',
      edit: 'Edit',
      preview: 'Preview',
      delete: 'Delete',
      openMenu: 'Open menu',
      searchPosts: 'Search posts...',
      noPosts: 'No posts found',
    },
  },
  fr: {
    posts: 'Articles',
    manageAllPosts: 'Gérez tous vos articles de blog',
    createNew: 'Créer',
    postDetails: 'Détails de l\'article',
    postPreview: 'Prévisualiser et gérer cet article',
    edit: 'Modifier',
    viewOnSite: 'Voir sur le site',
    published: 'Publié',
    draft: 'Brouillon',
    author: 'Auteur',
    category: 'Catégorie',
    readingTime: 'Temps de lecture',
    minutes: 'minutes',
    views: 'Vues',
    createdAt: 'Créé le',
    publishedAt: 'Publié le',
    tags: 'Tags',
    noTags: 'Aucun tag',
    excerpt: 'Extrait',
    noExcerpt: 'Aucun extrait fourni',
    tableTranslations: {
      title: 'Titre',
      author: 'Auteur',
      status: 'Statut',
      category: 'Catégorie',
      views: 'Vues',
      date: 'Date',
      published: 'Publié',
      draft: 'Brouillon',
      edit: 'Modifier',
      preview: 'Aperçu',
      delete: 'Supprimer',
      openMenu: 'Ouvrir le menu',
      searchPosts: 'Rechercher...',
      noPosts: 'Aucun article trouvé',
    },
  },
  ar: {
    posts: 'المنشورات',
    manageAllPosts: 'إدارة جميع منشورات المدونة',
    createNew: 'إنشاء جديد',
    postDetails: 'تفاصيل المنشور',
    postPreview: 'معاينة وإدارة هذا المنشور',
    edit: 'تعديل',
    viewOnSite: 'عرض على الموقع',
    published: 'منشور',
    draft: 'مسودة',
    author: 'الكاتب',
    category: 'الفئة',
    readingTime: 'وقت القراءة',
    minutes: 'دقائق',
    views: 'المشاهدات',
    createdAt: 'تاريخ الإنشاء',
    publishedAt: 'تاريخ النشر',
    tags: 'الوسوم',
    noTags: 'لا توجد وسوم',
    excerpt: 'المقتطف',
    noExcerpt: 'لا يوجد مقتطف',
    tableTranslations: {
      title: 'العنوان',
      author: 'الكاتب',
      status: 'الحالة',
      category: 'الفئة',
      views: 'المشاهدات',
      date: 'التاريخ',
      published: 'منشور',
      draft: 'مسودة',
      edit: 'تعديل',
      preview: 'معاينة',
      delete: 'حذف',
      openMenu: 'فتح القائمة',
      searchPosts: 'البحث في المنشورات...',
      noPosts: 'لا توجد منشورات',
    },
  },
  ur: {
    posts: 'پوسٹس',
    manageAllPosts: 'اپنی تمام بلاگ پوسٹس کا نظم کریں',
    createNew: 'نئی بنائیں',
    postDetails: 'پوسٹ کی تفصیلات',
    postPreview: 'اس پوسٹ کا پیش نظارہ اور نظم',
    edit: 'ترمیم',
    viewOnSite: 'سائٹ پر دیکھیں',
    published: 'شائع شدہ',
    draft: 'مسودہ',
    author: 'مصنف',
    category: 'زمرہ',
    readingTime: 'پڑھنے کا وقت',
    minutes: 'منٹ',
    views: 'ملاحظات',
    createdAt: 'بنایا گیا',
    publishedAt: 'شائع کیا گیا',
    tags: 'ٹیگز',
    noTags: 'کوئی ٹیگز نہیں',
    excerpt: 'اقتباس',
    noExcerpt: 'کوئی اقتباس فراہم نہیں کیا گیا',
    tableTranslations: {
      title: 'عنوان',
      author: 'مصنف',
      status: 'حیثیت',
      category: 'زمرہ',
      views: 'ملاحظات',
      date: 'تاریخ',
      published: 'شائع',
      draft: 'مسودہ',
      edit: 'ترمیم',
      preview: 'پیش نظارہ',
      delete: 'حذف',
      openMenu: 'مینو کھولیں',
      searchPosts: 'پوسٹس تلاش کریں...',
      noPosts: 'کوئی پوسٹس نہیں ملیں',
    },
  },
}

interface PostsListContentProps {
  locale: Locale
  posts: PostWithRelations[]
}

/**
 * PostsListContent - Posts list with sliding panel for details
 */
export function PostsListContent({ locale, posts }: PostsListContentProps) {
  const router = useRouter()
  const t = translations[locale]
  const config = localeConfig[locale]
  const isRTL = config.dir === 'rtl'

  const [selectedPost, setSelectedPost] = React.useState<PostWithRelations | null>(null)
  const [sheetOpen, setSheetOpen] = React.useState(false)

  const handleEditPost = (post: PostWithRelations) => {
    setSelectedPost(post)
    setSheetOpen(true)
  }

  const navigateToEdit = () => {
    if (selectedPost) {
      router.push(`/${locale}/admin/posts/${selectedPost.id}`)
    }
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t.posts}</h1>
          <p className="text-muted-foreground">{t.manageAllPosts}</p>
        </div>
        <Button asChild>
          <Link href={`/${locale}/admin/posts/new`}>
            <Plus className="h-4 w-4 me-2" />
            {t.createNew}
          </Link>
        </Button>
      </div>

      {/* Posts Table */}
      <PostsTable
        posts={posts}
        locale={locale}
        translations={t.tableTranslations}
        onEdit={handleEditPost}
      />

      {/* Sliding Panel for Post Details */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side={isRTL ? 'start' : 'end'} className="w-full sm:max-w-lg overflow-y-auto">
          {selectedPost && (
            <>
              <SheetHeader>
                <SheetTitle>{t.postDetails}</SheetTitle>
                <SheetDescription>{t.postPreview}</SheetDescription>
              </SheetHeader>

              <div className="mt-6 space-y-6">
                {/* Post Title */}
                <div>
                  <h3 className="text-xl font-semibold">{selectedPost.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">/{selectedPost.slug}</p>
                </div>

                {/* Status Badge */}
                <Badge
                  variant="outline"
                  className={
                    selectedPost.is_published
                      ? 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20'
                      : 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20'
                  }
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full me-1.5 ${
                      selectedPost.is_published ? 'bg-green-500' : 'bg-yellow-500'
                    }`}
                  />
                  {selectedPost.is_published ? t.published : t.draft}
                </Badge>

                <Separator />

                {/* Metadata */}
                <div className="space-y-4">
                  {selectedPost.author && (
                    <div className="flex items-center gap-3">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">{t.author}</p>
                        <p className="font-medium">{selectedPost.author.name}</p>
                      </div>
                    </div>
                  )}

                  {selectedPost.category && (
                    <div className="flex items-center gap-3">
                      <Tag className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">{t.category}</p>
                        <p className="font-medium">{selectedPost.category.name}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">{t.readingTime}</p>
                      <p className="font-medium">{selectedPost.reading_time} {t.minutes}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Eye className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">{t.views}</p>
                      <p className="font-medium">{(selectedPost.view_count || 0).toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">{t.createdAt}</p>
                      <p className="font-medium">
                        {selectedPost.created_at
                          ? format(new Date(selectedPost.created_at), 'MMM d, yyyy')
                          : '-'}
                      </p>
                    </div>
                  </div>

                  {selectedPost.published_at && (
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">{t.publishedAt}</p>
                        <p className="font-medium">
                          {format(new Date(selectedPost.published_at), 'MMM d, yyyy')}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Tags */}
                <div>
                  <p className="text-sm font-medium mb-2">{t.tags}</p>
                  {selectedPost.tags && selectedPost.tags.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {selectedPost.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">{t.noTags}</p>
                  )}
                </div>

                <Separator />

                {/* Excerpt */}
                <div>
                  <p className="text-sm font-medium mb-2">{t.excerpt}</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedPost.excerpt || t.noExcerpt}
                  </p>
                </div>

                <Separator />

                {/* Actions */}
                <div className="flex flex-col gap-3">
                  <Button onClick={navigateToEdit}>
                    <Edit className="h-4 w-4 me-2" />
                    {t.edit}
                  </Button>
                  <Button variant="outline" asChild>
                    <Link
                      href={`/${locale}/blog/${selectedPost.slug}`}
                      target="_blank"
                    >
                      <ExternalLink className="h-4 w-4 me-2" />
                      {t.viewOnSite}
                    </Link>
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
