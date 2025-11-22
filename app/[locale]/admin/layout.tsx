'use client'

import * as React from 'react'
import { useParams, usePathname } from 'next/navigation'
import { DashboardShell, DirectionProvider } from 'noorui-rtl'
import { FileText, Plus, LayoutDashboard, Settings } from 'lucide-react'
import { LanguageSwitcher } from '@/components/blog/language-switcher'
import { ThemeSwitcher } from '@/components/blog/theme-switcher'
import type { Locale } from '@/lib/supabase/types'

const localeConfig: Record<Locale, { dir: 'ltr' | 'rtl' }> = {
  en: { dir: 'ltr' },
  fr: { dir: 'ltr' },
  ar: { dir: 'rtl' },
  ur: { dir: 'rtl' },
}

// Translations for nav items
const navTranslations: Record<Locale, {
  dashboard: string
  posts: string
  createNew: string
  settings: string
}> = {
  en: {
    dashboard: 'Dashboard',
    posts: 'Posts',
    createNew: 'Create New',
    settings: 'Settings',
  },
  fr: {
    dashboard: 'Tableau de bord',
    posts: 'Articles',
    createNew: 'Créer',
    settings: 'Paramètres',
  },
  ar: {
    dashboard: 'لوحة التحكم',
    posts: 'المنشورات',
    createNew: 'إنشاء جديد',
    settings: 'الإعدادات',
  },
  ur: {
    dashboard: 'ڈیش بورڈ',
    posts: 'پوسٹس',
    createNew: 'نئی بنائیں',
    settings: 'ترتیبات',
  },
}

// Navigation items for the admin sidebar
const getNavItems = (locale: Locale) => {
  const t = navTranslations[locale]
  const arT = navTranslations.ar

  return [
    {
      title: t.dashboard,
      titleAr: arT.dashboard,
      href: `/${locale}/admin`,
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      title: t.posts,
      titleAr: arT.posts,
      href: `/${locale}/admin/posts`,
      icon: <FileText className="h-5 w-5" />,
    },
    {
      title: t.createNew,
      titleAr: arT.createNew,
      href: `/${locale}/admin/posts/new`,
      icon: <Plus className="h-5 w-5" />,
    },
    {
      title: t.settings,
      titleAr: arT.settings,
      href: `/${locale}/admin/settings`,
      icon: <Settings className="h-5 w-5" />,
    },
  ]
}

// Mock notifications (in production, fetch from API)
const mockNotifications = [
  {
    id: '1',
    title: 'New comment',
    description: 'Someone commented on your post',
    time: '5 minutes ago',
    read: false,
    type: 'comment' as const,
  },
  {
    id: '2',
    title: 'Post published',
    description: 'Your post is now live',
    time: '1 hour ago',
    read: true,
    type: 'success' as const,
  },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const params = useParams()
  const pathname = usePathname()
  const locale = (params.locale as Locale) || 'en'
  const config = localeConfig[locale]

  const navItems = getNavItems(locale)

  return (
    <DirectionProvider>
      <div dir={config.dir} className="min-h-screen bg-background">
        <DashboardShell
          navItems={navItems}
          user={{
            name: 'Admin User',
            email: 'admin@kitab.blog',
            initials: 'AU',
          }}
          notifications={mockNotifications}
          logo={<span className="text-lg font-bold">Kitab</span>}
          logoHref={`/${locale}`}
          sidebarWidth="240px"
          headerActions={
            <>
              <ThemeSwitcher />
              <LanguageSwitcher currentLocale={locale} />
            </>
          }
        >
          {children}
        </DashboardShell>
      </div>
    </DirectionProvider>
  )
}
