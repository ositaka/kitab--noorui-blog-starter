import { notFound } from 'next/navigation'
import { getPostBySlug, getRelatedPosts } from '@/lib/supabase/api'
import { serializeMDX } from '@/lib/mdx'
import type { Locale } from '@/lib/supabase/types'
import { PostPageClient } from './post-client'

interface Props {
  params: Promise<{ locale: string; slug: string }>
}

export default async function PostPage({ params }: Props) {
  const { locale: localeParam, slug } = await params
  const locale = localeParam as Locale

  const post = await getPostBySlug(slug, locale)

  if (!post) {
    notFound()
  }

  const relatedPosts = await getRelatedPosts(slug, post.category_id || '', locale, 3)

  // Serialize MDX content on the server
  const mdxSource = post.content
    ? await serializeMDX(post.content)
    : null

  return (
    <PostPageClient
      locale={locale}
      post={post}
      relatedPosts={relatedPosts}
      mdxSource={mdxSource}
    />
  )
}
