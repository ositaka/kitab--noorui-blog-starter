import type { Locale } from '@/lib/supabase/types'
import { SettingsContent } from './settings-content'

interface SettingsPageProps {
  params: Promise<{ locale: Locale }>
}

const translations: Record<Locale, {
  title: string
  description: string
  profile: {
    title: string
    description: string
    name: string
    email: string
    role: string
    admin: string
    guest: string
  }
  site: {
    title: string
    description: string
    siteName: string
    siteUrl: string
    locales: string
    enabledLocales: string
  }
  demo: {
    title: string
    description: string
    viewOnGithub: string
    builtWith: string
  }
  actions: {
    signOut: string
    signOutDescription: string
  }
}> = {
  en: {
    title: 'Settings',
    description: 'Manage your account and site settings',
    profile: {
      title: 'Profile',
      description: 'Your account information',
      name: 'Name',
      email: 'Email',
      role: 'Role',
      admin: 'Admin',
      guest: 'Guest (View Only)',
    },
    site: {
      title: 'Site Information',
      description: 'About this blog',
      siteName: 'Site Name',
      siteUrl: 'Site URL',
      locales: 'Languages',
      enabledLocales: 'English, French, Arabic, Urdu',
    },
    demo: {
      title: 'About This Demo',
      description: 'This is Kitab - a multilingual blog starter with full RTL/LTR support',
      viewOnGithub: 'View on GitHub',
      builtWith: 'Built with Next.js, Supabase, and noorui-rtl',
    },
    actions: {
      signOut: 'Sign Out',
      signOutDescription: 'Exit the admin panel',
    },
  },
  fr: {
    title: 'Parametres',
    description: 'Gerez votre compte et les parametres du site',
    profile: {
      title: 'Profil',
      description: 'Vos informations de compte',
      name: 'Nom',
      email: 'Email',
      role: 'Role',
      admin: 'Administrateur',
      guest: 'Invite (Lecture seule)',
    },
    site: {
      title: 'Informations du site',
      description: 'A propos de ce blog',
      siteName: 'Nom du site',
      siteUrl: 'URL du site',
      locales: 'Langues',
      enabledLocales: 'Anglais, Francais, Arabe, Ourdou',
    },
    demo: {
      title: 'A propos de cette demo',
      description: 'Ceci est Kitab - un starter de blog multilingue avec support RTL/LTR complet',
      viewOnGithub: 'Voir sur GitHub',
      builtWith: 'Construit avec Next.js, Supabase et noorui-rtl',
    },
    actions: {
      signOut: 'Se deconnecter',
      signOutDescription: 'Quitter le panneau d\'administration',
    },
  },
  ar: {
    title: 'الاعدادات',
    description: 'ادارة حسابك واعدادات الموقع',
    profile: {
      title: 'الملف الشخصي',
      description: 'معلومات حسابك',
      name: 'الاسم',
      email: 'البريد الالكتروني',
      role: 'الدور',
      admin: 'مدير',
      guest: 'ضيف (للعرض فقط)',
    },
    site: {
      title: 'معلومات الموقع',
      description: 'حول هذه المدونة',
      siteName: 'اسم الموقع',
      siteUrl: 'رابط الموقع',
      locales: 'اللغات',
      enabledLocales: 'الانجليزية، الفرنسية، العربية، الاردية',
    },
    demo: {
      title: 'حول هذا العرض',
      description: 'هذا كتاب - قالب مدونة متعدد اللغات مع دعم كامل للكتابة من اليمين لليسار',
      viewOnGithub: 'عرض على GitHub',
      builtWith: 'مبني باستخدام Next.js و Supabase و noorui-rtl',
    },
    actions: {
      signOut: 'تسجيل الخروج',
      signOutDescription: 'الخروج من لوحة الادارة',
    },
  },
  ur: {
    title: 'ترتیبات',
    description: 'اپنے اکاؤنٹ اور سائٹ کی ترتیبات کا انتظام کریں',
    profile: {
      title: 'پروفائل',
      description: 'آپ کے اکاؤنٹ کی معلومات',
      name: 'نام',
      email: 'ای میل',
      role: 'کردار',
      admin: 'منتظم',
      guest: 'مہمان (صرف دیکھیں)',
    },
    site: {
      title: 'سائٹ کی معلومات',
      description: 'اس بلاگ کے بارے میں',
      siteName: 'سائٹ کا نام',
      siteUrl: 'سائٹ کا لنک',
      locales: 'زبانیں',
      enabledLocales: 'انگریزی، فرانسیسی، عربی، اردو',
    },
    demo: {
      title: 'اس ڈیمو کے بارے میں',
      description: 'یہ کتاب ہے - مکمل RTL/LTR سپورٹ کے ساتھ کثیر لسانی بلاگ سٹارٹر',
      viewOnGithub: 'GitHub پر دیکھیں',
      builtWith: 'Next.js، Supabase اور noorui-rtl کے ساتھ بنایا گیا',
    },
    actions: {
      signOut: 'سائن آؤٹ',
      signOutDescription: 'ایڈمن پینل سے باہر نکلیں',
    },
  },
}

export default async function SettingsPage({ params }: SettingsPageProps) {
  const { locale } = await params
  const t = translations[locale]

  return <SettingsContent locale={locale} translations={t} />
}
