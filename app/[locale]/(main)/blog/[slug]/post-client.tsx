'use client'

import Link from 'next/link'
import Image from 'next/image'
import { formatDate } from '@/lib/utils'
import type { ReactNode } from 'react'
import { useState, useEffect } from 'react'
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  Badge,
  Avatar,
  AvatarImage,
  AvatarFallback,
  Separator,
  Button,
  ButtonArrow,
} from 'noorui-rtl'
import { Clock, Eye } from 'lucide-react'
import type { Locale, PostWithRelations } from '@/lib/supabase/types'
import { TableOfContents } from '@/components/blog/table-of-contents'
import { ShareButtons } from '@/components/social-share-buttons'
import { CommentSection } from '@/components/comments'

interface PostPageClientProps {
  locale: Locale
  post: PostWithRelations
  relatedPosts: PostWithRelations[]
  mdxContent: ReactNode | null
  currentUser?: {
    id: string
    name: string
    email: string
    avatar?: string
  }
}

const pageText: Record<Locale, { home: string; blog: string; related: string; back: string; min: string; share: string }> = {
  en: { home: 'Home', blog: 'Blog', related: 'Related Articles', back: 'Back to Blog', min: 'min read', share: 'Share' },
  fr: { home: 'Accueil', blog: 'Blog', related: 'Articles connexes', back: 'Retour au blog', min: 'min de lecture', share: 'Partager' },
  ar: { home: 'الرئيسية', blog: 'المدونة', related: 'مقالات ذات صلة', back: 'العودة للمدونة', min: 'دقيقة للقراءة', share: 'مشاركة' },
  ur: { home: 'ہوم', blog: 'بلاگ', related: 'متعلقہ مضامین', back: 'بلاگ پر واپس', min: 'منٹ پڑھنے کا وقت', share: 'شیئر کریں' },
}

export function PostPageClient({ locale, post, relatedPosts, mdxContent, currentUser }: PostPageClientProps) {
  const text = pageText[locale]
  const isRTL = locale === 'ar' || locale === 'ur'
  const [mounted, setMounted] = useState(false)

  const authorName = post.author?.name || 'Unknown'
  const authorBio = post.author?.bio || ''
  const categoryName = post.category?.name || ''
  const categoryColor = post.category?.color || '#6366f1'
  const authorAvatar = post.author?.avatar_url
  const authorInitials = authorName.slice(0, 2).toUpperCase()

  // Prevent hydration mismatch for date formatting
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="container mx-auto max-w-6xl py-8 px-4">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-8">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href={'/' + locale}>{text.home}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={'/' + locale + '/blog'}>{text.blog}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="max-w-[200px] truncate">{post.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Article */}
        <article className="lg:col-span-3">
          {/* Header */}
          <header className="mb-8">
            {categoryName && (
              <Badge
                variant="outline"
                className="mb-4"
                style={{ borderColor: categoryColor, color: categoryColor }}
              >
                {categoryName}
              </Badge>
            )}

            <h1 className="text-4xl md:text-5xl font-bold mb-4">{post.title}</h1>

            {post.excerpt && (
              <p className="text-xl text-muted-foreground mb-6">{post.excerpt}</p>
            )}

            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {post.reading_time} {text.min}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                {post.view_count}
              </span>
              <span suppressHydrationWarning>
                {mounted && post.published_at && formatDate(post.published_at, locale, { format: 'medium' })}
              </span>
            </div>

            {/* Featured Image */}
            {post.featured_image && (
              <div className="relative h-64 md:h-96 w-full mb-8 rounded-lg overflow-hidden">
                <Image
                  src={post.featured_image}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            {/* Author */}
            <Card>
              <CardContent className="flex items-center gap-4 p-4">
                <Avatar className="h-12 w-12">
                  {authorAvatar && <AvatarImage src={authorAvatar} alt={authorName} />}
                  <AvatarFallback>{authorInitials}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{authorName}</p>
                  <p className="text-sm text-muted-foreground line-clamp-1">{authorBio}</p>
                </div>
              </CardContent>
            </Card>
          </header>

          <Separator className="my-8" />

          {/* Content */}
          <div className="prose prose-lg dark:prose-invert max-w-none">
            {mdxContent ? (
              mdxContent
            ) : post.content ? (
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            ) : (
              <p>{post.excerpt}</p>
            )}
          </div>

          <Separator className="my-8" />

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {post.tags.map((tag) => (
                <Link key={tag} href={'/' + locale + '/blog?tag=' + encodeURIComponent(tag)}>
                  <Badge variant="secondary">{tag}</Badge>
                </Link>
              ))}
            </div>
          )}

          {/* Share Buttons */}
          <div className="mb-8">
            <ShareButtons
              url={typeof window !== 'undefined' ? window.location.href : ''}
              title={post.title}
              description={post.excerpt || post.title}
              locale={locale}
            />
          </div>

          {/* Back Button */}
          <div className="flex items-center">
            <ButtonArrow variant="outline" direction="back" icon="arrow" asChild>
              <Link href={'/' + locale + '/blog'}>
                {text.back}
              </Link>
            </ButtonArrow>
          </div>

          {/* Comment Section */}
          <div className="mt-12">
            <CommentSection
              postId={post.id}
              postAuthorId={post.author_id || undefined}
              locale={locale}
              currentUser={currentUser}
              sortBy="newest"
              maxDepth={3}
              enableReactions={true}
            />
          </div>
        </article>

        {/* Sidebar - Sticky */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-6">
            {/* Table of Contents */}
            <TableOfContents
              contentSelector=".prose"
              title={isRTL ? 'جدول المحتويات' : 'On this page'}
            />

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">{text.related}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {relatedPosts.map((relatedPost) => (
                    <Link
                      key={relatedPost.id}
                      href={'/' + locale + '/blog/' + relatedPost.slug}
                      className="block hover:text-primary transition-colors"
                    >
                      <p className="font-medium line-clamp-2">{relatedPost.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {relatedPost.reading_time} {text.min}
                      </p>
                    </Link>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </aside>
      </div>
    </div>
  )
}
