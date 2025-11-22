'use client'

import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Badge } from 'noorui-rtl'
import { Clock, Eye, MessageSquare } from 'lucide-react'
import { format } from 'date-fns'
import type { Post } from '@/lib/posts'
import { useDirection } from 'noorui-rtl'

interface BlogCardProps {
  post: Post
}

export function BlogCard({ post }: BlogCardProps) {
  const { direction } = useDirection()
  const isRTL = direction === 'rtl'

  return (
    <Link href={`/blog/${post.slug}`}>
      <Card className="h-full hover:border-primary transition-colors">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary">{isRTL ? post.categoryAr : post.category}</Badge>
          </div>
          <CardTitle className="line-clamp-2">
            {isRTL ? post.titleAr : post.title}
          </CardTitle>
          <CardDescription className="line-clamp-3">
            {isRTL ? post.excerptAr : post.excerpt}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{post.readingTime} min</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              <span>{post.views}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageSquare className="h-4 w-4" />
              <span>{post.comments}</span>
            </div>
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            <span>{isRTL ? post.authorAr : post.author}</span>
            <span className="mx-2">•</span>
            <span>{format(new Date(post.publishedAt), 'MMM dd, yyyy')}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
