'use client'

import Link from 'next/link'
import { useTheme } from 'next-themes'
import { useDirection, Button } from 'noorui-rtl'
import { Moon, Sun, Languages } from 'lucide-react'

export function SiteNav() {
  const { theme, setTheme } = useTheme()
  const { direction, setDirection } = useDirection()

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold">
            Noor UI Blog
          </Link>

          <div className="flex items-center gap-6">
            <Link href="/" className="text-sm font-medium hover:text-primary">
              Home
            </Link>
            <Link href="/blog" className="text-sm font-medium hover:text-primary">
              Blog
            </Link>
            <Link href="/about" className="text-sm font-medium hover:text-primary">
              About
            </Link>

            <div className="flex items-center gap-2 border-s ps-6">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              >
                {theme === 'dark' ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setDirection(direction === 'rtl' ? 'ltr' : 'rtl')}
              >
                <Languages className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
