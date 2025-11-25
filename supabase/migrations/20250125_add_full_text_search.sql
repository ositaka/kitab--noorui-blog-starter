-- Add full-text search support to post_translations table
-- This enables fast searching across post titles, excerpts, and content

-- Add search_vector column for full-text search
ALTER TABLE post_translations
ADD COLUMN IF NOT EXISTS search_vector tsvector
GENERATED ALWAYS AS (
  setweight(to_tsvector('simple', coalesce(title, '')), 'A') ||
  setweight(to_tsvector('simple', coalesce(excerpt, '')), 'B') ||
  setweight(to_tsvector('simple', coalesce(content, '')), 'C')
) STORED;

-- Create GIN index for fast full-text search
CREATE INDEX IF NOT EXISTS post_translations_search_idx
ON post_translations USING GIN(search_vector);

-- Add comment
COMMENT ON COLUMN post_translations.search_vector IS
'Full-text search vector with weighted ranking: title (A), excerpt (B), content (C). Uses simple dictionary for multilingual support.';
