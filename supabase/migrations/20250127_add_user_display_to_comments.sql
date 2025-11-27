-- Migration: Add User Display Info to Comments
-- Description: Add user_name and user_avatar columns to denormalize user data
-- Date: 2025-01-27
-- Reason: Can't join with auth.users through PostgREST, so we store display info directly

-- Add columns
ALTER TABLE comments
  ADD COLUMN IF NOT EXISTS user_name TEXT,
  ADD COLUMN IF NOT EXISTS user_avatar TEXT;

-- Add comments
COMMENT ON COLUMN comments.user_name IS 'Cached user display name (from user_metadata)';
COMMENT ON COLUMN comments.user_avatar IS 'Cached user avatar URL (from user_metadata)';

-- Backfill existing comments (optional - will show as Anonymous if not filled)
-- Note: This requires manual backfilling since we can't access auth.users from SQL
-- Existing comments will show "Anonymous" until users edit them or new comments are created
