'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Badge,
  Button,
  ButtonArrow,
  Input,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  EmptyState,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from 'noorui-rtl'
import {
  MessageSquare,
  Search,
  ExternalLink,
  Pin,
  Trash2,
  MessageCircle,
  Filter,
} from 'lucide-react'
import { formatDate } from '@/lib/utils'
import type { Locale } from '@/lib/supabase/types'
import type { AdminComment } from '@/lib/supabase/comments'
import { deleteComment, togglePinComment } from '@/lib/supabase/comments'
import { toast } from 'sonner'

const translations: Record<Locale, {
  title: string
  description: string
  search: string
  searchPlaceholder: string
  filterAll: string
  filterActive: string
  filterDeleted: string
  filterPinned: string
  sortNewest: string
  sortOldest: string
  user: string
  comment: string
  post: string
  status: string
  date: string
  actions: string
  viewPost: string
  pin: string
  unpin: string
  delete: string
  deleted: string
  pinned: string
  edited: string
  reply: string
  replies: string
  noComments: string
  noCommentsDescription: string
  page: string
  of: string
  previous: string
  next: string
  deleteTitle: string
  deleteDescription: string
  cancel: string
  deleting: string
  confirmDelete: string
  total: string
}> = {
  en: {
    title: 'Comments Management',
    description: 'Manage and moderate all comments on your blog',
    search: 'Search',
    searchPlaceholder: 'Search comments or users...',
    filterAll: 'All',
    filterActive: 'Active',
    filterDeleted: 'Deleted',
    filterPinned: 'Pinned',
    sortNewest: 'Newest First',
    sortOldest: 'Oldest First',
    user: 'User',
    comment: 'Comment',
    post: 'Post',
    status: 'Status',
    date: 'Date',
    actions: 'Actions',
    viewPost: 'View Post',
    pin: 'Pin',
    unpin: 'Unpin',
    delete: 'Delete',
    deleted: 'Deleted',
    pinned: 'Pinned',
    edited: 'Edited',
    reply: 'Reply',
    replies: 'Replies',
    noComments: 'No comments found',
    noCommentsDescription: 'Try adjusting your filters or search query',
    page: 'Page',
    of: 'of',
    previous: 'Previous',
    next: 'Next',
    deleteTitle: 'Delete Comment',
    deleteDescription: 'Are you sure you want to delete this comment? This action cannot be undone.',
    cancel: 'Cancel',
    deleting: 'Deleting...',
    confirmDelete: 'Delete',
    total: 'Total',
  },
  fr: {
    title: 'Gestion des commentaires',
    description: 'Gérer et modérer tous les commentaires sur votre blog',
    search: 'Rechercher',
    searchPlaceholder: 'Rechercher des commentaires ou des utilisateurs...',
    filterAll: 'Tous',
    filterActive: 'Actifs',
    filterDeleted: 'Supprimés',
    filterPinned: 'Épinglés',
    sortNewest: 'Plus récents',
    sortOldest: 'Plus anciens',
    user: 'Utilisateur',
    comment: 'Commentaire',
    post: 'Article',
    status: 'Statut',
    date: 'Date',
    actions: 'Actions',
    viewPost: 'Voir l\'article',
    pin: 'Épingler',
    unpin: 'Désépingler',
    delete: 'Supprimer',
    deleted: 'Supprimé',
    pinned: 'Épinglé',
    edited: 'Modifié',
    reply: 'Réponse',
    replies: 'Réponses',
    noComments: 'Aucun commentaire trouvé',
    noCommentsDescription: 'Essayez d\'ajuster vos filtres ou votre requête de recherche',
    page: 'Page',
    of: 'sur',
    previous: 'Précédent',
    next: 'Suivant',
    deleteTitle: 'Supprimer le commentaire',
    deleteDescription: 'Êtes-vous sûr de vouloir supprimer ce commentaire ? Cette action est irréversible.',
    cancel: 'Annuler',
    deleting: 'Suppression...',
    confirmDelete: 'Supprimer',
    total: 'Total',
  },
  ar: {
    title: 'إدارة التعليقات',
    description: 'إدارة ومراقبة جميع التعليقات على مدونتك',
    search: 'بحث',
    searchPlaceholder: 'البحث عن تعليقات أو مستخدمين...',
    filterAll: 'الكل',
    filterActive: 'نشط',
    filterDeleted: 'محذوف',
    filterPinned: 'مثبت',
    sortNewest: 'الأحدث أولاً',
    sortOldest: 'الأقدم أولاً',
    user: 'المستخدم',
    comment: 'التعليق',
    post: 'المنشور',
    status: 'الحالة',
    date: 'التاريخ',
    actions: 'الإجراءات',
    viewPost: 'عرض المنشور',
    pin: 'تثبيت',
    unpin: 'إلغاء التثبيت',
    delete: 'حذف',
    deleted: 'محذوف',
    pinned: 'مثبت',
    edited: 'معدل',
    reply: 'رد',
    replies: 'ردود',
    noComments: 'لا توجد تعليقات',
    noCommentsDescription: 'حاول تعديل الفلاتر أو استعلام البحث',
    page: 'صفحة',
    of: 'من',
    previous: 'السابق',
    next: 'التالي',
    deleteTitle: 'حذف التعليق',
    deleteDescription: 'هل أنت متأكد من حذف هذا التعليق؟ لا يمكن التراجع عن هذا الإجراء.',
    cancel: 'إلغاء',
    deleting: 'جارٍ الحذف...',
    confirmDelete: 'حذف',
    total: 'الإجمالي',
  },
  ur: {
    title: 'تبصرے کا انتظام',
    description: 'اپنے بلاگ پر تمام تبصروں کا انتظام اور نگرانی کریں',
    search: 'تلاش',
    searchPlaceholder: 'تبصرے یا صارفین تلاش کریں...',
    filterAll: 'تمام',
    filterActive: 'فعال',
    filterDeleted: 'حذف شدہ',
    filterPinned: 'پن شدہ',
    sortNewest: 'نیا پہلے',
    sortOldest: 'پرانا پہلے',
    user: 'صارف',
    comment: 'تبصرہ',
    post: 'پوسٹ',
    status: 'حیثیت',
    date: 'تاریخ',
    actions: 'اعمال',
    viewPost: 'پوسٹ دیکھیں',
    pin: 'پن کریں',
    unpin: 'پن ہٹائیں',
    delete: 'حذف کریں',
    deleted: 'حذف شدہ',
    pinned: 'پن شدہ',
    edited: 'ترمیم شدہ',
    reply: 'جواب',
    replies: 'جوابات',
    noComments: 'کوئی تبصرے نہیں ملے',
    noCommentsDescription: 'اپنے فلٹرز یا تلاش کی استفسار کو ایڈجسٹ کرنے کی کوشش کریں',
    page: 'صفحہ',
    of: 'از',
    previous: 'پچھلا',
    next: 'اگلا',
    deleteTitle: 'تبصرہ حذف کریں',
    deleteDescription: 'کیا آپ واقعی یہ تبصرہ حذف کرنا چاہتے ہیں؟ یہ عمل واپس نہیں کیا جا سکتا۔',
    cancel: 'منسوخ کریں',
    deleting: 'حذف ہو رہا ہے...',
    confirmDelete: 'حذف کریں',
    total: 'کل',
  },
}

interface CommentsContentProps {
  locale: Locale
  comments: AdminComment[]
  total: number
  currentPage: number
  totalPages: number
  currentStatus: 'all' | 'active' | 'deleted' | 'pinned'
  currentSearch: string
  currentSort: 'newest' | 'oldest'
}

export function CommentsContent({
  locale,
  comments,
  total,
  currentPage,
  totalPages,
  currentStatus,
  currentSearch,
  currentSort,
}: CommentsContentProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const t = translations[locale]
  const [searchInput, setSearchInput] = React.useState(currentSearch)
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
  const [commentToDelete, setCommentToDelete] = React.useState<string | null>(null)
  const [isDeleting, setIsDeleting] = React.useState(false)

  // Update URL with new filters
  const updateFilters = (updates: {
    status?: string
    search?: string
    sort?: string
    page?: string
  }) => {
    const params = new URLSearchParams(searchParams.toString())

    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
    })

    router.push(`/${locale}/admin/comments?${params.toString()}`)
  }

  // Handle search with debounce
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== currentSearch) {
        updateFilters({ search: searchInput, page: '1' })
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [searchInput])

  // Handle delete
  const handleDelete = async () => {
    if (!commentToDelete) return

    setIsDeleting(true)

    try {
      console.log('Deleting comment:', commentToDelete)
      const result = await deleteComment(commentToDelete)
      console.log('Delete result:', result)

      if (result.success) {
        toast.success('Comment deleted successfully')
        setDeleteDialogOpen(false)
        setCommentToDelete(null)

        // Force refresh the page data
        router.refresh()
      } else {
        console.error('Delete failed:', result.error)
        toast.error(result.error || 'Failed to delete comment')
      }
    } catch (error) {
      console.error('Unexpected delete error:', error)
      toast.error('An unexpected error occurred')
    } finally {
      setIsDeleting(false)
    }
  }

  // Handle pin toggle
  const handleTogglePin = async (commentId: string, isPinned: boolean) => {
    const result = await togglePinComment(commentId, !isPinned)

    if (result.success) {
      toast.success(isPinned ? 'Comment unpinned' : 'Comment pinned')
      router.refresh()
    } else {
      toast.error(result.error || 'Failed to toggle pin')
    }
  }

  // Get status badge color
  const getStatusBadge = (comment: AdminComment) => {
    if (comment.is_deleted) {
      return (
        <Badge variant="outline" className="bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20">
          {t.deleted}
        </Badge>
      )
    }
    if (comment.is_pinned) {
      return (
        <Badge variant="outline" className="bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20">
          <Pin className="h-3 w-3 me-1" />
          {t.pinned}
        </Badge>
      )
    }
    return null
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t.title}</h1>
        <p className="text-muted-foreground">{t.description}</p>
      </div>

      {/* Filters & Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Status Filters */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant={currentStatus === 'all' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => updateFilters({ status: 'all', page: '1' })}
              >
                <Filter className="h-4 w-4 me-2" />
                {t.filterAll}
              </Button>
              <Button
                variant={currentStatus === 'active' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => updateFilters({ status: 'active', page: '1' })}
              >
                <MessageCircle className="h-4 w-4 me-2" />
                {t.filterActive}
              </Button>
              <Button
                variant={currentStatus === 'pinned' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => updateFilters({ status: 'pinned', page: '1' })}
              >
                <Pin className="h-4 w-4 me-2" />
                {t.filterPinned}
              </Button>
              <Button
                variant={currentStatus === 'deleted' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => updateFilters({ status: 'deleted', page: '1' })}
              >
                <Trash2 className="h-4 w-4 me-2" />
                {t.filterDeleted}
              </Button>
            </div>

            {/* Search & Sort */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder={t.searchPlaceholder}
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="ps-9"
                />
              </div>
              <Select value={currentSort} onValueChange={(value) => updateFilters({ sort: value })}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">{t.sortNewest}</SelectItem>
                  <SelectItem value="oldest">{t.sortOldest}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Results count */}
          <div className="mt-4 text-sm text-muted-foreground">
            {t.total}: {total.toLocaleString()} {total === 1 ? t.comment.toLowerCase() : t.replies.toLowerCase()}
          </div>
        </CardContent>
      </Card>

      {/* Comments Table */}
      <Card>
        <CardContent className="p-0">
          {comments.length === 0 ? (
            <div className="py-12">
              <EmptyState
                icon={<MessageSquare className="h-12 w-12" />}
                title={t.noComments}
                description={t.noCommentsDescription}
              />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t.user}</TableHead>
                  <TableHead>{t.comment}</TableHead>
                  <TableHead>{t.post}</TableHead>
                  <TableHead>{t.status}</TableHead>
                  <TableHead>{t.date}</TableHead>
                  <TableHead className="text-end">{t.actions}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {comments.map((comment) => (
                  <TableRow key={comment.id}>
                    {/* User */}
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          {comment.user_avatar && (
                            <AvatarImage src={comment.user_avatar} alt={comment.user_name} />
                          )}
                          <AvatarFallback className="text-xs">
                            {comment.user_name[0]?.toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">{comment.user_name}</p>
                        </div>
                      </div>
                    </TableCell>

                    {/* Comment */}
                    <TableCell className="max-w-md">
                      <p className="line-clamp-2 text-sm">{comment.content}</p>
                      <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                        {comment.parent_id && (
                          <span className="flex items-center gap-1">
                            <MessageCircle className="h-3 w-3" />
                            {t.reply}
                          </span>
                        )}
                        {comment.reply_count > 0 && (
                          <span>
                            {comment.reply_count} {comment.reply_count === 1 ? t.reply : t.replies}
                          </span>
                        )}
                        {comment.is_edited && <span>• {t.edited}</span>}
                      </div>
                    </TableCell>

                    {/* Post */}
                    <TableCell>
                      <Link
                        href={`/${locale}/blog/${comment.post_slug}`}
                        className="text-sm text-primary hover:underline"
                        target="_blank"
                      >
                        {comment.post_title}
                      </Link>
                    </TableCell>

                    {/* Status */}
                    <TableCell>{getStatusBadge(comment)}</TableCell>

                    {/* Date */}
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(comment.created_at, locale, { format: 'short' })}
                    </TableCell>

                    {/* Actions */}
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          asChild
                        >
                          <Link href={`/${locale}/blog/${comment.post_slug}#comment-${comment.id}`} target="_blank">
                            <ExternalLink className="h-4 w-4" />
                          </Link>
                        </Button>
                        {!comment.is_deleted && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => handleTogglePin(comment.id, comment.is_pinned)}
                            >
                              <Pin className={`h-4 w-4 ${comment.is_pinned ? 'fill-current' : ''}`} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                              onClick={() => {
                                setCommentToDelete(comment.id)
                                setDeleteDialogOpen(true)
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {t.page} {currentPage} {t.of} {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => updateFilters({ page: (currentPage - 1).toString() })}
            >
              {t.previous}
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => updateFilters({ page: (currentPage + 1).toString() })}
            >
              {t.next}
            </Button>
          </div>
        </div>
      )}

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.deleteTitle}</DialogTitle>
            <DialogDescription>{t.deleteDescription}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false)
                setCommentToDelete(null)
              }}
              disabled={isDeleting}
            >
              {t.cancel}
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? t.deleting : t.confirmDelete}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
