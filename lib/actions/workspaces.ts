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
    // Fetch workspace associations for the user
    const { data: workspacesData, error } = await supabase
      .from('workspaces_users')
      .select('workspace_id')
      .eq('user_id', userId);
    
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