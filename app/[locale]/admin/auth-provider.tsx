'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

// Admin emails that have full access
const ADMIN_EMAILS = process.env.NEXT_PUBLIC_ADMIN_EMAILS
  ? process.env.NEXT_PUBLIC_ADMIN_EMAILS.split(',').map(email => email.trim())
  : []

export type UserRole = 'admin' | 'guest' | null

export interface AuthUser {
  id: string
  email: string
  name: string
  avatar?: string
  role: UserRole
}

interface AuthContextType {
  user: AuthUser | null
  isAdmin: boolean
  isGuest: boolean
  isLoading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAdmin: false,
  isGuest: false,
  isLoading: true,
  signOut: async () => {},
})

export function useAuth() {
  return useContext(AuthContext)
}

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null
  return null
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const checkAuth = async () => {
      // Check for guest mode cookie first
      const isGuestMode = getCookie('kitab_guest_mode') === 'true'

      if (isGuestMode) {
        setUser({
          id: 'guest',
          email: 'guest@kitab.blog',
          name: 'Guest',
          role: 'guest',
        })
        setIsLoading(false)
        return
      }

      // Check Supabase auth
      const { data: { user: supabaseUser } } = await supabase.auth.getUser()

      if (supabaseUser) {
        const isAdmin = ADMIN_EMAILS.includes(supabaseUser.email || '')
        setUser({
          id: supabaseUser.id,
          email: supabaseUser.email || '',
          name: supabaseUser.user_metadata?.full_name || supabaseUser.email?.split('@')[0] || 'User',
          avatar: supabaseUser.user_metadata?.avatar_url,
          role: isAdmin ? 'admin' : 'guest',
        })
      } else {
        setUser(null)
      }

      setIsLoading(false)
    }

    checkAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const isAdmin = ADMIN_EMAILS.includes(session.user.email || '')
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
          avatar: session.user.user_metadata?.avatar_url,
          role: isAdmin ? 'admin' : 'guest',
        })
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase.auth])

  const handleSignOut = async () => {
    // Clear guest cookie
    document.cookie = 'kitab_guest_mode=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    // Sign out from Supabase
    await supabase.auth.signOut()
    setUser(null)
  }

  const isAdmin = user?.role === 'admin'
  const isGuest = user?.role === 'guest'

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        isGuest,
        isLoading,
        signOut: handleSignOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
