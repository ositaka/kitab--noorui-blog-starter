'use client'

import { useEffect, useState } from 'react'
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  Button,
  useDirection,
} from 'noorui-rtl'
import { List } from 'lucide-react'

interface TocItem {
  id: string
  text: string
  level: number
}

interface TableOfContentsProps {
  contentSelector?: string
  title?: string
}

export function TableOfContents({
  contentSelector = 'article',
  title
}: TableOfContentsProps) {
  const [headings, setHeadings] = useState<TocItem[]>([])
  const [activeId, setActiveId] = useState<string>('')
  const { direction } = useDirection()
  const isRTL = direction === 'rtl'

  const defaultTitle = isRTL ? 'جدول المحتويات' : 'Table of Contents'

  useEffect(() => {
    const content = document.querySelector(contentSelector)
    if (!content) return

    const elements = content.querySelectorAll('h2, h3')
    const items: TocItem[] = Array.from(elements).map((el, index) => {
      const id = el.id || `heading-${index}`
      if (!el.id) el.id = id
      return {
        id,
        text: el.textContent || '',
        level: el.tagName === 'H2' ? 2 : 3,
      }
    })
    setHeadings(items)
  }, [contentSelector])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: '-100px 0px -80% 0px' }
    )

    headings.forEach(({ id }) => {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [headings])

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  if (headings.length === 0) return null

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <List className="h-4 w-4" />
          {title || defaultTitle}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 pe-1">
        <div className="max-h-[300px] overflow-y-auto scrollbar-thin">
          <nav className="space-y-1 pe-1">
            {headings.map((heading) => (
              <Button
                key={heading.id}
                variant="ghost"
                size="sm"
                className={`
                  w-full justify-start text-start h-auto py-1.5
                  ${heading.level === 3 ? 'ps-4' : ''}
                  ${activeId === heading.id ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'}
                `}
                onClick={() => scrollToHeading(heading.id)}
              >
                <span className="truncate text-sm">{heading.text}</span>
              </Button>
            ))}
          </nav>
        </div>
      </CardContent>
    </Card>
  )
}
