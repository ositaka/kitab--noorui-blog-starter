export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Locale = 'en' | 'fr' | 'ar' | 'ur'

export type LocalizedString = {
  [key in Locale]?: string
}

export interface Database {
  public: {
    Tables: {
      authors: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          avatar_url: string | null
          website: string | null
          twitter: string | null
          name: LocalizedString
          bio: LocalizedString
        }
        Insert: {
          id: string
          created_at?: string
          updated_at?: string
          avatar_url?: string | null
          website?: string | null
          twitter?: string | null
          name?: LocalizedString
          bio?: LocalizedString
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          avatar_url?: string | null
          website?: string | null
          twitter?: string | null
          name?: LocalizedString
          bio?: LocalizedString
        }
      }
      categories: {
        Row: {
          id: string
          created_at: string
          slug: string
          color: string
          icon: string | null
          name: LocalizedString
          description: LocalizedString
        }
        Insert: {
          id: string
          created_at?: string
          slug: string
          color?: string
          icon?: string | null
          name?: LocalizedString
          description?: LocalizedString
        }
        Update: {
          id?: string
          created_at?: string
          slug?: string
          color?: string
          icon?: string | null
          name?: LocalizedString
          description?: LocalizedString
        }
      }
      posts: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          slug: string
          locale: Locale
          author_id: string | null
          category_id: string | null
          title: string
          excerpt: string | null
          content: string | null
          featured_image: string | null
          reading_time: number
          published_at: string | null
          is_published: boolean
          is_featured: boolean
          meta_title: string | null
          meta_description: string | null
          tags: string[]
          view_count: number
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          slug: string
          locale?: Locale
          author_id?: string | null
          category_id?: string | null
          title: string
          excerpt?: string | null
          content?: string | null
          featured_image?: string | null
          reading_time?: number
          published_at?: string | null
          is_published?: boolean
          is_featured?: boolean
          meta_title?: string | null
          meta_description?: string | null
          tags?: string[]
          view_count?: number
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          slug?: string
          locale?: Locale
          author_id?: string | null
          category_id?: string | null
          title?: string
          excerpt?: string | null
          content?: string | null
          featured_image?: string | null
          reading_time?: number
          published_at?: string | null
          is_published?: boolean
          is_featured?: boolean
          meta_title?: string | null
          meta_description?: string | null
          tags?: string[]
          view_count?: number
        }
      }
      post_translations: {
        Row: {
          id: string
          canonical_slug: string
          post_id: string
          locale: Locale
        }
        Insert: {
          id?: string
          canonical_slug: string
          post_id: string
          locale: Locale
        }
        Update: {
          id?: string
          canonical_slug?: string
          post_id?: string
          locale?: Locale
        }
      }
    }
    Views: {
      posts_with_relations: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          slug: string
          locale: Locale
          author_id: string | null
          category_id: string | null
          title: string
          excerpt: string | null
          content: string | null
          featured_image: string | null
          reading_time: number
          published_at: string | null
          is_published: boolean
          is_featured: boolean
          meta_title: string | null
          meta_description: string | null
          tags: string[]
          view_count: number
          author_name: LocalizedString | null
          author_avatar: string | null
          author_bio: LocalizedString | null
          category_name: LocalizedString | null
          category_slug: string | null
          category_color: string | null
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

// Helper types
export type Author = Database['public']['Tables']['authors']['Row']
export type Category = Database['public']['Tables']['categories']['Row']
export type Post = Database['public']['Tables']['posts']['Row']
export type PostWithRelations = Database['public']['Views']['posts_with_relations']['Row']

// Insert types
export type AuthorInsert = Database['public']['Tables']['authors']['Insert']
export type CategoryInsert = Database['public']['Tables']['categories']['Insert']
export type PostInsert = Database['public']['Tables']['posts']['Insert']
