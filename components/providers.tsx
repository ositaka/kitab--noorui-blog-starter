'use client'

import { ThemeProvider } from 'next-themes'
import { DirectionProvider, DesignSystemProvider, TooltipProvider } from 'noorui-rtl'
import { Toaster } from 'sonner'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" enableSystem={true}>
      <DirectionProvider>
        <DesignSystemProvider defaultTheme="minimal">
          <TooltipProvider>
            {children}
            <Toaster richColors position="bottom-right" />
          </TooltipProvider>
        </DesignSystemProvider>
      </DirectionProvider>
    </ThemeProvider>
  )
}
