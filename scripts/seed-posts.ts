/**
 * Seed Script - Import markdown posts into Supabase
 *
 * Uses Strapi-style translations pattern:
 * - posts table: shared/non-translatable fields
 * - post_translations table: locale-specific content
 *
 * Usage:
 *   npx tsx scripts/seed-posts.ts
 *
 * Requirements:
 *   - Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local
 */

import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'

// Load environment variables
const dotenv = require('dotenv')
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

interface PostFrontmatter {
  id: string
  title: string
  excerpt: string
  category: string
  author: string
  publishedAt: string
  readingTime: number
  featured: boolean
  featuredImage: string
  tags: string[]
}

type Locale = 'en' | 'fr' | 'ar' | 'ur'

async function parseMarkdownFile(filePath: string): Promise<{ frontmatter: PostFrontmatter; content: string } | null> {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8')

    // Simple frontmatter parsing
    const frontmatterMatch = fileContent.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
    if (!frontmatterMatch) {
      console.warn(`No frontmatter found in ${filePath}`)
      return null
    }

    const [, frontmatterStr, content] = frontmatterMatch

    // Parse YAML-like frontmatter
    const frontmatter: Partial<PostFrontmatter> = {}
    const lines = frontmatterStr.split('\n')

    for (const line of lines) {
      const colonIndex = line.indexOf(':')
      if (colonIndex === -1) continue

      const key = line.substring(0, colonIndex).trim()
      let value = line.substring(colonIndex + 1).trim()

      // Remove quotes
      if ((value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1)
      }

      // Parse arrays
      if (value.startsWith('[') && value.endsWith(']')) {
        const arrayStr = value.slice(1, -1)
        const items = arrayStr.split(',').map(item => {
          item = item.trim()
          if ((item.startsWith('"') && item.endsWith('"')) ||
              (item.startsWith("'") && item.endsWith("'"))) {
            return item.slice(1, -1)
          }
          return item
        })
        ;(frontmatter as any)[key] = items
        continue
      }

      // Parse booleans
      if (value === 'true') {
        ;(frontmatter as any)[key] = true
        continue
      }
      if (value === 'false') {
        ;(frontmatter as any)[key] = false
        continue
      }

      // Parse numbers
      const num = parseInt(value)
      if (!isNaN(num) && String(num) === value) {
        ;(frontmatter as any)[key] = num
        continue
      }

      ;(frontmatter as any)[key] = value
    }

    return {
      frontmatter: frontmatter as PostFrontmatter,
      content: content.trim()
    }
  } catch (error) {
    console.error(`Error parsing ${filePath}:`, error)
    return null
  }
}

// Simple markdown to HTML conversion
function markdownToHtml(markdown: string): string {
  return markdown
    // Headers
    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
    .replace(/^# (.*$)/gm, '<h1>$1</h1>')
    // Bold and italic
    .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Code blocks
    .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    // Lists
    .replace(/^\- (.*$)/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>')
    .replace(/^\d+\. (.*$)/gm, '<li>$1</li>')
    // Paragraphs
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(?!<[hpuol])/gm, '<p>')
    .replace(/(?<![>\n])$/gm, '</p>')
    // Clean up
    .replace(/<p><\/p>/g, '')
    .replace(/<p>(<[hpuol])/g, '$1')
    .replace(/(<\/[hpuol][^>]*>)<\/p>/g, '$1')
}

// Map category name to category ID
const categoryMap: Record<string, string> = {
  'scripts-alphabets': 'scripts-alphabets',
  'rtl-ltr-concepts': 'rtl-ltr-concepts',
  'typography': 'typography',
  'cultural-context': 'cultural-context',
}

interface PostData {
  slug: string
  author_id: string
  category_id: string
  featured_image: string
  reading_time: number
  published_at: string
  is_published: boolean
  is_featured: boolean
  tags: string[]
}

interface TranslationData {
  locale: Locale
  title: string
  excerpt: string
  content: string
}

async function seedPosts() {
  const contentDir = path.join(process.cwd(), 'content', 'posts')
  const locales: Locale[] = ['en', 'fr', 'ar', 'ur']

  console.log('Starting seed process (Strapi-style translations)...')
  console.log(`Content directory: ${contentDir}`)

  // Collect all posts grouped by slug
  const postsBySlug = new Map<string, { base: PostData; translations: TranslationData[] }>()

  for (const locale of locales) {
    const localeDir = path.join(contentDir, locale)

    if (!fs.existsSync(localeDir)) {
      console.log(`Skipping ${locale} - directory not found`)
      continue
    }

    const files = fs.readdirSync(localeDir).filter(f => f.endsWith('.md'))
    console.log(`\nProcessing ${locale}: ${files.length} files`)

    for (const file of files) {
      const filePath = path.join(localeDir, file)
      const parsed = await parseMarkdownFile(filePath)

      if (!parsed) continue

      const { frontmatter, content } = parsed
      // Store raw Markdown - let the frontend handle rendering with MDX/Shiki
      const slug = frontmatter.id

      // If this is the first locale for this slug, create the base record
      if (!postsBySlug.has(slug)) {
        postsBySlug.set(slug, {
          base: {
            slug,
            author_id: frontmatter.author,
            category_id: categoryMap[frontmatter.category] || frontmatter.category,
            featured_image: frontmatter.featuredImage,
            reading_time: frontmatter.readingTime,
            published_at: frontmatter.publishedAt,
            is_published: true,
            is_featured: frontmatter.featured || false,
            tags: frontmatter.tags || [],
          },
          translations: []
        })
      }

      // Add translation with raw Markdown content
      postsBySlug.get(slug)!.translations.push({
        locale,
        title: frontmatter.title,
        excerpt: frontmatter.excerpt,
        content: content,  // Raw Markdown, not HTML
      })
    }
  }

  console.log(`\n--- Inserting ${postsBySlug.size} posts with translations ---\n`)

  let totalPosts = 0
  let totalTranslations = 0
  let errors = 0

  for (const [slug, { base, translations }] of postsBySlug) {
    // Upsert base post
    const { data: post, error: postError } = await supabase
      .from('posts')
      .upsert(base, { onConflict: 'slug' })
      .select('id')
      .single()

    if (postError) {
      console.error(`Error inserting post ${slug}:`, postError.message)
      errors++
      continue
    }

    totalPosts++
    const postId = post.id

    // Insert translations
    for (const translation of translations) {
      const { error: transError } = await supabase
        .from('post_translations')
        .upsert({
          post_id: postId,
          locale: translation.locale,
          title: translation.title,
          excerpt: translation.excerpt,
          content: translation.content,
        }, { onConflict: 'post_id,locale' })

      if (transError) {
        console.error(`Error inserting ${slug}/${translation.locale}:`, transError.message)
        errors++
      } else {
        console.log(`  ✓ ${slug} [${translation.locale}]`)
        totalTranslations++
      }
    }
  }

  console.log('\n--- Seed Summary ---')
  console.log(`Posts created/updated: ${totalPosts}`)
  console.log(`Translations created/updated: ${totalTranslations}`)
  console.log(`Errors: ${errors}`)
}

seedPosts()
  .then(() => {
    console.log('\nSeed completed!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Seed failed:', error)
    process.exit(1)
  })
