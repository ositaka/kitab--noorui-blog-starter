'use client'

import { SiteNav } from '@/components/site-nav'
import { SiteFooter } from '@/components/site-footer'
import { FeaturedPost } from '@/components/featured-post'
import { BlogCard } from '@/components/blog-card'
import { getAllPosts, getFeaturedPost } from '@/lib/posts'

export default function HomePage() {
  const featuredPost = getFeaturedPost()
  const allPosts = getAllPosts().filter((post) => !post.featured).slice(0, 6)

  return (
    <div className="min-h-screen flex flex-col">
      <SiteNav />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-12">
          {featuredPost && (
            <div className="mb-16">
              <FeaturedPost post={featuredPost} />
            </div>
          )}

          <div className="mb-8">
            <h2 className="text-3xl font-bold">Latest Posts</h2>
            <p className="text-muted-foreground mt-2">
              Explore our latest articles and tutorials
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
