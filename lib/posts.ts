export interface Post {
  id: string
  slug: string
  title: string
  titleAr: string
  excerpt: string
  excerptAr: string
  content: string
  contentAr: string
  author: string
  authorAr: string
  status: 'published' | 'draft' | 'scheduled'
  category: string
  categoryAr: string
  views: number
  comments: number
  publishedAt: string
  language: 'en' | 'ar' | 'both'
  featuredImage: string
  readingTime: number
  featured?: boolean
}

export const mockPosts: Post[] = [
  {
    id: '1',
    slug: 'getting-started-with-noor-ui',
    title: 'Getting Started with Noor UI',
    titleAr: 'البدء مع نور UI',
    excerpt: 'Learn how to build beautiful, accessible applications with Noor UI component library.',
    excerptAr: 'تعلم كيفية بناء تطبيقات جميلة وسهلة الوصول باستخدام مكتبة مكونات نور UI.',
    content: 'Full content here...',
    contentAr: 'المحتوى الكامل هنا...',
    author: 'Ahmed Hassan',
    authorAr: 'أحمد حسن',
    status: 'published',
    category: 'Tutorial',
    categoryAr: 'درس تعليمي',
    views: 1234,
    comments: 45,
    publishedAt: '2025-11-01',
    language: 'both',
    featuredImage: '/images/post-1.jpg',
    readingTime: 5,
    featured: true,
  },
  {
    id: '2',
    slug: 'building-responsive-layouts',
    title: 'Building Responsive Layouts',
    titleAr: 'بناء تخطيطات متجاوبة',
    excerpt: 'Master the art of creating responsive layouts that work seamlessly across all devices.',
    excerptAr: 'أتقن فن إنشاء تخطيطات متجاوبة تعمل بسلاسة عبر جميع الأجهزة.',
    content: 'Full content here...',
    contentAr: 'المحتوى الكامل هنا...',
    author: 'Sarah Ahmed',
    authorAr: 'سارة أحمد',
    status: 'published',
    category: 'Design',
    categoryAr: 'تصميم',
    views: 892,
    comments: 23,
    publishedAt: '2025-11-05',
    language: 'both',
    featuredImage: '/images/post-2.jpg',
    readingTime: 7,
  },
  {
    id: '3',
    slug: 'rtl-support-best-practices',
    title: 'RTL Support: Best Practices',
    titleAr: 'دعم RTL: أفضل الممارسات',
    excerpt: 'Essential tips for implementing proper right-to-left language support in your applications.',
    excerptAr: 'نصائح أساسية لتنفيذ دعم اللغات من اليمين إلى اليسار بشكل صحيح في تطبيقاتك.',
    content: 'Full content here...',
    contentAr: 'المحتوى الكامل هنا...',
    author: 'Mohammed Ali',
    authorAr: 'محمد علي',
    status: 'published',
    category: 'Development',
    categoryAr: 'تطوير',
    views: 2103,
    comments: 67,
    publishedAt: '2025-11-10',
    language: 'both',
    featuredImage: '/images/post-3.jpg',
    readingTime: 10,
  },
  {
    id: '4',
    slug: 'theme-customization-guide',
    title: 'Theme Customization Guide',
    titleAr: 'دليل تخصيص السمات',
    excerpt: 'Discover how to customize Noor UI themes to match your brand identity perfectly.',
    excerptAr: 'اكتشف كيفية تخصيص سمات نور UI لتتناسب مع هوية علامتك التجارية بشكل مثالي.',
    content: 'Full content here...',
    contentAr: 'المحتوى الكامل هنا...',
    author: 'Layla Ibrahim',
    authorAr: 'ليلى إبراهيم',
    status: 'published',
    category: 'Design',
    categoryAr: 'تصميم',
    views: 1567,
    comments: 34,
    publishedAt: '2025-11-12',
    language: 'both',
    featuredImage: '/images/post-4.jpg',
    readingTime: 8,
  },
  {
    id: '5',
    slug: 'accessibility-matters',
    title: 'Accessibility Matters',
    titleAr: 'أهمية إمكانية الوصول',
    excerpt: 'Why accessibility should be a priority and how Noor UI makes it easier to build inclusive apps.',
    excerptAr: 'لماذا يجب أن تكون إمكانية الوصول أولوية وكيف يسهل نور UI بناء تطبيقات شاملة.',
    content: 'Full content here...',
    contentAr: 'المحتوى الكامل هنا...',
    author: 'Omar Khalid',
    authorAr: 'عمر خالد',
    status: 'published',
    category: 'Tutorial',
    categoryAr: 'درس تعليمي',
    views: 945,
    comments: 28,
    publishedAt: '2025-11-15',
    language: 'both',
    featuredImage: '/images/post-5.jpg',
    readingTime: 6,
  },
  {
    id: '6',
    slug: 'component-composition-patterns',
    title: 'Component Composition Patterns',
    titleAr: 'أنماط تركيب المكونات',
    excerpt: 'Learn advanced patterns for composing reusable components in React applications.',
    excerptAr: 'تعلم الأنماط المتقدمة لتركيب المكونات القابلة لإعادة الاستخدام في تطبيقات React.',
    content: 'Full content here...',
    contentAr: 'المحتوى الكامل هنا...',
    author: 'Fatima Said',
    authorAr: 'فاطمة سعيد',
    status: 'published',
    category: 'Development',
    categoryAr: 'تطوير',
    views: 1789,
    comments: 52,
    publishedAt: '2025-11-18',
    language: 'both',
    featuredImage: '/images/post-6.jpg',
    readingTime: 12,
  },
]

export function getAllPosts(): Post[] {
  return mockPosts.filter((post) => post.status === 'published')
}

export function getFeaturedPost(): Post | undefined {
  return mockPosts.find((post) => post.featured && post.status === 'published')
}

export function getPostBySlug(slug: string): Post | undefined {
  return mockPosts.find((post) => post.slug === slug && post.status === 'published')
}

export function getPostsByCategory(category: string): Post[] {
  return mockPosts.filter(
    (post) => post.category === category && post.status === 'published'
  )
}

export function getAllCategories(): string[] {
  const categories = new Set(mockPosts.map((post) => post.category))
  return Array.from(categories)
}
