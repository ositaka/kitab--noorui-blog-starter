-- Migration: Comment System
-- Description: Creates tables for comments and reactions with RLS policies
-- Date: 2025-01-26

-- =====================================================
-- TABLES
-- =====================================================

-- Comments table
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,

  -- Content
  content TEXT NOT NULL,
  content_html TEXT, -- Rendered markdown (cached for performance)

  -- Metadata
  is_pinned BOOLEAN DEFAULT false,
  is_answer BOOLEAN DEFAULT false,
  is_deleted BOOLEAN DEFAULT false,
  is_edited BOOLEAN DEFAULT false,
  edited_at TIMESTAMPTZ,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Constraints
  CONSTRAINT valid_parent CHECK (id != parent_id),
  CONSTRAINT content_length CHECK (char_length(content) <= 5000)
);

-- Comment reactions table
CREATE TABLE IF NOT EXISTS comment_reactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  comment_id UUID NOT NULL REFERENCES comments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  emoji TEXT NOT NULL CHECK (emoji IN ('👍', '❤️', '💡', '🚀', '🎉', '👀')),

  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- One reaction type per user per comment
  CONSTRAINT unique_user_comment_reaction UNIQUE(comment_id, user_id, emoji)
);

-- =====================================================
-- INDEXES
-- =====================================================

-- Comments indexes for performance
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comments_pinned ON comments(is_pinned) WHERE is_pinned = true;

-- Reactions indexes
CREATE INDEX IF NOT EXISTS idx_reactions_comment_id ON comment_reactions(comment_id);
CREATE INDEX IF NOT EXISTS idx_reactions_user_id ON comment_reactions(user_id);

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Function to prevent deeply nested threads (max 3 levels)
CREATE OR REPLACE FUNCTION check_comment_depth()
RETURNS TRIGGER AS $$
DECLARE
  depth INTEGER := 0;
  current_parent UUID := NEW.parent_id;
BEGIN
  -- Calculate depth by traversing parent chain
  WHILE current_parent IS NOT NULL LOOP
    depth := depth + 1;

    -- Max depth is 3 levels
    IF depth >= 3 THEN
      RAISE EXCEPTION 'Maximum comment depth (3 levels) exceeded';
    END IF;

    -- Get next parent
    SELECT parent_id INTO current_parent
    FROM comments
    WHERE id = current_parent;
  END LOOP;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_comment_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Enforce comment depth limit
CREATE TRIGGER enforce_comment_depth
  BEFORE INSERT ON comments
  FOR EACH ROW
  EXECUTE FUNCTION check_comment_depth();

-- Auto-update updated_at on comment edit
CREATE TRIGGER update_comment_timestamp
  BEFORE UPDATE ON comments
  FOR EACH ROW
  EXECUTE FUNCTION update_comment_updated_at();

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE comment_reactions ENABLE ROW LEVEL SECURITY;

-- Comments: Anyone can read non-deleted comments
CREATE POLICY "read_comments"
  ON comments FOR SELECT
  USING (is_deleted = false);

-- Comments: Authenticated users can create
CREATE POLICY "create_comments"
  ON comments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Comments: Users can update their own comments
CREATE POLICY "update_own_comments"
  ON comments FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Comments: Users can soft-delete their own comments
CREATE POLICY "delete_own_comments"
  ON comments FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (
    auth.uid() = user_id AND
    is_deleted = true
  );

-- Reactions: Anyone can read reactions
CREATE POLICY "read_reactions"
  ON comment_reactions FOR SELECT
  USING (true);

-- Reactions: Authenticated users can add reactions
CREATE POLICY "create_reactions"
  ON comment_reactions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Reactions: Users can remove their own reactions
CREATE POLICY "delete_reactions"
  ON comment_reactions FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON TABLE comments IS 'User comments on blog posts with threading support';
COMMENT ON TABLE comment_reactions IS 'Emoji reactions to comments';

COMMENT ON COLUMN comments.content IS 'Raw markdown content';
COMMENT ON COLUMN comments.content_html IS 'Rendered HTML (cached for performance)';
COMMENT ON COLUMN comments.is_pinned IS 'Pinned by author/moderator';
COMMENT ON COLUMN comments.is_answer IS 'Marked as answer by post author';
COMMENT ON COLUMN comments.is_deleted IS 'Soft delete - preserves thread structure';
COMMENT ON COLUMN comments.parent_id IS 'Parent comment ID for threading (max 3 levels)';
