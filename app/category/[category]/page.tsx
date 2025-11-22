'use client'

import { use } from 'react'
import { SiteNav } from '@/components/site-nav'
import { SiteFooter } from '@/components/site-footer'
import { BlogCard } from '@/components/blog-card'
import { getPostsByCategory } from '@/lib/posts'

export default function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = use(params)
  const categoryName = category.charAt(0).toUpperCase() + category.slice(1)
  const posts = getPostsByCategory(categoryName)

  return (
    <div className="min-h-screen flex flex-col">
      <SiteNav />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-12">
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-4">{categoryName}</h1>
            <p className="text-muted-foreground text-lg">
              {posts.length} {posts.length === 1 ? 'post' : 'posts'} in this category
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>

          {posts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No posts found in this category.</p>
            </div>
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
