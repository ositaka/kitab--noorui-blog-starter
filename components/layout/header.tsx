'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Separator,
} from 'noorui-rtl'
import { Globe, Menu, X, BookOpen, Sun, Moon, Search } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import type { Locale } from '@/lib/supabase/types'
import { SearchModal } from '@/components/search/search-modal'

interface HeaderProps {
  locale: Locale
}

const translations = {
  en: {
    nav: {
      home: 'Home',
      blog: 'Blog',
      about: 'About',
      dashboard: 'Dashboard',
    },
    language: 'Language',
  },
  fr: {
    nav: {
      home: 'Accueil',
      blog: 'Blog',
      about: 'A propos',
      dashboard: 'Tableau de bord',
    },
    language: 'Langue',
  },
  ar: {
    nav: {
      home: 'الرئيسية',
      blog: 'المدونة',
      about: 'حول',
      dashboard: 'لوحة التحكم',
    },
    language: 'اللغة',
  },
  ur: {
    nav: {
      home: 'ہوم',
      blog: 'بلاگ',
      about: 'ہمارے بارے میں',
      dashboard: 'ڈیش بورڈ',
    },
    language: 'زبان',
  },
}

const languages = [
  { code: 'en', name: 'English', flag: 'GB' },
  { code: 'fr', name: 'Francais', flag: 'FR' },
  { code: 'ar', name: 'العربية', flag: 'SA' },
  { code: 'ur', name: 'اردو', flag: 'PK' },
]

export function Header({ locale }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const t = translations[locale]

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  const getLocalizedPath = (newLocale: string) => {
    const segments = pathname.split('/')
    segments[1] = newLocale
    return segments.join('/')
  }

  const navItems = [
    { href: '/' + locale, label: t.nav.home },
    { href: '/' + locale + '/blog', label: t.nav.blog },
    { href: '/' + locale + '/about', label: t.nav.about },
    { href: '/' + locale + '/admin', label: t.nav.dashboard },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href={'/' + locale} className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Kitab</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={'text-sm font-medium transition-colors hover:text-primary ' + (pathname === item.href ? 'text-primary' : 'text-muted-foreground')}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {/* Search Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              className="gap-2"
            >
              <Search className="h-4 w-4" />
              <span className="hidden sm:inline text-xs text-muted-foreground">
                {locale === 'ar' ? 'بحث' : locale === 'ur' ? 'تلاش' : locale === 'fr' ? 'Rechercher' : 'Search'}
              </span>
              <kbd className="hidden sm:inline-flex h-5 px-1.5 items-center gap-1 rounded border bg-muted font-mono text-[10px] font-medium text-muted-foreground">
                <span className="text-xs">⌘</span>K
              </kbd>
            </Button>

            {/* Mode Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label="Toggle theme"
            >
              {mounted && (
                theme === 'dark' ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )
              )}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <Globe className="h-4 w-4" />
                  <span className="hidden sm:inline">
                    {languages.find((l) => l.code === locale)?.name}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {languages.map((lang) => (
                  <DropdownMenuItem key={lang.code} asChild>
                    <Link
                      href={getLocalizedPath(lang.code)}
                      className={'flex items-center gap-2 ' + (locale === lang.code ? 'font-semibold' : '')}
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden pb-4">
            <Separator className="mb-4" />
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={'px-4 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent ' + (pathname === item.href ? 'bg-accent text-primary' : 'text-muted-foreground')}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>

      {/* Search Modal */}
      <SearchModal locale={locale} />
    </header>
  )
}
