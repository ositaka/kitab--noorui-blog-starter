# Kitab Blog Roadmap

A plan for enriching the blog while also expanding noorui-rtl components.

---

## Phase 1: Content Rendering & Reading Experience

### 1.1 Markdown/MDX Rendering ✅
- [x] Install `next-mdx-remote` or `@mdx-js/react`
- [x] Create MDX components mapping for custom styling
- [x] Support for code syntax highlighting (`rehype-highlight` or `shiki`)
- [x] RTL-aware prose styles

### 1.2 Sticky Sidebar ✅
- [x] Make sidebar sticky on scroll
- [x] Add smooth scroll behavior
- [x] Collapse on mobile (hidden on mobile, visible on lg+)

### 1.3 Table of Contents (ToC) ✅
- [x] Auto-generate from headings (using rehype-slug + existing ToC component)
- [x] Highlight active section on scroll
- [x] Smooth scroll to section
- [x] RTL-aware positioning (uses CSS logical properties)

**New noorui-rtl components:**
- `TableOfContents` - Auto-generated, scroll-aware ToC
- `StickyAside` - Sticky sidebar container with RTL support

---

## Phase 2: Rich Content Components

### 2.1 Blockquote Component ✅
- [x] Styled blockquote with author attribution
- [x] Support for pull quotes
- [x] RTL text direction support (uses CSS logical properties)
- [x] Multiple variants (default, accent, subtle)

### 2.2 Callout Component ✅
- [x] Info, warning, error, success, note types
- [x] Optional title
- [x] Custom icons support
- [x] RTL-aware layout

### 2.3 Video/Media Component ✅
- [x] Support for YouTube, Vimeo embeds
- [x] Privacy-focused embeds (youtube-nocookie.com, dnt=1)
- [x] Responsive aspect ratios
- [ ] Video player with custom controls (future)
- [ ] Audio player with waveform visualization (future)

### 2.4 Figure/Gallery Component ✅
- [x] Figure with caption
- [x] Image grid layout
- [x] Size variants (default, wide, full)
- [ ] Image gallery with lightbox (future)
- [ ] Carousel/slider mode (future)

### 2.5 Code Block Component ✅
- [x] Syntax highlighting (via rehype-pretty-code)
- [x] Copy button
- [x] File name header
- [x] Line numbers (via Shiki)
- [x] Line highlighting (via Shiki)
- [x] RTL-aware for Arabic code comments

**Components added to Kitab (components/mdx/):**
- `Blockquote` - Styled quote with attribution
- `PullQuote` - Highlighted pull quote
- `Callout` - Info/warning/error/success boxes
- `Figure` - Image with caption
- `ImageGrid` - Grid layout for images
- `MediaEmbed` - YouTube/Vimeo embed wrapper
- `YouTube` - Convenience component for YouTube
- `Vimeo` - Convenience component for Vimeo
- `CodeBlock` - Code with copy button and filename
- `CopyButton` - Standalone copy button
- `WideBox` - Container that breaks out of content width for tables/wide content

**Demo page:** `/en/components-demo` (development only)

### 2.6 About Page ✅
- [x] About page with MDX components showcase
- [x] Demonstrates Callout, PullQuote, Blockquote (accent variant), WideBox
- [x] Creator bio and social links
- [x] Technical highlights table
- [x] Call-to-action for noorui-rtl

**Site Navigation Updates:**
- [x] Dashboard link added to header navigation (all locales)
- [x] Footer links updated with real URLs (GitHub, LinkedIn, noorui.com)
- [x] Social icons: GitHub + LinkedIn (replaced Twitter)

---

## Phase 3: Social & Engagement Features

### 3.1 Comments System
Options to consider:
- [ ] Giscus (GitHub Discussions) - Free, developer-friendly
- [ ] Disqus - Popular, feature-rich
- [ ] Custom with Supabase - Full control, multilingual

Features needed:
- [ ] Threaded replies
- [ ] RTL text input
- [ ] Reactions/likes
- [ ] Moderation

### 3.2 Social Sharing ✅ COMPLETED
- [x] Share buttons (Twitter, Facebook, LinkedIn, WhatsApp)
- [x] Copy link button with clipboard API
- [x] Native share API support (mobile)
- [x] Tooltips for all share buttons
- [x] RTL-aware layout
- [x] Multilingual support (all 4 locales)
- [x] Brand colors on hover
- [x] Integrated into blog post pages

**Social Sharing Features Implemented:**
- ✅ ShareButtons component with 4 social platforms
- ✅ Twitter, Facebook, LinkedIn, WhatsApp sharing
- ✅ Copy link to clipboard with visual feedback
- ✅ Native Share API for mobile devices
- ✅ Tooltips using noorui-rtl Tooltip component
- ✅ Brand-specific hover colors for each platform
- ✅ RTL/LTR support with proper spacing
- ✅ Multilingual button labels and tooltips

**Technical Implementation:**
- Component: `components/social-share-buttons.tsx`
- Props: url, title, description, locale
- Integration: Added to blog post page after content
- Uses Lucide icons: Twitter, Facebook, Linkedin, MessageCircle, Link2, Check
- Clipboard API for copy functionality
- Navigator Share API for native sharing
- TooltipProvider from noorui-rtl for hover tooltips

### 3.3 Newsletter Subscription
- [ ] Email capture form
- [ ] Integration options (Mailchimp, ConvertKit, Buttondown)
- [ ] Inline and popup variants

**New noorui-rtl components:**
- `CommentSection` - Comments display
- `CommentForm` - RTL-aware comment input
- `ShareButtons` - Social sharing
- `NewsletterForm` - Email subscription

---

## Phase 4: Admin Panel

### 4.1 Authentication
- [x] Supabase Auth integration (Google OAuth)
- [x] Admin role check (via ADMIN_EMAILS env var)
- [x] Protected routes (middleware-based)
- [x] Guest mode (view-only access for demos)
- [x] Login page with Google + Guest options
- [x] Auth state management (AuthProvider context)

### 4.2 Post Management
- [x] Posts list with filters
- [x] Create/Edit post form
- [x] Rich text editor (already have `RichTextEditor` in noorui-rtl)
- [x] Draft/Publish workflow
- [x] Image upload to Supabase Storage
- [x] Translation management (all 4 locales)
- [x] Server actions protected (guests cannot edit)
- [x] Toast notifications for errors/success
- [x] Delete post functionality with confirmation dialog
- [x] View count tracking (increments on post view)
- [x] Image upload keyboard accessibility (Tab + Enter/Space)

### 4.3 Dashboard
- [x] Analytics overview (views, popular posts)
- [ ] Recent comments
- [x] Quick actions

### 4.4 Admin Structure (Implemented)
- [x] Separate admin layout (no site header/footer)
- [x] Sidebar navigation with DashboardShell
- [x] Proper Next.js routing (no hash-based navigation)
- [x] Server Actions for mutations
- [x] Sliding panel for post details preview
- [x] Guest mode badge in header
- [x] Settings page with profile, site info, and sign out

**New noorui-rtl components:**
- `AdminLayout` - Admin panel shell (using DashboardShell)
- `PostEditor` - Full post editing experience
- `ImageUpload` - Drag & drop image upload (TODO)
- `TranslationEditor` - Side-by-side translation editing
- `StatsCard` - Analytics display card

### 4.5 Authentication Architecture
```
Guest Mode:                    Admin Mode:
┌─────────────────┐            ┌─────────────────┐
│  Login Page     │            │  Login Page     │
│  "Enter Guest"  │            │  Google Sign-In │
└────────┬────────┘            └────────┬────────┘
         │                              │
         ▼                              ▼
┌─────────────────┐            ┌─────────────────┐
│  Cookie Set     │            │  Supabase Auth  │
│  kitab_guest    │            │  + Email Check  │
└────────┬────────┘            └────────┬────────┘
         │                              │
         ▼                              ▼
┌─────────────────┐            ┌─────────────────┐
│  View Only      │            │  Full Access    │
│  - Can browse   │            │  - CRUD posts   │
│  - No mutations │            │  - All actions  │
└─────────────────┘            └─────────────────┘
```

---

## Phase 5: Discovery & Navigation

### 5.1 Search ✅ COMPLETED
- [x] Full-text search (PostgreSQL)
- [x] Search modal (Cmd+K / Ctrl+K)
- [x] Real-time search with debouncing
- [x] Recent posts display
- [x] RTL search input (Arabic, Urdu)
- [x] Multilingual support (all 4 locales)
- [x] Search button in header with keyboard shortcut hint
- [x] Loading states
- [x] Database migration for search_vector column

**Search Features Implemented:**
- ✅ PostgreSQL full-text search with `tsvector` and GIN index
- ✅ Weighted search ranking: title (A), excerpt (B), content (C)
- ✅ CommandDialog from noorui-rtl for beautiful search UI
- ✅ Keyboard shortcut: Cmd+K or Ctrl+K to open search
- ✅ Debounced search (300ms delay) for better UX
- ✅ Recent posts shown when no query entered
- ✅ Search results with post title, excerpt, reading time
- ✅ Click or Enter to navigate to post
- ✅ Loading animation with pulsing search icon
- ✅ RTL-aware input and layout for Arabic/Urdu
- ✅ Search button in header with visible ⌘K hint

**Technical Implementation:**
- Database: `search_vector` column with GIN index on `post_translations`
- Server Action: `searchPosts()` in `lib/supabase/search.ts`
- Components:
  - `components/search/search-modal.tsx` - Search modal using CommandDialog
  - `components/layout/header.tsx` - Search button integration
- Migration: `supabase/migrations/20250125_add_full_text_search.sql`
- Uses `simple` dictionary for multilingual support
- Supports filters: category, tags, limit

### 5.2 Related Posts ✅ COMPLETED
- [x] Enhanced algorithm with tag matching and relevance scoring
- [x] Category + tag-based matching (10 points per category, 5 points per tag)
- [x] Relevance-based sorting
- [x] Already integrated in sidebar with visual cards
- [x] Multilingual support (all 4 locales)
- [x] Enriched with author and category data

**Related Posts Features Implemented:**
- ✅ Smart algorithm in `getRelatedPosts()` function (lib/supabase/api.ts:145-240)
- ✅ Scoring system: Category match (+10 points) + Tag matches (+5 points each)
- ✅ Filters out unrelated posts (score 0)
- ✅ Sorts by relevance score first, then by published date
- ✅ Falls back to category-only matches if no tag matches found
- ✅ Enriches results with author and category data for display
- ✅ Displays in sidebar with title, reading time, and clickable links
- ✅ RTL-aware layout (proper alignment for Arabic/Urdu)
- ✅ Already integrated in blog post page sidebar

**Technical Implementation:**
- Enhanced Function: `getRelatedPosts(slug, categoryId, locale, limit, tags?)` in `lib/supabase/api.ts`
- Accepts optional `currentTags` parameter for tag-based matching
- Fetches 3x limit to ensure enough candidates for scoring
- Scores each post based on category and tag overlap
- Returns top N posts after sorting by relevance
- Integration: Updated `app/[locale]/(main)/blog/[slug]/page.tsx:175` to pass post tags
- Display: Already showing in `post-client.tsx:199-220` sidebar

### 5.3 Pagination ✅ COMPLETED
- [x] Server-side pagination with page numbers
- [x] URL-based pagination (preserves state on refresh)
- [x] Category filtering with pagination
- [x] RTL-aware pagination controls
- [x] 12 posts per page
- [x] Pagination component from noorui-rtl
- [x] Works across all 4 locales
- [ ] Infinite scroll option (future)
- [ ] Load more button (future)

**Pagination Features Implemented:**
- ✅ Server-side pagination in `getPosts()` API with `withCount` option
- ✅ Returns both posts array and total count for calculating pages
- ✅ URL searchParams handling for page number (`?page=2`)
- ✅ Category filtering with pagination (`?category=id&page=1`)
- ✅ Resets to page 1 when changing category
- ✅ noorui-rtl Pagination component with RTL support
- ✅ Shows pagination only when more than 1 page
- ✅ Limit of 12 posts per page (configurable via POSTS_PER_PAGE constant)

**Technical Implementation:**
- API: Enhanced `getPosts()` in `lib/supabase/api.ts:14-88`
  - Added `withCount` parameter to return `{ posts, total }` object
  - Uses Supabase `count: 'exact'` for accurate pagination
  - Backward compatible - returns array when `withCount: false`
- Server Component: `app/[locale]/(main)/blog/page.tsx`
  - Accepts `searchParams` for page and category
  - Calculates offset based on page number: `(page - 1) * POSTS_PER_PAGE`
  - Passes `currentPage`, `totalPosts`, `postsPerPage` to client
  - Fetches exactly 12 posts per page (configurable via constant)
- Client Component: `app/[locale]/(main)/blog/blog-client.tsx`
  - Calculates `totalPages` from totalPosts and postsPerPage
  - Handles page changes with `handlePageChange()`
  - Updates URL with `router.push()` for stateful navigation
  - Category tabs navigate with URL params (server-side filtering)
  - Uses PaginationWrapper component at bottom of post grid
- Pagination Component: `components/ui/pagination-wrapper.tsx`
  - Wrapper around noorui-rtl compound pagination components
  - Simple API: `currentPage`, `totalPages`, `onPageChange`, `dir`
  - Built with `<Pagination>`, `<PaginationContent>`, `<PaginationItem>`, etc.
  - Smart page rendering: shows first, last, current ± 1, with ellipsis
  - Disabled Previous/Next at boundaries
  - Visual separation with top border and spacing (`mt-12 pt-8 border-t`)
  - Hides when only 1 page exists
  - RTL-aware with `dir` prop

### 5.4 Filters & Sorting
- [ ] Sort by date, popularity
- [ ] Filter by tag, category
- [ ] URL-based filters

**New noorui-rtl components:**
- `SearchModal` - Cmd+K search experience
- `SearchInput` - RTL-aware search input
- `Pagination` - ✅ Exists (compound component pattern)
- `PaginationWrapper` - ✅ Created in Kitab as simple wrapper (could migrate to noorui-rtl)
- `InfiniteScroll` - Auto-loading content (future)

### Phase 6: SEO & Performance Components

**New noorui-rtl components:**
- `NavigationProgress` - Top progress bar for page transitions (like Next.js nprogress)
- `Skeleton` - Skeleton loader component with various shapes/sizes
- `SkeletonText` - Text content skeleton
- `SkeletonImage` - Image placeholder skeleton

---

## Phase 6: SEO & Performance

### 6.1 SEO ✅ COMPLETED
- [x] Dynamic meta tags (title, description, keywords, authors)
- [x] Open Graph metadata (title, description, image, type, locale)
- [x] Twitter Card metadata
- [x] Canonical URLs with hreflang tags (all 4 locales + x-default)
- [x] JSON-LD structured data (BlogPosting schema)
- [x] Sitemap.xml generation (all pages + posts with alternates)
- [x] Robots.txt configuration
- [x] SEO fields in database (meta_title, meta_description, og_image, focus_keyword, twitter_card)
- [x] Database migration for SEO columns in posts_localized view
- [x] SEO admin UI component with per-locale settings
- [x] Auto-population on blur (title → meta_title, excerpt → meta_description)
- [x] Character counters with ideal length validation
- [x] Live search preview in admin
- [x] Full RTL support in SEO interface using `dir` attribute
- [x] Content-based direction (RTL for Arabic/Urdu, LTR for English/French)
- [x] RSS feed generation (all 4 locales)

**SEO Features Implemented:**
- ✅ Per-locale SEO customization (meta title, description, OG image, focus keyword)
- ✅ Character counters for optimal lengths (50-60 for title, 150-160 for description)
- ✅ Color-coded badges (green for ideal, gray/red for suboptimal)
- ✅ Live search preview in admin showing how posts appear in Google
- ✅ Focus keyword field for SEO guidance
- ✅ Twitter card type selection (summary_large_image, summary)
- ✅ Smart auto-population: empty SEO fields auto-fill on blur with title/excerpt
- ✅ Automatic fallbacks in frontend (title → meta_title, excerpt → meta_description, featured_image → og_image)
- ✅ Full RTL support using native `dir` attribute (proper mirroring for Arabic/Urdu)
- ✅ Content-based directionality (editing English in Arabic UI works correctly)
- ✅ All 21 blog posts have SEO metadata across all 4 locales

**Technical Implementation:**
- Database: Added 5 SEO columns to `post_translations` table
- Admin UI: `SEOSection` component with accordion, character counting, preview
- Frontend: `generateMetadata()` function in post pages with comprehensive fallback logic
- RTL: Uses `dir` attribute on containers for automatic CSS mirroring

### 6.4 RSS Feed ✅ COMPLETED
- [x] RSS 2.0 XML generation for all 4 locales
- [x] RSS discovery links in HTML head
- [x] Locale-specific feeds (/en/rss.xml, /ar/rss.xml, /fr/rss.xml, /ur/rss.xml)
- [x] Proper XML escaping for multilingual content
- [x] Include post metadata (author, category, tags, images)
- [x] CDATA sections for full content
- [x] Atom self-link and Dublin Core creator tags
- [x] Cache headers for performance (1 hour cache, 2 hour stale-while-revalidate)

**RSS Feed Features Implemented:**
- ✅ Per-locale RSS feeds at `/{locale}/rss.xml`
- ✅ RSS 2.0 specification compliant
- ✅ Multilingual titles and descriptions
- ✅ Proper XML character escaping (handles Arabic, Urdu, special chars)
- ✅ Full post content in CDATA sections
- ✅ Author attribution with dc:creator
- ✅ Category and tag support
- ✅ Featured image enclosures
- ✅ Proper pub dates in RFC 822 format
- ✅ RSS auto-discovery links in HTML <head>
- ✅ Cache-Control headers for CDN optimization

**Technical Implementation:**
- Route Handler: `app/[locale]/rss.xml/route.ts`
  - Dynamic RSS generation per locale
  - Fetches latest 50 posts from Supabase
  - XML escaping function for security
  - Proper Content-Type and Cache-Control headers
- Layout: `app/[locale]/layout.tsx`
  - Added RSS auto-discovery in generateMetadata()
  - Alternate link with type `application/rss+xml`
  - Multilingual feed titles
- RSS Structure:
  - Channel: Site info, language, lastBuildDate
  - Items: Title, link, guid, description, content, pubDate, author, categories
  - Namespaces: Atom, Content, Dublin Core
  - Features: Enclosures for images, multiple categories per item

### 6.2 Performance
- [x] Image optimization (next/image with Supabase CDN)
- [ ] Lazy loading improvements
- [ ] Static generation optimization
- [ ] Bundle analysis

### 6.3 Loading States ✅ COMPLETED
- [x] Navigation loading indicator (NextTopLoader - top progress bar)
- [x] Skeleton loaders for blog post list
- [x] Skeleton loaders for post content
- [x] Loading states for admin dashboard
- [x] Loading states for admin posts list
- [x] Skeleton components (SkeletonText, SkeletonImage, SkeletonCard)
- [x] RTL/LTR support in all loading states
- [x] Theme-aware (works in light/dark mode)

**Loading States Features Implemented:**
- ✅ NextTopLoader for navigation progress (uses CSS variable `--primary` for theme integration)
- ✅ Skeleton components built on top of noorui-rtl's Skeleton base component
- ✅ SkeletonText: Multi-line text placeholders with customizable widths
- ✅ SkeletonImage: Image placeholders with aspect ratio support (16/9, 4/3, 1/1, 3/2, 2/1)
- ✅ SkeletonCard: Blog post card skeleton matching actual card layout
- ✅ Page-level loading states using Next.js 15 loading.tsx convention
- ✅ All loading states marked as 'use client' for proper React component handling

**Technical Implementation:**
- Package: `nextjs-toploader` installed and integrated in `components/providers.tsx`
- Components: Created in `components/ui/skeleton/` directory
  - `skeleton-text.tsx` - Flexible text line placeholders
  - `skeleton-image.tsx` - Aspect ratio-aware image placeholders
  - `skeleton-card.tsx` - Composite blog card skeleton
  - `index.ts` - Barrel export for easy imports
- Loading pages:
  - `app/[locale]/(main)/blog/loading.tsx` - Blog list skeleton
  - `app/[locale]/(main)/blog/[slug]/loading.tsx` - Blog post skeleton
  - `app/[locale]/admin/loading.tsx` - Admin dashboard skeleton
  - `app/[locale]/admin/posts/loading.tsx` - Admin posts list skeleton
- All loading components use shimmer animation from noorui-rtl Skeleton
- Fully responsive: Mobile/desktop layouts respected
- Accessibility: Skeleton components inherit from noorui-rtl's accessible base

---

## Priority Order (Suggested)

### High Priority (Do First)
1. **Markdown rendering** - Essential for blog content
2. **Sticky sidebar + ToC** - Improves reading experience
3. **Blockquote component** - Common in blog posts

### Medium Priority
4. **Code block component** - Important for tech content
5. **Search** - User expectation
6. **Comments** - Engagement
7. **Admin panel basics** - Content management

### Lower Priority (Nice to Have)
8. **Gallery/Carousel** - Rich media
9. **Video/Audio** - Multimedia content
10. **Newsletter** - Marketing
11. **Advanced analytics** - Insights

---

## Implementation Notes

### For noorui-rtl Development
When creating components, ensure:
- [ ] RTL/LTR support via `dir` prop or context
- [ ] Logical CSS properties (`margin-inline-start`, etc.)
- [ ] Keyboard navigation works in both directions
- [ ] Touch gestures respect direction (swipe left/right)
- [ ] Icons flip when appropriate (arrows, etc.)

### Testing Checklist
For each feature, test in:
- [ ] English (LTR)
- [ ] French (LTR)  
- [ ] Arabic (RTL)
- [ ] Urdu (RTL)
- [ ] Light mode
- [ ] Dark mode
- [ ] Mobile viewport
- [ ] Desktop viewport

---

## Getting Started

To continue development, start a fresh Claude Code session and reference this roadmap:

```
"Let's work on Phase 1 of the Kitab blog roadmap - specifically markdown rendering. Check ROADMAP.md for context."
```

---

## Phase 7: Component Development in noorui-rtl

### Development Workflow

**Primary workflow**: Build components directly in noorui-rtl, then use in Kitab.

```
┌─────────────────────────────────────────────────────────────────┐
│  1. BUILD IN NOORUI-RTL                                         │
│     Create component in noorui-rtl/components/                  │
│     Add TypeScript types, RTL support, variants                 │
│     Write Storybook stories and tests                           │
│     Export from index.ts                                        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  2. PUBLISH NEW VERSION                                         │
│     Bump version in package.json                                │
│     npm publish                                                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  3. USE IN KITAB                                                │
│     npm update noorui-rtl                                       │
│     Import component: import { X } from 'noorui-rtl'            │
│     Use in MDX components or pages                              │
└─────────────────────────────────────────────────────────────────┘
```

**Alternative workflow** (for complex components): Prototype in Kitab first, then migrate.

```
Kitab /components/  →  Test with real content  →  Migrate to noorui-rtl
```

### Component Spec Template

When a component is ready for migration, create a spec file at:
`/docs/components/<component-name>.md`

Template structure:

```markdown
# ComponentName

## Overview
Brief description of what the component does.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| variant | 'default' \| 'highlight' | 'default' | Visual style |
| dir | 'ltr' \| 'rtl' | inherited | Text direction |

## RTL Behavior
- How the component adapts to RTL
- Which CSS properties use logical values
- Icon/arrow flipping behavior

## Variants
Description of each variant with visual examples.

## Usage Examples

### Basic
\`\`\`tsx
<ComponentName>Content</ComponentName>
\`\`\`

### With RTL
\`\`\`tsx
<ComponentName dir="rtl">محتوى عربي</ComponentName>
\`\`\`

## Accessibility
- Keyboard navigation
- ARIA attributes
- Screen reader behavior

## Source Code
\`\`\`tsx
// Full component code here
\`\`\`
```

### Components to Build in noorui-rtl

#### Phase 2: Rich Content Components (Priority: HIGH)

| Component | Description | Props | Status |
|-----------|-------------|-------|--------|
| `Blockquote` | Styled quote with optional author/source | `variant`, `author`, `source`, `cite` | ✅ Ready in Kitab |
| `PullQuote` | Large highlighted quote for emphasis | `align` (left/center/right) | ✅ Ready in Kitab |
| `Callout` | Info/warning/error/success boxes | `type`, `title`, `icon` | ✅ Ready in Kitab |
| `CodeBlock` | Enhanced code with copy, filename | `filename`, `language`, `copyable` | ✅ Ready in Kitab |
| `MediaEmbed` | YouTube/Vimeo embeds | `url`, `aspectRatio`, `caption` | ✅ Ready in Kitab |
| `YouTube` | YouTube convenience wrapper | `id`, `url`, `caption` | ✅ Ready in Kitab |
| `Vimeo` | Vimeo convenience wrapper | `id`, `url`, `caption` | ✅ Ready in Kitab |
| `Figure` | Image with caption | `src`, `alt`, `caption`, `size` | ✅ Ready in Kitab |
| `ImageGrid` | Grid of images | `columns`, `gap` | ✅ Ready in Kitab |
| `CopyButton` | Standalone copy button | `text` | ✅ Ready in Kitab |

**Location:** `components/mdx/` - Ready to migrate to noorui-rtl when needed.

#### Phase 1: Reading Experience
- [ ] `TableOfContents` - Already in Kitab, needs migration
- [ ] `StickyAside` - Sidebar container with sticky behavior

#### From Phase 3
- [ ] `CommentSection`
- [ ] `CommentForm`
- [ ] `ShareButtons`
- [ ] `NewsletterForm`

#### From Phase 4 (Admin Panel)
- [ ] `StatsCard` - Dashboard statistics card with trend indicator
- [ ] `PostsTable` - Posts DataTable with columns, filters, and actions
- [ ] `PostFilters` - Filter controls for posts (search, status, category)
- [ ] `PostEditor` - Multi-locale post editing form
- [ ] `ContentEditor` - Dual-mode editor (Rich Text + Markdown) with preview
- [ ] `TranslationEditor` - Side-by-side translation editor with copy functionality
- [x] `ImageUpload` - Drag & drop image upload (implemented in Kitab)
- [x] `SEOSection` - SEO metadata editor with character counters and preview (implemented in Kitab)

#### Missing Core Components
- [ ] `AlertDialog` - Confirmation dialog for destructive actions (delete, discard changes). Currently using `Dialog` as a workaround in Kitab.
- [ ] `useToast` hook - Toast hook for programmatic toast notifications. Currently using `sonner` directly in Kitab.

#### Bug Fixes Needed in noorui-rtl
- [ ] **DataTable filtering/sorting not working** - The `searchable` prop and column `sortable`/`filterable` props don't seem to trigger actual filtering/sorting. Kitab has a local workaround using Table + custom logic. This should be fixed in noorui-rtl so DataTable works out of the box.

#### Fixed in noorui-rtl v0.3.8
- [x] **DashboardShell DialogTitle accessibility** - Added visually hidden SheetTitle to satisfy radix-ui accessibility requirements. This fixes the console warning about DialogContent requiring DialogTitle.
- [x] **DashboardShell mobile sidebar RTL positioning** - Fixed mobile sidebar to use `side="start"` instead of direction-based logic since CSS logical properties handle RTL automatically. Now the sidebar correctly appears on the right side for RTL locales.

#### Added in noorui-rtl v0.3.11
- [x] **DashboardShell headerActions prop** - New prop to add custom actions (like theme/language switchers) to the header.

#### Added in noorui-rtl v0.3.12
- [x] **RichTextEditor dir prop** - New prop to override direction from context. Useful when editing content in a different language than the page locale (e.g., editing Arabic content on an English admin page).

#### Fixed in noorui-rtl v0.3.13
- [x] **RichTextEditor jsx attribute console error** - Fixed `jsx` attribute console error in Next.js 16 with Turbopack. Replaced styled-jsx with standard `dangerouslySetInnerHTML` for inline styles.

#### Added in noorui-rtl v0.3.14
- [x] **ButtonArrow component** - New button variant with semantic direction support (`forward`/`back`). Arrows automatically flip in RTL mode using `rtl:rotate-180`. Replaces the need for manual arrow icon handling with direction-aware buttons.

#### Added in Kitab v0.1.x
- [x] **Localized date formatting** - Dates now display in Arabic format (e.g., "٢٢ نوفمبر ٢٠٢٥") when in Arabic locale. Uses `Intl.DateTimeFormat` with locale-aware month names and numerals. Created `formatDate` utility in `lib/utils.ts`.
- [x] **Admin auth with Guest mode** - Google OAuth + Email magic link + Guest mode for demos. Protected server actions, toast notifications, settings page.

#### Bug Fixes Needed in Kitab
- [ ] **Translation copy preview not parsing markdown** - When copying content between locales in the TranslationEditor, the preview panel shows raw markdown instead of rendered content. Need to parse/render markdown in the preview.

#### From Phase 5 (Discovery & Navigation)
- [ ] `SearchModal` - Command palette search with Cmd+K
- [ ] `SearchInput` - Dedicated search input with RTL support
- [ ] `PaginationSimple` or `PaginationControlled` - Convenience wrapper for common pagination use case (currently implemented as `PaginationWrapper` in Kitab - could migrate to noorui-rtl)
- [ ] `InfiniteScroll` - Auto-loading content on scroll

### Migration Session Prompt

When starting a new session to migrate components, use:

```
"I have component specs ready in /docs/components/ from the Kitab blog.
Let's migrate [ComponentName] to noorui-rtl package.
Check the spec file for props, RTL behavior, and source code."
```

### After Migration Checklist

For each migrated component:
- [ ] Component added to noorui-rtl/components/
- [ ] Exported from index.ts
- [ ] TypeScript types exported
- [ ] Storybook story created
- [ ] Unit tests written
- [ ] RTL tests included
- [ ] Documentation updated
- [ ] Version bumped
- [ ] Published to npm
- [ ] Kitab updated to use package version

---

## Content Enrichment

### MDX Components Usage
The MDX components from Phase 2 are ready to be used in blog posts. When creating new posts or updating existing ones, consider using:

**Rich Content Components:**
- `<Blockquote author="..." source="...">` - Styled quotes with attribution
- `<PullQuote align="center">` - Large highlighted quotes
- `<Callout type="info|warning|error|success|note" title="...">` - Informational boxes
- `<Figure src="..." alt="..." caption="..." size="default|wide|full" />` - Images with captions
- `<ImageGrid columns={2|3|4}>` - Grid layout for multiple images
- `<YouTube id="..." />` / `<Vimeo id="..." />` - Video embeds
- `<CodeBlock filename="..." language="..." copyable>` - Enhanced code blocks

**Demo page:** `/en/components-demo` (development only)

**TODO:**
- [ ] Update existing blog posts to use MDX components where appropriate
- [ ] Use rich components in upcoming posts for better content presentation

---

## Phase 8: Kitab Migrations (Post noorui-rtl Update)

Once Phase 7 is complete and noorui-rtl has been updated with the missing components, update Kitab to use the new package versions.

### Components to Migrate/Update

#### Delete Confirmation Dialog
**Current workaround:** Using `Dialog` from noorui-rtl
**Target:** Switch to `AlertDialog` when available

**Files to update:**
- [ ] `app/[locale]/admin/posts/posts-list-content.tsx` - Replace `Dialog` with `AlertDialog` for delete confirmation

```tsx
// Before (current workaround)
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from 'noorui-rtl'

// After (when AlertDialog is available)
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from 'noorui-rtl'
```

#### Toast Notifications
**Current workaround:** Using `toast` from `sonner` directly
**Target:** Use `useToast` hook from noorui-rtl when available

**Files to update:**
- [ ] `app/[locale]/admin/posts/posts-list-content.tsx` - Switch from sonner to noorui-rtl toast
- [ ] `app/[locale]/admin/admin-client.tsx` - If using toast notifications
- [ ] `components/providers.tsx` - May need to update Toaster provider

```tsx
// Before (current workaround)
import { toast } from 'sonner'
toast.success('Post deleted successfully')

// After (when useToast is available)
import { useToast } from 'noorui-rtl'
const { toast } = useToast()
toast({ title: 'Post deleted successfully', variant: 'success' })
```

### Migration Checklist

When noorui-rtl is updated:

1. **Update noorui-rtl package**
   ```bash
   npm update noorui-rtl
   ```

2. **Verify new exports are available**
   ```tsx
   // Check in a test file
   import { AlertDialog, useToast } from 'noorui-rtl'
   ```

3. **Update components one by one**
   - [ ] Replace Dialog → AlertDialog for delete confirmations
   - [ ] Replace sonner toast → useToast hook
   - [ ] Test in all 4 locales (en, fr, ar, ur)
   - [ ] Test in light/dark mode
   - [ ] Test on mobile/desktop

4. **Clean up**
   - [ ] Remove sonner dependency if no longer needed
   - [ ] Update providers.tsx to use noorui-rtl Toaster if applicable
