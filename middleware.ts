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
  const protectedRoutes = ['/search', '/profile']
  const isProtectedRoute = protectedRoutes.some(route => pathname === route || (pathname.startsWith(route) && pathname !== '/login'))
  
  // Auth routes (no authenticated users allowed)
  const authRoutes = ['/login']
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route))

  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (isAuthRoute && session) {
    // Check if user has completed their profile
    try {
      // Get user data from Supabase
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        // Check if user profile is complete by checking the users table
        const { data: userData } = await supabase
          .from('users')
          .select('content')
          .eq('auth_id', user.id)
          .single()
          
        // If user has empty content, redirect to complete profile
        if (userData && (!userData.content || userData.content.trim() === '')) {
          return NextResponse.redirect(new URL('/profile', request.url))
        }
      }
    } catch (error) {
      console.error('Error checking user profile:', error)
    }
    
    // Default redirect if profile is complete
    return NextResponse.redirect(new URL('/search', request.url))
  }

  return response
}

// Specify which routes the middleware should run on
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
} 