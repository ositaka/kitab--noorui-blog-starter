'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Input } from 'noorui-rtl'
import { DirectionProvider } from 'noorui-rtl'
import type { Locale } from '@/lib/supabase/types'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, ArrowRight, Mail } from 'lucide-react'
import { toast } from 'sonner'

interface LoginContentProps {
  locale: Locale
  translations: {
    title: string
    subtitle: string
    googleButton: string
    emailPlaceholder: string
    emailButton: string
    emailSent: string
    guestButton: string
    guestNote: string
    backToSite: string
  }
}

const localeConfig: Record<Locale, { dir: 'ltr' | 'rtl' }> = {
  en: { dir: 'ltr' },
  fr: { dir: 'ltr' },
  ar: { dir: 'rtl' },
  ur: { dir: 'rtl' },
}

export function LoginContent({ locale, translations: t }: LoginContentProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState<'google' | 'email' | 'guest' | null>(null)
  const [email, setEmail] = useState('')
  const [emailSent, setEmailSent] = useState(false)
  const config = localeConfig[locale]
  const isRTL = config.dir === 'rtl'

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsLoading('email')
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/${locale}/admin`,
        },
      })
      if (error) {
        toast.error(error.message)
        setIsLoading(null)
      } else {
        setEmailSent(true)
        toast.success(t.emailSent)
        setIsLoading(null)
      }
    } catch (error) {
      console.error('Email sign-in error:', error)
      toast.error('Failed to send magic link')
      setIsLoading(null)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsLoading('google')
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=/${locale}/admin`,
        },
      })
      if (error) {
        console.error('Google sign-in error:', error)
        setIsLoading(null)
      }
    } catch (error) {
      console.error('Google sign-in error:', error)
      setIsLoading(null)
    }
  }

  const handleGuestMode = async () => {
    setIsLoading('guest')
    try {
      // Call server action to set guest cookie
      const response = await fetch('/api/auth/guest', {
        method: 'POST',
      })
      if (response.ok) {
        router.push(`/${locale}/admin`)
        router.refresh()
      } else {
        setIsLoading(null)
      }
    } catch (error) {
      console.error('Guest mode error:', error)
      setIsLoading(null)
    }
  }

  const BackArrow = isRTL ? ArrowRight : ArrowLeft

  return (
    <DirectionProvider>
      <div dir={config.dir} className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">{t.title}</h1>
            <p className="text-muted-foreground">{t.subtitle}</p>
          </div>

          {/* Login Card */}
          <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
            {/* Google Sign In */}
            <Button
              onClick={handleGoogleSignIn}
              disabled={isLoading !== null}
              className="w-full mb-4 h-12"
              variant="primary"
            >
              {isLoading === 'google' ? (
                <span className="animate-pulse">...</span>
              ) : (
                <>
                  <svg className="w-5 h-5 me-2" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  {t.googleButton}
                </>
              )}
            </Button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-card text-muted-foreground">or</span>
              </div>
            </div>

            {/* Email Magic Link */}
            {emailSent ? (
              <div className="text-center py-4 px-3 bg-muted rounded-md mb-4">
                <Mail className="h-8 w-8 mx-auto mb-2 text-primary" />
                <p className="text-sm text-foreground font-medium">{t.emailSent}</p>
                <p className="text-xs text-muted-foreground mt-1">{email}</p>
              </div>
            ) : (
              <form onSubmit={handleEmailSignIn} className="mb-4">
                <div className="flex gap-2">
                  <Input
                    type="email"
                    placeholder={t.emailPlaceholder}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading !== null}
                    className="flex-1"
                  />
                  <Button
                    type="submit"
                    disabled={isLoading !== null || !email}
                    variant="secondary"
                  >
                    {isLoading === 'email' ? (
                      <span className="animate-pulse">...</span>
                    ) : (
                      <>
                        <Mail className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            )}

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-card text-muted-foreground">or</span>
              </div>
            </div>

            {/* Guest Mode */}
            <Button
              onClick={handleGuestMode}
              disabled={isLoading !== null}
              className="w-full h-12"
              variant="outline"
            >
              {isLoading === 'guest' ? (
                <span className="animate-pulse">...</span>
              ) : (
                t.guestButton
              )}
            </Button>

            <p className="text-xs text-muted-foreground text-center mt-3">
              {t.guestNote}
            </p>
          </div>

          {/* Back to site link */}
          <div className="text-center mt-6">
            <a
              href={`/${locale}`}
              className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
            >
              <BackArrow className="w-4 h-4" />
              {t.backToSite}
            </a>
          </div>
        </div>
      </div>
    </DirectionProvider>
  )
}
