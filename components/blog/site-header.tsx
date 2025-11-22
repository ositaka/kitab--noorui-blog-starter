'use client'

import Link from 'next/link'
import {
  Button,
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  Separator,
  useDirection,
} from 'noorui-rtl'
import { Menu, BookOpen } from 'lucide-react'
import { LanguageSwitcher } from './language-switcher'
import { ThemeSwitcher } from './theme-switcher'
import type { Locale } from '@/lib/supabase/types'

interface SiteHeaderProps {
  locale: Locale
}

const navItems: Record<Locale, { home: string; blog: string; about: string }> = {
  en: { home: 'Home', blog: 'Blog', about: 'About' },
  fr: { home: 'Accueil', blog: 'Blog', about: 'À propos' },
  ar: { home: 'الرئيسية', blog: 'المدونة', about: 'حول' },
  ur: { home: 'ہوم', blog: 'بلاگ', about: 'ہمارے بارے میں' },
}

export function SiteHeader({ locale }: SiteHeaderProps) {
  const { direction } = useDirection()
  const nav = navItems[locale]

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href={`/${locale}`} className="flex items-center gap-2">
          <BookOpen className="h-6 w-6" />
          <span className="font-bold text-xl">Kitab</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href={`/${locale}`}>
            <Button variant="ghost">{nav.home}</Button>
          </Link>
          <Link href={`/${locale}/blog`}>
            <Button variant="ghost">{nav.blog}</Button>
          </Link>
          <Link href={`/${locale}/about`}>
            <Button variant="ghost">{nav.about}</Button>
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeSwitcher />
          <LanguageSwitcher currentLocale={locale} />

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side={direction === 'rtl' ? 'end' : 'start'}>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Kitab
                </SheetTitle>
              </SheetHeader>
              <Separator className="my-4" />
              <nav className="flex flex-col gap-2">
                <Link href={`/${locale}`}>
                  <Button variant="ghost" className="w-full justify-start">
                    {nav.home}
                  </Button>
                </Link>
                <Link href={`/${locale}/blog`}>
                  <Button variant="ghost" className="w-full justify-start">
                    {nav.blog}
                  </Button>
                </Link>
                <Link href={`/${locale}/about`}>
                  <Button variant="ghost" className="w-full justify-start">
                    {nav.about}
                  </Button>
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
