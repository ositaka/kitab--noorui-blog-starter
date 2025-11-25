'use client'

import * as React from 'react'
import {
  Button,
  Tabs,
  TabsList,
  TabsTrigger,
  Textarea,
} from 'noorui-rtl'
import { Eye, Code, Type, Copy, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import dynamic from 'next/dynamic'

// Dynamically import MDXEditor to avoid SSR issues
const MDXEditorComponent = dynamic(
  () => import('./mdx-editor-wrapper'),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center p-8 text-muted-foreground">
        Loading editor...
      </div>
    )
  }
)

export type ContentFormat = 'html' | 'markdown'

export interface ContentEditorProps {
  content: string
  format: ContentFormat
  onChange: (content: string, format: ContentFormat) => void
  placeholder?: string
  className?: string
  minHeight?: string
  dir?: 'ltr' | 'rtl'
}

/**
 * ContentEditor - Dual-mode editor supporting Rich Text (MDX) and Markdown
 * Uses MDXEditor for WYSIWYG markdown editing
 *
 * Features:
 * - Rich Text mode (WYSIWYG via MDXEditor - native markdown)
 * - Markdown mode (raw text)
 * - Preview mode for both formats
 * - RTL support
 * - Copy to clipboard
 */
export function ContentEditor({
  content,
  format,
  onChange,
  placeholder,
  className,
  minHeight = '300px',
  dir = 'ltr',
}: ContentEditorProps) {
  const [mode, setMode] = React.useState<'rich' | 'markdown' | 'preview'>('rich')
  const [copied, setCopied] = React.useState(false)
  const isRTL = dir === 'rtl'

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleEditorChange = (markdown: string) => {
    onChange(markdown, 'markdown')
  }

  const handleMarkdownChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value, 'markdown')
  }

  // Simple markdown to HTML preview (basic conversion)
  const renderMarkdownPreview = (md: string) => {
    // Process tables first (before other conversions break the structure)
    let html = md

    // Handle markdown tables
    const tableSeparatorPattern = '[-:' + String.raw`\s` + '|]+'
    const tableRegex = new RegExp(`^\\|(.+)\\|\\s*\\n\\|${tableSeparatorPattern}\\|\\s*\\n((?:\\|.+\\|\\s*\\n?)+)`, 'gm')
    html = html.replace(tableRegex, (match, headerRow, bodyRows) => {
      const headers = headerRow.split('|').map((h: string) => h.trim()).filter(Boolean)
      const headerHtml = headers.map((h: string) => `<th class="border border-border px-4 py-2 bg-muted font-medium">${h}</th>`).join('')

      const rows = bodyRows.trim().split('\n').map((row: string) => {
        const cells = row.split('|').map((c: string) => c.trim()).filter(Boolean)
        return `<tr>${cells.map((c: string) => `<td class="border border-border px-4 py-2">${c}</td>`).join('')}</tr>`
      }).join('')

      return `<table class="w-full border-collapse my-4"><thead><tr>${headerHtml}</tr></thead><tbody>${rows}</tbody></table>`
    })

    // Now apply other markdown conversions
    html = html
      // Headers
      .replace(/^### (.*$)/gim, '<h3 class="text-xl font-semibold mt-6 mb-2">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mt-8 mb-3">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mt-10 mb-4">$1</h1>')
      // Bold and italic
      .replace(/\*\*\*(.*?)\*\*\*/gim, '<strong><em>$1</em></strong>')
      .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/gim, '<em>$1</em>')
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" class="text-primary underline">$1</a>')
      // Code blocks
      .replace(/```([\s\S]*?)```/gim, '<pre class="bg-muted p-4 rounded-lg overflow-auto my-4"><code>$1</code></pre>')
      // Inline code
      .replace(/`([^`]+)`/gim, '<code class="bg-muted px-1 py-0.5 rounded text-sm">$1</code>')
      // Blockquotes
      .replace(/^> (.*$)/gim, '<blockquote class="border-s-4 border-primary/30 ps-4 italic text-muted-foreground my-4">$1</blockquote>')
      // Unordered lists
      .replace(/^- (.*$)/gim, '<li class="ms-4">$1</li>')
      .replace(/^\* (.*$)/gim, '<li class="ms-4">$1</li>')
      // Ordered lists
      .replace(/^\d+\. (.*$)/gim, '<li class="ms-4">$1</li>')
      // Paragraphs (double newlines)
      .replace(/\n\n/gim, '</p><p class="my-4">')
      // Line breaks
      .replace(/\n/gim, '<br />')

    // Wrap in paragraph if not starting with a block element
    if (!html.startsWith('<h') && !html.startsWith('<pre') && !html.startsWith('<blockquote') && !html.startsWith('<table')) {
      html = `<p class="my-4">${html}</p>`
    }

    return html
  }

  return (
    <div className={cn('rounded-md border border-input bg-background overflow-hidden', className)}>
      {/* Mode switcher toolbar */}
      <div className="flex items-center justify-between border-b border-border bg-muted/30 px-2 py-1.5">
        <Tabs value={mode} onValueChange={(v) => setMode(v as typeof mode)}>
          <TabsList className="h-8">
            <TabsTrigger value="rich" className="h-7 px-3 text-xs gap-1.5">
              <Type className="h-3.5 w-3.5" />
              {isRTL ? 'محرر مرئي' : 'Visual'}
            </TabsTrigger>
            <TabsTrigger value="markdown" className="h-7 px-3 text-xs gap-1.5">
              <Code className="h-3.5 w-3.5" />
              Markdown
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">MD</span>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2"
            onClick={handleCopy}
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-green-500" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </Button>
        </div>
      </div>

      {/* Editor content */}
      <div style={{ minHeight }}>
        {mode === 'rich' && (
          <MDXEditorComponent
            markdown={content}
            onChange={handleEditorChange}
            placeholder={placeholder || (isRTL ? 'ابدأ الكتابة...' : 'Start writing...')}
          />
        )}

        {mode === 'markdown' && (
          <Textarea
            value={content}
            onChange={handleMarkdownChange}
            placeholder={placeholder || (isRTL ? '# ابدأ الكتابة بالماركداون...' : '# Start writing in Markdown...')}
            className="border-0 rounded-none resize-none font-mono text-sm"
            style={{ minHeight }}
            dir={dir}
          />
        )}

        {/* Preview mode removed - MDX custom components not supported in editor preview */}
        {mode === 'preview' && mode !== 'preview' && (
          <div
            className={cn(
              'prose prose-sm dark:prose-invert max-w-none p-4',
              isRTL && 'text-right'
            )}
            dir={dir}
            dangerouslySetInnerHTML={{
              __html: renderMarkdownPreview(content) || `<p class="text-muted-foreground">${isRTL ? 'لا يوجد محتوى للمعاينة' : 'No content to preview'}</p>`,
            }}
          />
        )}
      </div>

      {/* Format indicator */}
      <div className="flex items-center justify-between border-t border-border bg-muted/30 px-3 py-1.5 text-xs text-muted-foreground">
        <span>
          {mode === 'rich' && (isRTL ? 'المحرر المرئي - الإخراج: Markdown' : 'Visual editor - Output: Markdown')}
          {mode === 'markdown' && (isRTL ? 'وضع الماركداون' : 'Markdown mode')}
          {mode === 'preview' && (isRTL ? 'معاينة المحتوى' : 'Content preview')}
        </span>
        <span>{content.length} {isRTL ? 'حرف' : 'chars'}</span>
      </div>
    </div>
  )
}

export default ContentEditor
