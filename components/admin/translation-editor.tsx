'use client'

import * as React from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Textarea,
  Badge,
  Button,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from 'noorui-rtl'
import { Copy, Check, Globe, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Locale } from '@/lib/supabase/types'
import { ContentEditor, type ContentFormat } from './content-editor'

export interface TranslationData {
  title: string
  excerpt: string
  content: string
  contentFormat: ContentFormat
}

export interface TranslationEditorProps {
  translations: Record<Locale, TranslationData>
  onChange: (locale: Locale, field: keyof TranslationData, value: string | ContentFormat) => void
  translations_ui: {
    title: string
    excerpt: string
    content: string
    languages: Record<Locale, string>
    copyFrom: string
    translationStatus: string
    complete: string
    incomplete: string
  }
}

const LOCALES: Locale[] = ['en', 'fr', 'ar', 'ur']
const RTL_LOCALES: Locale[] = ['ar', 'ur']

/**
 * TranslationEditor - Side-by-side multi-locale content editor
 * Features:
 * - Tab-based locale switching
 * - Side-by-side comparison (source + target)
 * - Translation status indicators
 * - Copy from another locale
 * - RTL support for Arabic/Urdu
 *
 * Candidate for migration to noorui-rtl (Phase 7)
 */
export function TranslationEditor({
  translations,
  onChange,
  translations_ui: t,
}: TranslationEditorProps) {
  const [activeLocale, setActiveLocale] = React.useState<Locale>('en')
  const [sourceLocale, setSourceLocale] = React.useState<Locale | null>(null)
  const [copiedField, setCopiedField] = React.useState<string | null>(null)

  const isRTL = (locale: Locale) => RTL_LOCALES.includes(locale)

  const getTranslationStatus = (locale: Locale): 'complete' | 'incomplete' => {
    const data = translations[locale]
    return data.title && data.content ? 'complete' : 'incomplete'
  }

  const copyFromLocale = (fromLocale: Locale, field: keyof TranslationData) => {
    const value = translations[fromLocale][field]
    if (typeof value === 'string') {
      onChange(activeLocale, field, value)
      setCopiedField(`${fromLocale}-${field}`)
      setTimeout(() => setCopiedField(null), 2000)
    }
  }

  const handleContentChange = (locale: Locale, content: string, format: ContentFormat) => {
    onChange(locale, 'content', content)
    onChange(locale, 'contentFormat', format)
  }

  return (
    <div className="space-y-4">
      {/* Locale tabs with status badges */}
      <Tabs value={activeLocale} onValueChange={(v) => setActiveLocale(v as Locale)}>
        <TabsList className="grid w-full max-w-2xl grid-cols-4">
          {LOCALES.map((locale) => (
            <TabsTrigger key={locale} value={locale} className="gap-2">
              <span>{t.languages[locale]}</span>
              <Badge
                variant="outline"
                className={cn(
                  'h-5 text-[10px]',
                  getTranslationStatus(locale) === 'complete'
                    ? 'bg-green-500/10 text-green-700 border-green-500/30'
                    : 'bg-yellow-500/10 text-yellow-700 border-yellow-500/30'
                )}
              >
                {getTranslationStatus(locale) === 'complete' ? '✓' : '○'}
              </Badge>
            </TabsTrigger>
          ))}
        </TabsList>

        {LOCALES.map((locale) => (
          <TabsContent key={locale} value={locale} className="mt-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Source reference panel */}
              <Card className="border-dashed">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      {t.copyFrom}
                    </CardTitle>
                    <Tabs
                      value={sourceLocale || 'none'}
                      onValueChange={(v) => setSourceLocale(v === 'none' ? null : (v as Locale))}
                    >
                      <TabsList className="h-7">
                        {LOCALES.filter((l) => l !== locale).map((l) => (
                          <TabsTrigger key={l} value={l} className="h-6 px-2 text-xs">
                            {t.languages[l]}
                          </TabsTrigger>
                        ))}
                      </TabsList>
                    </Tabs>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {sourceLocale ? (
                    <>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-xs text-muted-foreground">{t.title}</Label>
                          <CopyButton
                            onClick={() => copyFromLocale(sourceLocale, 'title')}
                            copied={copiedField === `${sourceLocale}-title`}
                          />
                        </div>
                        <p
                          className={cn(
                            'text-sm p-2 rounded bg-muted/50 min-h-[40px]',
                            isRTL(sourceLocale) && 'text-right'
                          )}
                          dir={isRTL(sourceLocale) ? 'rtl' : 'ltr'}
                        >
                          {translations[sourceLocale].title || '-'}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-xs text-muted-foreground">{t.excerpt}</Label>
                          <CopyButton
                            onClick={() => copyFromLocale(sourceLocale, 'excerpt')}
                            copied={copiedField === `${sourceLocale}-excerpt`}
                          />
                        </div>
                        <p
                          className={cn(
                            'text-sm p-2 rounded bg-muted/50 min-h-[60px]',
                            isRTL(sourceLocale) && 'text-right'
                          )}
                          dir={isRTL(sourceLocale) ? 'rtl' : 'ltr'}
                        >
                          {translations[sourceLocale].excerpt || '-'}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-xs text-muted-foreground">{t.content}</Label>
                          <CopyButton
                            onClick={() => copyFromLocale(sourceLocale, 'content')}
                            copied={copiedField === `${sourceLocale}-content`}
                          />
                        </div>
                        <div
                          className={cn(
                            'text-sm p-2 rounded bg-muted/50 min-h-[200px] max-h-[300px] overflow-auto prose prose-sm dark:prose-invert',
                            isRTL(sourceLocale) && 'text-right'
                          )}
                          dir={isRTL(sourceLocale) ? 'rtl' : 'ltr'}
                          dangerouslySetInnerHTML={{
                            __html: translations[sourceLocale].content || '-',
                          }}
                        />
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                      <ChevronRight className="h-8 w-8 mb-2" />
                      <p className="text-sm">Select a source language above</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Active locale editor */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    {t.languages[locale]}
                    <Badge
                      variant="outline"
                      className={cn(
                        getTranslationStatus(locale) === 'complete'
                          ? 'bg-green-500/10 text-green-700 border-green-500/30'
                          : 'bg-yellow-500/10 text-yellow-700 border-yellow-500/30'
                      )}
                    >
                      {getTranslationStatus(locale) === 'complete' ? t.complete : t.incomplete}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor={`title-${locale}`}>{t.title}</Label>
                    <Input
                      id={`title-${locale}`}
                      value={translations[locale].title}
                      onChange={(e) => onChange(locale, 'title', e.target.value)}
                      placeholder={isRTL(locale) ? 'أدخل العنوان...' : 'Enter title...'}
                      dir={isRTL(locale) ? 'rtl' : 'ltr'}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`excerpt-${locale}`}>{t.excerpt}</Label>
                    <Textarea
                      id={`excerpt-${locale}`}
                      value={translations[locale].excerpt}
                      onChange={(e) => onChange(locale, 'excerpt', e.target.value)}
                      placeholder={isRTL(locale) ? 'وصف مختصر...' : 'Brief description...'}
                      dir={isRTL(locale) ? 'rtl' : 'ltr'}
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t.content}</Label>
                    <ContentEditor
                      content={translations[locale].content}
                      format={translations[locale].contentFormat}
                      onChange={(content, format) => handleContentChange(locale, content, format)}
                      dir={isRTL(locale) ? 'rtl' : 'ltr'}
                      placeholder={isRTL(locale) ? 'اكتب محتوى المنشور...' : 'Write your content...'}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

// Helper component
function CopyButton({ onClick, copied }: { onClick: () => void; copied: boolean }) {
  return (
    <Button variant="ghost" size="sm" className="h-6 px-2" onClick={onClick}>
      {copied ? (
        <Check className="h-3 w-3 text-green-500" />
      ) : (
        <Copy className="h-3 w-3" />
      )}
    </Button>
  )
}

export default TranslationEditor
