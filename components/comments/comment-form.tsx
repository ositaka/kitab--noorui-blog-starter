'use client'

import * as React from 'react'
import { Avatar, AvatarImage, AvatarFallback } from 'noorui-rtl'
import { Button } from 'noorui-rtl'
import { Card } from 'noorui-rtl'
import { Textarea } from 'noorui-rtl'
import { cn } from '@/lib/utils'
import { createComment } from '@/lib/supabase/comments'
import { toast } from 'sonner'
import { Kbd } from '@/components/ui/kbd'

export interface CommentFormProps {
  postId: string
  parentId?: string | null
  initialContent?: string
  placeholder?: string
  maxLength?: number
  locale: 'en' | 'ar' | 'fr' | 'ur'
  mode?: 'create' | 'edit'
  user: {
    id: string
    name: string
    avatar?: string
    email: string
  }
  onSubmit?: (content: string) => void
  onCancel?: () => void
  className?: string
}

/**
 * Comment form component for creating/editing comments
 *
 * Features:
 * - Simple textarea for markdown input
 * - Character counter
 * - RTL/LTR support
 * - Optimistic updates
 * - Error handling
 *
 * @example
 * <CommentForm
 *   postId="abc123"
 *   locale="en"
 *   user={currentUser}
 *   onSubmit={handleSubmit}
 * />
 */
export function CommentForm({
  postId,
  parentId = null,
  initialContent = '',
  placeholder = 'Share your thoughts...',
  maxLength = 5000,
  locale,
  mode = 'create',
  user,
  onSubmit,
  onCancel,
  className,
}: CommentFormProps) {
  const [content, setContent] = React.useState(initialContent)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea
  React.useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = `${textarea.scrollHeight}px`
    }
  }, [content])

  // Auto-focus on mount if it's a reply
  React.useEffect(() => {
    if (parentId && textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [parentId])

  // Determine text direction
  const dir = locale === 'ar' || locale === 'ur' ? 'rtl' : 'ltr'

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!content.trim()) {
      toast.error('Comment cannot be empty')
      return
    }

    if (content.length > maxLength) {
      toast.error(`Comment is too long (max ${maxLength} characters)`)
      return
    }

    setIsSubmitting(true)

    try {
      if (mode === 'edit') {
        // In edit mode, just call the onSubmit callback
        // The parent component handles the actual update
        onSubmit?.(content.trim())
      } else {
        // In create mode, call the API
        const result = await createComment({
          postId,
          parentId,
          content: content.trim(),
        })

        if (result.success) {
          toast.success('Comment posted successfully')
          setContent('')
          onSubmit?.(content)
        } else {
          toast.error(result.error || 'Failed to post comment')
        }
      }
    } catch (error) {
      console.error('Error submitting comment:', error)
      toast.error('Failed to post comment')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Cmd/Ctrl + Enter to submit
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault()
      handleSubmit(e as any)
    }

    // Escape to cancel
    if (e.key === 'Escape' && onCancel) {
      e.preventDefault()
      onCancel()
    }
  }

  // Character count color
  const characterCountColor = () => {
    const percentage = (content.length / maxLength) * 100
    if (percentage >= 100) return 'text-destructive'
    if (percentage >= 90) return 'text-orange-500'
    if (percentage >= 75) return 'text-yellow-500'
    return 'text-muted-foreground'
  }

  return (
    <Card className={cn('p-4', className)} dir={dir}>
      <form onSubmit={handleSubmit}>
        <div className="flex gap-3">
          {/* User Avatar */}
          <Avatar className="flex-shrink-0">
            {user.avatar && <AvatarImage src={user.avatar} alt={user.name} />}
            <AvatarFallback>{user.name[0]?.toUpperCase() || user.email[0]?.toUpperCase()}</AvatarFallback>
          </Avatar>

          {/* Form Content */}
          <div className="flex-1 min-w-0 space-y-3">
            {/* Textarea */}
            <Textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={isSubmitting}
              className="min-h-[100px] resize-none"
              dir="auto" // Auto-detect direction based on content
              maxLength={maxLength}
            />

            {/* Footer: Character count + Actions */}
            <div className="flex items-center justify-between gap-3">
              {/* Character Count */}
              <span className={cn('text-xs', characterCountColor())}>
                {content.length} / {maxLength}
              </span>

              {/* Actions */}
              <div className="flex items-center gap-2">
                {onCancel && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={onCancel}
                    disabled={isSubmitting}
                    className="gap-2"
                  >
                    Cancel
                    <Kbd keys={['esc']} size="sm" />
                  </Button>
                )}

                <Button
                  type="submit"
                  size="sm"
                  disabled={isSubmitting || !content.trim() || content.length > maxLength}
                  className="gap-2"
                >
                  {isSubmitting
                    ? (mode === 'edit' ? 'Updating...' : 'Posting...')
                    : mode === 'edit'
                      ? 'Update'
                      : parentId
                        ? 'Reply'
                        : 'Comment'}
                  {!isSubmitting && <Kbd keys={['mod', 'enter']} size="sm" />}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </Card>
  )
}
