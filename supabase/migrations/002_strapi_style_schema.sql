-- Migration: Convert to Strapi-style translations pattern
--
-- IMPORTANT: This will DROP all existing data!
-- Run this in your Supabase SQL Editor if you want to switch to the new schema.
--
-- If you have existing data you want to keep, you'll need to migrate it manually.

-- ============================================
-- DROP EXISTING TABLES (in correct order due to foreign keys)
-- ============================================
DROP VIEW IF EXISTS posts_with_relations CASCADE;
DROP VIEW IF EXISTS posts_localized CASCADE;
DROP VIEW IF EXISTS authors_localized CASCADE;
DROP VIEW IF EXISTS categories_localized CASCADE;

DROP TABLE IF EXISTS post_translations CASCADE;
DROP TABLE IF EXISTS posts CASCADE;
DROP TABLE IF EXISTS category_translations CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS author_translations CASCADE;
DROP TABLE IF EXISTS authors CASCADE;

-- ============================================
-- Now run the new schema.sql file
-- ============================================
-- Copy and paste the contents of supabase/schema.sql here,
-- or run schema.sql separately after this migration.
