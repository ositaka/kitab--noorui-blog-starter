'use client'

import { useState } from 'react'
import { Button, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from 'noorui-rtl'
import { Share2, Twitter, Facebook, Linkedin, MessageCircle, Link2, Check } from 'lucide-react'
import type { Locale } from '@/lib/supabase/types'

interface ShareButtonsProps {
  url: string
  title: string
  description?: string
  locale: Locale
  className?: string
}

const translations: Record<Locale, {
  share: string
  copyLink: string
  copied: string
  shareOn: string
}> = {
  en: {
    share: 'Share',
    copyLink: 'Copy link',
    copied: 'Copied!',
    shareOn: 'Share on',
  },
  fr: {
    share: 'Partager',
    copyLink: 'Copier le lien',
    copied: 'Copié!',
    shareOn: 'Partager sur',
  },
  ar: {
    share: 'مشاركة',
    copyLink: 'نسخ الرابط',
    copied: 'تم النسخ!',
    shareOn: 'شارك على',
  },
  ur: {
    share: 'شیئر کریں',
    copyLink: 'لنک کاپی کریں',
    copied: 'کاپی ہو گیا!',
    shareOn: 'شیئر کریں',
  },
}

/**
 * ShareButtons - Social media sharing component
 *
 * Features:
 * - Twitter, Facebook, LinkedIn, WhatsApp sharing
 * - Copy link to clipboard
 * - Native Share API support (mobile)
 * - RTL-aware layout
 * - Multilingual tooltips
 *
 * @example
 * <ShareButtons
 *   url="https://example.com/post"
 *   title="My Blog Post"
 *   description="Check out this post"
 *   locale="en"
 * />
 */
export function ShareButtons({ url, title, description, locale, className }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)
  const t = translations[locale]
  const isRTL = locale === 'ar' || locale === 'ur'

  // Encode for URL
  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)
  const encodedDescription = encodeURIComponent(description || title)

  // Share URLs
  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
  }

  // Copy link to clipboard
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  // Native Share API (for mobile devices)
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description || title,
          url,
        })
      } catch (err) {
        // User cancelled or error occurred
        console.log('Share cancelled or failed:', err)
      }
    }
  }

  const shareButtons = [
    {
      name: 'Twitter',
      icon: Twitter,
      href: shareLinks.twitter,
      color: 'hover:text-[#1DA1F2]',
    },
    {
      name: 'Facebook',
      icon: Facebook,
      href: shareLinks.facebook,
      color: 'hover:text-[#4267B2]',
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      href: shareLinks.linkedin,
      color: 'hover:text-[#0077B5]',
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      href: shareLinks.whatsapp,
      color: 'hover:text-[#25D366]',
    },
  ]

  return (
    <div className={className}>
      <TooltipProvider>
        <div className="flex items-center gap-2 flex-wrap">
          {/* Native Share (mobile only) */}
          {typeof navigator !== 'undefined' && typeof navigator.share === 'function' && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNativeShare}
                  className="gap-2"
                >
                  <Share2 className="h-4 w-4" />
                  <span className="hidden sm:inline">{t.share}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t.share}</p>
              </TooltipContent>
            </Tooltip>
          )}

          {/* Social Media Buttons */}
          {shareButtons.map((button) => (
            <Tooltip key={button.name}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className={`${button.color} transition-colors`}
                >
                  <a
                    href={button.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${t.shareOn} ${button.name}`}
                  >
                    <button.icon className="h-4 w-4" />
                  </a>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{`${t.shareOn} ${button.name}`}</p>
              </TooltipContent>
            </Tooltip>
          ))}

          {/* Copy Link Button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyLink}
                className="gap-2"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Link2 className="h-4 w-4" />
                )}
                <span className="hidden sm:inline">
                  {copied ? t.copied : t.copyLink}
                </span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{copied ? t.copied : t.copyLink}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    </div>
  )
}
