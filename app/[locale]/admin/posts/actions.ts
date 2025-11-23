'use server'

import type { Locale } from '@/lib/supabase/types'
import { isAdmin } from '@/lib/supabase/auth'
import {
  createPost as createPostApi,
  updatePost as updatePostApi,
  upsertTranslation as upsertTranslationApi,
  deletePost as deletePostApi,
  publishPost as publishPostApi,
  unpublishPost as unpublishPostApi,
  type CreatePostData,
  type UpdatePostData,
  type UpdateTranslationData,
} from '@/lib/supabase/admin-api'

// Error messages for unauthorized access
const GUEST_ERROR = {
  error: 'This is a demo - editing is disabled for guests. Sign in with an admin account to make changes.',
}

/**
 * Check if user is authorized to make changes
 * Returns null if authorized, error object if not
 */
async function requireAdmin() {
  const admin = await isAdmin()
  if (!admin) {
    return GUEST_ERROR
  }
  return null
}

/**
 * Server Actions for admin post operations
 * These wrap the admin-api functions to be callable from client components
 * All mutation actions are protected - only admins can modify data
 */

export async function createPostAction(data: CreatePostData) {
  const authError = await requireAdmin()
  if (authError) return authError

  return createPostApi(data)
}

export async function updatePostAction(postId: string, data: UpdatePostData) {
  const authError = await requireAdmin()
  if (authError) return authError

  return updatePostApi(postId, data)
}

export async function upsertTranslationAction(
  postId: string,
  locale: Locale,
  data: UpdateTranslationData
) {
  const authError = await requireAdmin()
  if (authError) return authError

  return upsertTranslationApi(postId, locale, data)
}

export async function deletePostAction(postId: string) {
  const authError = await requireAdmin()
  if (authError) return authError

  return deletePostApi(postId)
}

export async function publishPostAction(postId: string) {
  const authError = await requireAdmin()
  if (authError) return authError

  return publishPostApi(postId)
}

export async function unpublishPostAction(postId: string) {
  const authError = await requireAdmin()
  if (authError) return authError

  return unpublishPostApi(postId)
}
