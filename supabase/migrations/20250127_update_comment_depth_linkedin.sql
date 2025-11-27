-- Migration: Update comment depth limit to LinkedIn-style (max 1 level)
-- Date: 2025-01-27
-- Changes: Update from 2 levels to 1 level (no replies to replies)

-- Drop and recreate the depth check function with new limit
CREATE OR REPLACE FUNCTION check_comment_depth()
RETURNS TRIGGER AS $$
DECLARE
  depth INTEGER := 0;
  current_parent UUID := NEW.parent_id;
BEGIN
  -- Calculate depth by traversing parent chain
  WHILE current_parent IS NOT NULL LOOP
    depth := depth + 1;

    -- Max depth is 1 level (LinkedIn-style: only one level of replies)
    IF depth >= 2 THEN
      RAISE EXCEPTION 'Maximum comment depth (1 level) exceeded - replies to replies are not allowed';
    END IF;

    -- Get next parent
    SELECT parent_id INTO current_parent
    FROM comments
    WHERE id = current_parent;
  END LOOP;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Note: The trigger already exists, so we don't need to recreate it
-- The updated function will be used automatically
