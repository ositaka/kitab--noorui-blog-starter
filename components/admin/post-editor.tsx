'use client'

import * as React from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Button,
} from 'noorui-rtl'
import type { Locale, AuthorLocalized, CategoryLocalized } from '@/lib/supabase/types'
import { TranslationEditor, type TranslationData } from './translation-editor'
import type { ContentFormat } from './content-editor'

export interface PostEditorData {
  slug: string
  categoryId: string
  authorId: string
  isPublished: boolean
  isFeatured: boolean
  titles: Record<Locale, string>
  excerpts: Record<Locale, string>
  contents: Record<Locale, string>
}

export interface PostEditorProps {
  data: PostEditorData
  authors: AuthorLocalized[]
  categories: CategoryLocalized[]
  translations: {
    postDetails: string
    title: string
    excerpt: string
    content: string
    category: string
    author: string
    status: string
    draft: string
    published: string
    cancel: string
    saveDraft: string
    publish: string
    all: string
    languages: Record<Locale, string>
  }
  isEditing: boolean
  onChange: (data: PostEditorData) => void
  onCancel: () => void
  onSaveDraft: () => void
  onPublish: () => void
}

const emptyTranslation: TranslationData = {
  title: '',
  excerpt: '',
  content: '',
  contentFormat: 'html',
}

/**
 * PostEditor - Full post editing experience with metadata and translations
 * Uses TranslationEditor for multi-locale content editing
 * Candidate for migration to noorui-rtl (Phase 7)
 */
export function PostEditor({
  data,
  authors,
  categories,
  translations: t,
  isEditing,
  onChange,
  onCancel,
  onSaveDraft,
  onPublish,
}: PostEditorProps) {
  // Convert flat data to TranslationData format
  const [translationFormats, setTranslationFormats] = React.useState<Record<Locale, ContentFormat>>({
    en: 'html',
    fr: 'html',
    ar: 'html',
    ur: 'html',
  })

  const translationsData: Record<Locale, TranslationData> = {
    en: { title: data.titles.en, excerpt: data.excerpts.en, content: data.contents.en, contentFormat: translationFormats.en },
    fr: { title: data.titles.fr, excerpt: data.excerpts.fr, content: data.contents.fr, contentFormat: translationFormats.fr },
    ar: { title: data.titles.ar, excerpt: data.excerpts.ar, content: data.contents.ar, contentFormat: translationFormats.ar },
    ur: { title: data.titles.ur, excerpt: data.excerpts.ur, content: data.contents.ur, contentFormat: translationFormats.ur },
  }

  const handleTranslationChange = (locale: Locale, field: keyof TranslationData, value: string | ContentFormat) => {
    if (field === 'contentFormat') {
      setTranslationFormats(prev => ({ ...prev, [locale]: value as ContentFormat }))
      return
    }

    const fieldMap: Record<string, 'titles' | 'excerpts' | 'contents'> = {
      title: 'titles',
      excerpt: 'excerpts',
      content: 'contents',
    }

    const dataField = fieldMap[field]
    if (dataField) {
      onChange({
        ...data,
        [dataField]: { ...data[dataField], [locale]: value },
      })
    }
  }

  const updateField = <K extends keyof PostEditorData>(field: K, value: PostEditorData[K]) => {
    onChange({ ...data, [field]: value })
  }

  return (
    <div className="space-y-6">
      {/* Action buttons */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          {isEditing ? t.postDetails : t.postDetails}
        </h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel}>
            {t.cancel}
          </Button>
          <Button variant="outline" onClick={onSaveDraft}>
            {t.saveDraft}
          </Button>
          <Button onClick={onPublish}>{t.publish}</Button>
        </div>
      </div>

      {/* Post metadata */}
      <Card>
        <CardHeader>
          <CardTitle>{t.postDetails}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                placeholder="post-url-slug"
                value={data.slug}
                onChange={(e) => updateField('slug', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">{t.category}</Label>
              <Select
                value={data.categoryId}
                onValueChange={(v) => updateField('categoryId', v)}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder={t.all} />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="author">{t.author}</Label>
              <Select
                value={data.authorId}
                onValueChange={(v) => updateField('authorId', v)}
              >
                <SelectTrigger id="author">
                  <SelectValue placeholder={t.all} />
                </SelectTrigger>
                <SelectContent>
                  {authors.map((author) => (
                    <SelectItem key={author.id} value={author.id}>
                      {author.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">{t.status}</Label>
              <Select
                value={data.isPublished ? 'published' : 'draft'}
                onValueChange={(v) => updateField('isPublished', v === 'published')}
              >
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">{t.draft}</SelectItem>
                  <SelectItem value="published">{t.published}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Translations with side-by-side editor */}
      <TranslationEditor
        translations={translationsData}
        onChange={handleTranslationChange}
        translations_ui={{
          title: t.title,
          excerpt: t.excerpt,
          content: t.content,
          languages: t.languages,
          copyFrom: 'Copy from',
          translationStatus: 'Status',
          complete: 'Complete',
          incomplete: 'Incomplete',
        }}
      />
    </div>
  )
}
