import type { Locale } from '@/lib/supabase/types'
import { Header, Footer } from '@/components/layout'

/**
 * Main layout for public-facing pages.
 * Includes the site header and footer.
 */
export default async function MainLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  return (
    <div className="flex min-h-screen flex-col">
      <Header locale={locale as Locale} />
      <main className="flex-1">
        {children}
      </main>
      <Footer locale={locale as Locale} />
    </div>
  )
}
