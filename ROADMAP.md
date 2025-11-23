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

### 2.1 Blockquote Component
- [ ] Styled blockquote with author attribution
- [ ] Support for pull quotes
- [ ] RTL text direction support
- [ ] Multiple variants (default, highlight, warning)

### 2.2 Video/Audio Component
- [ ] Video player with custom controls
- [ ] Audio player with waveform visualization
- [ ] Support for YouTube, Vimeo embeds
- [ ] Podcast-style audio player
- [ ] RTL controls layout

### 2.3 Gallery Component
- [ ] Image gallery with lightbox
- [ ] Carousel/slider mode
- [ ] Grid layout options
- [ ] RTL swipe direction
- [ ] Captions support

### 2.4 Code Block Component
- [ ] Syntax highlighting
- [ ] Copy button
- [ ] Line numbers
- [ ] Line highlighting
- [ ] File name header
- [ ] RTL-aware for Arabic code comments

**New noorui-rtl components:**
- `Blockquote` - Styled quote with attribution
- `PullQuote` - Highlighted pull quote
- `VideoPlayer` - Custom video player
- `AudioPlayer` - Podcast-style audio player
- `MediaEmbed` - YouTube/Vimeo embed wrapper
- `ImageGallery` - Grid gallery with lightbox
- `Carousel` - Image/content carousel
- `CodeBlock` - Enhanced code display

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

### 3.2 Social Sharing
- [ ] Share buttons (Twitter, Facebook, LinkedIn, WhatsApp)
- [ ] Copy link button
- [ ] Native share API support
- [ ] Share counts (optional)

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
- [ ] Supabase Auth integration
- [ ] Admin role check
- [ ] Protected routes

### 4.2 Post Management
- [x] Posts list with filters
- [x] Create/Edit post form
- [x] Rich text editor (already have `RichTextEditor` in noorui-rtl)
- [x] Draft/Publish workflow
- [ ] Image upload to Supabase Storage
- [x] Translation management (all 4 locales)

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

**New noorui-rtl components:**
- `AdminLayout` - Admin panel shell (using DashboardShell)
- `PostEditor` - Full post editing experience
- `ImageUpload` - Drag & drop image upload
- `TranslationEditor` - Side-by-side translation editing
- `StatsCard` - Analytics display card

---

## Phase 5: Discovery & Navigation

### 5.1 Search
- [ ] Full-text search
- [ ] Search modal (Cmd+K)
- [ ] Search suggestions
- [ ] RTL search input

### 5.2 Related Posts
- [ ] Algorithm improvements (tags, categories)
- [ ] Visual related posts section

### 5.3 Pagination
- [ ] Numbered pagination
- [ ] Infinite scroll option
- [ ] Load more button

### 5.4 Filters & Sorting
- [ ] Sort by date, popularity
- [ ] Filter by tag, category
- [ ] URL-based filters

**New noorui-rtl components:**
- `SearchModal` - Cmd+K search experience
- `SearchInput` - RTL-aware search input
- `Pagination` - (already exists, may need enhancement)
- `InfiniteScroll` - Auto-loading content

---

## Phase 6: SEO & Performance

### 6.1 SEO
- [ ] Dynamic meta tags
- [ ] Open Graph images
- [ ] JSON-LD structured data
- [ ] Sitemap generation
- [ ] RSS feed

### 6.2 Performance
- [ ] Image optimization (already using next/image)
- [ ] Lazy loading
- [ ] Static generation where possible
- [ ] Bundle analysis

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

## Phase 7: Component Migration to noorui-rtl

### Development Workflow

```
┌─────────────────────────────────────────────────────────────────┐
│  1. PROTOTYPE IN KITAB                                          │
│     Build component in /components/ui/                          │
│     Test with real blog content (all 4 locales)                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  2. CREATE COMPONENT SPEC                                       │
│     Generate /docs/components/<component-name>.md               │
│     Include: Props, Variants, RTL behavior, Examples            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  3. MIGRATE TO NOORUI-RTL (separate session)                    │
│     Copy component to noorui-rtl repo                           │
│     Add to exports, write tests, update docs                    │
│     Publish new version                                         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  4. UPDATE KITAB                                                │
│     npm update noorui-rtl                                       │
│     Replace local import with package import                    │
│     Delete local component file                                 │
└─────────────────────────────────────────────────────────────────┘
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

### Components to Migrate (by Phase)

#### From Phase 1
- [ ] `TableOfContents`
- [ ] `StickyAside`

#### From Phase 2
- [ ] `Blockquote`
- [ ] `PullQuote`
- [ ] `VideoPlayer`
- [ ] `AudioPlayer`
- [ ] `MediaEmbed`
- [ ] `ImageGallery`
- [ ] `Carousel`
- [ ] `CodeBlock`

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
- [ ] `ImageUpload` - Drag & drop image upload (future)

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

#### From Phase 5
- [ ] `SearchModal`
- [ ] `SearchInput`
- [ ] `InfiniteScroll`

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
