import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import type { Locale } from '@/lib/supabase/types'

const locales: Locale[] = ['en', 'fr', 'ar', 'ur']

const localeConfig: Record<Locale, { dir: 'ltr' | 'rtl'; lang: string }> = {
  en: { dir: 'ltr', lang: 'en' },
  fr: { dir: 'ltr', lang: 'fr' },
  ar: { dir: 'rtl', lang: 'ar' },
  ur: { dir: 'rtl', lang: 'ur' },
}

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params

  const titles: Record<string, string> = {
    en: 'Kitab - RTL/LTR Blog',
    fr: 'Kitab - Blog RTL/LTR',
    ar: 'كتاب - مدونة RTL/LTR',
    ur: 'کتاب - RTL/LTR بلاگ',
  }

  return {
    title: {
      default: titles[locale] || titles.en,
      template: `%s | ${titles[locale] || titles.en}`,
    },
  }
}

/**
 * Base locale layout - only handles dir and lang attributes.
 * Header/Footer are handled by child route group layouts.
 */
export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!locales.includes(locale as Locale)) {
    notFound()
  }

  const config = localeConfig[locale as Locale]

  return (
    <div dir={config.dir} lang={config.lang}>
      {children}
    </div>
  )
}
