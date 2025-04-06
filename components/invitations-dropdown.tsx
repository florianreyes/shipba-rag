import React, { useState, useEffect } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Button } from './ui/button';
import { InvitationItem } from './invitation-item';
import { NotificationBadge } from './ui/notification-badge';
import { Inbox } from 'lucide-react';

interface Invitation {
  id: string;
  invited_at: string;
  workspaces: {
    id: string;
    name: string;
    description: string;
  };
  users: {
    id: string;
    name: string;
    email: string;
  };
}

export function InvitationsDropdown() {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const fetchInvitations = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/invitations');
      if (!response.ok) {
        throw new Error('Failed to fetch invitations');
      }
      const data = await response.json();
      setInvitations(data.invitations || []);
    } catch (error) {
      console.error('Error fetching invitations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInvitations();
  }, []);

  // Refetch invitations when dropdown is opened
  useEffect(() => {
    if (open) {
      fetchInvitations();
    }
  }, [open]);

  const handleAcceptInvitation = async (invitationId: string) => {
    try {
      const response = await fetch(`/api/invitations/${invitationId}/accept`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('Failed to accept invitation');
      }
      
      // Remove invitation from list
      setInvitations((prevInvitations) => 
        prevInvitations.filter((inv) => inv.id !== invitationId)
      );
      
      // Recarga la página para mostrar los nuevos workspaces
      window.location.reload();
    } catch (error) {
      console.error('Error accepting invitation:', error);
      throw error;
    }
  };

  const handleRejectInvitation = async (invitationId: string) => {
    try {
      const response = await fetch(`/api/invitations/${invitationId}/reject`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('Failed to reject invitation');
      }
      
      // Remove invitation from list
      setInvitations((prevInvitations) => 
        prevInvitations.filter((inv) => inv.id !== invitationId)
      );
    } catch (error) {
      console.error('Error rejecting invitation:', error);
      throw error;
    }
  };

  return (
    <div className="relative">
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="relative rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            <Inbox className="h-5 w-5" />
            <NotificationBadge count={invitations.length} size="sm" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80">
          <div className="py-2 px-4 border-b">
            <h3 className="font-medium">Invitations</h3>
          </div>
          
          {isLoading ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Loading invitations...
            </div>
          ) : invitations.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              You don&apos;t have any pending invitations
            </div>
          ) : (
            <div className="max-h-[300px] overflow-y-auto">
              {invitations.map((invitation) => (
                <InvitationItem
                  key={invitation.id}
                  invitation={invitation}
                  onAccept={handleAcceptInvitation}
                  onReject={handleRejectInvitation}
                />
              ))}
            </div>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
} 