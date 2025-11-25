'use client'

import * as React from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Input,
  Textarea,
  Label,
  Badge,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'noorui-rtl'
import { Search, Globe, Twitter, Image as ImageIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export type TwitterCardType = 'summary' | 'summary_large_image' | 'app' | 'player'

export interface SEOData {
  meta_title?: string
  meta_description?: string
  og_image?: string
  focus_keyword?: string
  twitter_card?: TwitterCardType
}

interface SEOSectionProps {
  data: SEOData
  onChange: (data: SEOData) => void
  postTitle: string
  postExcerpt: string
  featuredImage?: string
  dir?: 'ltr' | 'rtl'
}

/**
 * SEO Section Component
 * Provides UI for managing SEO metadata including:
 * - Meta title & description
 * - Open Graph image
 * - Focus keyword
 * - Twitter card type
 */
export function SEOSection({
  data,
  onChange,
  postTitle,
  postExcerpt,
  featuredImage,
  dir = 'ltr',
}: SEOSectionProps) {
  const isRTL = dir === 'rtl'

  // Fallback values for display preview
  const metaTitleFallback = data.meta_title || postTitle
  const metaDescFallback = data.meta_description || postExcerpt
  const ogImage = data.og_image || featuredImage

  // Calculate character counts (only count actual input, not fallbacks)
  const metaTitleLength = data.meta_title?.length || 0
  const metaDescLength = data.meta_description?.length || 0

  // Ideal lengths for SEO
  const titleIdeal = metaTitleLength >= 50 && metaTitleLength <= 60
  const descIdeal = metaDescLength >= 150 && metaDescLength <= 160

  const handleChange = (field: keyof SEOData, value: string) => {
    onChange({ ...data, [field]: value })
  }

  const handleBlur = (field: keyof SEOData) => {
    // On blur, if the field is empty, auto-populate with fallback
    if (field === 'meta_title' && !data.meta_title) {
      onChange({ ...data, meta_title: postTitle })
    } else if (field === 'meta_description' && !data.meta_description) {
      onChange({ ...data, meta_description: postExcerpt })
    }
  }

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="seo">
        <AccordionTrigger className="text-base font-semibold">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            {isRTL ? 'تحسين محركات البحث والشبكات الاجتماعية' : 'SEO & Social Media'}
          </div>
        </AccordionTrigger>
        <AccordionContent className="space-y-6 pt-4">
          {/* Meta Title */}
          <div className="space-y-2" dir={dir}>
            <div className="flex items-center justify-between">
              <Label htmlFor="meta_title" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                {isRTL ? 'عنوان ميتا' : 'Meta Title'}
              </Label>
              <Badge
                variant={titleIdeal ? 'default' : metaTitleLength > 60 ? 'destructive' : 'secondary'}
                className="text-xs"
              >
                {metaTitleLength} / 60
              </Badge>
            </div>
            <Input
              id="meta_title"
              value={data.meta_title || ''}
              onChange={(e) => handleChange('meta_title', e.target.value)}
              onBlur={() => handleBlur('meta_title')}
              placeholder={
                isRTL
                  ? `افتراضي: ${postTitle.slice(0, 40)}...`
                  : `Default: ${postTitle.slice(0, 40)}...`
              }
              dir={dir}
            />
            <p className="text-xs text-muted-foreground" dir={dir}>
              {isRTL
                ? 'يظهر في نتائج البحث. الأفضل: 50-60 حرف. اترك فارغًا لاستخدام عنوان المنشور.'
                : 'Appears in search results. Ideal: 50-60 chars. Leave empty to use post title.'}
            </p>
          </div>

          {/* Meta Description */}
          <div className="space-y-2" dir={dir}>
            <div className="flex items-center justify-between">
              <Label htmlFor="meta_description">
                {isRTL ? 'وصف ميتا' : 'Meta Description'}
              </Label>
              <Badge
                variant={descIdeal ? 'default' : metaDescLength > 160 ? 'destructive' : 'secondary'}
                className="text-xs"
              >
                {metaDescLength} / 160
              </Badge>
            </div>
            <Textarea
              id="meta_description"
              value={data.meta_description || ''}
              onChange={(e) => handleChange('meta_description', e.target.value)}
              onBlur={() => handleBlur('meta_description')}
              placeholder={
                isRTL
                  ? `افتراضي: ${postExcerpt.slice(0, 60)}...`
                  : `Default: ${postExcerpt.slice(0, 60)}...`
              }
              rows={3}
              dir={dir}
            />
            <p className="text-xs text-muted-foreground" dir={dir}>
              {isRTL
                ? 'يظهر في نتائج البحث. الأفضل: 150-160 حرف. اترك فارغًا لاستخدام المقتطف.'
                : 'Appears in search results. Ideal: 150-160 chars. Leave empty to use excerpt.'}
            </p>
          </div>

          {/* Focus Keyword */}
          <div className="space-y-2" dir={dir}>
            <Label htmlFor="focus_keyword" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              {isRTL ? 'الكلمة المفتاحية الرئيسية' : 'Focus Keyword'}
            </Label>
            <Input
              id="focus_keyword"
              value={data.focus_keyword || ''}
              onChange={(e) => handleChange('focus_keyword', e.target.value)}
              placeholder={isRTL ? 'على سبيل المثال: RTL تصميم' : 'e.g., RTL design'}
              dir={dir}
            />
            <p className="text-xs text-muted-foreground" dir={dir}>
              {isRTL
                ? 'الكلمة الرئيسية التي تريد أن يتم العثور عليها في محركات البحث.'
                : 'The main keyword you want to rank for in search engines.'}
            </p>
          </div>

          {/* Open Graph Image */}
          <div className="space-y-2" dir={dir}>
            <Label htmlFor="og_image" className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              {isRTL ? 'صورة Open Graph' : 'Open Graph Image'}
            </Label>
            <Input
              id="og_image"
              type="url"
              value={data.og_image || ''}
              onChange={(e) => handleChange('og_image', e.target.value)}
              placeholder={
                isRTL
                  ? featuredImage
                    ? `افتراضي: ${featuredImage.slice(0, 40)}...`
                    : 'https://example.com/image.jpg'
                  : featuredImage
                  ? `Default: ${featuredImage.slice(0, 40)}...`
                  : 'https://example.com/image.jpg'
              }
              dir="ltr"
            />
            <p className="text-xs text-muted-foreground" dir={dir}>
              {isRTL
                ? 'صورة مخصصة للشبكات الاجتماعية. الأبعاد المثالية: 1200×630 بكسل. اترك فارغًا لاستخدام الصورة المميزة.'
                : 'Custom image for social sharing. Ideal: 1200×630px. Leave empty to use featured image.'}
            </p>
            {ogImage && (
              <div className="relative w-full h-32 bg-muted rounded-lg overflow-hidden">
                <img
                  src={ogImage}
                  alt="Open Graph preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          {/* Twitter Card Type */}
          <div className="space-y-2" dir={dir}>
            <Label htmlFor="twitter_card" className="flex items-center gap-2">
              <Twitter className="h-4 w-4" />
              {isRTL ? 'نوع بطاقة تويتر' : 'Twitter Card Type'}
            </Label>
            <Select
              value={data.twitter_card || 'summary_large_image'}
              onValueChange={(value) => handleChange('twitter_card', value)}
            >
              <SelectTrigger id="twitter_card">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="summary_large_image">
                  {isRTL ? 'ملخص مع صورة كبيرة' : 'Summary Large Image'}
                </SelectItem>
                <SelectItem value="summary">
                  {isRTL ? 'ملخص' : 'Summary'}
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground" dir={dir}>
              {isRTL
                ? 'يحدد كيف ستظهر الروابط على تويتر/X.'
                : 'Determines how links appear on Twitter/X.'}
            </p>
          </div>

          {/* SEO Preview */}
          <div className="space-y-2 pt-4 border-t">
            <p className="text-sm font-medium" dir={dir}>
              {isRTL ? 'معاينة نتائج البحث' : 'Search Preview'}
            </p>
            <div className="p-4 border rounded-lg bg-muted/30" dir={dir}>
              <div className="text-sm text-primary font-medium line-clamp-1">
                {metaTitleFallback}
              </div>
              <div className="text-xs text-muted-foreground line-clamp-2 mt-1">
                {metaDescFallback}
              </div>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

export default SEOSection
