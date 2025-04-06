import React from 'react';
import { getWorkspaceById, isWorkspaceAdmin } from '@/lib/actions/workspaces';
import { getCurrentUser } from '@/lib/actions/auth';
import { redirect } from 'next/navigation';
import WorkspaceSettingsClient from './workspace-settings-client';

export default async function WorkspaceSettingsPage({
  params,
}: {
  params: any
}) {
  // Await params before accessing properties
  const resolvedParams = await Promise.resolve(params);
  const workspaceId = resolvedParams.id;
  
  const user = await getCurrentUser();
  
  if (!user) {
    redirect('/login');
  }
  
  const isAdmin = await isWorkspaceAdmin(user.id, workspaceId);
  
  if (!isAdmin) {
    redirect(`/search`);
  }
  
  const workspace = await getWorkspaceById(workspaceId);
  
  return <WorkspaceSettingsClient workspace={workspace} workspaceId={workspaceId} />;
} 