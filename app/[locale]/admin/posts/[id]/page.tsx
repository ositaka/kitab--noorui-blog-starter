import type { Locale } from '@/lib/supabase/types'
import { notFound } from 'next/navigation'
import {
  getAllAuthors,
  getAllCategories,
  getPostWithTranslations,
} from '@/lib/supabase/admin-api'
import { EditPostContent } from './edit-post-content'

interface EditPostPageProps {
  params: Promise<{ locale: Locale; id: string }>
}

/**
 * Edit Post Page - Edit an existing blog post
 */
export default async function EditPostPage({ params }: EditPostPageProps) {
  const { locale, id } = await params

  const [{ post, translations }, authors, categories] = await Promise.all([
    getPostWithTranslations(id),
    getAllAuthors(locale),
    getAllCategories(locale),
  ])

  if (!post) {
    notFound()
  }

  return (
    <EditPostContent
      locale={locale}
      post={post}
      translations={translations}
      authors={authors}
      categories={categories}
    />
  )
}
