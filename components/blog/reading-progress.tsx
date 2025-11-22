'use client'

import { useEffect, useState } from 'react'
import { Progress } from 'noorui-rtl'

interface ReadingProgressProps {
  target?: string // CSS selector for the content container
}

export function ReadingProgress({ target }: ReadingProgressProps) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const updateProgress = () => {
      let scrollHeight: number
      let scrollTop: number
      let clientHeight: number

      if (target) {
        const element = document.querySelector(target)
        if (!element) return
        const rect = element.getBoundingClientRect()
        const elementTop = window.scrollY + rect.top
        const elementHeight = rect.height
        scrollTop = Math.max(0, window.scrollY - elementTop)
        scrollHeight = elementHeight
        clientHeight = window.innerHeight
      } else {
        scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight
        scrollTop = window.scrollY
        clientHeight = 0
      }

      const scrolled = (scrollTop / (scrollHeight - clientHeight)) * 100
      setProgress(Math.min(100, Math.max(0, scrolled)))
    }

    window.addEventListener('scroll', updateProgress, { passive: true })
    updateProgress()

    return () => window.removeEventListener('scroll', updateProgress)
  }, [target])

  return (
    <div className="fixed top-0 inset-x-0 z-50 h-1">
      <Progress value={progress} className="h-full rounded-none" />
    </div>
  )
}
