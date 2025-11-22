import { serialize } from 'next-mdx-remote/serialize'
import type { MDXRemoteSerializeResult } from 'next-mdx-remote'

export interface SerializeOptions {
  scope?: Record<string, unknown>
}

/**
 * Check if content is raw HTML (from database) vs Markdown/MDX
 * HTML content should be rendered with dangerouslySetInnerHTML, not MDX
 */
export function isHTMLContent(content: string): boolean {
  // Check if content starts with HTML tags (indicating it's raw HTML from DB)
  const htmlStartPattern = /^\s*<(h[1-6]|p|div|section|article|ul|ol|blockquote)/i
  // Check for multiple HTML block elements
  const htmlBlockPattern = /<\/(p|div|h[1-6]|ul|ol|li|blockquote)>/gi
  const matches = content.match(htmlBlockPattern)

  return htmlStartPattern.test(content) || (matches !== null && matches.length > 3)
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
