'use client'

import { SiteNav } from '@/components/site-nav'
import { SiteFooter } from '@/components/site-footer'
import { Card, CardContent } from 'noorui-rtl'

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteNav />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-4">About This Blog</h1>
            <p className="text-muted-foreground text-lg">
              Learn more about Noor UI and this blog starter
            </p>
          </div>

          <div className="space-y-8">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold mb-4">About Noor UI</h2>
                <p className="text-muted-foreground mb-4">
                  Noor UI is a comprehensive component library designed for building beautiful,
                  accessible, and bilingual web applications. It provides full support for both
                  LTR and RTL layouts, making it perfect for multilingual projects.
                </p>
                <p className="text-muted-foreground">
                  With four distinct themes and complete dark mode support, Noor UI gives you
                  the flexibility to create unique user experiences while maintaining consistency
                  and accessibility standards.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold mb-4">About This Starter</h2>
                <p className="text-muted-foreground mb-4">
                  This blog starter demonstrates the capabilities of Noor UI in a real-world
                  application. It showcases:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Minimal, clean design aesthetic</li>
                  <li>Full bilingual support (English/Arabic)</li>
                  <li>Responsive layouts for all devices</li>
                  <li>Theme switching capabilities</li>
                  <li>Proper RTL/LTR direction handling</li>
                  <li>Accessible components throughout</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold mb-4">Features</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold mb-2">Four Design Themes</h3>
                    <p className="text-sm text-muted-foreground">
                      Choose from Minimal, Futuristic, Cozy, or Artistic themes
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Dark Mode</h3>
                    <p className="text-sm text-muted-foreground">
                      Full dark mode support across all themes
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">RTL Support</h3>
                    <p className="text-sm text-muted-foreground">
                      Seamless right-to-left layout switching
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Type Safe</h3>
                    <p className="text-sm text-muted-foreground">
                      Built with TypeScript for better DX
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold mb-4">Get Started</h2>
                <p className="text-muted-foreground mb-4">
                  Ready to build your own project with Noor UI? Install the package and start
                  creating beautiful, accessible applications today.
                </p>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                  <code>npm install noorui-rtl</code>
                </pre>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
