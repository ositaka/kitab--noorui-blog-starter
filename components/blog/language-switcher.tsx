'use client'

import { usePathname, useRouter } from 'next/navigation'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  Button,
} from 'noorui-rtl'
import { Globe, Check } from 'lucide-react'
import type { Locale } from '@/lib/supabase/types'

interface LanguageSwitcherProps {
  currentLocale: Locale
  availableLocales?: Locale[]
}

const localeLabels: Record<Locale, { name: string; nativeName: string; dir: 'ltr' | 'rtl' }> = {
  en: { name: 'English', nativeName: 'English', dir: 'ltr' },
  fr: { name: 'French', nativeName: 'Français', dir: 'ltr' },
  ar: { name: 'Arabic', nativeName: 'العربية', dir: 'rtl' },
  ur: { name: 'Urdu', nativeName: 'اردو', dir: 'rtl' },
}

export function LanguageSwitcher({
  currentLocale,
  availableLocales = ['en', 'fr', 'ar', 'ur']
}: LanguageSwitcherProps) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLocaleChange = (newLocale: Locale) => {
    // Replace the locale segment in the path
    const segments = pathname.split('/')
    if (segments[1] && Object.keys(localeLabels).includes(segments[1])) {
      segments[1] = newLocale
    } else {
      segments.splice(1, 0, newLocale)
    }
    router.push(segments.join('/'))
  }

  const currentLabel = localeLabels[currentLocale]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Globe className="h-4 w-4 me-2" />
          {currentLabel.nativeName}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Language / اللغة</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {availableLocales.map((locale) => {
          const label = localeLabels[locale]
          const isActive = locale === currentLocale
          return (
            <DropdownMenuItem
              key={locale}
              onClick={() => handleLocaleChange(locale)}
              className="flex items-center justify-between"
              dir={label.dir}
            >
              <span>
                {label.nativeName}
                <span className="text-muted-foreground ms-2 text-xs">
                  ({label.name})
                </span>
              </span>
              {isActive && <Check className="h-4 w-4 ms-2" />}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
