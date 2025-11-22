'use client'

import Link from 'next/link'
import { Separator } from 'noorui-rtl'
import { BookOpen, Github, Twitter } from 'lucide-react'
import type { Locale } from '@/lib/supabase/types'

interface FooterProps {
  locale: Locale
}

const translations = {
  en: {
    description: 'A multilingual blog starter showcasing RTL support and Arabic typography.',
    sections: {
      navigation: 'Navigation',
      resources: 'Resources',
      connect: 'Connect',
    },
    links: {
      home: 'Home',
      blog: 'Blog',
      about: 'About',
      github: 'GitHub',
      docs: 'Documentation',
      components: 'Components',
    },
    copyright: 'All rights reserved.',
    madeWith: 'Made with',
    and: 'and',
  },
  fr: {
    description: 'Un blog multilingue presentant le support RTL et la typographie arabe.',
    sections: {
      navigation: 'Navigation',
      resources: 'Ressources',
      connect: 'Connexion',
    },
    links: {
      home: 'Accueil',
      blog: 'Blog',
      about: 'A propos',
      github: 'GitHub',
      docs: 'Documentation',
      components: 'Composants',
    },
    copyright: 'Tous droits reserves.',
    madeWith: 'Fait avec',
    and: 'et',
  },
  ar: {
    description: 'مدونة متعددة اللغات تعرض دعم RTL والخط العربي.',
    sections: {
      navigation: 'التنقل',
      resources: 'الموارد',
      connect: 'تواصل',
    },
    links: {
      home: 'الرئيسية',
      blog: 'المدونة',
      about: 'حول',
      github: 'GitHub',
      docs: 'التوثيق',
      components: 'المكونات',
    },
    copyright: 'جميع الحقوق محفوظة.',
    madeWith: 'صنع بـ',
    and: 'و',
  },
  ur: {
    description: 'ایک کثیر لسانی بلاگ جو RTL سپورٹ اور عربی ٹائپوگرافی دکھاتا ہے۔',
    sections: {
      navigation: 'نیویگیشن',
      resources: 'وسائل',
      connect: 'رابطہ',
    },
    links: {
      home: 'ہوم',
      blog: 'بلاگ',
      about: 'ہمارے بارے میں',
      github: 'GitHub',
      docs: 'دستاویزات',
      components: 'اجزاء',
    },
    copyright: 'جملہ حقوق محفوظ ہیں۔',
    madeWith: 'بنایا گیا',
    and: 'اور',
  },
}

export function Footer({ locale }: FooterProps) {
  const t = translations[locale]
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto max-w-6xl px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link href={'/' + locale} className="flex items-center gap-2 mb-4">
              <BookOpen className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">Kitab</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              {t.description}
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">{t.sections.navigation}</h3>
            <ul className="space-y-2">
              <li>
                <Link href={'/' + locale} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {t.links.home}
                </Link>
              </li>
              <li>
                <Link href={'/' + locale + '/blog'} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {t.links.blog}
                </Link>
              </li>
              <li>
                <Link href={'/' + locale + '/about'} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {t.links.about}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">{t.sections.resources}</h3>
            <ul className="space-y-2">
              <li>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {t.links.github}
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {t.links.docs}
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {t.links.components}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">{t.sections.connect}</h3>
            <div className="flex gap-4">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>{currentYear} Kitab. {t.copyright}</p>
          <p>
            {t.madeWith} <span className="text-red-500">noorui-rtl</span> {t.and} Next.js
          </p>
        </div>
      </div>
    </footer>
  )
}
