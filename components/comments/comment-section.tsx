'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from 'noorui-rtl'
import { Separator } from 'noorui-rtl'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'noorui-rtl'
import { MessageSquare } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getComments } from '@/lib/supabase/comments'
import type { CommentWithReactions } from '@/lib/supabase/comments'
import { CommentForm } from './comment-form'
import { Comment } from './comment'
import { SkeletonCard } from '@/components/ui/skeleton'

export interface CommentSectionProps {
  postId: string
  postAuthorId?: string
  locale: 'en' | 'ar' | 'fr' | 'ur'
  currentUser?: {
    id: string
    name: string
    avatar?: string
    email: string
  }
  sortBy?: 'newest' | 'oldest' | 'most-reactions'
  allowReplies?: boolean
  maxDepth?: number
  enableReactions?: boolean
  className?: string
}

/**
 * Main comment section container
 *
 * Features:
 * - Fetches and displays comments
 * - Sorting options (newest, oldest, most reactions)
 * - Comment form for authenticated users
 * - Loading states
 * - Empty states
 * - Pagination (load more)
 *
 * @example
 * <CommentSection
 *   postId="abc123"
 *   locale="en"
 *   currentUser={user}
 *   sortBy="newest"
 *   maxDepth={3}
 * />
 */
export function CommentSection({
  postId,
  postAuthorId,
  locale,
  currentUser,
  sortBy: initialSortBy = 'newest',
  allowReplies = true,
  maxDepth = 3,
  enableReactions = true,
  className,
}: CommentSectionProps) {
  const router = useRouter()
  const [comments, setComments] = React.useState<CommentWithReactions[]>([])
  const [totalComments, setTotalComments] = React.useState(0)
  const [isLoading, setIsLoading] = React.useState(true)
  const [sortBy, setSortBy] = React.useState(initialSortBy)
  const [limit, setLimit] = React.useState(20)

  // Fetch comments
  const fetchComments = React.useCallback(async () => {
    setIsLoading(true)

    try {
      const result = await getComments(postId, {
        sortBy,
        limit,
        offset: 0,
      })

      setComments(result.comments)
      setTotalComments(result.total)
    } catch (error) {
      console.error('Error fetching comments:', error)
    } finally {
      setIsLoading(false)
    }
  }, [postId, sortBy, limit])

  // Fetch on mount and when dependencies change
  React.useEffect(() => {
    fetchComments()
  }, [fetchComments])

  // Handle load more
  const handleLoadMore = () => {
    setLimit((prev) => prev + 20)
  }

  // Handle sort change
  const handleSortChange = (value: string) => {
    setSortBy(value as typeof sortBy)
  }

  // Handle comment submission
  const handleCommentSubmit = () => {
    router.refresh() // Refresh to show new comment
  }

  // Determine text direction
  const dir = locale === 'ar' || locale === 'ur' ? 'rtl' : 'ltr'

  // Get translations
  const t = getTranslations(locale)

  return (
    <div className={cn('space-y-6', className)} dir={dir}>
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          <h2 className="text-2xl font-bold">
            {t.comments} ({totalComments})
          </h2>
        </div>

        {/* Sort Select */}
        {!isLoading && totalComments > 0 && (
          <Select value={sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">{t.sortNewest}</SelectItem>
              <SelectItem value="oldest">{t.sortOldest}</SelectItem>
              <SelectItem value="most-reactions">{t.sortMostReactions}</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>

      <Separator />

      {/* Comment Form (if authenticated) */}
      {currentUser && (
        <CommentForm
          postId={postId}
          locale={locale}
          user={currentUser}
          placeholder={t.placeholder}
          onSubmit={handleCommentSubmit}
        />
      )}

      {/* Comments List */}
      {isLoading ? (
        // Loading State
        <div className="space-y-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : comments.length === 0 ? (
        // Empty State
        <div className="text-center py-12">
          <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-lg font-medium text-muted-foreground mb-2">
            {t.noComments}
          </p>
          <p className="text-sm text-muted-foreground">
            {currentUser ? t.beFirst : t.signInToComment}
          </p>
        </div>
      ) : (
        // Comments
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id}>
              <Comment
                comment={comment}
                locale={locale}
                currentUser={currentUser}
                postAuthorId={postAuthorId}
                depth={0}
                maxDepth={maxDepth}
              />
            </div>
          ))}

          {/* Load More */}
          {comments.length < totalComments && (
            <div className="flex justify-center pt-6">
              <Button
                variant="outline"
                onClick={handleLoadMore}
                disabled={isLoading}
              >
                {t.loadMore}
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Sign in prompt for guests */}
      {!currentUser && (
        <div className="text-center py-6 border-t">
          <p className="text-sm text-muted-foreground">
            {t.signInToComment}
          </p>
        </div>
      )}
    </div>
  )
}

// Translations
function getTranslations(locale: 'en' | 'ar' | 'fr' | 'ur') {
  const translations = {
    en: {
      comments: 'Comments',
      sortNewest: 'Newest first',
      sortOldest: 'Oldest first',
      sortMostReactions: 'Most reactions',
      placeholder: 'Share your thoughts...',
      noComments: 'No comments yet',
      beFirst: 'Be the first to comment!',
      signInToComment: 'Sign in to join the conversation',
      loadMore: 'Load more comments',
    },
    ar: {
      comments: 'التعليقات',
      sortNewest: 'الأحدث أولاً',
      sortOldest: 'الأقدم أولاً',
      sortMostReactions: 'الأكثر تفاعلاً',
      placeholder: 'شارك أفكارك...',
      noComments: 'لا توجد تعليقات بعد',
      beFirst: 'كن أول من يعلق!',
      signInToComment: 'سجل الدخول للانضمام إلى المحادثة',
      loadMore: 'تحميل المزيد من التعليقات',
    },
    fr: {
      comments: 'Commentaires',
      sortNewest: 'Plus récent',
      sortOldest: 'Plus ancien',
      sortMostReactions: 'Plus de réactions',
      placeholder: 'Partagez vos pensées...',
      noComments: 'Aucun commentaire pour le moment',
      beFirst: 'Soyez le premier à commenter!',
      signInToComment: 'Connectez-vous pour rejoindre la conversation',
      loadMore: 'Charger plus de commentaires',
    },
    ur: {
      comments: 'تبصرے',
      sortNewest: 'نیا پہلے',
      sortOldest: 'پرانا پہلے',
      sortMostReactions: 'سب سے زیادہ ردعمل',
      placeholder: 'اپنے خیالات شیئر کریں...',
      noComments: 'ابھی تک کوئی تبصرہ نہیں',
      beFirst: 'تبصرہ کرنے والے پہلے بنیں!',
      signInToComment: 'بات چیت میں شامل ہونے کے لیے سائن ان کریں',
      loadMore: 'مزید تبصرے لوڈ کریں',
    },
  }

  return translations[locale]
}
