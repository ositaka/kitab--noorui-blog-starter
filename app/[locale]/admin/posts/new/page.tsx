import type { Locale } from '@/lib/supabase/types'
import { getAllAuthors, getAllCategories } from '@/lib/supabase/admin-api'
import { NewPostContent } from './new-post-content'

interface NewPostPageProps {
  params: Promise<{ locale: Locale }>
}

/**
 * New Post Page - Create a new blog post
 */
export default async function NewPostPage({ params }: NewPostPageProps) {
  const { locale } = await params

  const [authors, categories] = await Promise.all([
    getAllAuthors(locale),
    getAllCategories(locale),
  ])

  return (
    <NewPostContent
      locale={locale}
      authors={authors}
      categories={categories}
    />
  )
}
