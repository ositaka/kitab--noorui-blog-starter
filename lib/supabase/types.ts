export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Locale = 'en' | 'fr' | 'ar' | 'ur'

export interface Database {
  public: {
    Tables: {
      // Base tables (non-translatable fields)
      authors: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          avatar_url: string | null
          website: string | null
          twitter: string | null
        }
        Insert: {
          id: string
          created_at?: string
          updated_at?: string
          avatar_url?: string | null
          website?: string | null
          twitter?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          avatar_url?: string | null
          website?: string | null
          twitter?: string | null
        }
      }
      author_translations: {
        Row: {
          id: string
          author_id: string
          locale: Locale
          name: string
          bio: string | null
        }
        Insert: {
          id?: string
          author_id: string
          locale: Locale
          name: string
          bio?: string | null
        }
        Update: {
          id?: string
          author_id?: string
          locale?: Locale
          name?: string
          bio?: string | null
        }
      }
      categories: {
        Row: {
          id: string
          created_at: string
          slug: string
          color: string
          icon: string | null
        }
        Insert: {
          id: string
          created_at?: string
          slug: string
          color?: string
          icon?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          slug?: string
          color?: string
          icon?: string | null
        }
      }
      category_translations: {
        Row: {
          id: string
          category_id: string
          locale: Locale
          name: string
          description: string | null
        }
        Insert: {
          id?: string
          category_id: string
          locale: Locale
          name: string
          description?: string | null
        }
        Update: {
          id?: string
          category_id?: string
          locale?: Locale
          name?: string
          description?: string | null
        }
      }
      posts: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          slug: string
          author_id: string | null
          category_id: string | null
          featured_image: string | null
          reading_time: number
          published_at: string | null
          is_published: boolean
          is_featured: boolean
          tags: string[]
          view_count: number
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          slug: string
          author_id?: string | null
          category_id?: string | null
          featured_image?: string | null
          reading_time?: number
          published_at?: string | null
          is_published?: boolean
          is_featured?: boolean
          tags?: string[]
          view_count?: number
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          slug?: string
          author_id?: string | null
          category_id?: string | null
          featured_image?: string | null
          reading_time?: number
          published_at?: string | null
          is_published?: boolean
          is_featured?: boolean
          tags?: string[]
          view_count?: number
        }
      }
      post_translations: {
        Row: {
          id: string
          post_id: string
          locale: Locale
          title: string
          excerpt: string | null
          content: string | null
          meta_title: string | null
          meta_description: string | null
          og_image: string | null
          focus_keyword: string | null
          twitter_card: string | null
        }
        Insert: {
          id?: string
          post_id: string
          locale: Locale
          title: string
          excerpt?: string | null
          content?: string | null
          meta_title?: string | null
          meta_description?: string | null
          og_image?: string | null
          focus_keyword?: string | null
          twitter_card?: string | null
        }
        Update: {
          id?: string
          post_id?: string
          locale?: Locale
          title?: string
          excerpt?: string | null
          content?: string | null
          meta_title?: string | null
          meta_description?: string | null
          og_image?: string | null
          focus_keyword?: string | null
          twitter_card?: string | null
        }
      }
    }
    Views: {
      // Localized views (joins base + translations)
      posts_localized: {
        Row: {
          id: string
          slug: string
          author_id: string | null
          category_id: string | null
          featured_image: string | null
          reading_time: number
          published_at: string | null
          is_published: boolean
          is_featured: boolean
          tags: string[]
          view_count: number
          created_at: string
          updated_at: string
          locale: Locale
          title: string
          excerpt: string | null
          content: string | null
          meta_title: string | null
          meta_description: string | null
          og_image: string | null
          twitter_card: string | null
          focus_keyword: string | null
        }
      }
      authors_localized: {
        Row: {
          id: string
          avatar_url: string | null
          website: string | null
          twitter: string | null
          created_at: string
          updated_at: string
          locale: Locale
          name: string
          bio: string | null
        }
      }
      categories_localized: {
        Row: {
          id: string
          slug: string
          color: string
          icon: string | null
          created_at: string
          locale: Locale
          name: string
          description: string | null
        }
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Base types (without translations)
export type Author = Database['public']['Tables']['authors']['Row']
export type Category = Database['public']['Tables']['categories']['Row']
export type Post = Database['public']['Tables']['posts']['Row']

// Translation types
export type AuthorTranslation = Database['public']['Tables']['author_translations']['Row']
export type CategoryTranslation = Database['public']['Tables']['category_translations']['Row']
export type PostTranslation = Database['public']['Tables']['post_translations']['Row']

// Localized types (from views - what you'll use in components)
export type PostLocalized = Database['public']['Views']['posts_localized']['Row']
export type AuthorLocalized = Database['public']['Views']['authors_localized']['Row']
export type CategoryLocalized = Database['public']['Views']['categories_localized']['Row']

// Insert types
export type AuthorInsert = Database['public']['Tables']['authors']['Insert']
export type CategoryInsert = Database['public']['Tables']['categories']['Insert']
export type PostInsert = Database['public']['Tables']['posts']['Insert']
export type PostTranslationInsert = Database['public']['Tables']['post_translations']['Insert']

// Extended post type with author and category info
export interface PostWithRelations extends PostLocalized {
  author?: AuthorLocalized | null
  category?: CategoryLocalized | null
}
