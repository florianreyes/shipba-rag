import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createBasicUser } from '@/lib/actions/users'

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

    // Create user in public.users table using Drizzle ORM
    if (user) {
      try {
        // Create user in the public.users table using Drizzle ORM
        const { success, userId, error } = await createBasicUser({
          auth_id: user.id,
          mail: user.email || '',
          name: null,
        });
        
        if (!success) {
          console.error('Error creating user:', error);
        } else {
          // Check if user has content in their profile
          const { data: userData } = await supabase
            .from('users')
            .select('content')
            .eq('auth_id', user.id)
            .single();
            
          // Only redirect to profile if content is empty or doesn't exist
          if (!userData || !userData.content || userData.content.trim() === '') {
            return NextResponse.redirect(new URL('/profile', request.url));
          }
          
          // If user has content, redirect to search
          return NextResponse.redirect(new URL('/search', request.url));
        }
      } catch (error) {
        console.error('Error creating user:', error)
        // Continue the flow even if creation fails
      }
    }
  }

  // URL to redirect to after sign in
  return NextResponse.redirect(new URL('/search', request.url))
} 