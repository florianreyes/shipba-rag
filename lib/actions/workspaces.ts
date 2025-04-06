"use server";

import { createClient } from '@/lib/supabase/server';
import { getCommunityLogo } from '@/lib/utils/communityLogos';
import { notFound } from 'next/navigation';

export type Workspace = {
  id: string;
  name: string;
  image?: string;
};

/**
 * Fetches workspaces for a specific user
 */
export async function getUserWorkspaces(userId: string): Promise<Workspace[]> {
  const supabase = await createClient();
  
  try {
    // Fetch workspace associations for the user with active or admin status only
    const { data: workspacesData, error } = await supabase
      .from('workspaces_users')
      .select('workspace_id')
      .eq('user_id', userId)
      .in('status', ['active', 'admin']);
    
    if (error) {
      console.error('Error fetching workspaces:', error);
      return [];
    }
    
    if (!workspacesData || workspacesData.length === 0) {
      // Return empty array if user has no workspaces
      return [];
    }
    
    // Get workspace details for each workspace_id
    const workspaceIds = workspacesData.map(item => item.workspace_id);
    const { data: workspacesDetails, error: detailsError } = await supabase
      .from('workspaces')
      .select('*')
      .in('id', workspaceIds);
    
    if (detailsError || !workspacesDetails || workspacesDetails.length === 0) {
      console.error('Error fetching workspace details:', detailsError);
      return [];
    }
    
    return workspacesDetails.map(workspace => ({
      id: workspace.id,
      name: workspace.name,
      image: getCommunityLogo(workspace.name)
    }));
  } catch (error) {
    console.error('Error in getUserWorkspaces:', error);
    return [];
  }
}

/**
 * Adds a user to a workspace
 */
export async function addUserToWorkspace(userId: string, workspaceId: string): Promise<boolean> {
  const supabase = await createClient();
  
  try {
    const { error } = await supabase
      .from('workspaces_users')
      .insert({
        user_id: userId,
        workspace_id: workspaceId,
      });
    
    if (error) {
      console.error('Error adding user to workspace:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in addUserToWorkspace:', error);
    return false;
  }
} 

export type WorkspaceDetails = {
  id: string;
  name: string;
  description: string;
}

/**
 * Fetches workspace details by ID
 * Throws notFound() if workspace doesn't exist
 */
export async function getWorkspaceById(id: string): Promise<WorkspaceDetails> {
  try {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('workspaces')
      .select('id, name, description')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code !== 'PGRST116') {
        console.error('Database error:', error.message);
      }
      notFound();
    }
    
    if (!data) {
      notFound();
    }
    
    return data as WorkspaceDetails;
  } catch (error) {
    console.error('Unexpected error fetching workspace:', error);
    throw new Error('Failed to fetch workspace');
  }
} 

/**
 * Invites a user to a workspace
 */
export async function inviteUserToWorkspace(
  workspaceId: string, 
  userEmail: string, 
  invitedBy: string,
  isAdmin: boolean = false
): Promise<{ success: boolean; message: string; }> {
  const supabase = await createClient();
  
  try {
    // Check if the inviter has access to the workspace
    const { data: inviterAccess, error: inviterError } = await supabase
      .from('workspaces_users')
      .select('*')
      .eq('user_id', invitedBy)
      .eq('workspace_id', workspaceId)
      .single();
    
    if (inviterError || !inviterAccess) {
      return { 
        success: false, 
        message: 'You do not have permission to invite users to this workspace' 
      };
    }
    
    // Find the user by email
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('mail', userEmail)
      .single();
    
    if (userError || !userData) {
      return { 
        success: false, 
        message: 'User not found with the provided email' 
      };
    }
    
    // Check if user is already in the workspace or has a pending invitation
    const { data: existingUser, error: existingError } = await supabase
      .from('workspaces_users')
      .select('*')
      .eq('user_id', userData.id)
      .eq('workspace_id', workspaceId)
      .single();
      
    if (existingUser) {
      if (existingUser.status === 'active' || existingUser.status === 'admin') {
        return { 
          success: false, 
          message: 'User is already a member of this workspace' 
        };
      } else if (existingUser.status === 'invited') {
        return { 
          success: false, 
          message: 'User has already been invited to this workspace' 
        };
      }
    }
    
    // Insert the invitation
    const { error: insertError } = await supabase
      .from('workspaces_users')
      .insert({
        user_id: userData.id,
        workspace_id: workspaceId,
        status: isAdmin ? 'admin' : 'invited',
        invited_by: invitedBy,
        invited_at: new Date().toISOString(),
      });
    
    if (insertError) {
      console.error('Error creating invitation:', insertError);
      return { 
        success: false, 
        message: 'Failed to create invitation' 
      };
    }
    
    return { 
      success: true, 
      message: 'Invitation sent successfully' 
    };
  } catch (error) {
    console.error('Error in inviteUserToWorkspace:', error);
    return { 
      success: false, 
      message: 'An unexpected error occurred' 
    };
  }
}

/**
 * Gets all pending invitations for the current user
 */
export async function getUserInvitations(userId: string): Promise<any[]> {
  const supabase = await createClient();
  
  try {
    // Get all pending invitations
    const { data: invitations, error } = await supabase
      .from('workspaces_users')
      .select(`
        id,
        status,
        invited_at,
        invited_by,
        workspace_id,
        workspaces (
          id,
          name,
          description
        ),
        users!invited_by (
          id,
          name,
          mail
        )
      `)
      .eq('user_id', userId)
      .eq('status', 'invited');
    
    if (error) {
      console.error('Error fetching invitations:', error);
      return [];
    }
    
    return invitations || [];
  } catch (error) {
    console.error('Error in getUserInvitations:', error);
    return [];
  }
}

/**
 * Responds to a workspace invitation (accept or reject)
 */
export async function respondToInvitation(
  invitationId: string, 
  userId: string, 
  accept: boolean
): Promise<{ success: boolean; message: string; }> {
  const supabase = await createClient();
  
  try {
    // Verify the invitation belongs to the user
    const { data: invitation, error: fetchError } = await supabase
      .from('workspaces_users')
      .select('*')
      .eq('id', invitationId)
      .eq('user_id', userId)
      .eq('status', 'invited')
      .single();
    
    if (fetchError || !invitation) {
      return { 
        success: false, 
        message: 'Invitation not found or already processed' 
      };
    }
    
    if (accept) {
      // Update the invitation status to active
      const { error: updateError } = await supabase
        .from('workspaces_users')
        .update({ status: 'active' })
        .eq('id', invitationId);
      
      if (updateError) {
        console.error('Error accepting invitation:', updateError);
        return { 
          success: false, 
          message: 'Failed to accept invitation' 
        };
      }
      
      return { 
        success: true, 
        message: 'Invitation accepted successfully' 
      };
    } else {
      // Update the invitation status to rejected instead of deleting
      const { error: updateError } = await supabase
        .from('workspaces_users')
        .update({ status: 'rejected' })
        .eq('id', invitationId);
      
      if (updateError) {
        console.error('Error rejecting invitation:', updateError);
        return { 
          success: false, 
          message: 'Failed to reject invitation' 
        };
      }
      
      return { 
        success: true, 
        message: 'Invitation rejected successfully' 
      };
    }
  } catch (error) {
    console.error('Error in respondToInvitation:', error);
    return {
      success: false,
      message: 'An unexpected error occurred'
    };
  }
}

/**
 * Search for users by email
 */
export async function searchUsersByEmail(
  query: string,
  limit: number = 5
): Promise<any[]> {
  const supabase = await createClient();
  
  try {
    if (!query || query.length < 3) {
      return [];
    }
    
    // First get users matching the email pattern
    const { data: users, error } = await supabase
      .from('users')
      .select('id, name, mail')
      .ilike('mail', `%${query}%`)
      .limit(limit);
    
    if (error) {
      console.error('Error searching users:', error);
      return [];
    }
    
    // If no users found, return empty array
    if (!users || users.length === 0) {
      return [];
    }
    
    // Return all users that match the email pattern, regardless of workspace status
    return users;
  } catch (error) {
    console.error('Error in searchUsersByEmail:', error);
    return [];
  }
}

/**
 * Fetches all members of a workspace
 */
export async function getWorkspaceMembers(workspaceId: string): Promise<any[]> {
  const supabase = await createClient();
  
  try {
    // Using a simpler query approach with manual joining
    const { data: workspaceUsers, error: workspaceError } = await supabase
      .from('workspaces_users')
      .select('id, status, user_id')
      .eq('workspace_id', workspaceId)
      .in('status', ['active', 'admin']);
    
    if (workspaceError || !workspaceUsers || workspaceUsers.length === 0) {
      console.error('Error fetching workspace users:', workspaceError);
      return [];
    }
    
    // Get the user IDs
    const userIds = workspaceUsers.map(wu => wu.user_id);
    
    // Fetch user details
    const { data: userDetails, error: userError } = await supabase
      .from('users')
      .select('id, name, mail')
      .in('id', userIds);
    
    if (userError || !userDetails) {
      console.error('Error fetching user details:', userError);
      return [];
    }
    
    // Combine the data
    const result = workspaceUsers.map(wu => {
      const userDetail = userDetails.find(u => u.id === wu.user_id);
      return {
        id: wu.id,
        status: wu.status,
        user_id: wu.user_id,
        users: userDetail || { id: wu.user_id, name: 'Unknown User', mail: '' }
      };
    });
    
    return result;
  } catch (error) {
    console.error('Error in getWorkspaceMembers:', error);
    return [];
  }
}

/**
 * Fetches all pending invitations for a workspace
 */
export async function getWorkspacePendingInvitations(workspaceId: string): Promise<any[]> {
  const supabase = await createClient();
  
  try {
    // Using a simpler query approach with manual joining
    const { data: invitations, error: invitationsError } = await supabase
      .from('workspaces_users')
      .select('id, status, invited_at, invited_by, user_id')
      .eq('workspace_id', workspaceId)
      .eq('status', 'invited');
    
    if (invitationsError || !invitations || invitations.length === 0) {
      console.error('Error fetching workspace invitations:', invitationsError);
      return [];
    }
    
    // Get the user IDs and inviter IDs
    const userIds = invitations.map(inv => inv.user_id);
    const inviterIds = invitations.filter(inv => inv.invited_by).map(inv => inv.invited_by);
    const allIds = [...new Set([...userIds, ...inviterIds])];
    
    // Fetch user details
    const { data: userDetails, error: userError } = await supabase
      .from('users')
      .select('id, name, mail')
      .in('id', allIds);
    
    if (userError || !userDetails) {
      console.error('Error fetching user details:', userError);
      return [];
    }
    
    // Combine the data
    const result = invitations.map(invitation => {
      const userDetail = userDetails.find(u => u.id === invitation.user_id);
      const inviterDetail = invitation.invited_by ? 
        userDetails.find(u => u.id === invitation.invited_by) : null;
      
      return {
        id: invitation.id,
        status: invitation.status,
        invited_at: invitation.invited_at,
        invited_by: invitation.invited_by,
        user_id: invitation.user_id,
        users: userDetail || { id: invitation.user_id, name: 'Unknown User', mail: '' },
        invited_user: inviterDetail ? {
          id: inviterDetail.id,
          name: inviterDetail.name
        } : null
      };
    });
    
    return result;
  } catch (error) {
    console.error('Error in getWorkspacePendingInvitations:', error);
    return [];
  }
}

/**
 * Removes a user from a workspace
 */
export async function removeUserFromWorkspace(
  workspaceId: string,
  userId: string,
  currentUserId: string
): Promise<{ success: boolean; message: string; }> {
  const supabase = await createClient();
  
  try {
    // Check if the current user has admin access
    const { data: currentUserAccess, error: accessError } = await supabase
      .from('workspaces_users')
      .select('status')
      .eq('user_id', currentUserId)
      .eq('workspace_id', workspaceId)
      .single();
    
    if (accessError || !currentUserAccess || currentUserAccess.status !== 'admin') {
      return { 
        success: false, 
        message: 'You do not have permission to remove users from this workspace' 
      };
    }
    
    // Prevent removing yourself
    if (userId === currentUserId) {
      return {
        success: false,
        message: 'You cannot remove yourself from the workspace'
      };
    }
    
    // Check if user exists in workspace
    const { data: userToRemove, error: userError } = await supabase
      .from('workspaces_users')
      .select('id, status')
      .eq('user_id', userId)
      .eq('workspace_id', workspaceId)
      .single();
    
    if (userError || !userToRemove) {
      return {
        success: false,
        message: 'User not found in this workspace'
      };
    }
    
    // Don't allow removing another admin
    if (userToRemove.status === 'admin') {
      return {
        success: false,
        message: 'Cannot remove an admin from workspace'
      };
    }
    
    // Delete the user from workspace
    const { error: deleteError } = await supabase
      .from('workspaces_users')
      .delete()
      .eq('id', userToRemove.id);
    
    if (deleteError) {
      console.error('Error removing user from workspace:', deleteError);
      return {
        success: false,
        message: 'Failed to remove user from workspace'
      };
    }
    
    return {
      success: true,
      message: 'User removed from workspace successfully'
    };
  } catch (error) {
    console.error('Error in removeUserFromWorkspace:', error);
    return {
      success: false,
      message: 'An unexpected error occurred'
    };
  }
}

/**
 * Checks if a user is an admin of a workspace
 */
export async function isWorkspaceAdmin(userId: string, workspaceId: string): Promise<boolean> {
  const supabase = await createClient();
  
  try {
    const { data, error } = await supabase
      .from('workspaces_users')
      .select('status')
      .eq('user_id', userId)
      .eq('workspace_id', workspaceId)
      .single();
    
    if (error || !data) {
      return false;
    }
    
    return data.status === 'admin';
  } catch (error) {
    console.error('Error checking workspace admin status:', error);
    return false;
  }
} 