'use server'

import { createClient } from './server'
import { cookies } from 'next/headers'

// Admin emails allowed to make changes
// Set ADMIN_EMAILS in .env.local as comma-separated list
// Example: ADMIN_EMAILS=your.email@gmail.com,another@gmail.com
const ADMIN_EMAILS = process.env.ADMIN_EMAILS
  ? process.env.ADMIN_EMAILS.split(',').map(email => email.trim())
  : []

export type UserRole = 'admin' | 'guest' | null

export interface AuthUser {
  id: string
  email: string
  name: string
  avatar?: string
  role: UserRole
}

/**
 * Get the current user from Supabase Auth or guest cookie
 */
export async function getUser(): Promise<AuthUser | null> {
  const cookieStore = await cookies()

  // Check for guest mode first
  const guestCookie = cookieStore.get('kitab_guest_mode')
  if (guestCookie?.value === 'true') {
    return {
      id: 'guest',
      email: 'guest@kitab.blog',
      name: 'Guest',
      role: 'guest',
    }
  }

  // Check for Supabase auth user
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    return null
  }

  const isAdmin = ADMIN_EMAILS.includes(user.email || '')

  return {
    id: user.id,
    email: user.email || '',
    name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
    avatar: user.user_metadata?.avatar_url,
    role: isAdmin ? 'admin' : 'guest', // Non-admin authenticated users are treated as guests
  }
}

/**
 * Check if current user is an admin (can make changes)
 */
export async function isAdmin(): Promise<boolean> {
  const user = await getUser()
  return user?.role === 'admin'
}

/**
 * Check if current user is a guest (view-only)
 */
export async function isGuest(): Promise<boolean> {
  const user = await getUser()
  return user?.role === 'guest'
}

/**
 * Check if user is authenticated (either admin or guest)
 */
export async function isAuthenticated(): Promise<boolean> {
  const user = await getUser()
  return user !== null
}

/**
 * Enter as guest - sets a cookie to enable guest mode
 */
export async function enterAsGuest(): Promise<{ success: boolean }> {
  const cookieStore = await cookies()

  cookieStore.set('kitab_guest_mode', 'true', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/',
  })

  return { success: true }
}

/**
 * Exit guest mode
 */
export async function exitGuestMode(): Promise<{ success: boolean }> {
  const cookieStore = await cookies()
  cookieStore.delete('kitab_guest_mode')
  return { success: true }
}

/**
 * Sign out - clears both Supabase session and guest cookie
 */
export async function signOut(): Promise<{ success: boolean; error?: string }> {
  try {
    const cookieStore = await cookies()

    // Clear guest cookie if exists
    cookieStore.delete('kitab_guest_mode')

    // Sign out from Supabase
    const supabase = await createClient()
    await supabase.auth.signOut()

    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to sign out'
    }
  }
}

/**
 * Get Google OAuth URL for sign-in
 */
export async function getGoogleSignInUrl(redirectTo: string): Promise<string | null> {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  })

  if (error) {
    console.error('Google sign-in error:', error)
    return null
  }

  return data.url
}
