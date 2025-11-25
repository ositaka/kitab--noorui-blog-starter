import { notFound } from 'next/navigation'
import { getPostBySlug, getRelatedPosts, incrementPostViews } from '@/lib/supabase/api'
import type { Locale } from '@/lib/supabase/types'
import { PostPageClient } from './post-client'
import type { Metadata } from 'next'
import { MDXRemote } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import rehypePrettyCode from 'rehype-pretty-code'
import rehypeSlug from 'rehype-slug'
import type { Options as PrettyCodeOptions } from 'rehype-pretty-code'
import { Blockquote, PullQuote } from '@/components/mdx/blockquote'
import { Callout, InfoCallout, WarningCallout, ErrorCallout, SuccessCallout } from '@/components/mdx/callout'
import { Figure, ImageGrid } from '@/components/mdx/figure'
import { MediaEmbed, YouTube, Vimeo, UrlEmbed } from '@/components/mdx/media-embed'
import { CodeBlock } from '@/components/mdx/code-block'
import { WideBox } from '@/components/mdx/wide-box'

// Shiki syntax highlighting options
const prettyCodeOptions: PrettyCodeOptions = {
  theme: {
    dark: 'github-dark',
    light: 'github-light',
  },
  keepBackground: false,
  defaultLang: 'plaintext',
}

// MDX components for RSC rendering
const mdxComponents = {
  // Custom MDX components
  Blockquote,
  PullQuote,
  Callout,
  InfoCallout,
  WarningCallout,
  ErrorCallout,
  SuccessCallout,
  Figure,
  ImageGrid,
  MediaEmbed,
  YouTube,
  Vimeo,
  UrlEmbed,
  CodeBlock,
  WideBox,
  // HTML elements
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => <h1 className="text-4xl font-bold mt-12 mb-4 scroll-mt-24" {...props} />,
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => <h2 className="text-3xl font-bold mt-10 mb-4 scroll-mt-24" {...props} />,
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => <h3 className="text-2xl font-semibold mt-8 mb-3 scroll-mt-24" {...props} />,
  h4: (props: React.HTMLAttributes<HTMLHeadingElement>) => <h4 className="text-xl font-semibold mt-6 mb-2 scroll-mt-24" {...props} />,
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => <p className="my-4 leading-7" {...props} />,
  pre: (props: React.HTMLAttributes<HTMLPreElement>) => <pre {...props} />,
  code: (props: React.HTMLAttributes<HTMLElement>) => {
    const className = props.className || ''
    if (className.includes('language-')) return <code {...props} />
    return <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono" {...props} />
  },
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => <ul className="my-4 ps-6 list-disc" {...props} />,
  ol: (props: React.OlHTMLAttributes<HTMLOListElement>) => <ol className="my-4 ps-6 list-decimal" {...props} />,
  li: (props: React.LiHTMLAttributes<HTMLLIElement>) => <li className="my-1" {...props} />,
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => <a className="text-primary underline underline-offset-4 hover:text-primary/80" {...props} />,
  blockquote: (props: React.HTMLAttributes<HTMLQuoteElement>) => <blockquote className="border-s-4 border-primary/30 ps-4 my-6 italic text-muted-foreground" {...props} />,
  table: (props: React.HTMLAttributes<HTMLTableElement>) => <div className="my-6 w-full overflow-auto"><table className="w-full border-collapse border border-border" {...props} /></div>,
  thead: (props: React.HTMLAttributes<HTMLTableSectionElement>) => <thead className="bg-muted/50" {...props} />,
  tr: (props: React.HTMLAttributes<HTMLTableRowElement>) => <tr className="border-b border-border" {...props} />,
  td: (props: React.TdHTMLAttributes<HTMLTableCellElement>) => <td className="border border-border px-4 py-2 text-start" {...props} />,
  th: (props: React.ThHTMLAttributes<HTMLTableCellElement>) => <th className="border border-border px-4 py-2 font-semibold text-start" {...props} />,
  hr: () => <hr className="my-8 border-border" />,
}

interface Props {
  params: Promise<{ locale: string; slug: string }>
}

// Generate metadata for SEO and Open Graph
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: localeParam, slug } = await params
  const locale = localeParam as Locale

  const post = await getPostBySlug(slug, locale)

  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  const authorName = post.author?.name || 'Kitab'
  const categoryName = post.category?.name || 'Blog'
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const postUrl = `${baseUrl}/${locale}/blog/${slug}`

  // Build keywords from tags
  const keywords = post.tags || []

  // SEO fallback logic: use custom SEO fields if available, otherwise fallback to post data
  const metaTitle = post.meta_title || post.title
  const metaDescription = post.meta_description || post.excerpt || `Read ${post.title} on Kitab - A multilingual blog about RTL languages and typography.`
  const ogImage = post.og_image || post.featured_image
  const twitterCard = (post.twitter_card as 'summary' | 'summary_large_image' | 'app' | 'player') || 'summary_large_image'

  return {
    title: metaTitle,
    description: metaDescription,
    authors: [{ name: authorName }],
    keywords: [...keywords, 'RTL', 'Arabic', 'Urdu', 'typography', 'web development', categoryName],
    category: categoryName,
    alternates: {
      canonical: postUrl,
      languages: {
        'x-default': `${baseUrl}/en/blog/${slug}`, // Default language for unknown locales
        'en': `${baseUrl}/en/blog/${slug}`,
        'ar': `${baseUrl}/ar/blog/${slug}`,
        'fr': `${baseUrl}/fr/blog/${slug}`,
        'ur': `${baseUrl}/ur/blog/${slug}`,
      },
    },
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url: postUrl,
      siteName: 'Kitab',
      locale: locale === 'ar' ? 'ar_SA' : locale === 'ur' ? 'ur_PK' : locale === 'fr' ? 'fr_FR' : 'en_US',
      type: 'article',
      publishedTime: post.published_at || undefined,
      modifiedTime: post.updated_at || undefined,
      authors: [authorName],
      tags: keywords,
      images: ogImage ? [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: metaTitle,
        }
      ] : [],
    },
    twitter: {
      card: twitterCard,
      title: metaTitle,
      description: metaDescription,
      images: ogImage ? [ogImage] : [],
      creator: '@kitabblog',
      site: '@kitabblog',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}

export default async function PostPage({ params }: Props) {
  const { locale: localeParam, slug } = await params
  const locale = localeParam as Locale

  const post = await getPostBySlug(slug, locale)

  if (!post) {
    notFound()
  }

  // Increment view count (fire and forget - don't await to avoid blocking page render)
  incrementPostViews(post.id).catch(() => {
    // Silently ignore errors - view tracking is not critical
  })

  const relatedPosts = await getRelatedPosts(slug, post.category_id || '', locale, 3, post.tags || [])

  // JSON-LD structured data for SEO
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const authorName = post.author?.name || 'Kitab'
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt || '',
    image: post.featured_image || `${baseUrl}/og-default.jpg`,
    datePublished: post.published_at || post.created_at,
    dateModified: post.updated_at || post.created_at,
    author: {
      '@type': 'Person',
      name: authorName,
      url: `${baseUrl}/${locale}/about`,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Kitab',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${baseUrl}/${locale}/blog/${slug}`,
    },
    keywords: (post.tags || []).join(', '),
    articleSection: post.category?.name || 'Blog',
    inLanguage: locale === 'ar' ? 'ar-SA' : locale === 'ur' ? 'ur-PK' : locale === 'fr' ? 'fr-FR' : 'en-US',
    wordCount: post.content ? post.content.split(/\s+/).length : 0,
    timeRequired: `PT${post.reading_time || 5}M`,
  }

  // Render MDX content as a React Server Component
  const mdxContent = post.content ? (
    <MDXRemote
      source={post.content}
      components={mdxComponents}
      options={{
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          rehypePlugins: [
            rehypeSlug, // Add IDs to headings for ToC
            [rehypePrettyCode, prettyCodeOptions],
          ],
        },
      }}
    />
  ) : null

  return (
    <>
      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PostPageClient
        locale={locale}
        post={post}
        relatedPosts={relatedPosts}
        mdxContent={mdxContent}
      />
    </>
  )
}
