-- Kitab Blog Schema (Strapi-style translations pattern)
-- Run this in your Supabase SQL Editor
--
-- Pattern: Base tables contain shared fields, translation tables contain locale-specific content
-- This is the same approach used by Strapi, Directus, and other headless CMS platforms

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- AUTHORS (base table)
-- ============================================
CREATE TABLE authors (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  avatar_url TEXT,
  website TEXT,
  twitter TEXT
);

COMMENT ON TABLE authors IS 'Authors - shared/non-translatable fields';

-- ============================================
-- AUTHOR TRANSLATIONS
-- ============================================
CREATE TABLE author_translations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_id TEXT NOT NULL REFERENCES authors(id) ON DELETE CASCADE,
  locale TEXT NOT NULL,
  name TEXT NOT NULL,
  bio TEXT,
  UNIQUE(author_id, locale)
);

CREATE INDEX idx_author_translations_locale ON author_translations(locale);
CREATE INDEX idx_author_translations_author ON author_translations(author_id);

COMMENT ON TABLE author_translations IS 'Author translations - locale-specific content';

-- ============================================
-- CATEGORIES (base table)
-- ============================================
CREATE TABLE categories (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  slug TEXT UNIQUE NOT NULL,
  color TEXT DEFAULT '#6366f1',
  icon TEXT
);

COMMENT ON TABLE categories IS 'Categories - shared/non-translatable fields';

-- ============================================
-- CATEGORY TRANSLATIONS
-- ============================================
CREATE TABLE category_translations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id TEXT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  locale TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  UNIQUE(category_id, locale)
);

CREATE INDEX idx_category_translations_locale ON category_translations(locale);
CREATE INDEX idx_category_translations_category ON category_translations(category_id);

COMMENT ON TABLE category_translations IS 'Category translations - locale-specific content';

-- ============================================
-- POSTS (base table)
-- ============================================
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Unique identifier across all translations
  slug TEXT UNIQUE NOT NULL,

  -- Relations
  author_id TEXT REFERENCES authors(id) ON DELETE SET NULL,
  category_id TEXT REFERENCES categories(id) ON DELETE SET NULL,

  -- Shared metadata (same across all translations)
  featured_image TEXT,
  reading_time INTEGER DEFAULT 5,
  published_at TIMESTAMPTZ,
  is_published BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,

  -- Tags (shared across translations)
  tags TEXT[] DEFAULT '{}',

  -- Analytics
  view_count INTEGER DEFAULT 0
);

CREATE INDEX idx_posts_slug ON posts(slug);
CREATE INDEX idx_posts_author ON posts(author_id);
CREATE INDEX idx_posts_category ON posts(category_id);
CREATE INDEX idx_posts_published ON posts(is_published, published_at DESC);
CREATE INDEX idx_posts_featured ON posts(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_posts_tags ON posts USING GIN(tags);

COMMENT ON TABLE posts IS 'Posts - shared/non-translatable fields';

-- ============================================
-- POST TRANSLATIONS
-- ============================================
CREATE TABLE post_translations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  locale TEXT NOT NULL,

  -- Translatable content
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT,

  -- SEO (per-locale)
  meta_title TEXT,
  meta_description TEXT,

  UNIQUE(post_id, locale)
);

CREATE INDEX idx_post_translations_locale ON post_translations(locale);
CREATE INDEX idx_post_translations_post ON post_translations(post_id);

COMMENT ON TABLE post_translations IS 'Post translations - locale-specific content';

-- ============================================
-- UPDATED_AT TRIGGERS
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_authors_updated_at
  BEFORE UPDATE ON authors
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

-- Enable RLS on all tables
ALTER TABLE authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE author_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE category_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_translations ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public can read authors" ON authors FOR SELECT USING (TRUE);
CREATE POLICY "Public can read author_translations" ON author_translations FOR SELECT USING (TRUE);
CREATE POLICY "Public can read categories" ON categories FOR SELECT USING (TRUE);
CREATE POLICY "Public can read category_translations" ON category_translations FOR SELECT USING (TRUE);

-- Public can read published posts
CREATE POLICY "Public can read published posts" ON posts FOR SELECT USING (is_published = TRUE);
CREATE POLICY "Public can read translations of published posts" ON post_translations FOR SELECT
  USING (EXISTS (SELECT 1 FROM posts WHERE posts.id = post_translations.post_id AND posts.is_published = TRUE));

-- Authenticated users have full access (for admin)
CREATE POLICY "Authenticated full access authors" ON authors FOR ALL
  USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated full access author_translations" ON author_translations FOR ALL
  USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated full access categories" ON categories FOR ALL
  USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated full access category_translations" ON category_translations FOR ALL
  USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated full access posts" ON posts FOR ALL
  USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated full access post_translations" ON post_translations FOR ALL
  USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- ============================================
-- HELPFUL VIEWS
-- ============================================

-- View: Posts with translations (for a specific locale)
-- Usage: SELECT * FROM posts_localized WHERE locale = 'en'
CREATE OR REPLACE VIEW posts_localized AS
SELECT
  p.id,
  p.slug,
  p.author_id,
  p.category_id,
  p.featured_image,
  p.reading_time,
  p.published_at,
  p.is_published,
  p.is_featured,
  p.tags,
  p.view_count,
  p.created_at,
  p.updated_at,
  pt.locale,
  pt.title,
  pt.excerpt,
  pt.content,
  pt.meta_title,
  pt.meta_description
FROM posts p
JOIN post_translations pt ON p.id = pt.post_id;

-- View: Authors with translations
CREATE OR REPLACE VIEW authors_localized AS
SELECT
  a.id,
  a.avatar_url,
  a.website,
  a.twitter,
  a.created_at,
  a.updated_at,
  at.locale,
  at.name,
  at.bio
FROM authors a
JOIN author_translations at ON a.id = at.author_id;

-- View: Categories with translations
CREATE OR REPLACE VIEW categories_localized AS
SELECT
  c.id,
  c.slug,
  c.color,
  c.icon,
  c.created_at,
  ct.locale,
  ct.name,
  ct.description
FROM categories c
JOIN category_translations ct ON c.id = ct.category_id;

-- Grant access to views
GRANT SELECT ON posts_localized TO anon, authenticated;
GRANT SELECT ON authors_localized TO anon, authenticated;
GRANT SELECT ON categories_localized TO anon, authenticated;

-- ============================================
-- SEED DATA: AUTHORS
-- ============================================
INSERT INTO authors (id, avatar_url, twitter, website) VALUES
  ('noor-team', '/images/authors/noor-team.jpg', '@noorui', 'https://noorui.com'),
  ('amira-hassan', '/images/authors/amira-hassan.jpg', NULL, NULL),
  ('karim-benali', '/images/authors/karim-benali.jpg', NULL, NULL),
  ('fatima-zahra', '/images/authors/fatima-zahra.jpg', NULL, NULL);

INSERT INTO author_translations (author_id, locale, name, bio) VALUES
  ('noor-team', 'en', 'Noor Team', 'The team behind Noor UI, building beautiful bidirectional interfaces.'),
  ('noor-team', 'fr', 'Équipe Noor', 'L''équipe derrière Noor UI, créant de belles interfaces bidirectionnelles.'),
  ('noor-team', 'ar', 'فريق نور', 'الفريق وراء نور UI، يبني واجهات ثنائية الاتجاه جميلة.'),
  ('noor-team', 'ur', 'نور ٹیم', 'نور UI کے پیچھے ٹیم، خوبصورت دو طرفہ انٹرفیس بنا رہی ہے۔'),

  ('amira-hassan', 'en', 'Amira Hassan', 'Linguist and typographer specializing in Arabic script history and evolution.'),
  ('amira-hassan', 'fr', 'Amira Hassan', 'Linguiste et typographe spécialisée dans l''histoire de l''écriture arabe.'),
  ('amira-hassan', 'ar', 'أميرة حسن', 'لغوية ومصممة خطوط متخصصة في تاريخ وتطور الخط العربي.'),
  ('amira-hassan', 'ur', 'امیرہ حسن', 'ماہر لسانیات اور ٹائپوگرافر جو عربی رسم الخط کی تاریخ میں مہارت رکھتی ہیں۔'),

  ('karim-benali', 'en', 'Karim Benali', 'Senior frontend developer with 10+ years building RTL-first applications.'),
  ('karim-benali', 'fr', 'Karim Benali', 'Développeur frontend senior avec plus de 10 ans dans les applications RTL.'),
  ('karim-benali', 'ar', 'كريم بن علي', 'مطور واجهات أمامية أول مع أكثر من 10 سنوات في بناء تطبيقات RTL.'),
  ('karim-benali', 'ur', 'کریم بن علی', 'سینئر فرنٹ اینڈ ڈویلپر جو 10+ سال سے RTL ایپلیکیشنز بنا رہے ہیں۔'),

  ('fatima-zahra', 'en', 'Fatima Zahra', 'UX researcher focused on cross-cultural design and accessibility in MENA region.'),
  ('fatima-zahra', 'fr', 'Fatima Zahra', 'Chercheuse UX spécialisée dans le design interculturel et l''accessibilité.'),
  ('fatima-zahra', 'ar', 'فاطمة الزهراء', 'باحثة تجربة المستخدم متخصصة في التصميم عبر الثقافات وإمكانية الوصول.'),
  ('fatima-zahra', 'ur', 'فاطمہ زہرا', 'UX محقق جو MENA خطے میں بین الثقافتی ڈیزائن پر توجہ مرکوز کرتی ہیں۔');

-- ============================================
-- SEED DATA: CATEGORIES
-- ============================================
INSERT INTO categories (id, slug, color, icon) VALUES
  ('scripts-alphabets', 'scripts-alphabets', '#8B5CF6', 'scroll-text'),
  ('rtl-ltr-concepts', 'rtl-ltr-concepts', '#3B82F6', 'arrow-left-right'),
  ('typography', 'typography', '#10B981', 'type'),
  ('cultural-context', 'cultural-context', '#F59E0B', 'globe');

INSERT INTO category_translations (category_id, locale, name, description) VALUES
  ('scripts-alphabets', 'en', 'Scripts & Alphabets', 'History and evolution of writing systems'),
  ('scripts-alphabets', 'fr', 'Écritures & Alphabets', 'Histoire et évolution des systèmes d''écriture'),
  ('scripts-alphabets', 'ar', 'الخطوط والأبجديات', 'تاريخ وتطور أنظمة الكتابة'),
  ('scripts-alphabets', 'ur', 'رسم الخط اور حروف تہجی', 'تحریری نظاموں کی تاریخ اور ارتقاء'),

  ('rtl-ltr-concepts', 'en', 'RTL/LTR Concepts', 'Technical concepts for bidirectional text'),
  ('rtl-ltr-concepts', 'fr', 'Concepts RTL/LTR', 'Concepts techniques pour le texte bidirectionnel'),
  ('rtl-ltr-concepts', 'ar', 'مفاهيم RTL/LTR', 'المفاهيم التقنية للنص ثنائي الاتجاه'),
  ('rtl-ltr-concepts', 'ur', 'RTL/LTR تصورات', 'دو طرفہ متن کے تکنیکی تصورات'),

  ('typography', 'en', 'Typography', 'Font design and text rendering'),
  ('typography', 'fr', 'Typographie', 'Design de polices et rendu du texte'),
  ('typography', 'ar', 'الطباعة', 'تصميم الخطوط وعرض النص'),
  ('typography', 'ur', 'ٹائپوگرافی', 'فونٹ ڈیزائن اور متن رینڈرنگ'),

  ('cultural-context', 'en', 'Cultural Context', 'Cultural aspects of script and design'),
  ('cultural-context', 'fr', 'Contexte Culturel', 'Aspects culturels de l''écriture et du design'),
  ('cultural-context', 'ar', 'السياق الثقافي', 'الجوانب الثقافية للخط والتصميم'),
  ('cultural-context', 'ur', 'ثقافتی سیاق', 'رسم الخط اور ڈیزائن کے ثقافتی پہلو');
