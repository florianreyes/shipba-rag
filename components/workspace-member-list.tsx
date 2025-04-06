'use client'

import React, { useState, useEffect, useCallback } from 'react';
import { User, MoreHorizontal, Shield } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Button } from './ui/button';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';

interface Member {
  id: string;
  status: string;
  user_id: string;
  users: {
    id: string;
    name: string;
    mail: string;
  };
}

interface WorkspaceMemberListProps {
  workspaceId: string;
}

export function WorkspaceMemberList({ workspaceId }: WorkspaceMemberListProps) {
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);

  const fetchMembers = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/workspaces/${workspaceId}/members`);
      if (!response.ok) {
        throw new Error('Failed to fetch members');
      }
      
      const data = await response.json();
      setMembers(data.members || []);
    } catch (error) {
      console.error('Error fetching members:', error);
      toast.error('Failed to load workspace members');
    } finally {
      setIsLoading(false);
    }
  }, [workspaceId]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const handleRemoveMember = async () => {
    if (!selectedMember) return;
    
    try {
      setIsRemoving(true);
      const response = await fetch(`/api/workspaces/${workspaceId}/members/${selectedMember.user_id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to remove member');
      }
      
      toast.success('Member removed successfully');
      
      // Remove the member from the local state
      setMembers(members.filter(m => m.id !== selectedMember.id));
    } catch (error) {
      console.error('Error removing member:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to remove member');
    } finally {
      setIsRemoving(false);
      setConfirmOpen(false);
      setSelectedMember(null);
    }
  };

  const openRemoveConfirm = (member: Member) => {
    setSelectedMember(member);
    setConfirmOpen(true);
  };

  if (isLoading) {
    return (
      <div className="py-4 text-center text-sm text-muted-foreground">
        Loading members...
      </div>
    );
  }

  if (members.length === 0) {
    return (
      <div className="py-4 text-center text-sm text-muted-foreground">
        This workspace has no members yet.
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {members.map((member) => (
          <div 
            key={member.id} 
            className="flex items-center justify-between p-3 rounded-md border"
          >
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">{member.users?.name || 'Unknown user'}</p>
                  {member.status === 'admin' && (
                    <Shield className="h-3.5 w-3.5 text-primary" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{member.users?.mail || ''}</p>
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {member.status !== 'admin' && (
                  <DropdownMenuItem>
                    Make Admin
                  </DropdownMenuItem>
                )}
                {member.status !== 'admin' && (
                  <DropdownMenuItem 
                    className="text-destructive"
                    onClick={() => openRemoveConfirm(member)}
                  >
                    Remove from workspace
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ))}
      </div>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove member</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove {selectedMember?.users?.name} from this workspace?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setConfirmOpen(false)}
              disabled={isRemoving}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleRemoveMember}
              disabled={isRemoving}
              variant="destructive"
            >
              {isRemoving ? 'Removing...' : 'Remove'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
} 