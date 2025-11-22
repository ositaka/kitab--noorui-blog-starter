-- Kitab Blog Schema
-- Run this in your Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- AUTHORS TABLE
-- ============================================
CREATE TABLE authors (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  avatar_url TEXT,
  website TEXT,
  twitter TEXT,
  -- Multilingual fields stored as JSONB
  name JSONB NOT NULL DEFAULT '{}',
  bio JSONB NOT NULL DEFAULT '{}'
);

-- Example name/bio structure:
-- { "en": "Noor Team", "fr": "Équipe Noor", "ar": "فريق نور", "ur": "نور ٹیم" }

COMMENT ON TABLE authors IS 'Blog post authors with multilingual support';

-- ============================================
-- CATEGORIES TABLE
-- ============================================
CREATE TABLE categories (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  slug TEXT UNIQUE NOT NULL,
  color TEXT DEFAULT '#6366f1',
  icon TEXT,
  -- Multilingual fields
  name JSONB NOT NULL DEFAULT '{}',
  description JSONB NOT NULL DEFAULT '{}'
);

COMMENT ON TABLE categories IS 'Post categories with multilingual support';

-- ============================================
-- POSTS TABLE
-- ============================================
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Identifiers
  slug TEXT UNIQUE NOT NULL,
  locale TEXT NOT NULL DEFAULT 'en',

  -- Relations
  author_id TEXT REFERENCES authors(id) ON DELETE SET NULL,
  category_id TEXT REFERENCES categories(id) ON DELETE SET NULL,

  -- Content (single language per row for better querying)
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT,

  -- Metadata
  featured_image TEXT,
  reading_time INTEGER DEFAULT 5,
  published_at TIMESTAMPTZ,
  is_published BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,

  -- SEO
  meta_title TEXT,
  meta_description TEXT,

  -- Tags stored as array
  tags TEXT[] DEFAULT '{}',

  -- View tracking
  view_count INTEGER DEFAULT 0,

  -- Unique constraint: one post per slug+locale combination
  UNIQUE(slug, locale)
);

COMMENT ON TABLE posts IS 'Blog posts - one row per language version';

-- ============================================
-- POST TRANSLATIONS (Alternative approach)
-- For linking translations together
-- ============================================
CREATE TABLE post_translations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  canonical_slug TEXT NOT NULL,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  locale TEXT NOT NULL,
  UNIQUE(canonical_slug, locale)
);

COMMENT ON TABLE post_translations IS 'Links post translations together by canonical slug';

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_posts_slug ON posts(slug);
CREATE INDEX idx_posts_locale ON posts(locale);
CREATE INDEX idx_posts_author ON posts(author_id);
CREATE INDEX idx_posts_category ON posts(category_id);
CREATE INDEX idx_posts_published ON posts(is_published, published_at DESC);
CREATE INDEX idx_posts_featured ON posts(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_posts_tags ON posts USING GIN(tags);

-- ============================================
-- UPDATED_AT TRIGGER
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

-- Enable RLS
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_translations ENABLE ROW LEVEL SECURITY;

-- Public read access for published posts
CREATE POLICY "Public can read published posts"
  ON posts FOR SELECT
  USING (is_published = TRUE);

-- Public read access for authors
CREATE POLICY "Public can read authors"
  ON authors FOR SELECT
  USING (TRUE);

-- Public read access for categories
CREATE POLICY "Public can read categories"
  ON categories FOR SELECT
  USING (TRUE);

-- Public read access for translations
CREATE POLICY "Public can read translations"
  ON post_translations FOR SELECT
  USING (TRUE);

-- Authenticated users can do everything (for admin)
CREATE POLICY "Authenticated users have full access to posts"
  ON posts FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users have full access to authors"
  ON authors FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users have full access to categories"
  ON categories FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users have full access to translations"
  ON post_translations FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ============================================
-- SEED DATA: AUTHORS
-- ============================================
INSERT INTO authors (id, name, bio, avatar_url, twitter) VALUES
(
  'noor-team',
  '{"en": "Noor Team", "fr": "Équipe Noor", "ar": "فريق نور", "ur": "نور ٹیم"}',
  '{"en": "The team behind Noor UI, building beautiful bidirectional interfaces.", "fr": "L''équipe derrière Noor UI, créant de belles interfaces bidirectionnelles.", "ar": "الفريق وراء نور UI، يبني واجهات ثنائية الاتجاه جميلة.", "ur": "نور UI کے پیچھے ٹیم، خوبصورت دو طرفہ انٹرفیس بنا رہی ہے۔"}',
  '/images/authors/noor-team.jpg',
  '@naborui'
),
(
  'amira-hassan',
  '{"en": "Amira Hassan", "fr": "Amira Hassan", "ar": "أميرة حسن", "ur": "امیرہ حسن"}',
  '{"en": "Linguist and typographer specializing in Arabic script history and evolution.", "fr": "Linguiste et typographe spécialisée dans l''histoire et l''évolution de l''écriture arabe.", "ar": "لغوية ومصممة خطوط متخصصة في تاريخ وتطور الخط العربي.", "ur": "ماہر لسانیات اور ٹائپوگرافر جو عربی رسم الخط کی تاریخ میں مہارت رکھتی ہیں۔"}',
  '/images/authors/amira-hassan.jpg',
  NULL
),
(
  'karim-benali',
  '{"en": "Karim Benali", "fr": "Karim Benali", "ar": "كريم بن علي", "ur": "کریم بن علی"}',
  '{"en": "Senior frontend developer with 10+ years building RTL-first applications.", "fr": "Développeur frontend senior avec plus de 10 ans d''expérience dans les applications RTL.", "ar": "مطور واجهات أمامية أول مع أكثر من 10 سنوات في بناء تطبيقات RTL.", "ur": "سینئر فرنٹ اینڈ ڈویلپر جو 10+ سال سے RTL ایپلیکیشنز بنا رہے ہیں۔"}',
  '/images/authors/karim-benali.jpg',
  NULL
),
(
  'fatima-zahra',
  '{"en": "Fatima Zahra", "fr": "Fatima Zahra", "ar": "فاطمة الزهراء", "ur": "فاطمہ زہرا"}',
  '{"en": "UX researcher focused on cross-cultural design and accessibility in MENA region.", "fr": "Chercheuse UX spécialisée dans le design interculturel et l''accessibilité dans la région MENA.", "ar": "باحثة تجربة المستخدم متخصصة في التصميم عبر الثقافات وإمكانية الوصول في منطقة MENA.", "ur": "UX محقق جو MENA خطے میں بین الثقافتی ڈیزائن پر توجہ مرکوز کرتی ہیں۔"}',
  '/images/authors/fatima-zahra.jpg',
  NULL
);

-- ============================================
-- SEED DATA: CATEGORIES
-- ============================================
INSERT INTO categories (id, slug, name, description, color, icon) VALUES
(
  'scripts-alphabets',
  'scripts-alphabets',
  '{"en": "Scripts & Alphabets", "fr": "Écritures & Alphabets", "ar": "الخطوط والأبجديات", "ur": "رسم الخط اور حروف تہجی"}',
  '{"en": "History and evolution of writing systems", "fr": "Histoire et évolution des systèmes d''écriture", "ar": "تاريخ وتطور أنظمة الكتابة", "ur": "تحریری نظاموں کی تاریخ اور ارتقاء"}',
  '#8B5CF6',
  'scroll-text'
),
(
  'rtl-ltr-concepts',
  'rtl-ltr-concepts',
  '{"en": "RTL/LTR Concepts", "fr": "Concepts RTL/LTR", "ar": "مفاهيم RTL/LTR", "ur": "RTL/LTR تصورات"}',
  '{"en": "Technical concepts for bidirectional text", "fr": "Concepts techniques pour le texte bidirectionnel", "ar": "المفاهيم التقنية للنص ثنائي الاتجاه", "ur": "دو طرفہ متن کے تکنیکی تصورات"}',
  '#3B82F6',
  'arrow-left-right'
),
(
  'typography',
  'typography',
  '{"en": "Typography", "fr": "Typographie", "ar": "الطباعة", "ur": "ٹائپوگرافی"}',
  '{"en": "Font design and text rendering", "fr": "Design de polices et rendu du texte", "ar": "تصميم الخطوط وعرض النص", "ur": "فونٹ ڈیزائن اور متن رینڈرنگ"}',
  '#10B981',
  'type'
),
(
  'cultural-context',
  'cultural-context',
  '{"en": "Cultural Context", "fr": "Contexte Culturel", "ar": "السياق الثقافي", "ur": "ثقافتی سیاق"}',
  '{"en": "Cultural aspects of script and design", "fr": "Aspects culturels de l''écriture et du design", "ar": "الجوانب الثقافية للخط والتصميم", "ur": "رسم الخط اور ڈیزائن کے ثقافتی پہلو"}',
  '#F59E0B',
  'globe'
);

-- ============================================
-- HELPFUL VIEWS
-- ============================================

-- View for getting posts with author and category info
CREATE OR REPLACE VIEW posts_with_relations AS
SELECT
  p.*,
  a.name as author_name,
  a.avatar_url as author_avatar,
  a.bio as author_bio,
  c.name as category_name,
  c.slug as category_slug,
  c.color as category_color
FROM posts p
LEFT JOIN authors a ON p.author_id = a.id
LEFT JOIN categories c ON p.category_id = c.id;

-- Grant access to the view
GRANT SELECT ON posts_with_relations TO anon, authenticated;
