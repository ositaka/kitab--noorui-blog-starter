-- Migration: Fix comment deletion RLS policy
-- Date: 2025-01-27
-- Issue: "new row violates row-level security policy" when trying to delete comments
-- Root cause: Conflicting UPDATE policies for deletion

-- Drop the problematic delete policy
DROP POLICY IF EXISTS "delete_own_comments" ON comments;

-- The existing "update_own_comments" policy already allows users to update their own comments
-- We just need to ensure it covers the soft-delete case (updating is_deleted to true)
-- The current policy should already handle this, but let's make it explicit:

-- Drop and recreate the update policy to be more permissive
DROP POLICY IF EXISTS "update_own_comments" ON comments;

CREATE POLICY "update_own_comments"
  ON comments FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- This policy now allows users to update ANY field on their own comments,
-- including soft-deleting them by setting is_deleted = true
