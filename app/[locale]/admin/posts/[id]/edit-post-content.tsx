'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { PostEditor, type PostEditorData } from '@/components/admin/post-editor'
import type { Locale, Post, AuthorLocalized, CategoryLocalized } from '@/lib/supabase/types'
import { updatePostAction, upsertTranslationAction } from '../actions'

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
    postDetails: 'Edit Post',
    title: 'Title',
    excerpt: 'Excerpt',
    content: 'Content',
    category: 'Category',
    author: 'Author',
    status: 'Status',
    draft: 'Draft',
    published: 'Published',
    cancel: 'Cancel',
    saveDraft: 'Save Changes',
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
    postDetails: 'Modifier l\'Article',
    title: 'Titre',
    excerpt: 'Extrait',
    content: 'Contenu',
    category: 'Catégorie',
    author: 'Auteur',
    status: 'Statut',
    draft: 'Brouillon',
    published: 'Publié',
    cancel: 'Annuler',
    saveDraft: 'Enregistrer',
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
    postDetails: 'تعديل المنشور',
    title: 'العنوان',
    excerpt: 'المقتطف',
    content: 'المحتوى',
    category: 'الفئة',
    author: 'الكاتب',
    status: 'الحالة',
    draft: 'مسودة',
    published: 'منشور',
    cancel: 'إلغاء',
    saveDraft: 'حفظ التغييرات',
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
    postDetails: 'پوسٹ میں ترمیم',
    title: 'عنوان',
    excerpt: 'اقتباس',
    content: 'مواد',
    category: 'زمرہ',
    author: 'مصنف',
    status: 'حیثیت',
    draft: 'مسودہ',
    published: 'شائع شدہ',
    cancel: 'منسوخ',
    saveDraft: 'تبدیلیاں محفوظ کریں',
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

interface EditPostContentProps {
  locale: Locale
  post: Post
  translations: Record<Locale, { title: string; excerpt: string | null; content: string | null }>
  authors: AuthorLocalized[]
  categories: CategoryLocalized[]
}

/**
 * EditPostContent - Client component for editing existing posts
 */
export function EditPostContent({
  locale,
  post,
  translations: existingTranslations,
  authors,
  categories,
}: EditPostContentProps) {
  const router = useRouter()
  const t = translations[locale]

  // Initialize data from the existing post and translations
  const [data, setData] = React.useState<PostEditorData>(() => ({
    slug: post.slug,
    categoryId: post.category_id || '',
    authorId: post.author_id || '',
    isPublished: post.is_published,
    isFeatured: post.is_featured,
    titles: {
      en: existingTranslations.en?.title || '',
      fr: existingTranslations.fr?.title || '',
      ar: existingTranslations.ar?.title || '',
      ur: existingTranslations.ur?.title || '',
    },
    excerpts: {
      en: existingTranslations.en?.excerpt || '',
      fr: existingTranslations.fr?.excerpt || '',
      ar: existingTranslations.ar?.excerpt || '',
      ur: existingTranslations.ur?.excerpt || '',
    },
    contents: {
      en: existingTranslations.en?.content || '',
      fr: existingTranslations.fr?.content || '',
      ar: existingTranslations.ar?.content || '',
      ur: existingTranslations.ur?.content || '',
    },
  }))

  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const handleCancel = () => {
    router.push(`/${locale}/admin/posts`)
  }

  const handleSave = async (publish: boolean) => {
    if (!data.slug) {
      return
    }

    setIsSubmitting(true)

    try {
      // Update post metadata
      const updateResult = await updatePostAction(post.id, {
        slug: data.slug,
        author_id: data.authorId || undefined,
        category_id: data.categoryId || undefined,
        is_published: publish ? true : data.isPublished,
        is_featured: data.isFeatured,
        published_at: publish && !post.is_published ? new Date().toISOString() : undefined,
      })

      // Check for guest mode error or update failure
      if ('error' in updateResult && updateResult.error) {
        toast.error(updateResult.error)
        return
      }
      if ('success' in updateResult && !updateResult.success) {
        toast.error('Failed to update post')
        return
      }

      // Update translations for each locale that has content
      const locales: Locale[] = ['en', 'fr', 'ar', 'ur']
      const translationPromises = locales
        .filter((loc) => data.titles[loc]) // Only update locales with titles
        .map((loc) =>
          upsertTranslationAction(post.id, loc, {
            title: data.titles[loc],
            excerpt: data.excerpts[loc] || undefined,
            content: data.contents[loc] || undefined,
          })
        )

      const translationResults = await Promise.all(translationPromises)

      // Check if any translation failed (guest mode)
      const translationError = translationResults.find((r) => r.error)
      if (translationError?.error) {
        toast.error(translationError.error)
        return
      }

      toast.success(publish ? 'Post published!' : 'Changes saved!')
      router.push(`/${locale}/admin/posts`)
    } catch (error) {
      toast.error('An error occurred while saving the post')
      console.error('Error updating post:', error)
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
        isEditing={true}
        onChange={setData}
        onCancel={handleCancel}
        onSaveDraft={() => handleSave(false)}
        onPublish={() => handleSave(true)}
      />
    </div>
  )
}
