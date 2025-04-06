import React from 'react';
import { Check, X } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner';

interface InvitationItemProps {
  invitation: {
    id: string;
    invited_at: string;
    workspaces: {
      name: string;
    };
    users: {
      name: string;
    };
  };
  onAccept: (id: string) => Promise<void>;
  onReject: (id: string) => Promise<void>;
}

export function InvitationItem({ invitation, onAccept, onReject }: InvitationItemProps) {
  const [isLoading, setIsLoading] = React.useState<{ accept: boolean; reject: boolean }>({
    accept: false,
    reject: false,
  });

  const handleAccept = async () => {
    try {
      setIsLoading({ ...isLoading, accept: true });
      await onAccept(invitation.id);
      toast.success('Invitation accepted successfully');
    } catch (error) {
      console.error('Error accepting invitation:', error);
      toast.error('Failed to accept invitation');
    } finally {
      setIsLoading({ ...isLoading, accept: false });
    }
  };

  const handleReject = async () => {
    try {
      setIsLoading({ ...isLoading, reject: true });
      await onReject(invitation.id);
      toast.success('Invitation rejected successfully');
    } catch (error) {
      console.error('Error rejecting invitation:', error);
      toast.error('Failed to reject invitation');
    } finally {
      setIsLoading({ ...isLoading, reject: false });
    }
  };

  return (
    <div className="py-3 px-4 border-b last:border-b-0">
      <div className="flex justify-between items-center">
        <div className="flex-grow">
          <div className="text-sm font-medium">
            {invitation.workspaces.name}
          </div>
          <div className="text-xs text-muted-foreground">
            Invited by {invitation.users?.name || 'A user'}
          </div>
        </div>
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="outline"
            className="border border-black dark:border-white h-8 w-8"
            onClick={handleAccept}
            disabled={isLoading.accept || isLoading.reject}
          >
            <Check className="h-4 w-4 text-black dark:text-white" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="border border-black dark:border-white h-8 w-8"
            onClick={handleReject}
            disabled={isLoading.accept || isLoading.reject}
          >
            <X className="h-4 w-4 text-black dark:text-white" />
          </Button>
        </div>
      </div>
    </div>
  );
} 