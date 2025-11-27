import { Metadata } from 'next'
import { getAllCommentsAdmin } from '@/lib/supabase/comments'
import { CommentsContent } from './comments-content'
import type { Locale } from '@/lib/supabase/types'

export const metadata: Metadata = {
  title: 'Comments Management',
  description: 'Manage all comments on your blog',
}

interface PageProps {
  params: Promise<{
    locale: Locale
  }>
  searchParams: Promise<{
    page?: string
    status?: 'all' | 'active' | 'deleted' | 'pinned'
    search?: string
    sort?: 'newest' | 'oldest'
  }>
}

export default async function CommentsPage({ params, searchParams }: PageProps) {
  const { locale } = await params
  const {
    page = '1',
    status = 'active',
    search = '',
    sort = 'newest',
  } = await searchParams

  const currentPage = parseInt(page, 10)
  const limit = 20
  const offset = (currentPage - 1) * limit

  // Fetch comments with filters
  const { comments, total } = await getAllCommentsAdmin({
    limit,
    offset,
    status,
    searchQuery: search,
    sortBy: sort,
  })

  const totalPages = Math.ceil(total / limit)

  return (
    <CommentsContent
      locale={locale}
      comments={comments}
      total={total}
      currentPage={currentPage}
      totalPages={totalPages}
      currentStatus={status}
      currentSearch={search}
      currentSort={sort}
    />
  )
}
