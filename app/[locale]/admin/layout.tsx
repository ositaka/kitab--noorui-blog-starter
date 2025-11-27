'use client'

import * as React from 'react'
import { useParams, usePathname } from 'next/navigation'
import { DashboardShell, DirectionProvider, Badge } from 'noorui-rtl'
import { FileText, Plus, LayoutDashboard, Settings, Eye, MessageSquare } from 'lucide-react'
import { LanguageSwitcher } from '@/components/blog/language-switcher'
import { ThemeSwitcher } from '@/components/blog/theme-switcher'
import type { Locale } from '@/lib/supabase/types'
import { AuthProvider, useAuth } from './auth-provider'

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
  comments: string
  createNew: string
  settings: string
  guestMode: string
}> = {
  en: {
    dashboard: 'Dashboard',
    posts: 'Posts',
    comments: 'Comments',
    createNew: 'Create New',
    settings: 'Settings',
    guestMode: 'View Only',
  },
  fr: {
    dashboard: 'Tableau de bord',
    posts: 'Articles',
    comments: 'Commentaires',
    createNew: 'Créer',
    settings: 'Paramètres',
    guestMode: 'Lecture seule',
  },
  ar: {
    dashboard: 'لوحة التحكم',
    posts: 'المنشورات',
    comments: 'التعليقات',
    createNew: 'إنشاء جديد',
    settings: 'الإعدادات',
    guestMode: 'للعرض فقط',
  },
  ur: {
    dashboard: 'ڈیش بورڈ',
    posts: 'پوسٹس',
    comments: 'تبصرے',
    createNew: 'نئی بنائیں',
    settings: 'ترتیبات',
    guestMode: 'صرف دیکھیں',
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
      title: t.comments,
      titleAr: arT.comments,
      href: `/${locale}/admin/comments`,
      icon: <MessageSquare className="h-5 w-5" />,
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

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const params = useParams()
  const pathname = usePathname()
  const locale = (params.locale as Locale) || 'en'
  const config = localeConfig[locale]
  const t = navTranslations[locale]
  const { user, isGuest, isLoading } = useAuth()

  // Skip DashboardShell for login page
  const isLoginPage = pathname?.includes('/admin/login')
  if (isLoginPage) {
    return <>{children}</>
  }

  const navItems = getNavItems(locale)

  // Show loading state briefly
  if (isLoading) {
    return (
      <div dir={config.dir} className="min-h-screen bg-muted/20 flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    )
  }

  const userInfo = user
    ? {
        name: user.name,
        email: user.email,
        initials: user.name
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2),
        avatar: user.avatar,
      }
    : {
        name: 'Guest',
        email: 'guest@kitab.blog',
        initials: 'G',
      }

  return (
    <div dir={config.dir} className="min-h-screen admin-bg">
      <DashboardShell
        navItems={navItems}
        user={userInfo}
        notifications={mockNotifications}
        logo={<span className="text-lg font-bold">Kitab</span>}
        logoHref={`/${locale}`}
        sidebarWidth="240px"
        headerActions={
          <>
            {isGuest && (
              <Badge variant="secondary" className="gap-1">
                <Eye className="h-3 w-3" />
                {t.guestMode}
              </Badge>
            )}
            <ThemeSwitcher />
            <LanguageSwitcher currentLocale={locale} />
          </>
        }
      >
        {children}
      </DashboardShell>
    </div>
  )
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <DirectionProvider>
      <AuthProvider>
        <AdminLayoutContent>{children}</AdminLayoutContent>
      </AuthProvider>
    </DirectionProvider>
  )
}
