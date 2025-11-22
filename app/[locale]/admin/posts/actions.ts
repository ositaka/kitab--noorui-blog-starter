'use server'

import type { Locale } from '@/lib/supabase/types'
import {
  createPost as createPostApi,
  updatePost as updatePostApi,
  upsertTranslation as upsertTranslationApi,
  type CreatePostData,
  type UpdatePostData,
  type UpdateTranslationData,
} from '@/lib/supabase/admin-api'

/**
 * Server Actions for admin post operations
 * These wrap the admin-api functions to be callable from client components
 */

export async function createPostAction(data: CreatePostData) {
  return createPostApi(data)
}

export async function updatePostAction(postId: string, data: UpdatePostData) {
  return updatePostApi(postId, data)
}

export async function upsertTranslationAction(
  postId: string,
  locale: Locale,
  data: UpdateTranslationData
) {
  return upsertTranslationApi(postId, locale, data)
}
