'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { PostEditor, type PostEditorData } from '@/components/admin/post-editor'
import type { TwitterCardType } from '@/components/admin/seo-section'
import type { Locale, Post, AuthorLocalized, CategoryLocalized } from '@/lib/supabase/types'
import { updatePostAction, upsertTranslationAction, uploadImageAction } from '../actions'

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
  featuredImage: string
  uploadImage: string
  removeImage: string
  imagePlaceholder: string
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
    featuredImage: 'Featured Image',
    uploadImage: 'Upload Image',
    removeImage: 'Remove',
    imagePlaceholder: 'Drag & drop an image or click to browse',
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
    featuredImage: 'Image à la une',
    uploadImage: 'Télécharger',
    removeImage: 'Supprimer',
    imagePlaceholder: 'Glissez-déposez une image ou cliquez pour parcourir',
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
    featuredImage: 'الصورة البارزة',
    uploadImage: 'رفع صورة',
    removeImage: 'حذف',
    imagePlaceholder: 'اسحب وأفلت صورة أو انقر للتصفح',
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
    featuredImage: 'نمایاں تصویر',
    uploadImage: 'تصویر اپ لوڈ کریں',
    removeImage: 'حذف کریں',
    imagePlaceholder: 'تصویر گھسیٹ کر چھوڑیں یا براؤز کرنے کے لیے کلک کریں',
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
  translations: Record<Locale, {
    title: string
    excerpt: string | null
    content: string | null
    meta_title?: string | null
    meta_description?: string | null
    og_image?: string | null
    focus_keyword?: string | null
    twitter_card?: string | null
  }>
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

  // Helper to check if a value is empty (null, undefined, or empty string)
  const isEmpty = (value: string | null | undefined): boolean => {
    return !value || value.trim() === ''
  }

  // Initialize data from the existing post and translations
  const [data, setData] = React.useState<PostEditorData>(() => ({
    slug: post.slug,
    categoryId: post.category_id || '',
    authorId: post.author_id || '',
    isPublished: post.is_published,
    isFeatured: post.is_featured,
    featuredImage: post.featured_image,
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
    seoData: {
      en: {
        meta_title: (isEmpty(existingTranslations.en?.meta_title) ? existingTranslations.en?.title : existingTranslations.en?.meta_title) || undefined,
        meta_description: (isEmpty(existingTranslations.en?.meta_description) ? existingTranslations.en?.excerpt : existingTranslations.en?.meta_description) || undefined,
        og_image: existingTranslations.en?.og_image || undefined,
        focus_keyword: existingTranslations.en?.focus_keyword || undefined,
        twitter_card: (existingTranslations.en?.twitter_card as TwitterCardType) || undefined,
      },
      fr: {
        meta_title: (isEmpty(existingTranslations.fr?.meta_title) ? existingTranslations.fr?.title : existingTranslations.fr?.meta_title) || undefined,
        meta_description: (isEmpty(existingTranslations.fr?.meta_description) ? existingTranslations.fr?.excerpt : existingTranslations.fr?.meta_description) || undefined,
        og_image: existingTranslations.fr?.og_image || undefined,
        focus_keyword: existingTranslations.fr?.focus_keyword || undefined,
        twitter_card: (existingTranslations.fr?.twitter_card as TwitterCardType) || undefined,
      },
      ar: {
        meta_title: (isEmpty(existingTranslations.ar?.meta_title) ? existingTranslations.ar?.title : existingTranslations.ar?.meta_title) || undefined,
        meta_description: (isEmpty(existingTranslations.ar?.meta_description) ? existingTranslations.ar?.excerpt : existingTranslations.ar?.meta_description) || undefined,
        og_image: existingTranslations.ar?.og_image || undefined,
        focus_keyword: existingTranslations.ar?.focus_keyword || undefined,
        twitter_card: (existingTranslations.ar?.twitter_card as TwitterCardType) || undefined,
      },
      ur: {
        meta_title: (isEmpty(existingTranslations.ur?.meta_title) ? existingTranslations.ur?.title : existingTranslations.ur?.meta_title) || undefined,
        meta_description: (isEmpty(existingTranslations.ur?.meta_description) ? existingTranslations.ur?.excerpt : existingTranslations.ur?.meta_description) || undefined,
        og_image: existingTranslations.ur?.og_image || undefined,
        focus_keyword: existingTranslations.ur?.focus_keyword || undefined,
        twitter_card: (existingTranslations.ur?.twitter_card as TwitterCardType) || undefined,
      },
    },
  }))

  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const handleCancel = () => {
    router.push(`/${locale}/admin/posts`)
  }

  const handleUploadImage = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('file', file)

    const result = await uploadImageAction(formData)

    if ('error' in result && result.error) {
      toast.error(result.error)
      throw new Error(result.error)
    }

    if ('url' in result) {
      return result.url
    }

    throw new Error('Upload failed')
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
        featured_image: data.featuredImage || undefined,
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
        .map((loc) => {
          const metaTitle = data.seoData[loc]?.meta_title
          const metaDesc = data.seoData[loc]?.meta_description
          const ogImage = data.seoData[loc]?.og_image
          const focusKeyword = data.seoData[loc]?.focus_keyword
          const twitterCard = data.seoData[loc]?.twitter_card

          return upsertTranslationAction(post.id, loc, {
            title: data.titles[loc],
            excerpt: data.excerpts[loc] || undefined,
            content: data.contents[loc] || undefined,
            // Send empty string to clear, or the value if present
            meta_title: isEmpty(metaTitle) ? '' : metaTitle,
            meta_description: isEmpty(metaDesc) ? '' : metaDesc,
            og_image: isEmpty(ogImage) ? '' : ogImage,
            focus_keyword: isEmpty(focusKeyword) ? '' : focusKeyword,
            twitter_card: twitterCard || 'summary_large_image',
          })
        })

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
        onUploadImage={handleUploadImage}
        onCancel={handleCancel}
        onSaveDraft={() => handleSave(false)}
        onPublish={() => handleSave(true)}
      />
    </div>
  )
}
