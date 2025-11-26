'use client'

import * as React from 'react'
import { Comment, type CommentProps } from './comment'
import type { CommentWithReactions } from '@/lib/supabase/comments'

export interface CommentThreadProps {
  comments: CommentWithReactions[]
  locale: 'en' | 'ar' | 'fr' | 'ur'
  currentUser?: CommentProps['currentUser']
  postAuthorId?: string
  depth?: number
  maxDepth?: number
  onReply?: (commentId: string) => void
  onEdit?: (commentId: string) => void
  onDelete?: (commentId: string) => void
}

/**
 * CommentThread component for rendering nested comment replies
 *
 * Handles recursive rendering up to maxDepth (default: 3)
 * Uses logical CSS properties for RTL-aware indentation
 *
 * @example
 * <CommentThread
 *   comments={replies}
 *   locale="en"
 *   currentUser={user}
 *   depth={1}
 *   maxDepth={3}
 * />
 */
export function CommentThread({
  comments,
  locale,
  currentUser,
  postAuthorId,
  depth = 0,
  maxDepth = 3,
  onReply,
  onEdit,
  onDelete,
}: CommentThreadProps) {
  if (!comments || comments.length === 0) {
    return null
  }

  // Don't render beyond max depth
  if (depth >= maxDepth) {
    return null
  }

  return (
    <div className="space-y-4 mt-4">
      {comments.map((comment) => (
        <div key={comment.id}>
          {/* Comment */}
          <Comment
            comment={comment}
            locale={locale}
            currentUser={currentUser}
            postAuthorId={postAuthorId}
            depth={depth}
            maxDepth={maxDepth}
            onReply={onReply}
            onEdit={onEdit}
            onDelete={onDelete}
          />

          {/* Nested Replies */}
          {comment.replies && comment.replies.length > 0 && (
            <CommentThread
              comments={comment.replies}
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
        </div>
      ))}
    </div>
  )
}
