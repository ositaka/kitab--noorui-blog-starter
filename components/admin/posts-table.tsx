'use client'

import * as React from 'react'
import Link from 'next/link'
import { format } from 'date-fns'
import {
  Badge,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Input,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  useDirection,
} from 'noorui-rtl'
import {
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  User,
  Tag,
  Calendar,
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Locale, PostWithRelations } from '@/lib/supabase/types'

export interface PostsTableProps {
  posts: PostWithRelations[]
  locale: Locale
  translations: {
    title: string
    author: string
    status: string
    category: string
    views: string
    date: string
    published: string
    draft: string
    edit: string
    preview: string
    delete: string
    openMenu: string
    searchPosts: string
    noPosts: string
  }
  onEdit: (post: PostWithRelations) => void
  onDelete?: (post: PostWithRelations) => void
}

type SortDirection = 'asc' | 'desc' | null
type SortField = 'title' | 'is_published' | 'view_count' | 'published_at' | null

/**
 * PostsTable - Posts list with custom filtering and sorting
 * Local implementation to fix DataTable issues from noorui-rtl
 * TODO: Fix DataTable in noorui-rtl package (see ROADMAP Phase 7)
 */
export function PostsTable({
  posts,
  locale,
  translations: t,
  onEdit,
  onDelete,
}: PostsTableProps) {
  const { direction } = useDirection()
  const isRTL = direction === 'rtl'

  // Local state for filtering and sorting
  const [searchQuery, setSearchQuery] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState<'all' | 'published' | 'draft'>('all')
  const [sortField, setSortField] = React.useState<SortField>(null)
  const [sortDirection, setSortDirection] = React.useState<SortDirection>(null)

  // Filter posts
  const filteredPosts = React.useMemo(() => {
    let result = [...posts]

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (post) =>
          post.title?.toLowerCase().includes(query) ||
          post.slug?.toLowerCase().includes(query) ||
          post.author?.name?.toLowerCase().includes(query) ||
          post.category?.name?.toLowerCase().includes(query)
      )
    }

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter((post) =>
        statusFilter === 'published' ? post.is_published : !post.is_published
      )
    }

    // Sorting
    if (sortField && sortDirection) {
      result.sort((a, b) => {
        let comparison = 0
        switch (sortField) {
          case 'title':
            comparison = (a.title || '').localeCompare(b.title || '')
            break
          case 'is_published':
            comparison = (a.is_published ? 1 : 0) - (b.is_published ? 1 : 0)
            break
          case 'view_count':
            comparison = (a.view_count || 0) - (b.view_count || 0)
            break
          case 'published_at':
            const dateA = a.published_at ? new Date(a.published_at).getTime() : 0
            const dateB = b.published_at ? new Date(b.published_at).getTime() : 0
            comparison = dateA - dateB
            break
        }
        return sortDirection === 'desc' ? -comparison : comparison
      })
    }

    return result
  }, [posts, searchQuery, statusFilter, sortField, sortDirection])

  // Handle sort toggle
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      if (sortDirection === 'asc') {
        setSortDirection('desc')
      } else if (sortDirection === 'desc') {
        setSortField(null)
        setSortDirection(null)
      }
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  // Sort icon helper
  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4 ms-1 opacity-50" />
    if (sortDirection === 'asc') return <ArrowUp className="h-4 w-4 ms-1" />
    return <ArrowDown className="h-4 w-4 ms-1" />
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t.searchPosts}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="ps-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}>
          <SelectTrigger className="w-[150px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t.status}: All</SelectItem>
            <SelectItem value="published">{t.published}</SelectItem>
            <SelectItem value="draft">{t.draft}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 -ms-3 font-medium"
                  onClick={() => handleSort('title')}
                >
                  {t.title}
                  <SortIcon field="title" />
                </Button>
              </TableHead>
              <TableHead>{t.author}</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 -ms-3 font-medium"
                  onClick={() => handleSort('is_published')}
                >
                  {t.status}
                  <SortIcon field="is_published" />
                </Button>
              </TableHead>
              <TableHead>{t.category}</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 -ms-3 font-medium"
                  onClick={() => handleSort('view_count')}
                >
                  {t.views}
                  <SortIcon field="view_count" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 -ms-3 font-medium"
                  onClick={() => handleSort('published_at')}
                >
                  {t.date}
                  <SortIcon field="published_at" />
                </Button>
              </TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPosts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                  {t.noPosts}
                </TableCell>
              </TableRow>
            ) : (
              filteredPosts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{post.title}</div>
                      <div className="text-xs text-muted-foreground mt-1">/{post.slug}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>{post.author?.name || '-'}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn(
                        'flex items-center gap-1.5 w-fit',
                        post.is_published
                          ? 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20'
                          : 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20'
                      )}
                    >
                      <span
                        className={cn(
                          'h-1.5 w-1.5 rounded-full',
                          post.is_published ? 'bg-green-500' : 'bg-yellow-500'
                        )}
                      />
                      {post.is_published ? t.published : t.draft}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Tag className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm">{post.category?.name || '-'}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4 text-muted-foreground" />
                      <span>{(post.view_count || 0).toLocaleString()}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {post.published_at
                          ? format(new Date(post.published_at), 'MMM d, yyyy')
                          : '-'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">{t.openMenu}</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align={isRTL ? 'start' : 'end'}>
                        <DropdownMenuItem onClick={() => onEdit(post)}>
                          <Edit className="h-4 w-4 me-2" />
                          {t.edit}
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/${locale}/blog/${post.slug}`} target="_blank">
                            <Eye className="h-4 w-4 me-2" />
                            {t.preview}
                          </Link>
                        </DropdownMenuItem>
                        {onDelete && (
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => onDelete(post)}
                          >
                            <Trash2 className="h-4 w-4 me-2" />
                            {t.delete}
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
