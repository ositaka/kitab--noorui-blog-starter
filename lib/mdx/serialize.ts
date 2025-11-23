import { serialize } from 'next-mdx-remote/serialize'
import type { MDXRemoteSerializeResult } from 'next-mdx-remote'
import rehypePrettyCode from 'rehype-pretty-code'
import type { Options as PrettyCodeOptions } from 'rehype-pretty-code'
import remarkGfm from 'remark-gfm'

export interface SerializeOptions {
  scope?: Record<string, unknown>
}

// Shiki syntax highlighting options
const prettyCodeOptions: PrettyCodeOptions = {
  theme: {
    dark: 'github-dark',
    light: 'github-light',
  },
  keepBackground: false,
  defaultLang: 'plaintext',
}

/**
 * Check if content is raw HTML (from rich text editor) vs Markdown/MDX
 *
 * We want to be CONSERVATIVE here - only bypass MDX for content that is
 * clearly from a rich text editor (starts with <p>, <div>, etc. and has
 * no markdown patterns).
 *
 * Markdown content should ALWAYS go through MDX for syntax highlighting.
 */
export function isHTMLContent(content: string): boolean {
  // If content contains markdown code blocks, it's markdown - process with MDX
  if (/```[\s\S]*?```/.test(content)) {
    return false
  }

  // If content contains markdown headers, it's markdown
  if (/^#{1,6}\s/m.test(content)) {
    return false
  }

  // If content starts with typical rich-editor HTML wrapper
  const richEditorPattern = /^\s*<(p|div)(\s[^>]*)?>.*<\/(p|div)>/is

  // Only treat as HTML if it looks like rich editor output AND has many closing tags
  const htmlBlockPattern = /<\/(p|div|h[1-6]|ul|ol|li|blockquote|span|strong|em)>/gi
  const matches = content.match(htmlBlockPattern)

  return richEditorPattern.test(content) && matches !== null && matches.length > 5
}

/**
 * Serialize MDX/Markdown content for client-side rendering
 * This function runs on the server
 * Returns null if content is HTML (should use dangerouslySetInnerHTML instead)
 */
export async function serializeMDX(
  content: string,
  options: SerializeOptions = {}
): Promise<MDXRemoteSerializeResult | null> {
  // If content is raw HTML, return null to signal fallback to HTML rendering
  if (isHTMLContent(content)) {
    return null
  }

  try {
    const serialized = await serialize(content, {
      mdxOptions: {
        development: process.env.NODE_ENV === 'development',
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          [rehypePrettyCode, prettyCodeOptions],
        ],
      },
      scope: options.scope,
    })

    return serialized
  } catch (error) {
    // If MDX parsing fails, return null to fall back to HTML rendering
    console.warn('MDX serialization failed, falling back to HTML:', error)
    return null
  }
}

/**
 * Check if content appears to be MDX (contains JSX/components)
 * vs plain Markdown
 */
export function isMDXContent(content: string): boolean {
  // Check for JSX-like patterns (capitalized component names)
  const jsxPattern = /<[A-Z][a-zA-Z]*[\s/>]/
  // Check for import/export statements
  const modulePattern = /^(import|export)\s/m

  return jsxPattern.test(content) || modulePattern.test(content)
}
