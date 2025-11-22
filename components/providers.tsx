'use client'

import { ThemeProvider } from 'next-themes'
import { DirectionProvider, DesignSystemProvider, TooltipProvider } from 'noorui-rtl'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" enableSystem={true}>
      <DirectionProvider>
        <DesignSystemProvider defaultTheme="minimal">
          <TooltipProvider>
            {children}
          </TooltipProvider>
        </DesignSystemProvider>
      </DirectionProvider>
    </ThemeProvider>
  )
}
