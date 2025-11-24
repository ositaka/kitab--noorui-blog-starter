import { cn } from '@/lib/utils'

export interface WideBoxProps {
  children: React.ReactNode
  /** Additional CSS classes */
  className?: string
}

/**
 * WideBox - Container that breaks out of content width
 *
 * Usage in MDX:
 * <WideBox>
 *   Content that needs more horizontal space
 * </WideBox>
 */
export function WideBox({ children, className }: WideBoxProps) {
  return (
    <div
      className={cn(
        'my-8 -mx-4 px-4 sm:-mx-8 sm:px-8 lg:-mx-16 lg:px-16',
        'not-prose',
        className,
      )}
    >
      {children}
    </div>
  )
}
