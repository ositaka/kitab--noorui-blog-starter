'use client'

import {
  MDXEditor,
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  linkPlugin,
  linkDialogPlugin,
  tablePlugin,
  codeBlockPlugin,
  codeMirrorPlugin,
  toolbarPlugin,
  UndoRedo,
  BoldItalicUnderlineToggles,
  BlockTypeSelect,
  CreateLink,
  ListsToggle,
  InsertTable,
  InsertThematicBreak,
  CodeToggle,
  type MDXEditorMethods,
} from '@mdxeditor/editor'
import '@mdxeditor/editor/style.css'
import { useRef, useEffect } from 'react'

interface MDXEditorWrapperProps {
  markdown: string
  onChange: (markdown: string) => void
  placeholder?: string
}

export default function MDXEditorWrapper({
  markdown,
  onChange,
  placeholder,
}: MDXEditorWrapperProps) {
  const editorRef = useRef<MDXEditorMethods>(null)

  // Update editor content when markdown prop changes externally
  useEffect(() => {
    if (editorRef.current) {
      const currentContent = editorRef.current.getMarkdown()
      if (currentContent !== markdown) {
        editorRef.current.setMarkdown(markdown)
      }
    }
  }, [markdown])

  return (
    <div className="mdx-editor-container">
      <MDXEditor
        ref={editorRef}
        markdown={markdown}
        onChange={onChange}
        placeholder={placeholder}
        contentEditableClassName="prose prose-sm dark:prose-invert max-w-none min-h-[250px] p-4 focus:outline-none"
        plugins={[
          // Core plugins
          headingsPlugin(),
          listsPlugin(),
          quotePlugin(),
          thematicBreakPlugin(),
          markdownShortcutPlugin(),
          linkPlugin(),
          linkDialogPlugin(),
          tablePlugin(),
          codeBlockPlugin({ defaultCodeBlockLanguage: 'js' }),
          codeMirrorPlugin({
            codeBlockLanguages: {
              js: 'JavaScript',
              ts: 'TypeScript',
              tsx: 'TypeScript (React)',
              jsx: 'JavaScript (React)',
              css: 'CSS',
              html: 'HTML',
              json: 'JSON',
              bash: 'Bash',
              shell: 'Shell',
              python: 'Python',
              sql: 'SQL',
              md: 'Markdown',
            },
          }),
          // Toolbar
          toolbarPlugin({
            toolbarContents: () => (
              <>
                <UndoRedo />
                <BlockTypeSelect />
                <BoldItalicUnderlineToggles />
                <CodeToggle />
                <CreateLink />
                <ListsToggle />
                <InsertTable />
                <InsertThematicBreak />
              </>
            ),
          }),
        ]}
      />
      <style jsx global>{`
        .mdx-editor-container {
          --font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        }

        .mdx-editor-container [class*="_editorRoot"] {
          font-family: inherit;
        }

        .mdx-editor-container [class*="_toolbarRoot"] {
          background: hsl(var(--muted));
          border-bottom: 1px solid hsl(var(--border));
          padding: 4px 8px;
          gap: 4px;
          flex-wrap: wrap;
        }

        .mdx-editor-container [class*="_toolbarRoot"] button,
        .mdx-editor-container [class*="_toolbarRoot"] select {
          background: transparent;
          border: 1px solid transparent;
          border-radius: 4px;
          padding: 4px 8px;
          font-size: 12px;
          color: hsl(var(--foreground));
          cursor: pointer;
          transition: all 0.2s;
        }

        .mdx-editor-container [class*="_toolbarRoot"] button:hover,
        .mdx-editor-container [class*="_toolbarRoot"] select:hover {
          background: hsl(var(--accent));
        }

        .mdx-editor-container [class*="_toolbarRoot"] button[data-state="on"],
        .mdx-editor-container [class*="_toolbarRoot"] button:active {
          background: hsl(var(--accent));
          color: hsl(var(--accent-foreground));
        }

        .mdx-editor-container [class*="_contentEditable"] {
          min-height: 250px;
          padding: 1rem;
        }

        .mdx-editor-container [class*="_contentEditable"]:focus {
          outline: none;
        }

        /* Code blocks */
        .mdx-editor-container pre {
          background: hsl(var(--muted));
          border: 1px solid hsl(var(--border));
          border-radius: 6px;
          padding: 1rem;
          overflow-x: auto;
          font-family: var(--font-mono);
        }

        .mdx-editor-container code {
          font-family: var(--font-mono);
          font-size: 0.875em;
        }

        /* Inline code */
        .mdx-editor-container :not(pre) > code {
          background: hsl(var(--muted));
          padding: 0.2rem 0.4rem;
          border-radius: 4px;
        }

        /* Tables */
        .mdx-editor-container table {
          border-collapse: collapse;
          width: 100%;
          margin: 1rem 0;
        }

        .mdx-editor-container th,
        .mdx-editor-container td {
          border: 1px solid hsl(var(--border));
          padding: 0.5rem 1rem;
          text-align: start;
        }

        .mdx-editor-container th {
          background: hsl(var(--muted));
          font-weight: 600;
        }

        /* Blockquotes */
        .mdx-editor-container blockquote {
          border-inline-start: 4px solid hsl(var(--primary) / 0.3);
          padding-inline-start: 1rem;
          margin: 1rem 0;
          font-style: italic;
          color: hsl(var(--muted-foreground));
        }

        /* Links */
        .mdx-editor-container a {
          color: hsl(var(--primary));
          text-decoration: underline;
        }

        /* Dark mode adjustments */
        .dark .mdx-editor-container [class*="_toolbarRoot"] {
          background: hsl(var(--muted));
        }

        /* Popover/dialog styles */
        .mdx-editor-container [class*="_dialogContent"],
        .mdx-editor-container [class*="_popoverContent"] {
          background: hsl(var(--background));
          border: 1px solid hsl(var(--border));
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          padding: 1rem;
        }

        .mdx-editor-container [class*="_dialogContent"] input,
        .mdx-editor-container [class*="_popoverContent"] input {
          background: hsl(var(--background));
          border: 1px solid hsl(var(--border));
          border-radius: 4px;
          padding: 0.5rem;
          font-size: 14px;
          width: 100%;
          color: hsl(var(--foreground));
        }

        .mdx-editor-container [class*="_dialogContent"] button[type="submit"],
        .mdx-editor-container [class*="_primaryButton"] {
          background: hsl(var(--primary));
          color: hsl(var(--primary-foreground));
          border: none;
          border-radius: 4px;
          padding: 0.5rem 1rem;
          cursor: pointer;
        }
      `}</style>
    </div>
  )
}
