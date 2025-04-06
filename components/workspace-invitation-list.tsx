'use client'

import React, { useState, useEffect, useCallback } from 'react';
import { User, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';

interface Invitation {
  id: string;
  invited_at: string;
  user_id: string;
  invited_by: string;
  users: {
    id: string;
    name: string;
    mail: string;
  };
  invited_user: {
    id: string;
    name: string;
  };
}

interface WorkspaceInvitationListProps {
  workspaceId: string;
}

export function WorkspaceInvitationList({ workspaceId }: WorkspaceInvitationListProps) {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchInvitations = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/workspaces/${workspaceId}/invitations`);
      if (!response.ok) {
        throw new Error('Failed to fetch invitations');
      }
      
      const data = await response.json();
      setInvitations(data.invitations || []);
    } catch (error) {
      console.error('Error fetching invitations:', error);
      toast.error('Failed to load workspace invitations');
    } finally {
      setIsLoading(false);
    }
  }, [workspaceId]);

  useEffect(() => {
    fetchInvitations();
  }, [fetchInvitations]);

  if (isLoading) {
    return (
      <div className="py-4 text-center text-sm text-muted-foreground">
        Loading invitations...
      </div>
    );
  }

  if (invitations.length === 0) {
    return (
      <div className="py-4 text-center text-sm text-muted-foreground">
        No pending invitations found.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {invitations.map((invitation) => (
        <div 
          key={invitation.id} 
          className="flex items-center justify-between p-3 rounded-md border"
        >
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">{invitation.users?.name || 'Unknown user'}</p>
              <p className="text-xs text-muted-foreground">{invitation.users?.mail || ''}</p>
            </div>
          </div>

          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>
              {invitation.invited_user ? invitation.invited_user.name : ''}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
} 