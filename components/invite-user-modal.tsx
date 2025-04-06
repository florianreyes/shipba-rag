import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { UserPlus, Search, User } from 'lucide-react';
import { toast } from 'sonner';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';

interface User {
  id: string;
  name: string;
  mail: string;
}

interface WorkspaceMember {
  id: string;
  status: string;
  user_id: string;
  users: User;
}

interface InviteUserModalProps {
  workspaceId: string;
  trigger?: React.ReactNode;
}

export function InviteUserModal({ workspaceId, trigger }: InviteUserModalProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isInviting, setIsInviting] = useState(false);
  const [workspaceMembers, setWorkspaceMembers] = useState<WorkspaceMember[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch current user ID
  const fetchCurrentUser = useCallback(async () => {
    try {
      const response = await fetch('/api/users/me');
      if (response.ok) {
        const data = await response.json();
        setCurrentUserId(data.user?.id || null);
      }
    } catch (error) {
      console.error('Error fetching current user:', error);
    }
  }, []);

  // Fetch all workspace members
  const fetchWorkspaceMembers = useCallback(async () => {
    try {
      const response = await fetch(`/api/workspaces/${workspaceId}/members`);
      if (response.ok) {
        const data = await response.json();
        setWorkspaceMembers(data.members || []);
      }
    } catch (error) {
      console.error('Error fetching workspace members:', error);
    }
  }, [workspaceId]);

  // Fetch workspace members and current user when modal opens
  useEffect(() => {
    if (open) {
      fetchWorkspaceMembers();
      fetchCurrentUser();
    }
  }, [open, fetchWorkspaceMembers, fetchCurrentUser]);

  // Filter existing members and current user from search results
  const filterSearchResults = (users: User[]): User[] => {
    // Get all user IDs who are already members
    const memberIds = new Set(workspaceMembers.map(member => member.user_id));
    
    // Filter out existing members and current user
    return users.filter(user => 
      !memberIds.has(user.id) && 
      user.id !== currentUserId
    );
  };

  // Handle search input changes with debounce
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    if (query.length < 3) {
      setSearchResults([]);
      return;
    }
    
    // Debounce search
    searchTimeoutRef.current = setTimeout(() => {
      searchUsers(query);
    }, 300);
  };

  // Search users by email
  const searchUsers = async (query: string) => {
    if (query.length < 3) return;
    
    try {
      setIsSearching(true);
      const response = await fetch(`/api/users/search?query=${encodeURIComponent(query)}`);
      
      if (!response.ok) {
        throw new Error('Failed to search users');
      }
      
      const data = await response.json();
      const filteredUsers = filterSearchResults(data.users || []);
      setSearchResults(filteredUsers);
    } catch (error) {
      console.error('Error searching users:', error);
      toast.error('Failed to search users');
    } finally {
      setIsSearching(false);
    }
  };

  // Select a user from search results
  const handleSelectUser = (user: User) => {
    setSelectedUser(user);
    setSearchQuery(user.mail);
    setSearchResults([]);
  };

  // Send invitation
  const handleSendInvitation = async () => {
    if (!selectedUser) {
      toast.error('Please select a user to invite');
      return;
    }
    
    try {
      setIsInviting(true);
      const response = await fetch(`/api/workspaces/${workspaceId}/invite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: selectedUser.mail,
          isAdmin,
        }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        toast.error(data.error || 'Failed to send invitation');
        return;
      }
      
      toast.success('Invitation sent successfully');
      setOpen(false);
      resetForm();
    } catch (error: any) {
      console.error('Error sending invitation:', error);
      toast.error(error.message || 'Failed to send invitation');
    } finally {
      setIsInviting(false);
    }
  };

  // Reset form state
  const resetForm = () => {
    setSearchQuery('');
    setSearchResults([]);
    setSelectedUser(null);
    setIsAdmin(false);
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  return (
    <Dialog open={open} onOpenChange={(value: boolean) => {
      setOpen(value);
      if (!value) resetForm();
    }}>
      <DialogTrigger asChild>
        {trigger || (
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <UserPlus className="h-4 w-4" />
            <span>Invite User</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invite User to Workspace</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="relative">
            <div className="relative">
              <Input
                placeholder="Search user by email"
                value={searchQuery}
                onChange={handleSearchChange}
                className="pr-10"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                {isSearching ? (
                  <div className="animate-spin h-4 w-4 border-2 border-primary border-opacity-20 border-t-primary rounded-full" />
                ) : (
                  <Search className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
            </div>

            {searchResults.length > 0 && (
              <div className="absolute w-full z-10 mt-1 max-h-60 overflow-auto rounded-md border bg-popover p-1 shadow-md">
                {searchResults.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center gap-2 p-2 cursor-pointer rounded hover:bg-muted"
                    onClick={() => handleSelectUser(user)}
                  >
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{user.name}</span>
                      <span className="text-xs text-muted-foreground">{user.mail}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="admin"
              checked={isAdmin}
              onCheckedChange={(checked: boolean) => setIsAdmin(checked)}
            />
            <Label htmlFor="admin" className="text-sm">Invite as admin</Label>
          </div>

          <div className="flex justify-end">
            <Button
              onClick={handleSendInvitation}
              disabled={!selectedUser || isInviting}
            >
              {isInviting ? 'Sending...' : 'Send Invitation'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 