import type { Locale } from '@/lib/supabase/types'

export const adminTranslations: Record<Locale, {
  title: string
  description: string
  nav: {
    posts: string
    create: string
    analytics: string
    settings: string
  }
  stats: {
    totalPosts: string
    publishedPosts: string
    draftPosts: string
    totalViews: string
    thisMonth: string
    thisWeek: string
  }
  table: {
    title: string
    author: string
    status: string
    category: string
    views: string
    date: string
    actions: string
  }
  status: {
    published: string
    draft: string
    scheduled: string
    all: string
  }
  actions: {
    edit: string
    preview: string
    delete: string
    publish: string
    unpublish: string
    openMenu: string
  }
  filters: {
    search: string
    searchPosts: string
    status: string
    category: string
    all: string
  }
  create: {
    newPost: string
    editPost: string
    postDetails: string
    title: string
    excerpt: string
    content: string
    category: string
    status: string
    tags: string
    featuredImage: string
    uploadImage: string
    saveDraft: string
    publish: string
    cancel: string
    saving: string
    saved: string
    error: string
  }
  languages: {
    en: string
    fr: string
    ar: string
    ur: string
  }
  notifications: {
    postCreated: string
    postUpdated: string
    postDeleted: string
    postPublished: string
  }
  empty: {
    noPosts: string
    createFirst: string
  }
}> = {
  en: {
    title: 'Content Management',
    description: 'Manage your blog posts and content',
    nav: {
      posts: 'Posts',
      create: 'Create New',
      analytics: 'Analytics',
      settings: 'Settings',
    },
    stats: {
      totalPosts: 'Total Posts',
      publishedPosts: 'Published',
      draftPosts: 'Drafts',
      totalViews: 'Total Views',
      thisMonth: 'this month',
      thisWeek: 'this week',
    },
    table: {
      title: 'Title',
      author: 'Author',
      status: 'Status',
      category: 'Category',
      views: 'Views',
      date: 'Date',
      actions: 'Actions',
    },
    status: {
      published: 'Published',
      draft: 'Draft',
      scheduled: 'Scheduled',
      all: 'All',
    },
    actions: {
      edit: 'Edit',
      preview: 'Preview',
      delete: 'Delete',
      publish: 'Publish',
      unpublish: 'Unpublish',
      openMenu: 'Open menu',
    },
    filters: {
      search: 'Search',
      searchPosts: 'Search posts...',
      status: 'Status',
      category: 'Category',
      all: 'All',
    },
    create: {
      newPost: 'New Post',
      editPost: 'Edit Post',
      postDetails: 'Post Details',
      title: 'Title',
      excerpt: 'Excerpt',
      content: 'Content',
      category: 'Category',
      status: 'Status',
      tags: 'Tags',
      featuredImage: 'Featured Image',
      uploadImage: 'Upload a cover image',
      saveDraft: 'Save Draft',
      publish: 'Publish',
      cancel: 'Cancel',
      saving: 'Saving...',
      saved: 'Saved',
      error: 'Error saving',
    },
    languages: {
      en: 'English',
      fr: 'French',
      ar: 'Arabic',
      ur: 'Urdu',
    },
    notifications: {
      postCreated: 'Post created successfully',
      postUpdated: 'Post updated successfully',
      postDeleted: 'Post deleted successfully',
      postPublished: 'Post published successfully',
    },
    empty: {
      noPosts: 'No posts found',
      createFirst: 'Create your first post',
    },
  },
  fr: {
    title: 'Gestion du contenu',
    description: 'Gérer vos articles de blog et contenu',
    nav: {
      posts: 'Articles',
      create: 'Nouveau',
      analytics: 'Analytique',
      settings: 'Paramètres',
    },
    stats: {
      totalPosts: 'Total articles',
      publishedPosts: 'Publiés',
      draftPosts: 'Brouillons',
      totalViews: 'Vues totales',
      thisMonth: 'ce mois',
      thisWeek: 'cette semaine',
    },
    table: {
      title: 'Titre',
      author: 'Auteur',
      status: 'Statut',
      category: 'Catégorie',
      views: 'Vues',
      date: 'Date',
      actions: 'Actions',
    },
    status: {
      published: 'Publié',
      draft: 'Brouillon',
      scheduled: 'Programmé',
      all: 'Tous',
    },
    actions: {
      edit: 'Modifier',
      preview: 'Aperçu',
      delete: 'Supprimer',
      publish: 'Publier',
      unpublish: 'Dépublier',
      openMenu: 'Ouvrir le menu',
    },
    filters: {
      search: 'Rechercher',
      searchPosts: 'Rechercher des articles...',
      status: 'Statut',
      category: 'Catégorie',
      all: 'Tous',
    },
    create: {
      newPost: 'Nouvel article',
      editPost: 'Modifier l\'article',
      postDetails: 'Détails de l\'article',
      title: 'Titre',
      excerpt: 'Extrait',
      content: 'Contenu',
      category: 'Catégorie',
      status: 'Statut',
      tags: 'Tags',
      featuredImage: 'Image à la une',
      uploadImage: 'Télécharger une image de couverture',
      saveDraft: 'Enregistrer brouillon',
      publish: 'Publier',
      cancel: 'Annuler',
      saving: 'Enregistrement...',
      saved: 'Enregistré',
      error: 'Erreur d\'enregistrement',
    },
    languages: {
      en: 'Anglais',
      fr: 'Français',
      ar: 'Arabe',
      ur: 'Ourdou',
    },
    notifications: {
      postCreated: 'Article créé avec succès',
      postUpdated: 'Article mis à jour avec succès',
      postDeleted: 'Article supprimé avec succès',
      postPublished: 'Article publié avec succès',
    },
    empty: {
      noPosts: 'Aucun article trouvé',
      createFirst: 'Créez votre premier article',
    },
  },
  ar: {
    title: 'إدارة المحتوى',
    description: 'إدارة منشورات المدونة والمحتوى',
    nav: {
      posts: 'المنشورات',
      create: 'إنشاء جديد',
      analytics: 'التحليلات',
      settings: 'الإعدادات',
    },
    stats: {
      totalPosts: 'إجمالي المنشورات',
      publishedPosts: 'منشورة',
      draftPosts: 'مسودات',
      totalViews: 'إجمالي المشاهدات',
      thisMonth: 'هذا الشهر',
      thisWeek: 'هذا الأسبوع',
    },
    table: {
      title: 'العنوان',
      author: 'المؤلف',
      status: 'الحالة',
      category: 'الفئة',
      views: 'المشاهدات',
      date: 'التاريخ',
      actions: 'الإجراءات',
    },
    status: {
      published: 'منشور',
      draft: 'مسودة',
      scheduled: 'مجدول',
      all: 'الكل',
    },
    actions: {
      edit: 'تعديل',
      preview: 'معاينة',
      delete: 'حذف',
      publish: 'نشر',
      unpublish: 'إلغاء النشر',
      openMenu: 'فتح القائمة',
    },
    filters: {
      search: 'بحث',
      searchPosts: 'البحث في المنشورات...',
      status: 'الحالة',
      category: 'الفئة',
      all: 'الكل',
    },
    create: {
      newPost: 'منشور جديد',
      editPost: 'تعديل المنشور',
      postDetails: 'تفاصيل المنشور',
      title: 'العنوان',
      excerpt: 'المقتطف',
      content: 'المحتوى',
      category: 'الفئة',
      status: 'الحالة',
      tags: 'الوسوم',
      featuredImage: 'الصورة المميزة',
      uploadImage: 'تحميل صورة الغلاف',
      saveDraft: 'حفظ كمسودة',
      publish: 'نشر',
      cancel: 'إلغاء',
      saving: 'جاري الحفظ...',
      saved: 'تم الحفظ',
      error: 'خطأ في الحفظ',
    },
    languages: {
      en: 'الإنجليزية',
      fr: 'الفرنسية',
      ar: 'العربية',
      ur: 'الأردية',
    },
    notifications: {
      postCreated: 'تم إنشاء المنشور بنجاح',
      postUpdated: 'تم تحديث المنشور بنجاح',
      postDeleted: 'تم حذف المنشور بنجاح',
      postPublished: 'تم نشر المنشور بنجاح',
    },
    empty: {
      noPosts: 'لا توجد منشورات',
      createFirst: 'أنشئ منشورك الأول',
    },
  },
  ur: {
    title: 'مواد کا انتظام',
    description: 'اپنی بلاگ پوسٹس اور مواد کا انتظام کریں',
    nav: {
      posts: 'پوسٹس',
      create: 'نیا بنائیں',
      analytics: 'تجزیات',
      settings: 'ترتیبات',
    },
    stats: {
      totalPosts: 'کل پوسٹس',
      publishedPosts: 'شائع شدہ',
      draftPosts: 'ڈرافٹ',
      totalViews: 'کل ملاحظات',
      thisMonth: 'اس مہینے',
      thisWeek: 'اس ہفتے',
    },
    table: {
      title: 'عنوان',
      author: 'مصنف',
      status: 'حالت',
      category: 'زمرہ',
      views: 'ملاحظات',
      date: 'تاریخ',
      actions: 'اقدامات',
    },
    status: {
      published: 'شائع شدہ',
      draft: 'ڈرافٹ',
      scheduled: 'شیڈیولڈ',
      all: 'تمام',
    },
    actions: {
      edit: 'ترمیم',
      preview: 'پیش نظارہ',
      delete: 'حذف کریں',
      publish: 'شائع کریں',
      unpublish: 'غیر شائع کریں',
      openMenu: 'مینو کھولیں',
    },
    filters: {
      search: 'تلاش',
      searchPosts: 'پوسٹس تلاش کریں...',
      status: 'حالت',
      category: 'زمرہ',
      all: 'تمام',
    },
    create: {
      newPost: 'نئی پوسٹ',
      editPost: 'پوسٹ میں ترمیم',
      postDetails: 'پوسٹ کی تفصیلات',
      title: 'عنوان',
      excerpt: 'خلاصہ',
      content: 'مواد',
      category: 'زمرہ',
      status: 'حالت',
      tags: 'ٹیگز',
      featuredImage: 'نمایاں تصویر',
      uploadImage: 'سرورق کی تصویر اپ لوڈ کریں',
      saveDraft: 'ڈرافٹ محفوظ کریں',
      publish: 'شائع کریں',
      cancel: 'منسوخ',
      saving: 'محفوظ ہو رہا ہے...',
      saved: 'محفوظ ہو گیا',
      error: 'محفوظ کرنے میں خرابی',
    },
    languages: {
      en: 'انگریزی',
      fr: 'فرانسیسی',
      ar: 'عربی',
      ur: 'اردو',
    },
    notifications: {
      postCreated: 'پوسٹ کامیابی سے بنائی گئی',
      postUpdated: 'پوسٹ کامیابی سے اپ ڈیٹ ہوئی',
      postDeleted: 'پوسٹ کامیابی سے حذف ہوئی',
      postPublished: 'پوسٹ کامیابی سے شائع ہوئی',
    },
    empty: {
      noPosts: 'کوئی پوسٹ نہیں ملی',
      createFirst: 'اپنی پہلی پوسٹ بنائیں',
    },
  },
}
