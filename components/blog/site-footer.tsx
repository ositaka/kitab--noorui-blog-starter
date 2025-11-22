'use client'

import Link from 'next/link'
import { Separator, Button, useDirection } from 'noorui-rtl'
import { Twitter, Github, BookOpen } from 'lucide-react'
import type { Locale } from '@/lib/supabase/types'

interface SiteFooterProps {
  locale: Locale
}

const footerText: Record<Locale, { built: string; rights: string }> = {
  en: { built: 'Built with Noor UI', rights: 'All rights reserved' },
  fr: { built: 'Construit avec Noor UI', rights: 'Tous droits réservés' },
  ar: { built: 'مبني بواسطة نور UI', rights: 'جميع الحقوق محفوظة' },
  ur: { built: 'Noor UI کے ساتھ بنایا گیا', rights: 'جملہ حقوق محفوظ ہیں' },
}

export function SiteFooter({ locale }: SiteFooterProps) {
  const text = footerText[locale]
  const year = new Date().getFullYear()

  return (
    <footer className="border-t bg-muted/50">
      <div className="container py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            <span className="font-semibold">Kitab</span>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <a href="https://twitter.com/noorui" target="_blank" rel="noopener noreferrer">
                <Twitter className="h-4 w-4" />
              </a>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <a href="https://github.com/noorui" target="_blank" rel="noopener noreferrer">
                <Github className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-2 text-sm text-muted-foreground">
          <p>© {year} Kitab. {text.rights}.</p>
          <p>{text.built}</p>
        </div>
      </div>
    </footer>
  )
}
