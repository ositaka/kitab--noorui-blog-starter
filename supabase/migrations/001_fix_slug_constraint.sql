-- Migration: Fix slug unique constraint
-- Run this in your Supabase SQL Editor to allow the same slug in different locales

-- Drop the single-column unique constraint on slug
ALTER TABLE posts DROP CONSTRAINT IF EXISTS posts_slug_key;

-- The composite unique constraint (slug, locale) already exists from the schema
-- If it doesn't exist, uncomment the line below:
-- ALTER TABLE posts ADD CONSTRAINT posts_slug_locale_key UNIQUE (slug, locale);
