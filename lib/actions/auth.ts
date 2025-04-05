"use server";

import { createClient } from '@/lib/supabase/server';

export type UserData = {
  id: string;
  email: string | null;
  name: string | null;
  avatar_url: string | null;
  auth_id: string | null;
};

/**
 * Gets the currently authenticated user with profile data
 */
export async function getCurrentUser(): Promise<UserData | null> {
  const supabase = await createClient();
  
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return null;
    }
    
    // Fetch user profile from users table
    const { data: userProfile } = await supabase
      .from('users')
      .select('*')
      .eq('auth_id', user.id)
      .single();
    
    // Type assertion for user metadata
    const metadata = user.user_metadata as Record<string, any> || {};
    const avatarUrl = metadata.avatar_url;
    
    return {
      id: userProfile?.id || '',
      email: user.email || null,
      name: userProfile?.name || user.email?.split('@')[0] || 'User',
      avatar_url: typeof avatarUrl === 'string' ? avatarUrl : null,
      auth_id: user.id
    };
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

/**
 * Signs the user out
 */
export async function signOut(): Promise<{ error: string | null }> {
  const supabase = await createClient();
  
  try {
    await supabase.auth.signOut();
    return { error: null };
  } catch (error) {
    console.error('Error signing out:', error);
    return { error: 'Failed to sign out' };
  }
}

/**
 * Sends a magic link to the user's email for authentication
 */
export async function signInWithMagicLink(email: string, redirectUrl: string): Promise<{ error: string | null }> {
  const supabase = await createClient();
  
  try {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectUrl,
      },
    });

    if (error) {
      console.error('Error sending magic link:', error);
      return { error: error.message };
    }

    return { error: null };
  } catch (error) {
    console.error('Error in signInWithMagicLink:', error);
    return { error: 'Failed to send login link' };
  }
} 