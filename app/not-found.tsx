'use client'

import Link from 'next/link'
import { SiteNav } from '@/components/site-nav'
import { SiteFooter } from '@/components/site-footer'
import { Button } from 'noorui-rtl'
import { Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteNav />

      <main className="flex-1 flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="text-6xl font-bold mb-4">404</h1>
          <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Sorry, we couldn't find the page you're looking for. The page might have been
            moved or deleted.
          </p>
          <Link href="/">
            <Button size="lg">
              <Home className="me-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
