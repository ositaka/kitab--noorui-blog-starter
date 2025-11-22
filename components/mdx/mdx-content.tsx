'use client'

import { MDXRemote, type MDXRemoteSerializeResult } from 'next-mdx-remote'
import { mdxComponents } from '@/lib/mdx/components'

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
