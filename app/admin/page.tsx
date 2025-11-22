'use client'

import * as React from 'react'
import { DashboardShell, DataTable, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Badge, Tabs, TabsContent, TabsList, TabsTrigger, Separator, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, useDirection, RichTextEditor } from 'noorui-rtl'
import {
  FileText,
  Eye,
  MessageSquare,
  TrendingUp,
  Plus,
  Search,
  Edit,
  Trash2,
  MoreHorizontal,
  User,
  Tag,
  Globe,
} from 'lucide-react'
import { mockPosts } from '@/lib/posts'
import { cn } from '@/lib/utils'

// Extend mock posts with admin-specific data
const adminPosts = mockPosts.map(post => ({
  ...post,
  status: post.featured ? 'published' : (Math.random() > 0.7 ? 'draft' : 'published'),
}))

function StatsCard({ icon, label, value, trend, trendLabel }: {
  icon: React.ReactNode
  label: string
  value: string
  trend: number
  trendLabel: string
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{label}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">
          <span className="text-green-600">+{trend}%</span> {trendLabel}
        </p>
      </CardContent>
    </Card>
  )
}

export default function AdminPage() {
  const { direction } = useDirection()
  const isRTL = direction === 'rtl'

  const [activeView, setActiveView] = React.useState<'posts' | 'create' | 'analytics'>('posts')
  const [selectedPost, setSelectedPost] = React.useState<typeof adminPosts[0] | null>(null)
  const [editorContent, setEditorContent] = React.useState('')
  const [editorContentAr, setEditorContentAr] = React.useState('')

  const mockNotifications = [
    {
      id: '1',
      title: isRTL ? 'تعليق جديد' : 'New Comment',
      description: isRTL ? 'على منشورك "البدء مع نور UI"' : 'On your post "Getting Started with Noor UI"',
      time: isRTL ? 'منذ 5 دقائق' : '5 minutes ago',
      read: false,
      type: 'comment' as const,
    },
    {
      id: '2',
      title: isRTL ? 'تم النشر' : 'Post Published',
      description: isRTL ? 'منشورك الآن متاح للجمهور' : 'Your post is now live',
      time: isRTL ? 'منذ ساعة' : '1 hour ago',
      read: false,
      type: 'success' as const,
    },
  ]

  // DataTable columns
  const columns = [
    {
      id: 'title',
      accessorKey: 'title' as keyof typeof adminPosts[0],
      header: isRTL ? 'العنوان' : 'Title',
      cell: (row: typeof adminPosts[0]) => (
        <div>
          <div className="font-medium">{isRTL ? row.titleAr : row.title}</div>
          <div className="flex items-center gap-2 mt-1">
            <Globe className="h-3 w-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              {row.language === 'both' ? (isRTL ? 'ثنائي اللغة' : 'Bilingual') : row.language}
            </span>
          </div>
        </div>
      ),
    },
    {
      id: 'author',
      accessorKey: 'author' as keyof typeof adminPosts[0],
      header: isRTL ? 'المؤلف' : 'Author',
      cell: (row: typeof adminPosts[0]) => (
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-muted-foreground" />
          <span>{isRTL ? row.authorAr : row.author}</span>
        </div>
      ),
    },
    {
      id: 'status',
      accessorKey: 'status' as keyof typeof adminPosts[0],
      header: isRTL ? 'الحالة' : 'Status',
      cell: (row: typeof adminPosts[0]) => {
        const statusConfig = {
          published: {
            label: isRTL ? 'منشور' : 'Published',
            className: 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20'
          },
          draft: {
            label: isRTL ? 'مسودة' : 'Draft',
            className: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20'
          },
        }
        const config = statusConfig[row.status as keyof typeof statusConfig] || statusConfig.published
        return (
          <Badge variant="outline" className={cn('flex items-center gap-1.5', config.className)}>
            <span className={cn(
              'h-1.5 w-1.5 rounded-full',
              row.status === 'published' && 'bg-green-500',
              row.status === 'draft' && 'bg-yellow-500'
            )} />
            {config.label}
          </Badge>
        )
      },
    },
    {
      id: 'category',
      accessorKey: 'category' as keyof typeof adminPosts[0],
      header: isRTL ? 'الفئة' : 'Category',
      cell: (row: typeof adminPosts[0]) => (
        <div className="flex items-center gap-1">
          <Tag className="h-3 w-3 text-muted-foreground" />
          <span className="text-sm">{isRTL ? row.categoryAr : row.category}</span>
        </div>
      ),
    },
    {
      id: 'views',
      accessorKey: 'views' as keyof typeof adminPosts[0],
      header: isRTL ? 'المشاهدات' : 'Views',
      cell: (row: typeof adminPosts[0]) => (
        <div className="flex items-center gap-1">
          <Eye className="h-4 w-4 text-muted-foreground" />
          <span>{row.views.toLocaleString()}</span>
        </div>
      ),
    },
    {
      id: 'comments',
      accessorKey: 'comments' as keyof typeof adminPosts[0],
      header: isRTL ? 'التعليقات' : 'Comments',
      cell: (row: typeof adminPosts[0]) => (
        <div className="flex items-center gap-1">
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
          <span>{row.comments}</span>
        </div>
      ),
    },
    {
      id: 'actions',
      accessorKey: 'id' as keyof typeof adminPosts[0],
      header: '',
      cell: (row: typeof adminPosts[0]) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">{isRTL ? 'فتح القائمة' : 'Open menu'}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align={isRTL ? 'start' : 'end'}>
            <DropdownMenuItem onClick={() => {
              setSelectedPost(row)
              window.location.hash = '#create'
            }}>
              <Edit className="h-4 w-4 me-2" />
              {isRTL ? 'تعديل' : 'Edit'}
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Eye className="h-4 w-4 me-2" />
              {isRTL ? 'معاينة' : 'Preview'}
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">
              <Trash2 className="h-4 w-4 me-2" />
              {isRTL ? 'حذف' : 'Delete'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  const navItems = [
    {
      title: 'Posts',
      titleAr: 'المنشورات',
      href: '#posts',
      icon: <FileText className="h-5 w-5" />,
    },
    {
      title: 'Create New',
      titleAr: 'إنشاء جديد',
      href: '#create',
      icon: <Plus className="h-5 w-5" />,
    },
    {
      title: 'Analytics',
      titleAr: 'التحليلات',
      href: '#analytics',
      icon: <TrendingUp className="h-5 w-5" />,
    },
  ]

  // Handle navigation
  React.useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1)
      if (hash === 'posts' || !hash) setActiveView('posts')
      else if (hash === 'create') setActiveView('create')
      else if (hash === 'analytics') setActiveView('analytics')
    }

    if (!window.location.hash) {
      window.location.hash = '#posts'
    }

    handleHashChange()
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <DashboardShell
        navItems={navItems}
        user={{
          name: isRTL ? 'أحمد حسن' : 'Ahmed Hassan',
          email: 'ahmed@noorui.com',
        }}
        notifications={mockNotifications}
        relative={true}
      >
        <div className="p-6 space-y-6">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold tracking-tight">
                {isRTL ? 'إدارة المحتوى' : 'Content Management'}
              </h1>
              <p className="text-sm text-muted-foreground">
                {isRTL ? 'إدارة منشورات المدونة والمحتوى' : 'Manage your blog posts and content'}
              </p>
            </div>
            {activeView === 'posts' && (
              <Button onClick={() => (window.location.hash = '#create')} size="lg" className="gap-2">
                <Plus className="h-5 w-5" />
                {isRTL ? 'منشور جديد' : 'New Post'}
              </Button>
            )}
          </div>

          {/* Analytics View */}
          {activeView === 'analytics' && (
            <div className="space-y-6">
              <div className="flex items-center justify-end">
                <Select defaultValue="30days">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7days">{isRTL ? 'آخر 7 أيام' : 'Last 7 days'}</SelectItem>
                    <SelectItem value="30days">{isRTL ? 'آخر 30 يوم' : 'Last 30 days'}</SelectItem>
                    <SelectItem value="90days">{isRTL ? 'آخر 90 يوم' : 'Last 90 days'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Stats Grid */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                  icon={<FileText className="h-4 w-4" />}
                  label={isRTL ? 'إجمالي المنشورات' : 'Total Posts'}
                  value={adminPosts.length.toString()}
                  trend={12}
                  trendLabel={isRTL ? 'هذا الشهر' : 'this month'}
                />
                <StatsCard
                  icon={<Eye className="h-4 w-4" />}
                  label={isRTL ? 'إجمالي المشاهدات' : 'Total Views'}
                  value="12.4K"
                  trend={8.2}
                  trendLabel={isRTL ? 'هذا الأسبوع' : 'this week'}
                />
                <StatsCard
                  icon={<MessageSquare className="h-4 w-4" />}
                  label={isRTL ? 'التعليقات' : 'Comments'}
                  value="342"
                  trend={5.1}
                  trendLabel={isRTL ? 'اليوم' : 'today'}
                />
                <StatsCard
                  icon={<TrendingUp className="h-4 w-4" />}
                  label={isRTL ? 'معدل التفاعل' : 'Engagement Rate'}
                  value="68%"
                  trend={2.3}
                  trendLabel={isRTL ? 'فوق المتوسط' : 'above average'}
                />
              </div>

              {/* Top Posts */}
              <Card>
                <CardHeader>
                  <CardTitle>{isRTL ? 'أفضل المنشورات' : 'Top Posts'}</CardTitle>
                  <CardDescription>
                    {isRTL ? 'المنشورات الأكثر مشاهدة هذا الشهر' : 'Most viewed posts this month'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {adminPosts
                      .filter(p => p.status === 'published')
                      .sort((a, b) => b.views - a.views)
                      .slice(0, 5)
                      .map((post, index) => (
                        <div key={post.id} className="flex items-center gap-4">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                            {index + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{isRTL ? post.titleAr : post.title}</p>
                            <p className="text-sm text-muted-foreground">{isRTL ? post.authorAr : post.author}</p>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Eye className="h-4 w-4" />
                              <span>{post.views.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MessageSquare className="h-4 w-4" />
                              <span>{post.comments}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Posts List View */}
          {activeView === 'posts' && (
            <div className="space-y-6">
              {/* Filters */}
              <Card className="border-2">
                <CardContent className="pt-6">
                  <div className="flex flex-col gap-4 md:flex-row md:items-end">
                    <div className="flex-1">
                      <Label htmlFor="search" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        {isRTL ? 'بحث' : 'Search'}
                      </Label>
                      <div className="relative mt-2">
                        <Search className="absolute start-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="search"
                          placeholder={isRTL ? 'البحث في المنشورات...' : 'Search posts...'}
                          className={cn("h-11", isRTL ? "pe-9" : "ps-9")}
                        />
                      </div>
                    </div>
                    <div className="w-full md:w-[180px]">
                      <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        {isRTL ? 'الحالة' : 'Status'}
                      </Label>
                      <Select defaultValue="all">
                        <SelectTrigger className="mt-2 h-11">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">{isRTL ? 'الكل' : 'All'}</SelectItem>
                          <SelectItem value="published">{isRTL ? 'منشور' : 'Published'}</SelectItem>
                          <SelectItem value="draft">{isRTL ? 'مسودة' : 'Draft'}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="w-full md:w-[180px]">
                      <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        {isRTL ? 'الفئة' : 'Category'}
                      </Label>
                      <Select defaultValue="all">
                        <SelectTrigger className="mt-2 h-11">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">{isRTL ? 'الكل' : 'All'}</SelectItem>
                          <SelectItem value="tutorial">{isRTL ? 'درس تعليمي' : 'Tutorial'}</SelectItem>
                          <SelectItem value="design">{isRTL ? 'تصميم' : 'Design'}</SelectItem>
                          <SelectItem value="development">{isRTL ? 'تطوير' : 'Development'}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Posts Table */}
              <Card>
                <CardContent className="p-0">
                  <DataTable
                    data={adminPosts}
                    columns={columns}
                    searchable
                    searchPlaceholder={isRTL ? 'بحث...' : 'Search...'}
                    emptyMessage={isRTL ? 'لا توجد منشورات' : 'No posts found'}
                    emptyMessageAr="لا توجد منشورات"
                  />
                </CardContent>
              </Card>
            </div>
          )}

          {/* Create/Edit Post View */}
          {activeView === 'create' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                {selectedPost && (
                  <p className="text-sm text-muted-foreground">
                    {isRTL ? 'تعديل' : 'Editing'}: {isRTL ? selectedPost.titleAr : selectedPost.title}
                  </p>
                )}
                <div className="flex gap-2 ms-auto">
                  <Button variant="outline" onClick={() => (window.location.hash = '#posts')}>
                    {isRTL ? 'إلغاء' : 'Cancel'}
                  </Button>
                  <Button variant="outline">
                    {isRTL ? 'حفظ كمسودة' : 'Save Draft'}
                  </Button>
                  <Button>{isRTL ? 'نشر' : 'Publish'}</Button>
                </div>
              </div>

              <Tabs defaultValue="en" className="w-full">
                <TabsList className="grid w-full max-w-md grid-cols-2">
                  <TabsTrigger value="en">English</TabsTrigger>
                  <TabsTrigger value="ar">العربية</TabsTrigger>
                </TabsList>

                <TabsContent value="en" className="space-y-6 mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Post Details (English)</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="title-en">Title</Label>
                        <Input
                          id="title-en"
                          placeholder="Enter post title in English..."
                          defaultValue={selectedPost?.title}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="excerpt-en">Excerpt</Label>
                        <Input
                          id="excerpt-en"
                          placeholder="Brief description..."
                          defaultValue={selectedPost?.excerpt}
                        />
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="category-en">Category</Label>
                          <Select defaultValue={selectedPost?.category.toLowerCase() || 'tutorial'}>
                            <SelectTrigger id="category-en">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="tutorial">Tutorial</SelectItem>
                              <SelectItem value="design">Design</SelectItem>
                              <SelectItem value="development">Development</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="status-en">Status</Label>
                          <Select defaultValue={selectedPost?.status || 'draft'}>
                            <SelectTrigger id="status-en">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="draft">Draft</SelectItem>
                              <SelectItem value="published">Published</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="content-en">Content</Label>
                        <RichTextEditor
                          content={editorContent}
                          onChange={setEditorContent}
                          placeholder="Write your post content in English..."
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="ar" className="space-y-6 mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>تفاصيل المنشور (العربية)</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="title-ar">العنوان</Label>
                        <Input
                          id="title-ar"
                          placeholder="أدخل عنوان المنشور بالعربية..."
                          dir="rtl"
                          defaultValue={selectedPost?.titleAr}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="excerpt-ar">المقتطف</Label>
                        <Input
                          id="excerpt-ar"
                          placeholder="وصف مختصر..."
                          dir="rtl"
                          defaultValue={selectedPost?.excerptAr}
                        />
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="category-ar">الفئة</Label>
                          <Select defaultValue={selectedPost?.category.toLowerCase() || 'tutorial'}>
                            <SelectTrigger id="category-ar">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="tutorial">درس تعليمي</SelectItem>
                              <SelectItem value="design">تصميم</SelectItem>
                              <SelectItem value="development">تطوير</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="status-ar">الحالة</Label>
                          <Select defaultValue={selectedPost?.status || 'draft'}>
                            <SelectTrigger id="status-ar">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="draft">مسودة</SelectItem>
                              <SelectItem value="published">منشور</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="content-ar">المحتوى</Label>
                        <RichTextEditor
                          content={editorContentAr}
                          onChange={setEditorContentAr}
                          placeholder="اكتب محتوى منشورك بالعربية..."
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </DashboardShell>
    </div>
  )
}
