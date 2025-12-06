# Kitab - Multilingual Blog Starter

A production-ready multilingual blog starter showcasing RTL support and Arabic typography, built with [Noor UI](https://noorui.com), Next.js 16, and Supabase.

**Live Demo**: [kitab.noorui.com](https://kitab.noorui.com)

## ✨ Features

### 🌐 Multilingual & RTL First
- **4 Languages**: English, Arabic, French, Urdu
- **Full RTL Support**: Proper right-to-left layouts for Arabic and Urdu
- **Per-Locale Content**: Separate translations for titles, excerpts, and full content
- **RTL-Aware Components**: All UI components adapt to text direction
- **Localized Dates**: Arabic numerals and month names in Arabic locale

### 📝 Rich Content System
- **MDX Support**: Write posts in Markdown with React components
- **Custom Components**: Callouts, Pull Quotes, Figures, Image Grids, Code Blocks, Media Embeds
- **Syntax Highlighting**: Beautiful code blocks with Shiki (GitHub themes)
- **Table of Contents**: Auto-generated, scroll-aware sidebar navigation
- **Reading Progress**: Visual indicator of scroll progress
- **Related Posts**: Automatically shows related content by category/tags

### 💬 Comment System
- **Threaded Discussions**: Nested replies up to 3 levels deep
- **LinkedIn-Style Reactions**: Compact emoji reactions (👍❤️💡 20)
- **Rich Features**: Edit, delete, pin comments, mark as answer
- **RTL/LTR Support**: Bidirectional text with `dir="auto"`
- **Keyboard Shortcuts**: Platform-aware shortcuts (⌘↵ on Mac, Ctrl↵ on Windows)
- **Optimistic Updates**: Instant UI feedback for all interactions
- **Moderation**: Pin/unpin, edit indicators, soft delete

### 🎨 Design
- **Dark Mode**: Complete dark theme with smooth transitions
- **Responsive**: Mobile-first design that works on all devices
- **Typography**: Optimized for readability with proper Arabic font rendering
- **Accessibility**: WCAG compliant, keyboard navigation, screen reader support

### 🔍 SEO Optimized
- **Dynamic Meta Tags**: Title, description, keywords, authors
- **Open Graph**: Social sharing with custom images (1200×630)
- **Twitter Cards**: Rich previews on Twitter/X
- **JSON-LD Structured Data**: BlogPosting schema for rich snippets
- **Canonical URLs**: Proper hreflang tags for all 4 locales
- **Sitemap**: Auto-generated sitemap.xml with all pages and posts
- **Robots.txt**: Configured for optimal crawling
- **Per-Locale SEO**: Custom meta titles and descriptions for each language

### ⚡ Performance
- **Next.js 16**: Latest version with Turbopack
- **Image Optimization**: Next/Image with Supabase CDN
- **Static Generation**: Pre-rendered pages for fast loading
- **Font Optimization**: next/font with Google Fonts

### 🛠️ Admin Dashboard
- **Complete CMS**: Full-featured content management at `/admin`
- **Authentication**: Google OAuth + Guest mode for demos
- **Multi-Locale Editor**: Edit content in all 4 languages simultaneously
- **Rich Text Editor**: WYSIWYG markdown editor (MDXEditor)
- **Image Upload**: Drag & drop upload to Supabase Storage
- **SEO Fields**: Per-locale meta titles, descriptions, OG images, focus keywords
- **Draft System**: Save drafts before publishing
- **Analytics**: View counts and post performance tracking

## 🏗️ Tech Stack

- **Framework**: Next.js 16 (App Router with Turbopack)
- **UI Library**: Noor UI v0.4.4 (noorui-rtl)
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage
- **Authentication**: Supabase Auth
- **Styling**: Tailwind CSS with CSS Logical Properties
- **Type Safety**: TypeScript
- **MDX**: next-mdx-remote/rsc
- **Code Highlighting**: rehype-pretty-code with Shiki

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Supabase account
- Google Cloud Console project (for OAuth)

### 1. Clone and Install

```bash
git clone https://github.com/ositaka/kitab--noorui-blog-starter.git kitab
cd kitab
npm install
```

### 2. Environment Setup

Create `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Admin Access
ADMIN_EMAILS=your@email.com,another@email.com

# Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. Database Setup

Run the SQL schema in your Supabase SQL Editor:

```bash
# Run schema
supabase/schema.sql

# Run SEO fields migration
supabase/migrations/add_seo_fields.sql
```

### 4. Seed Content

```bash
npm run db:seed
```

This will create:
- 4 authors (with translations)
- 4 categories (with translations)
- 21 blog posts (with 84 translations - 21×4 locales)

### 5. Start Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 6. Access Admin Dashboard

- Go to [http://localhost:3000/en/admin](http://localhost:3000/en/admin)
- Click "Enter as Guest" for demo mode (view-only)
- Or sign in with Google for full access

## 📁 Project Structure

```
kitab/
├── app/
│   ├── [locale]/              # Locale-based routing (en, ar, fr, ur)
│   │   ├── (main)/            # Main site layout
│   │   │   ├── page.tsx       # Homepage
│   │   │   ├── blog/          # Blog pages
│   │   │   │   ├── page.tsx   # Blog listing
│   │   │   │   └── [slug]/    # Individual posts
│   │   │   └── about/         # About page
│   │   └── admin/             # Admin dashboard
│   │       ├── layout.tsx     # Admin layout
│   │       ├── page.tsx       # Dashboard
│   │       ├── posts/         # Post management
│   │       └── settings/      # Settings
│   ├── sitemap.ts             # Dynamic sitemap generation
│   └── robots.ts              # Robots.txt configuration
├── components/
│   ├── admin/                 # Admin components
│   │   ├── post-editor.tsx    # Multi-locale post editor
│   │   ├── seo-section.tsx    # SEO metadata editor
│   │   ├── content-editor.tsx # Rich text + Markdown editor
│   │   └── image-upload.tsx   # Image upload component
│   ├── mdx/                   # Custom MDX components
│   │   ├── blockquote.tsx     # Blockquote & PullQuote
│   │   ├── callout.tsx        # Info/Warning/Error boxes
│   │   ├── code-block.tsx     # Code with syntax highlighting
│   │   ├── figure.tsx         # Images with captions
│   │   └── media-embed.tsx    # YouTube/Vimeo embeds
│   └── blog/                  # Blog components
│       └── table-of-contents.tsx
├── content/
│   ├── posts/                 # MDX blog posts
│   │   ├── en/                # English posts
│   │   ├── ar/                # Arabic posts
│   │   ├── fr/                # French posts
│   │   └── ur/                # Urdu posts
│   └── IMAGE_GENERATION_GUIDE.md  # AI image generation prompts
├── lib/
│   ├── supabase/              # Supabase utilities
│   │   ├── api.ts             # Database queries
│   │   ├── client.ts          # Client & server clients
│   │   └── types.ts           # TypeScript types
│   └── utils.ts               # Utility functions
├── scripts/
│   ├── seed-posts.ts          # Seed database from MDX files
│   ├── upload-images.ts       # Upload images to Supabase
│   └── fix-blog-links.ts      # Fix internal links with locales
└── supabase/
    ├── schema.sql             # Database schema
    └── migrations/            # Database migrations
```

## 🎨 Customization

### Adding Content

1. **Create MDX file** in `content/posts/[locale]/`
2. **Add frontmatter** with metadata
3. **Write content** using MDX components
4. **Run seed script** to sync to database

Example:

```mdx
---
id: "my-post-slug"
title: "My Post Title"
titleAr: "عنوان مقالتي"
titleFr: "Titre de mon article"
titleUr: "میری پوسٹ کا عنوان"
excerpt: "Post excerpt..."
category: "rtl-ltr-concepts"
author: "nuno-marques"
publishedAt: "2025-01-28"
readingTime: 5
featured: false
featuredImage: "https://..."
tags: ["rtl", "css"]
---

## Content starts here

<Callout type="info">
This is an info callout!
</Callout>
```

### Customizing SEO

Edit SEO fields in the admin dashboard:
1. Go to `/admin/posts`
2. Edit a post
3. Scroll to "SEO Settings (Per Language)"
4. Customize meta title, description, OG image per locale

### Styling

- `tailwind.config.ts` - Tailwind configuration
- `app/globals.css` - Global styles
- All components use CSS Logical Properties for RTL support

## 📄 Pages

### Public Pages
- **`/[locale]`** - Homepage with featured posts
- **`/[locale]/blog`** - Blog listing with filters
- **`/[locale]/blog/[slug]`** - Individual post with ToC and related posts
- **`/[locale]/about`** - About page

### Admin Pages
- **`/[locale]/admin`** - Dashboard with analytics
- **`/[locale]/admin/posts`** - Post management (list, create, edit, delete)
- **`/[locale]/admin/settings`** - Profile and settings

## 🔐 Authentication

Kitab supports two modes:

### Guest Mode (Demo)
- View-only access
- No mutations allowed
- Perfect for demos and portfolio

### Admin Mode
- Google OAuth sign-in
- Email whitelist (ADMIN_EMAILS env var)
- Full CRUD operations
- Image upload to Supabase Storage

## 📊 SEO Best Practices

### Meta Tags
- Title: 50-60 characters
- Description: 150-160 characters
- Use focus keywords naturally

### Open Graph Images
- Size: 1200×630px
- Format: JPG or PNG
- Include text overlay for clarity

### Structured Data
- BlogPosting schema auto-generated
- Includes author, publisher, dates
- Validates with Google Rich Results Test

## 👨‍💻 Author

**Nuno Marques** ([@ositaka](https://github.com/ositaka))
- Website: [ositaka.com](https://ositaka.com)
- Email: info@ositaka.com
- GitHub: [@ositaka](https://github.com/ositaka)

Built as a demonstration of [Noor UI](https://noorui.com) - the RTL-first React design system.

## 📄 License

MIT License - see the [LICENSE](LICENSE) file for details.

Copyright (c) 2024-2025 Nuno Marques

## Learn More

- [Noor UI Documentation](https://noorui.com)
- [Next.js Documentation](https://nextjs.org/docs)
