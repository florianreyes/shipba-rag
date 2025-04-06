'use client'

import React from 'react';
import { InviteUserModal } from '@/components/invite-user-modal';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserPlus } from 'lucide-react';
import { WorkspaceDetails } from '@/lib/actions/workspaces';
import { WorkspaceMemberList } from '@/components/workspace-member-list';
import { WorkspaceInvitationList } from '@/components/workspace-invitation-list';

interface WorkspaceSettingsClientProps {
  workspace: WorkspaceDetails;
  workspaceId: string;
}

export default function WorkspaceSettingsClient({ workspace, workspaceId }: WorkspaceSettingsClientProps) {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{workspace.name} Settings</h1>
      </div>
      
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3 mb-8">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="invitations">Invitations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle>Workspace Information</CardTitle>
              <CardDescription>
                Update your workspace details and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {workspace.description || 'No description'}
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="members">
          <Card className="max-w-md">
            <CardHeader>
              <div>
                <CardTitle>Workspace Members</CardTitle>
                <CardDescription className="mb-4">
                  Manage members of this workspace
                </CardDescription>
                <InviteUserModal 
                  workspaceId={workspaceId}
                  trigger={
                    <button className="w-full flex items-center justify-center gap-2 py-2 border rounded-md text-sm font-medium hover:bg-muted transition-colors">
                      <UserPlus className="h-4 w-4" />
                      <span>Invite User</span>
                    </button>
                  }
                />
              </div>
            </CardHeader>
            <CardContent>
              <WorkspaceMemberList workspaceId={workspaceId} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="invitations">
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle>Pending Invitations</CardTitle>
              <CardDescription>
                View and manage pending invitations to this workspace
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <WorkspaceInvitationList workspaceId={workspaceId} />
                
                <div>
                  <InviteUserModal 
                    workspaceId={workspaceId} 
                    trigger={
                      <button className="w-full flex items-center justify-center gap-2 py-2 border rounded-md text-sm font-medium hover:bg-muted transition-colors">
                        <UserPlus className="h-4 w-4" />
                        <span>Invite User</span>
                      </button>
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 