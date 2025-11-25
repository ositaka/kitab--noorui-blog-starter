import { MetadataRoute } from 'next'
import { getPosts } from '@/lib/supabase/api'
import type { Locale, PostWithRelations } from '@/lib/supabase/types'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
const locales: Locale[] = ['en', 'ar', 'fr', 'ur']

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const sitemap: MetadataRoute.Sitemap = []

  // Add homepage for each locale
  for (const locale of locales) {
    sitemap.push({
      url: `${baseUrl}/${locale}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
      alternates: {
        languages: {
          'en': `${baseUrl}/en`,
          'ar': `${baseUrl}/ar`,
          'fr': `${baseUrl}/fr`,
          'ur': `${baseUrl}/ur`,
        },
      },
    })
  }

  // Add blog listing page for each locale
  for (const locale of locales) {
    sitemap.push({
      url: `${baseUrl}/${locale}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
      alternates: {
        languages: {
          'en': `${baseUrl}/en/blog`,
          'ar': `${baseUrl}/ar/blog`,
          'fr': `${baseUrl}/fr/blog`,
          'ur': `${baseUrl}/ur/blog`,
        },
      },
    })
  }

  // Add about page for each locale
  for (const locale of locales) {
    sitemap.push({
      url: `${baseUrl}/${locale}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
      alternates: {
        languages: {
          'en': `${baseUrl}/en/about`,
          'ar': `${baseUrl}/ar/about`,
          'fr': `${baseUrl}/fr/about`,
          'ur': `${baseUrl}/ur/about`,
        },
      },
    })
  }

  // Add all blog posts for each locale
  for (const locale of locales) {
    try {
      const posts = await getPosts({ locale, limit: 1000 }) as PostWithRelations[]

      for (const post of posts) {
        const lastMod = post.updated_at || post.published_at || post.created_at || new Date().toISOString()

        sitemap.push({
          url: `${baseUrl}/${locale}/blog/${post.slug}`,
          lastModified: new Date(lastMod),
          changeFrequency: 'weekly',
          priority: 0.8,
          alternates: {
            languages: {
              'en': `${baseUrl}/en/blog/${post.slug}`,
              'ar': `${baseUrl}/ar/blog/${post.slug}`,
              'fr': `${baseUrl}/fr/blog/${post.slug}`,
              'ur': `${baseUrl}/ur/blog/${post.slug}`,
            },
          },
        })
      }
    } catch (error) {
      console.error(`Error fetching posts for locale ${locale}:`, error)
    }
  }

  return sitemap
}
