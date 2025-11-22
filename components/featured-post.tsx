'use client'

import Link from 'next/link'
import { Badge, Button } from 'noorui-rtl'
import { Clock, Eye, MessageSquare, ArrowRight } from 'lucide-react'
import { format } from 'date-fns'
import type { Post } from '@/lib/posts'
import { useDirection } from 'noorui-rtl'

interface FeaturedPostProps {
  post: Post
}

export function FeaturedPost({ post }: FeaturedPostProps) {
  const { direction } = useDirection()
  const isRTL = direction === 'rtl'

  return (
    <div className="relative overflow-hidden rounded-lg border bg-card p-8 md:p-12">
      <div className="max-w-3xl">
        <Badge className="mb-4">{isRTL ? post.categoryAr : post.category}</Badge>

        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          {isRTL ? post.titleAr : post.title}
        </h1>

        <p className="text-xl text-muted-foreground mb-6">
          {isRTL ? post.excerptAr : post.excerpt}
        </p>

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

        <Link href={`/blog/${post.slug}`}>
          <Button size="lg">
            Read Article
            <ArrowRight className="ms-2 h-4 w-4" />
          </Button>
        </Link>
      </div>

      <div className="absolute top-0 end-0 w-1/2 h-full bg-gradient-to-l from-primary/10 to-transparent -z-10 hidden md:block" />
    </div>
  )
}
