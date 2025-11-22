'use client'

import Link from 'next/link'
import Image from 'next/image'
import type { MDXComponents } from 'mdx/types'
import { Card, CardContent, Badge, Separator } from 'noorui-rtl'
import { Copy, Check, ExternalLink } from 'lucide-react'
import { useState } from 'react'

// Custom Code Block with copy functionality
function CodeBlock({ children, className, ...props }: React.HTMLAttributes<HTMLElement>) {
  const [copied, setCopied] = useState(false)
  const language = className?.replace('language-', '') || 'text'

  const handleCopy = async () => {
    const code = typeof children === 'string' ? children : ''
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative group">
      {language && language !== 'text' && (
        <span className="absolute top-2 start-3 text-xs text-muted-foreground font-mono">
          {language}
        </span>
      )}
      <button
        onClick={handleCopy}
        className="absolute top-2 end-2 p-1.5 rounded-md bg-muted/50 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-muted"
        aria-label="Copy code"
      >
        {copied ? (
          <Check className="h-4 w-4 text-green-500" />
        ) : (
          <Copy className="h-4 w-4 text-muted-foreground" />
        )}
      </button>
      <code className={className} {...props}>
        {children}
      </code>
    </div>
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
    <Card className="my-6 border callout" data-callout-type={type}>
      <CardContent className="p-4">
        {title && <p className="font-semibold mb-2">{title}</p>}
        <div className="text-sm">{children}</div>
      </CardContent>
    </Card>
  )
}

// Horizontal rule
function Hr() {
  return <Separator className="my-8" />
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

  // Code
  pre: (props) => <pre className="my-6 p-4 rounded-lg bg-muted overflow-auto" {...props} />,
  code: CodeBlock,

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
