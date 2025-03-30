import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
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
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set({
              name,
              value,
              ...options,
            })
          })
        },
      },
    }
  )

  // IMPORTANT: Refresh session to avoid users being logged out
  await supabase.auth.getUser()

  // Check if user is authenticated for protected routes
  const { pathname } = request.nextUrl
  const { data: { session } } = await supabase.auth.getSession()

  // Define protected routes
  const protectedRoutes = ['/dashboard']
  const isProtectedRoute = protectedRoutes.some(route => pathname === route || (pathname.startsWith(route) && pathname !== '/login'))
  
  // Auth routes (no authenticated users allowed)
  const authRoutes = ['/login']
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route))

  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return response
}

// Specify which routes the middleware should run on
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
} 