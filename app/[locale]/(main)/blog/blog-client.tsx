'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
  Badge,
  Avatar,
  AvatarImage,
  AvatarFallback,
  EmptyState,
} from 'noorui-rtl'
import { FileText } from 'lucide-react'
import type { Locale, PostWithRelations, CategoryLocalized } from '@/lib/supabase/types'
import { PaginationWrapper } from '@/components/ui/pagination-wrapper'

interface BlogPageClientProps {
  locale: Locale
  posts: PostWithRelations[]
  categories: CategoryLocalized[]
  currentPage: number
  totalPosts: number
  postsPerPage: number
}

const pageText: Record<Locale, { title: string; subtitle: string; all: string; empty: string; minRead: string }> = {
  en: {
    title: 'Blog',
    subtitle: 'Explore articles about RTL/LTR writing systems, typography, and cultural context',
    all: 'All',
    empty: 'No articles found',
    minRead: 'min read',
  },
  fr: {
    title: 'Blog',
    subtitle: 'Explorez les articles sur les systemes RTL/LTR, la typographie et le contexte culturel',
    all: 'Tout',
    empty: 'Aucun article trouve',
    minRead: 'min de lecture',
  },
  ar: {
    title: 'المدونة',
    subtitle: 'استكشف المقالات حول أنظمة الكتابة RTL/LTR والطباعة والسياق الثقافي',
    all: 'الكل',
    empty: 'لم يتم العثور على مقالات',
    minRead: 'دقيقة للقراءة',
  },
  ur: {
    title: 'بلاگ',
    subtitle: 'RTL/LTR تحریری نظاموں، ٹائپوگرافی اور ثقافتی سیاق کے بارے میں مضامین دیکھیں',
    all: 'سب',
    empty: 'کوئی مضمون نہیں ملا',
    minRead: 'منٹ پڑھنے کا وقت',
  },
}

export function BlogPageClient({ locale, posts, categories, currentPage, totalPosts, postsPerPage }: BlogPageClientProps) {
  const text = pageText[locale]
  const isRTL = locale === 'ar' || locale === 'ur'
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentCategory = searchParams.get('category')

  // Calculate total pages
  const totalPages = Math.ceil(totalPosts / postsPerPage)

  // Handle page change
  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', page.toString())
    router.push(`/${locale}/blog?${params.toString()}`)
  }

  // Handle category change
  const handleCategoryChange = (categoryId: string) => {
    const params = new URLSearchParams()
    if (categoryId !== 'all') {
      params.set('category', categoryId)
    }
    params.set('page', '1') // Reset to page 1 when changing category
    router.push(`/${locale}/blog?${params.toString()}`)
  }

  // Extract unique tags with counts (for sidebar)
  const tagCounts = new Map<string, number>()
  posts.forEach((post) => {
    post.tags?.forEach((tag) => {
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1)
    })
  })
  const tags = Array.from(tagCounts.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 20)

  return (
    <div className="container mx-auto max-w-6xl py-12 px-4">
      {/* Page Header */}
      <header className="mb-12">
        <h1 className="text-4xl font-bold mb-4">{text.title}</h1>
        <p className="text-xl text-muted-foreground">{text.subtitle}</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3">
          <Tabs value={currentCategory || 'all'} onValueChange={handleCategoryChange} dir={isRTL ? 'rtl' : 'ltr'}>
            <TabsList className="mb-8 flex-wrap">
              <TabsTrigger value="all">{text.all}</TabsTrigger>
              {categories.map((category) => (
                <TabsTrigger key={category.id} value={category.id}>
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value={currentCategory || 'all'}>
              {posts.length === 0 ? (
                <EmptyState
                  icon={<FileText className="h-12 w-12" />}
                  title={text.empty}
                />
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {posts.map((post) => (
                      <PostCard key={post.id} post={post} locale={locale} text={text} />
                    ))}
                  </div>

                  {/* Pagination */}
                  <PaginationWrapper
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    dir={isRTL ? 'rtl' : 'ltr'}
                  />
                </>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar - Tags */}
        <aside className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {tags.map(({ tag, count }) => (
                  <Link key={tag} href={'/' + locale + '/blog?tag=' + encodeURIComponent(tag)}>
                    <Badge variant="secondary" className="cursor-pointer hover:bg-primary/20">
                      {tag} ({count})
                    </Badge>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  )
}

interface PostCardProps {
  post: PostWithRelations
  locale: Locale
  text: { minRead: string }
}

function PostCard({ post, locale, text }: PostCardProps) {
  const authorName = post.author?.name || ''
  const categoryName = post.category?.name || ''
  const categoryColor = post.category?.color || '#6366f1'
  const authorAvatar = post.author?.avatar_url

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <Link href={'/' + locale + '/blog/' + post.slug}>
        {post.featured_image && (
          <div className="relative h-48 w-full">
            <Image
              src={post.featured_image}
              alt={post.title}
              fill
              className="object-cover"
            />
          </div>
        )}
        <CardHeader>
          {categoryName && (
            <Badge
              variant="secondary"
              className="w-fit mb-2"
              style={{ backgroundColor: categoryColor + '20', color: categoryColor }}
            >
              {categoryName}
            </Badge>
          )}
          <CardTitle className="line-clamp-2">{post.title}</CardTitle>
          <CardDescription className="line-clamp-2">
            {post.excerpt}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              {authorAvatar && <AvatarImage src={authorAvatar} alt={authorName} />}
              <AvatarFallback>{authorName.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{authorName}</p>
              <p className="text-xs text-muted-foreground">
                {post.reading_time} {text.minRead}
              </p>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  )
}
