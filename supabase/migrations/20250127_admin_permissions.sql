-- Migration: Admin Permissions for Comment Management
-- Description: Add admin role support and update RLS policies for comment moderation
-- Date: 2025-01-27

-- =====================================================
-- HELPER FUNCTION TO CHECK IF USER IS ADMIN
-- =====================================================

-- Create a function to check if the current user is an admin
-- Admins are identified by having 'admin' = true in their user_metadata
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  -- Check if the current user has admin flag in user_metadata
  RETURN (
    SELECT COALESCE(
      (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean,
      false
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Alternative: Check if user email is in admin list (more secure for production)
CREATE OR REPLACE FUNCTION is_admin_by_email()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    SELECT auth.email() IN (
      -- Add your admin emails here
      SELECT email FROM auth.users
      WHERE raw_user_meta_data->>'is_admin' = 'true'
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- UPDATE RLS POLICIES FOR ADMIN ACCESS
-- =====================================================

-- Drop existing update/delete policies for comments
DROP POLICY IF EXISTS "update_own_comments" ON comments;
DROP POLICY IF EXISTS "delete_own_comments" ON comments;

-- New policy: Users can update their own comments OR admins can update any comment
CREATE POLICY "update_comments"
  ON comments FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = user_id OR is_admin()
  )
  WITH CHECK (
    auth.uid() = user_id OR is_admin()
  );

-- Admins can also pin/unpin any comment
CREATE POLICY "admin_pin_comments"
  ON comments FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- =====================================================
-- GRANT NECESSARY PERMISSIONS
-- =====================================================

-- Grant execute permission on helper functions
GRANT EXECUTE ON FUNCTION is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION is_admin_by_email() TO authenticated;

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON FUNCTION is_admin() IS 'Helper function to check if current user has admin role (via user_metadata)';
COMMENT ON FUNCTION is_admin_by_email() IS 'Alternative admin check using email whitelist';
