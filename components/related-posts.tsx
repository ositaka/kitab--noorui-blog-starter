'use client'

import { BlogCard } from './blog-card'
import type { Post } from '@/lib/posts'
import { useDirection } from 'noorui-rtl'

interface RelatedPostsProps {
  currentPost: Post
  allPosts: Post[]
  maxPosts?: number
}

export function RelatedPosts({ currentPost, allPosts, maxPosts = 3 }: RelatedPostsProps) {
  const { direction } = useDirection()
  const isRTL = direction === 'rtl'

  // Find related posts based on category
  const relatedPosts = allPosts
    .filter(post =>
      post.id !== currentPost.id &&
      post.category === currentPost.category
    )
    .slice(0, maxPosts)

  if (relatedPosts.length === 0) {
    return null
  }

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold mb-6">
        {isRTL ? 'منشورات ذات صلة' : 'Related Posts'}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {relatedPosts.map((post) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  )
}
