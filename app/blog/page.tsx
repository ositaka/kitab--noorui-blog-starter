'use client'

import { SiteNav } from '@/components/site-nav'
import { SiteFooter } from '@/components/site-footer'
import { BlogCard } from '@/components/blog-card'
import { getAllPosts, getAllCategories } from '@/lib/posts'
import { Badge } from 'noorui-rtl'
import Link from 'next/link'

export default function BlogPage() {
  const allPosts = getAllPosts()
  const categories = getAllCategories()

  return (
    <div className="min-h-screen flex flex-col">
      <SiteNav />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-12">
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-4">All Posts</h1>
            <p className="text-muted-foreground text-lg">
              Browse all articles and tutorials
            </p>
          </div>

          <div className="mb-8">
            <h3 className="text-sm font-semibold mb-3">Filter by category:</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Link key={category} href={`/category/${category.toLowerCase()}`}>
                  <Badge variant="outline" className="hover:bg-primary hover:text-primary-foreground cursor-pointer">
                    {category}
                  </Badge>
                </Link>
              ))}
            </div>
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
