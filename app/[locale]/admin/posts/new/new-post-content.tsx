'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { PostEditor, type PostEditorData } from '@/components/admin/post-editor'
import type { Locale, AuthorLocalized, CategoryLocalized } from '@/lib/supabase/types'
import { createPostAction } from '../actions'

const translations: Record<Locale, {
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
}> = {
  en: {
    postDetails: 'New Post',
    title: 'Title',
    excerpt: 'Excerpt',
    content: 'Content',
    category: 'Category',
    author: 'Author',
    status: 'Status',
    draft: 'Draft',
    published: 'Published',
    cancel: 'Cancel',
    saveDraft: 'Save Draft',
    publish: 'Publish',
    all: 'Select...',
    languages: {
      en: 'English',
      fr: 'French',
      ar: 'Arabic',
      ur: 'Urdu',
    },
  },
  fr: {
    postDetails: 'Nouvel Article',
    title: 'Titre',
    excerpt: 'Extrait',
    content: 'Contenu',
    category: 'Catégorie',
    author: 'Auteur',
    status: 'Statut',
    draft: 'Brouillon',
    published: 'Publié',
    cancel: 'Annuler',
    saveDraft: 'Enregistrer le brouillon',
    publish: 'Publier',
    all: 'Sélectionner...',
    languages: {
      en: 'Anglais',
      fr: 'Français',
      ar: 'Arabe',
      ur: 'Ourdou',
    },
  },
  ar: {
    postDetails: 'منشور جديد',
    title: 'العنوان',
    excerpt: 'المقتطف',
    content: 'المحتوى',
    category: 'الفئة',
    author: 'الكاتب',
    status: 'الحالة',
    draft: 'مسودة',
    published: 'منشور',
    cancel: 'إلغاء',
    saveDraft: 'حفظ كمسودة',
    publish: 'نشر',
    all: 'اختر...',
    languages: {
      en: 'الإنجليزية',
      fr: 'الفرنسية',
      ar: 'العربية',
      ur: 'الأردية',
    },
  },
  ur: {
    postDetails: 'نئی پوسٹ',
    title: 'عنوان',
    excerpt: 'اقتباس',
    content: 'مواد',
    category: 'زمرہ',
    author: 'مصنف',
    status: 'حیثیت',
    draft: 'مسودہ',
    published: 'شائع شدہ',
    cancel: 'منسوخ',
    saveDraft: 'مسودہ محفوظ کریں',
    publish: 'شائع کریں',
    all: 'منتخب کریں...',
    languages: {
      en: 'انگریزی',
      fr: 'فرانسیسی',
      ar: 'عربی',
      ur: 'اردو',
    },
  },
}

const emptyPostData: PostEditorData = {
  slug: '',
  categoryId: '',
  authorId: '',
  isPublished: false,
  isFeatured: false,
  titles: { en: '', fr: '', ar: '', ur: '' },
  excerpts: { en: '', fr: '', ar: '', ur: '' },
  contents: { en: '', fr: '', ar: '', ur: '' },
}

interface NewPostContentProps {
  locale: Locale
  authors: AuthorLocalized[]
  categories: CategoryLocalized[]
}

/**
 * NewPostContent - Client component for creating new posts
 */
export function NewPostContent({
  locale,
  authors,
  categories,
}: NewPostContentProps) {
  const router = useRouter()
  const t = translations[locale]

  const [data, setData] = React.useState<PostEditorData>(emptyPostData)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const handleCancel = () => {
    router.push(`/${locale}/admin/posts`)
  }

  const handleSave = async (publish: boolean) => {
    if (!data.slug || !data.titles.en) {
      // Basic validation - at least need a slug and English title
      return
    }

    setIsSubmitting(true)

    try {
      // Build translations array from the editor data
      const translationsToCreate = (['en', 'fr', 'ar', 'ur'] as Locale[])
        .filter((loc) => data.titles[loc]) // Only include locales with titles
        .map((loc) => ({
          locale: loc,
          title: data.titles[loc],
          excerpt: data.excerpts[loc] || undefined,
          content: data.contents[loc] || undefined,
        }))

      const result = await createPostAction({
        slug: data.slug,
        author_id: data.authorId || undefined,
        category_id: data.categoryId || undefined,
        is_published: publish,
        is_featured: data.isFeatured,
        translations: translationsToCreate,
      })

      if (result.post) {
        router.push(`/${locale}/admin/posts`)
      } else {
        console.error('Failed to create post:', result.error)
      }
    } catch (error) {
      console.error('Error creating post:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="p-6">
      <PostEditor
        data={data}
        authors={authors}
        categories={categories}
        translations={t}
        isEditing={false}
        onChange={setData}
        onCancel={handleCancel}
        onSaveDraft={() => handleSave(false)}
        onPublish={() => handleSave(true)}
      />
    </div>
  )
}
