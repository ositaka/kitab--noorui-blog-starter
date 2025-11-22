# Noor UI Blog Starter

A minimal, clean blog starter built with [Noor UI](https://noorui.com) component library and Next.js 14.

## Features

### Design & UX
- **Four Design Themes**: Minimal, Futuristic, Cozy, and Artistic
- **Dark Mode**: Complete dark mode support across all themes
- **Bilingual**: Full English/Arabic support with proper RTL layouts
- **Responsive**: Mobile-first design that works on all devices
- **Reading Progress Bar**: Visual progress indicator while reading posts
- **Type Safe**: Built with TypeScript for better developer experience
- **Accessible**: WCAG compliant components throughout

### Content Features
- **Rich Text Editor**: Full WYSIWYG editor in admin dashboard
- **Related Posts**: Automatically shows related posts by category
- **Social Sharing**: Share to Twitter, Facebook, LinkedIn, Email, or copy link
- **Category Filtering**: Browse posts by category
- **Search & Filters**: Find posts quickly with search and filter options
- **Post Analytics**: View counts, comments, and engagement metrics

### Admin Dashboard
- **Complete CMS**: Full-featured content management system at `/admin`
- **DataTable**: Sortable, searchable posts table
- **Bilingual Editor**: Separate tabs for English and Arabic content
- **Analytics View**: Stats cards and top posts performance tracking
- **Draft System**: Save drafts before publishing

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **UI Library**: Noor UI (noorui-rtl)
- **Styling**: Tailwind CSS
- **Type Safety**: TypeScript
- **Date Handling**: date-fns

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the blog.

### Build

```bash
npm run build
npm start
```

## Project Structure

```
├── app/
│   ├── layout.tsx           # Root layout with providers
│   ├── page.tsx             # Homepage with featured post
│   ├── blog/
│   │   ├── page.tsx         # Blog archive page
│   │   └── [slug]/page.tsx  # Single post page
│   ├── category/
│   │   └── [category]/page.tsx  # Category filter page
│   ├── about/page.tsx       # About page
│   └── not-found.tsx        # 404 page
├── components/
│   ├── blog-card.tsx        # Post preview card
│   ├── featured-post.tsx    # Hero section component
│   ├── site-nav.tsx         # Navigation with theme switchers
│   └── site-footer.tsx      # Footer component
└── lib/
    └── posts.ts             # Mock data and post utilities
```

## Customization

### Changing the Default Theme

Edit `app/layout.tsx`:

```tsx
<DesignSystemProvider defaultTheme="cozy"> // Change to: minimal, futuristic, cozy, or artistic
  {children}
</DesignSystemProvider>
```

### Adding Real Content

Replace the mock data in `lib/posts.ts` with your actual content source:

- Connect to a CMS (Contentful, Sanity, etc.)
- Use MDX files for markdown content
- Fetch from your own API

### Customizing Styles

The project uses Tailwind CSS. Customize colors, fonts, and spacing in:

- `tailwind.config.ts` - Tailwind configuration
- `app/globals.css` - Global styles

## Theme Switching

The blog includes three independent theme layers:

1. **Design Theme** (Minimal, Futuristic, Cozy, Artistic)
2. **Color Mode** (Light/Dark)
3. **Direction** (LTR/RTL)

Users can switch between all combinations using the navigation controls.

## Pages

### Public Pages
- **/** - Homepage with featured post and latest articles
- **/blog** - All blog posts with category filters
- **/blog/[slug]** - Individual post page
- **/category/[category]** - Posts filtered by category
- **/about** - About page with project information

### Admin Dashboard
- **/admin** - Complete CMS dashboard for managing blog content
  - **Posts View** - DataTable with all posts, search, and filters
  - **Create/Edit View** - Bilingual post editor with tabs for English/Arabic
  - **Analytics View** - Stats cards and top posts performance

## License

MIT

## Learn More

- [Noor UI Documentation](https://noorui.com)
- [Next.js Documentation](https://nextjs.org/docs)
