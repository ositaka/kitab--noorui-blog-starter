import { codeToHtml, type BundledLanguage, type BundledTheme } from 'shiki'

export interface HighlightOptions {
  lang?: string
  theme?: BundledTheme
  darkTheme?: BundledTheme
}

const defaultOptions: Required<HighlightOptions> = {
  lang: 'text',
  theme: 'github-light',
  darkTheme: 'github-dark',
}

// Language aliases for common variations
const languageAliases: Record<string, BundledLanguage> = {
  js: 'javascript',
  ts: 'typescript',
  tsx: 'tsx',
  jsx: 'jsx',
  py: 'python',
  rb: 'ruby',
  sh: 'bash',
  shell: 'bash',
  yml: 'yaml',
  md: 'markdown',
  mdx: 'mdx',
}

export async function highlightCode(
  code: string,
  options: HighlightOptions = {}
): Promise<string> {
  const opts = { ...defaultOptions, ...options }
  const lang = (languageAliases[opts.lang ?? 'text'] || opts.lang || 'text') as BundledLanguage

  try {
    // Generate both light and dark versions
    const lightHtml = await codeToHtml(code, {
      lang,
      theme: opts.theme,
    })

    const darkHtml = await codeToHtml(code, {
      lang,
      theme: opts.darkTheme,
    })

    // Wrap in containers for light/dark mode switching
    return `
      <div class="shiki-light block dark:hidden">${lightHtml}</div>
      <div class="shiki-dark hidden dark:block">${darkHtml}</div>
    `
  } catch (error) {
    // Fallback for unsupported languages
    console.warn(`Shiki: Failed to highlight language "${lang}", falling back to plain text`)
    return `<pre><code>${escapeHtml(code)}</code></pre>`
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}
