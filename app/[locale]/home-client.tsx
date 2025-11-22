'use client'

import Link from 'next/link'
import Image from 'next/image'
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
  Badge,
  Button,
  Avatar,
  AvatarImage,
  AvatarFallback,
  Separator,
} from 'noorui-rtl'
import type { Locale, PostWithRelations, CategoryLocalized } from '@/lib/supabase/types'

interface HomePageClientProps {
  locale: Locale
  featuredPosts: PostWithRelations[]
  latestPosts: PostWithRelations[]
  categories: CategoryLocalized[]
}

const translations = {
  en: {
    hero: {
      title: 'Kitab',
      subtitle: 'A multilingual blog exploring RTL design, Arabic typography, and bidirectional web development.',
      cta: 'Start Reading',
    },
    sections: {
      featured: 'Featured Articles',
      latest: 'Latest Posts',
      categories: 'Browse by Category',
    },
    card: {
      readMore: 'Read More',
      minRead: 'min read',
    },
  },
  fr: {
    hero: {
      title: 'Kitab',
      subtitle: 'Un blog multilingue explorant le design RTL, la typographie arabe et le developpement web bidirectionnel.',
      cta: 'Commencer a lire',
    },
    sections: {
      featured: 'Articles en vedette',
      latest: 'Derniers articles',
      categories: 'Parcourir par categorie',
    },
    card: {
      readMore: 'Lire la suite',
      minRead: 'min de lecture',
    },
  },
  ar: {
    hero: {
      title: 'كتاب',
      subtitle: 'مدونة متعددة اللغات تستكشف تصميم RTL والخط العربي وتطوير الويب ثنائي الاتجاه.',
      cta: 'ابدأ القراءة',
    },
    sections: {
      featured: 'مقالات مميزة',
      latest: 'أحدث المقالات',
      categories: 'تصفح حسب الفئة',
    },
    card: {
      readMore: 'اقرأ المزيد',
      minRead: 'دقيقة للقراءة',
    },
  },
  ur: {
    hero: {
      title: 'کتاب',
      subtitle: 'ایک کثیر لسانی بلاگ جو RTL ڈیزائن، عربی ٹائپوگرافی، اور دو طرفہ ویب ڈویلپمنٹ کی کھوج کرتا ہے۔',
      cta: 'پڑھنا شروع کریں',
    },
    sections: {
      featured: 'نمایاں مضامین',
      latest: 'تازہ ترین پوسٹس',
      categories: 'زمرے کے لحاظ سے براؤز کریں',
    },
    card: {
      readMore: 'مزید پڑھیں',
      minRead: 'منٹ پڑھنے کا وقت',
    },
  },
}

export function HomePageClient({
  locale,
  featuredPosts,
  latestPosts,
  categories,
}: HomePageClientProps) {
  const t = translations[locale]
  const isRTL = locale === 'ar' || locale === 'ur'

  return (
    <div className="min-h-screen bg-background" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container mx-auto max-w-6xl text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
            {t.hero.title}
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8">
            {t.hero.subtitle}
          </p>
          <Button size="lg" asChild>
            <Link href={`/${locale}/blog`}>{t.hero.cta}</Link>
          </Button>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold mb-8">{t.sections.categories}</h2>
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/${locale}/blog?category=${category.slug}`}
              >
                <Badge
                  variant="outline"
                  className="px-4 py-2 text-sm cursor-pointer hover:bg-primary/10 transition-colors"
                  style={{ borderColor: category.color, color: category.color }}
                >
                  {category.name}
                </Badge>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Separator className="max-w-6xl mx-auto" />

      {/* Featured Posts Section */}
      {featuredPosts.length > 0 && (
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold mb-8">{t.sections.featured}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredPosts.map((post) => (
                <PostCard key={post.id} post={post} locale={locale} t={t} />
              ))}
            </div>
          </div>
        </section>
      )}

      <Separator className="max-w-6xl mx-auto" />

      {/* Latest Posts Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold mb-8">{t.sections.latest}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestPosts.map((post) => (
              <PostCard key={post.id} post={post} locale={locale} t={t} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

interface PostCardProps {
  post: PostWithRelations
  locale: Locale
  t: typeof translations['en']
}

function PostCard({ post, locale, t }: PostCardProps) {
  const authorName = post.author?.name || ''
  const categoryName = post.category?.name || ''
  const categoryColor = post.category?.color || '#6366f1'
  const authorAvatar = post.author?.avatar_url

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <Link href={`/${locale}/blog/${post.slug}`}>
        {post.featured_image && (
          <div className="relative h-48 w-full">
            <Image
              src={post.featured_image}
              alt={post.title}
              fill
              className="object-cover"
            />
          </div>
        )}
        <CardHeader>
          {categoryName && (
            <Badge
              variant="secondary"
              className="w-fit mb-2"
              style={{ backgroundColor: `${categoryColor}20`, color: categoryColor }}
            >
              {categoryName}
            </Badge>
          )}
          <CardTitle className="line-clamp-2">{post.title}</CardTitle>
          <CardDescription className="line-clamp-2">
            {post.excerpt}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              {authorAvatar && <AvatarImage src={authorAvatar} alt={authorName} />}
              <AvatarFallback>{authorName.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{authorName}</p>
              <p className="text-xs text-muted-foreground">
                {post.reading_time} {t.card.minRead}
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="ghost" size="sm" className="ms-auto">
            {t.card.readMore}
          </Button>
        </CardFooter>
      </Link>
    </Card>
  )
}
