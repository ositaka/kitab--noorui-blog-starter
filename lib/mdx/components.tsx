import Link from 'next/link'
import Image from 'next/image'
import type { MDXComponents } from 'mdx/types'
import { ExternalLink } from 'lucide-react'
import { type ReactNode } from 'react'

// Helper to extract text content from React children
function extractTextContent(node: ReactNode): string {
  if (typeof node === 'string') return node
  if (typeof node === 'number') return String(node)
  if (!node) return ''
  if (Array.isArray(node)) return node.map(extractTextContent).join('')
  if (typeof node === 'object' && 'props' in node) {
    const element = node as { props: { children?: ReactNode } }
    return extractTextContent(element.props.children)
  }
  return ''
}

// Pre block - simple wrapper (copy button handled via CSS/JS separately if needed)
function Pre({ children, ...props }: React.HTMLAttributes<HTMLPreElement>) {
  return (
    <pre {...props}>
      {children}
    </pre>
  )
}

// Inline code styling (not inside pre blocks)
function InlineCode({ children, className, ...props }: React.HTMLAttributes<HTMLElement>) {
  // If this code is inside a pre (has data attributes from rehype-pretty-code), render as-is
  if (className?.includes('language-') || props['data-language' as keyof typeof props]) {
    return <code className={className} {...props}>{children}</code>
  }

  // Otherwise, it's inline code - apply inline styling
  return (
    <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
      {children}
    </code>
  )
}

// Custom Blockquote with RTL support
function Blockquote({ children, ...props }: React.HTMLAttributes<HTMLQuoteElement>) {
  return (
    <blockquote
      className="border-s-4 border-primary/30 ps-4 my-6 italic text-muted-foreground"
      {...props}
    >
      {children}
    </blockquote>
  )
}

// Custom Link with external indicator
function CustomLink({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const isExternal = href?.startsWith('http')

  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary underline underline-offset-4 hover:text-primary/80 inline-flex items-center gap-1"
        {...props}
      >
        {children}
        <ExternalLink className="h-3 w-3" />
      </a>
    )
  }

  return (
    <Link href={href || '#'} className="text-primary underline underline-offset-4 hover:text-primary/80" {...props}>
      {children}
    </Link>
  )
}

// Custom Image with next/image
function CustomImage({ src, alt, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) {
  if (!src || typeof src !== 'string') return null

  // Handle relative and absolute URLs
  const isExternal = src.startsWith('http')

  return (
    <figure className="my-8">
      <div className="relative w-full aspect-video rounded-lg overflow-hidden">
        {isExternal ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={alt || ''}
            className="object-cover w-full h-full"
            {...props}
          />
        ) : (
          <Image
            src={src}
            alt={alt || ''}
            fill
            className="object-cover"
          />
        )}
      </div>
      {alt && (
        <figcaption className="text-center text-sm text-muted-foreground mt-2">
          {alt}
        </figcaption>
      )}
    </figure>
  )
}

// Custom Table with RTL support
function Table({ children, ...props }: React.HTMLAttributes<HTMLTableElement>) {
  return (
    <div className="my-6 w-full overflow-auto">
      <table className="w-full border-collapse border border-border" {...props}>
        {children}
      </table>
    </div>
  )
}

function TableHead({ children, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead className="bg-muted/50" {...props}>
      {children}
    </thead>
  )
}

function TableRow({ children, ...props }: React.HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr className="border-b border-border" {...props}>
      {children}
    </tr>
  )
}

function TableCell({ children, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td className="border border-border px-4 py-2 text-start" {...props}>
      {children}
    </td>
  )
}

function TableHeaderCell({ children, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th className="border border-border px-4 py-2 font-semibold text-start" {...props}>
      {children}
    </th>
  )
}

// Callout/Admonition component using CSS variables for theming
interface CalloutProps {
  type?: 'info' | 'warning' | 'error' | 'success'
  title?: string
  children: React.ReactNode
}

function Callout({ type = 'info', title, children }: CalloutProps) {
  // Use data attributes for theming - styles defined in CSS
  return (
    <div className="my-6 rounded-lg border p-4 callout" data-callout-type={type}>
      {title && <p className="font-semibold mb-2">{title}</p>}
      <div className="text-sm">{children}</div>
    </div>
  )
}

// Horizontal rule
function Hr() {
  return <hr className="my-8 border-border" />
}

// Simple Badge component for MDX
function Badge({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${className}`}>
      {children}
    </span>
  )
}

// Export MDX components mapping
export const mdxComponents: MDXComponents = {
  // Headings
  h1: (props) => <h1 className="text-4xl font-bold mt-12 mb-4 scroll-mt-24" {...props} />,
  h2: (props) => <h2 className="text-3xl font-bold mt-10 mb-4 scroll-mt-24" {...props} />,
  h3: (props) => <h3 className="text-2xl font-semibold mt-8 mb-3 scroll-mt-24" {...props} />,
  h4: (props) => <h4 className="text-xl font-semibold mt-6 mb-2 scroll-mt-24" {...props} />,
  h5: (props) => <h5 className="text-lg font-medium mt-4 mb-2 scroll-mt-24" {...props} />,
  h6: (props) => <h6 className="text-base font-medium mt-4 mb-2 scroll-mt-24" {...props} />,

  // Text elements
  p: (props) => <p className="my-4 leading-7" {...props} />,
  strong: (props) => <strong className="font-semibold" {...props} />,
  em: (props) => <em className="italic" {...props} />,

  // Links and media
  a: CustomLink,
  img: CustomImage,

  // Code (rehype-pretty-code handles syntax highlighting)
  pre: Pre,
  code: InlineCode,

  // Lists
  ul: (props) => <ul className="my-4 ps-6 list-disc" {...props} />,
  ol: (props) => <ol className="my-4 ps-6 list-decimal" {...props} />,
  li: (props) => <li className="my-1" {...props} />,

  // Blockquote
  blockquote: Blockquote,

  // Table
  table: Table,
  thead: TableHead,
  tr: TableRow,
  td: TableCell,
  th: TableHeaderCell,

  // Horizontal rule
  hr: Hr,

  // Custom components
  Callout,
  Badge,
}

export default mdxComponents
