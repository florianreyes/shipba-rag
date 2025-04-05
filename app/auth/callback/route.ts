import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { syncUserWithAuth } from '@/lib/supabase/user-management'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  
  if (code) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          },
        },
      }
    )
    
    // Exchange the code for a session
    await supabase.auth.exchangeCodeForSession(code)

    // Get the user data
    const { data: { user } } = await supabase.auth.getUser()

    // Sync with public.users table if we have a user
    if (user) {
      try {
        // Create or update user in the public.users table
        await syncUserWithAuth(user.id, {
          auth_id: user.id,
          mail: user.email || '',
        })
      } catch (error) {
        console.error('Error syncing user:', error)
        // Continue the flow even if syncing fails
      }
    }
  }

  // URL to redirect to after sign in
  return NextResponse.redirect(new URL('/dashboard', request.url))
} 