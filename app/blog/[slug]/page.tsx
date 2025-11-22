'use client'

import { use } from 'react'
import { notFound } from 'next/navigation'
import { SiteNav } from '@/components/site-nav'
import { SiteFooter } from '@/components/site-footer'
import { RelatedPosts } from '@/components/related-posts'
import { SocialShare } from '@/components/social-share'
import { ReadingProgress } from '@/components/reading-progress'
import { getPostBySlug, getAllPosts } from '@/lib/posts'
import { Badge, Separator } from 'noorui-rtl'
import { Clock, Eye, MessageSquare } from 'lucide-react'
import { format } from 'date-fns'
import { useDirection } from 'noorui-rtl'

export default function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const post = getPostBySlug(slug)
  const allPosts = getAllPosts()
  const { direction } = useDirection()
  const isRTL = direction === 'rtl'

  if (!post) {
    notFound()
  }

  const postUrl = typeof window !== 'undefined' ? window.location.href : ''

  return (
    <div className="min-h-screen flex flex-col">
      <ReadingProgress />
      <SiteNav />

      <main className="flex-1">
        <article className="container mx-auto px-4 py-12 max-w-4xl">
          <div className="mb-8">
            <Badge className="mb-4">{isRTL ? post.categoryAr : post.category}</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {isRTL ? post.titleAr : post.title}
            </h1>
            <p className="text-xl text-muted-foreground">
              {isRTL ? post.excerptAr : post.excerpt}
            </p>
          </div>

          <div className="flex items-center gap-6 text-sm text-muted-foreground mb-6">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{post.readingTime} min read</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              <span>{post.views} views</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              <span>{post.comments} comments</span>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-8">
            <span className="font-medium">{isRTL ? post.authorAr : post.author}</span>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground">
              {format(new Date(post.publishedAt), 'MMMM dd, yyyy')}
            </span>
          </div>

          <Separator className="mb-8" />

          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p>{isRTL ? post.contentAr : post.content}</p>

            <h2>Introduction</h2>
            <p>
              This is a placeholder for the full article content. In a real application,
              you would render the full markdown or rich text content here.
            </p>

            <h2>Key Points</h2>
            <ul>
              <li>First important point about the topic</li>
              <li>Second crucial insight to remember</li>
              <li>Third takeaway for your implementation</li>
            </ul>

            <h2>Conclusion</h2>
            <p>
              Wrapping up the article with final thoughts and next steps for readers
              to take action on what they've learned.
            </p>
          </div>

          <Separator className="my-8" />

          <SocialShare title={isRTL ? post.titleAr : post.title} url={postUrl} />

          <RelatedPosts currentPost={post} allPosts={allPosts} />
        </article>
      </main>

      <SiteFooter />
    </div>
  )
}
