import type { Locale } from '@/lib/supabase/types'
import { getUser } from '@/lib/supabase/auth'
import { redirect } from 'next/navigation'
import { LoginContent } from './login-content'

interface LoginPageProps {
  params: Promise<{ locale: Locale }>
}

const translations: Record<Locale, {
  title: string
  subtitle: string
  googleButton: string
  emailPlaceholder: string
  emailButton: string
  emailSent: string
  guestButton: string
  guestNote: string
  backToSite: string
}> = {
  en: {
    title: 'Kitab Admin',
    subtitle: 'Manage your blog content',
    googleButton: 'Sign in with Google',
    emailPlaceholder: 'Enter your email',
    emailButton: 'Send link',
    emailSent: 'Check your email for the magic link!',
    guestButton: 'Enter as Guest',
    guestNote: 'View-only mode - no editing allowed',
    backToSite: 'Back to site',
  },
  fr: {
    title: 'Kitab Admin',
    subtitle: 'Gerez le contenu de votre blog',
    googleButton: 'Se connecter avec Google',
    emailPlaceholder: 'Entrez votre email',
    emailButton: 'Envoyer',
    emailSent: 'Verifiez votre email pour le lien magique!',
    guestButton: 'Entrer en tant qu\'invite',
    guestNote: 'Mode lecture seule - modification non autorisee',
    backToSite: 'Retour au site',
  },
  ar: {
    title: 'ادارة كتاب',
    subtitle: 'ادارة محتوى مدونتك',
    googleButton: 'تسجيل الدخول بحساب جوجل',
    emailPlaceholder: 'ادخل بريدك الالكتروني',
    emailButton: 'ارسال',
    emailSent: 'تحقق من بريدك الالكتروني للرابط السحري!',
    guestButton: 'الدخول كضيف',
    guestNote: 'وضع القراءة فقط - لا يمكن التعديل',
    backToSite: 'العودة للموقع',
  },
  ur: {
    title: 'کتاب ایڈمن',
    subtitle: 'اپنے بلاگ کا مواد منظم کریں',
    googleButton: 'گوگل سے سائن ان کریں',
    emailPlaceholder: 'اپنا ای میل درج کریں',
    emailButton: 'لنک بھیجیں',
    emailSent: 'میجک لنک کے لیے اپنا ای میل چیک کریں!',
    guestButton: 'مہمان کے طور پر داخل ہوں',
    guestNote: 'صرف دیکھنے کا موڈ - ترمیم کی اجازت نہیں',
    backToSite: 'سائٹ پر واپس',
  },
}

export default async function LoginPage({ params }: LoginPageProps) {
  const { locale } = await params

  // If already authenticated, redirect to admin dashboard
  const user = await getUser()
  if (user) {
    redirect(`/${locale}/admin`)
  }

  const t = translations[locale]

  return <LoginContent locale={locale} translations={t} />
}
