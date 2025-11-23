import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh session if exists
  const { data: { user } } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // Check if this is an admin route (but not the login page)
  const isAdminRoute = pathname.match(/^\/[a-z]{2}\/admin(?!\/login)/)
  const isLoginPage = pathname.match(/^\/[a-z]{2}\/admin\/login/)

  if (isAdminRoute) {
    // Check for guest mode cookie
    const guestCookie = request.cookies.get('kitab_guest_mode')
    const isGuest = guestCookie?.value === 'true'

    // If not logged in and not in guest mode, redirect to login
    if (!user && !isGuest) {
      // Extract locale from pathname
      const locale = pathname.split('/')[1] || 'en'
      const loginUrl = new URL(`/${locale}/admin/login`, request.url)
      return NextResponse.redirect(loginUrl)
    }
  }

  // If on login page and already authenticated, redirect to admin
  if (isLoginPage) {
    const guestCookie = request.cookies.get('kitab_guest_mode')
    const isGuest = guestCookie?.value === 'true'

    if (user || isGuest) {
      const locale = pathname.split('/')[1] || 'en'
      const adminUrl = new URL(`/${locale}/admin`, request.url)
      return NextResponse.redirect(adminUrl)
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     * - api routes (API routes)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|api).*)',
  ],
}
