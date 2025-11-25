import { getPosts } from '@/lib/supabase/api'
import type { Locale } from '@/lib/supabase/types'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

const siteInfo: Record<Locale, { title: string; description: string; language: string }> = {
  en: {
    title: 'Kitab - RTL & Arabic Typography Blog',
    description: 'Explore articles about RTL/LTR writing systems, typography, and cultural context',
    language: 'en-US',
  },
  fr: {
    title: 'Kitab - Blog sur la Typographie RTL et Arabe',
    description: 'Explorez les articles sur les systemes RTL/LTR, la typographie et le contexte culturel',
    language: 'fr-FR',
  },
  ar: {
    title: 'كتاب - مدونة الطباعة العربية وأنظمة الكتابة',
    description: 'استكشف المقالات حول أنظمة الكتابة RTL/LTR والطباعة والسياق الثقافي',
    language: 'ar-SA',
  },
  ur: {
    title: 'کتاب - RTL اور عربی ٹائپوگرافی بلاگ',
    description: 'RTL/LTR تحریری نظاموں، ٹائپوگرافی اور ثقافتی سیاق کے بارے میں مضامین دیکھیں',
    language: 'ur-PK',
  },
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ locale: string }> }
) {
  const { locale: localeParam } = await params
  const locale = localeParam as Locale

  const info = siteInfo[locale]
  const posts = await getPosts({ locale, limit: 50 }) as any[]

  // Generate alternate feed links for other locales
  const locales: Locale[] = ['en', 'fr', 'ar', 'ur']
  const alternateFeeds = locales
    .filter(l => l !== locale)
    .map(l => {
      const altInfo = siteInfo[l]
      return `<atom:link href="${siteUrl}/${l}/rss.xml" rel="alternate" hreflang="${altInfo.language}" type="application/rss+xml" title="${escapeXml(altInfo.title)}" />`
    })
    .join('\n    ')

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
     xmlns:atom="http://www.w3.org/2005/Atom"
     xmlns:content="http://purl.org/rss/1.0/modules/content/"
     xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${escapeXml(info.title)}</title>
    <link>${siteUrl}/${locale}</link>
    <description>${escapeXml(info.description)}</description>
    <language>${info.language}</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/${locale}/rss.xml" rel="self" type="application/rss+xml" />
    ${alternateFeeds}
    <generator>Next.js</generator>
    ${posts
      .map((post) => {
        const postUrl = `${siteUrl}/${locale}/blog/${post.slug}`
        const pubDate = post.published_at || post.created_at
        const authorName = post.author?.name || 'Kitab'
        const categoryName = post.category?.name || ''

        return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <description>${escapeXml(post.excerpt || '')}</description>
      <content:encoded><![CDATA[${post.content || post.excerpt || ''}]]></content:encoded>
      <pubDate>${new Date(pubDate).toUTCString()}</pubDate>
      <dc:creator>${escapeXml(authorName)}</dc:creator>
      ${categoryName ? `<category>${escapeXml(categoryName)}</category>` : ''}
      ${post.featured_image ? `<enclosure url="${post.featured_image}" type="image/jpeg" />` : ''}
      ${(post.tags || []).map((tag: string) => `<category>${escapeXml(tag)}</category>`).join('\n      ')}
    </item>`
      })
      .join('')}
  </channel>
</rss>`

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
    },
  })
}
