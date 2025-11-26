'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Avatar, AvatarImage, AvatarFallback } from 'noorui-rtl'
import { Button } from 'noorui-rtl'
import { Card } from 'noorui-rtl'
import { Separator } from 'noorui-rtl'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from 'noorui-rtl'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from 'noorui-rtl'
import { MoreVertical, Pin, Flag, Trash2, Edit2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ReactionPicker, type Reaction } from '@/components/ui/reaction-picker'
import { UserBadge } from '@/components/ui/user-badge'
import { ContentRenderer } from '@/components/ui/content-renderer'
import { useRelativeTime } from '@/lib/hooks/use-relative-time'
import { toggleReaction, deleteComment, togglePinComment, updateComment } from '@/lib/supabase/comments'
import type { CommentWithReactions } from '@/lib/supabase/comments'
import { toast } from 'sonner'
import { CommentForm } from './comment-form'
import { CommentThread } from './comment-thread'

export interface CommentProps {
  comment: CommentWithReactions
  locale: 'en' | 'ar' | 'fr' | 'ur'
  currentUser?: {
    id: string
    name: string
    avatar?: string
    email: string
  }
  postAuthorId?: string
  depth?: number
  maxDepth?: number
  onReply?: (commentId: string) => void
  onEdit?: (commentId: string) => void
  onDelete?: (commentId: string) => void
}

/**
 * Individual comment display component
 *
 * Features:
 * - User info with badges
 * - Content rendering with RTL/LTR support
 * - Reactions (LinkedIn-style)
 * - Reply/Edit/Delete actions
 * - Nested replies
 * - Pin/Answer badges
 *
 * @example
 * <Comment
 *   comment={comment}
 *   locale="en"
 *   currentUser={user}
 *   postAuthorId={post.author_id}
 *   depth={0}
 *   maxDepth={3}
 * />
 */
export function Comment({
  comment,
  locale,
  currentUser,
  postAuthorId,
  depth = 0,
  maxDepth = 3,
  onReply,
  onEdit,
  onDelete,
}: CommentProps) {
  const router = useRouter()
  const [showReplyForm, setShowReplyForm] = React.useState(false)
  const [showEditForm, setShowEditForm] = React.useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false)
  const [isDeleting, setIsDeleting] = React.useState(false)
  const [optimisticReactions, setOptimisticReactions] = React.useState<Reaction[]>(
    comment.reaction_counts.map((r) => ({
      emoji: r.emoji,
      count: r.count,
      hasReacted: r.hasReacted,
    }))
  )

  // Get relative time
  const timeAgo = useRelativeTime(comment.created_at, locale)

  // Determine text direction
  const dir = locale === 'ar' || locale === 'ur' ? 'rtl' : 'ltr'

  // Check permissions
  const isOwnComment = currentUser?.id === comment.user_id
  const isPostAuthor = currentUser?.id === postAuthorId
  const canReply = depth < maxDepth && !!currentUser
  const canEdit = isOwnComment
  const canDelete = isOwnComment || isPostAuthor
  const canPin = isPostAuthor

  // Get user info
  // Note: Since we can't fetch auth.users directly, we'll need to enhance this later
  // For now, show current user's name if it's their comment, otherwise show Anonymous
  const isOwnCommentCheck = currentUser?.id === comment.user_id
  const userName = isOwnCommentCheck ? currentUser.name : (comment.user?.user_metadata?.name || comment.user?.user_metadata?.full_name || comment.user?.email || 'Anonymous')
  const userAvatar = isOwnCommentCheck ? currentUser.avatar : comment.user?.user_metadata?.avatar_url

  // Handle reaction toggle (LinkedIn-style: one reaction per user)
  const handleReact = async (emoji: string) => {
    if (!currentUser) {
      toast.error('You must be logged in to react')
      return
    }

    // Optimistic update - LinkedIn-style (one reaction at a time)
    setOptimisticReactions((prev) => {
      // Find if user already has a reaction
      const currentReaction = prev.find((r) => r.hasReacted)
      const clickedReaction = prev.find((r) => r.emoji === emoji)

      if (currentReaction?.emoji === emoji) {
        // Clicking the same reaction - remove it
        return prev
          .map((r) =>
            r.emoji === emoji
              ? { ...r, count: r.count - 1, hasReacted: false }
              : r
          )
          .filter((r) => r.count > 0)
      } else {
        // Clicking a different reaction - replace current with new
        let updated = prev

        // Remove current reaction if exists
        if (currentReaction) {
          updated = updated
            .map((r) =>
              r.emoji === currentReaction.emoji
                ? { ...r, count: r.count - 1, hasReacted: false }
                : r
            )
            .filter((r) => r.count > 0)
        }

        // Add new reaction
        if (clickedReaction) {
          updated = updated.map((r) =>
            r.emoji === emoji
              ? { ...r, count: r.count + 1, hasReacted: true }
              : r
          )
        } else {
          updated = [...updated, { emoji, count: 1, hasReacted: true }]
        }

        return updated
      }
    })

    // Call API
    const result = await toggleReaction(comment.id, emoji)
    if (!result.success) {
      toast.error(result.error || 'Failed to toggle reaction')
      // Revert optimistic update
      setOptimisticReactions(
        comment.reaction_counts.map((r) => ({
          emoji: r.emoji,
          count: r.count,
          hasReacted: r.hasReacted,
        }))
      )
    } else {
      // Refresh to sync server state
      router.refresh()
    }
  }

  // Handle delete
  const handleDelete = async () => {
    setIsDeleting(true)

    const result = await deleteComment(comment.id)

    if (result.success) {
      toast.success('Comment deleted')
      setShowDeleteDialog(false)
      router.refresh()
      onDelete?.(comment.id)
    } else {
      toast.error(result.error || 'Failed to delete comment')
    }

    setIsDeleting(false)
  }

  // Handle pin toggle
  const handleTogglePin = async () => {
    const result = await togglePinComment(comment.id, !comment.is_pinned)

    if (result.success) {
      toast.success(comment.is_pinned ? 'Comment unpinned' : 'Comment pinned')
      router.refresh()
    } else {
      toast.error(result.error || 'Failed to toggle pin')
    }
  }

  // Handle reply submission
  const handleReplySubmit = (content: string) => {
    setShowReplyForm(false)
    router.refresh()
  }

  // Handle edit
  const handleEdit = () => {
    setShowEditForm(true)
    setShowReplyForm(false)
  }

  // Handle edit submission
  const handleEditSubmit = async (content: string) => {
    const result = await updateComment(comment.id, {
      content,
      contentHtml: content, // For now, just use plain text
    })

    if (result.success) {
      toast.success('Comment updated')
      setShowEditForm(false)
      // Refresh to show updated comment
      router.refresh()
      // Trigger parent callback if provided
      onEdit?.(comment.id)
    } else {
      toast.error(result.error || 'Failed to update comment')
    }
  }

  return (
    <>
      <Card className={cn('p-4', depth > 0 && 'ms-10 border-s-2')} dir={dir}>
        <div className="flex gap-3">
          {/* Avatar */}
          <Avatar className="flex-shrink-0">
            {userAvatar && <AvatarImage src={userAvatar} alt={userName} />}
            <AvatarFallback>{userName[0]?.toUpperCase()}</AvatarFallback>
          </Avatar>

          {/* Content */}
          <div className="flex-1 min-w-0 space-y-3">
            {/* Header: User info + Time + Badges */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-medium">{userName}</span>

                {comment.user_id === postAuthorId && <UserBadge variant="author" />}
                {comment.is_pinned && (
                  <UserBadge variant="custom" label="Pinned" icon={<Pin className="h-3 w-3" />} />
                )}
                {comment.is_answer && (
                  <UserBadge variant="custom" label="Answer" />
                )}

                <span className="text-sm text-muted-foreground">
                  • {timeAgo}
                  {comment.is_edited && ' (edited)'}
                </span>
              </div>

              {/* Actions Menu */}
              {currentUser && (canEdit || canDelete || canPin) && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {canPin && (
                      <DropdownMenuItem onClick={handleTogglePin}>
                        <Pin className="me-2 h-4 w-4" />
                        {comment.is_pinned ? 'Unpin' : 'Pin'}
                      </DropdownMenuItem>
                    )}
                    {canEdit && (
                      <DropdownMenuItem onClick={handleEdit}>
                        <Edit2 className="me-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                    )}
                    {canDelete && (
                      <DropdownMenuItem
                        onClick={() => setShowDeleteDialog(true)}
                        className="text-destructive"
                      >
                        <Trash2 className="me-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    )}
                    {!canEdit && !canDelete && (
                      <DropdownMenuItem>
                        <Flag className="me-2 h-4 w-4" />
                        Report
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            {/* Comment Content */}
            {showEditForm ? (
              <div className="mt-4">
                <CommentForm
                  postId={comment.post_id}
                  locale={locale}
                  mode="edit"
                  user={currentUser!}
                  initialContent={comment.content}
                  placeholder="Edit your comment..."
                  onSubmit={handleEditSubmit}
                  onCancel={() => setShowEditForm(false)}
                />
              </div>
            ) : (
              <ContentRenderer
                content={comment.content_html || comment.content}
                format={comment.content_html ? 'html' : 'text'}
                dir="auto"
              />
            )}

            {/* Actions: Reactions + Reply + Edit */}
            <div className="flex items-center gap-3">
              <ReactionPicker
                reactions={optimisticReactions}
                variant="compact"
                onReact={handleReact}
              />

              <Separator orientation="vertical" className="h-4" />

              {canReply && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowReplyForm(!showReplyForm)}
                >
                  Reply
                </Button>
              )}

              {canEdit && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleEdit}
                >
                  Edit
                </Button>
              )}
            </div>

            {/* Reply Form */}
            {showReplyForm && currentUser && (
              <div className="mt-4">
                <CommentForm
                  postId={comment.post_id}
                  parentId={comment.id}
                  locale={locale}
                  user={currentUser}
                  placeholder={`Reply to ${userName}...`}
                  onSubmit={handleReplySubmit}
                  onCancel={() => setShowReplyForm(false)}
                />
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Nested Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <CommentThread
          comments={comment.replies as CommentWithReactions[]}
          locale={locale}
          currentUser={currentUser}
          postAuthorId={postAuthorId}
          depth={depth + 1}
          maxDepth={maxDepth}
          onReply={onReply}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Comment</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this comment? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
