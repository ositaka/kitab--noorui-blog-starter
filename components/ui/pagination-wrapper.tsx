'use client'

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from 'noorui-rtl'

interface PaginationWrapperProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  dir?: 'ltr' | 'rtl'
}

export function PaginationWrapper({ currentPage, totalPages, onPageChange, dir = 'ltr' }: PaginationWrapperProps) {
  if (totalPages <= 1) return null

  return (
    <div className="mt-12 pt-8 border-t">
      <Pagination dir={dir}>
        <PaginationContent>
        {/* Previous */}
        <PaginationItem>
          <PaginationPrevious
            onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
            className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
          />
        </PaginationItem>

        {/* Pages */}
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
          const showPage = page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)
          const showEllipsisBefore = page === currentPage - 2 && currentPage > 3
          const showEllipsisAfter = page === currentPage + 2 && currentPage < totalPages - 2

          if (showEllipsisBefore || showEllipsisAfter) {
            return (
              <PaginationItem key={`ellipsis-${page}`}>
                <PaginationEllipsis />
              </PaginationItem>
            )
          }

          if (!showPage) return null

          return (
            <PaginationItem key={page}>
              <PaginationLink onClick={() => onPageChange(page)} isActive={currentPage === page} className="cursor-pointer">
                {page}
              </PaginationLink>
            </PaginationItem>
          )
        })}

        {/* Next */}
        <PaginationItem>
          <PaginationNext
            onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
            className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
    </div>
  )
}
