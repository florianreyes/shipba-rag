import { createClient } from './client'

// Define the User type matching your users table schema
export type User = {
  id?: string
  auth_id: string | null
  name: string
  mail: string
  content?: string | null
  x_handle?: string | null
  telegram_handle?: string | null
  instagram_handle?: string | null
  created_at?: string
  updated_at?: string
}

/**
 * Creates or updates a user record in the public.users table
 * based on Supabase Auth user data
 */
export async function syncUserWithAuth(authUserId: string, userDetails: Partial<User> & { mail: string, name: string }) {
  const supabase = createClient()
  
  // First check if there's already a user with matching auth_id
  const { data: existingAuthUser, error: fetchAuthError } = await supabase
    .from('users')
    .select('*')
    .eq('auth_id', authUserId)
    .maybeSingle()
  
  if (fetchAuthError && fetchAuthError.code !== 'PGRST116') {
    console.error('Error fetching user by auth_id:', fetchAuthError)
    throw fetchAuthError
  }

  // Default empty content if not provided
  const details = {
    ...userDetails,
    content: userDetails.content || "" // Set default empty content if missing
  }

  // If found by auth_id, update that user
  if (existingAuthUser) {
    const { data, error: updateError } = await supabase
      .from('users')
      .update({
        ...details,
        updated_at: new Date().toISOString()
      })
      .eq('auth_id', authUserId)
      .select()
      .single()
    
    if (updateError) {
      console.error('Error updating user:', updateError)
      throw updateError
    }
    
    return data
  }
  
  // If not found by auth_id, check if there's a user with the same email but no auth_id
  const { data: existingEmailUser, error: fetchEmailError } = await supabase
    .from('users')
    .select('*')
    .eq('mail', userDetails.mail)
    .is('auth_id', null)
    .maybeSingle()
  
  if (fetchEmailError && fetchEmailError.code !== 'PGRST116') {
    console.error('Error fetching user by email:', fetchEmailError)
    throw fetchEmailError
  }
  
  // If found by email with null auth_id, update that user with the auth_id
  if (existingEmailUser) {
    const { data, error: updateError } = await supabase
      .from('users')
      .update({
        auth_id: authUserId,
        ...details,
        updated_at: new Date().toISOString()
      })
      .eq('id', existingEmailUser.id)
      .select()
      .single()
    
    if (updateError) {
      console.error('Error linking existing user with auth:', updateError)
      throw updateError
    }
    
    return data
  }
  
  // If no matching user exists, create a new record
  const { data, error: insertError } = await supabase
    .from('users')
    .insert([{ 
      auth_id: authUserId,
      ...details 
    }])
    .select()
    .single()
  
  if (insertError) {
    console.error('Error creating user:', insertError)
    throw insertError
  }
  
  return data
} 