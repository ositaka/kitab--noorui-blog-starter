'use client'

import { MDXRemote, type MDXRemoteSerializeResult } from 'next-mdx-remote'
import { Blockquote, PullQuote } from './blockquote'
import { Callout, InfoCallout, WarningCallout, ErrorCallout, SuccessCallout } from './callout'
import { Figure, ImageGrid } from './figure'
import { MediaEmbed, YouTube, Vimeo } from './media-embed'
import { CodeBlock, CopyButton } from './code-block'
import { WideBox } from './wide-box'

// Define components inline to avoid import issues
const mdxComponents = {
  // Custom components
  Blockquote,
  PullQuote,
  Callout,
  InfoCallout,
  WarningCallout,
  ErrorCallout,
  SuccessCallout,
  Figure,
  ImageGrid,
  MediaEmbed,
  YouTube,
  Vimeo,
  CodeBlock,
  CopyButton,
  WideBox,

  // Headings
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => <h1 className="text-4xl font-bold mt-12 mb-4 scroll-mt-24" {...props} />,
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => <h2 className="text-3xl font-bold mt-10 mb-4 scroll-mt-24" {...props} />,
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => <h3 className="text-2xl font-semibold mt-8 mb-3 scroll-mt-24" {...props} />,
  h4: (props: React.HTMLAttributes<HTMLHeadingElement>) => <h4 className="text-xl font-semibold mt-6 mb-2 scroll-mt-24" {...props} />,
  h5: (props: React.HTMLAttributes<HTMLHeadingElement>) => <h5 className="text-lg font-medium mt-4 mb-2 scroll-mt-24" {...props} />,
  h6: (props: React.HTMLAttributes<HTMLHeadingElement>) => <h6 className="text-base font-medium mt-4 mb-2 scroll-mt-24" {...props} />,

  // Text elements
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => <p className="my-4 leading-7" {...props} />,
  strong: (props: React.HTMLAttributes<HTMLElement>) => <strong className="font-semibold" {...props} />,
  em: (props: React.HTMLAttributes<HTMLElement>) => <em className="italic" {...props} />,

  // Links
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a className="text-primary underline underline-offset-4 hover:text-primary/80" {...props} />
  ),

  // Code
  pre: (props: React.HTMLAttributes<HTMLPreElement>) => <pre {...props} />,
  code: (props: React.HTMLAttributes<HTMLElement>) => {
    const className = props.className || ''
    // If inside a pre block (has language class), render as-is
    if (className.includes('language-')) {
      return <code {...props} />
    }
    // Inline code
    return <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono" {...props} />
  },

  // Lists
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => <ul className="my-4 ps-6 list-disc" {...props} />,
  ol: (props: React.OlHTMLAttributes<HTMLOListElement>) => <ol className="my-4 ps-6 list-decimal" {...props} />,
  li: (props: React.LiHTMLAttributes<HTMLLIElement>) => <li className="my-1" {...props} />,

  // Blockquote
  blockquote: (props: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote className="border-s-4 border-primary/30 ps-4 my-6 italic text-muted-foreground" {...props} />
  ),

  // Table
  table: (props: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="my-6 w-full overflow-auto">
      <table className="w-full border-collapse border border-border" {...props} />
    </div>
  ),
  thead: (props: React.HTMLAttributes<HTMLTableSectionElement>) => <thead className="bg-muted/50" {...props} />,
  tr: (props: React.HTMLAttributes<HTMLTableRowElement>) => <tr className="border-b border-border" {...props} />,
  td: (props: React.TdHTMLAttributes<HTMLTableCellElement>) => <td className="border border-border px-4 py-2 text-start" {...props} />,
  th: (props: React.ThHTMLAttributes<HTMLTableCellElement>) => <th className="border border-border px-4 py-2 font-semibold text-start" {...props} />,

  // Horizontal rule
  hr: () => <hr className="my-8 border-border" />,
}

interface MDXContentProps {
  source: MDXRemoteSerializeResult
  className?: string
}

export function MDXContent({ source, className }: MDXContentProps) {
  return (
    <div className={className}>
      <MDXRemote {...source} components={mdxComponents} />
    </div>
  )
}
