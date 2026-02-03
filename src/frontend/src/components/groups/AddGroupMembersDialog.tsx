import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Search, UserPlus, Loader2 } from 'lucide-react';
import { useSearchProfiles, useAddGroupMember } from '../../hooks/useQueries';
import { Principal } from '@dfinity/principal';
import type { GroupId } from '../../backend';
import { toast } from 'sonner';

interface AddGroupMembersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groupId: GroupId;
  existingMemberIds: string[];
  onMemberAdded?: () => void;
}

export default function AddGroupMembersDialog({
  open,
  onOpenChange,
  groupId,
  existingMemberIds,
  onMemberAdded,
}: AddGroupMembersDialogProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: searchResults, isLoading: isSearching } = useSearchProfiles(searchTerm);
  const addMember = useAddGroupMember();

  const handleAddMember = async (userId: Principal, username: string) => {
    try {
      await addMember.mutateAsync({ groupId, userId });
      toast.success(`${username} added to the group — you can start chatting now!`);
      onMemberAdded?.();
    } catch (error: any) {
      console.error('Error adding member:', error);
      if (error.message?.includes('already a member')) {
        toast.error(`${username} is already a member of this group`);
      } else if (error.message?.includes('Unauthorized')) {
        toast.error('You do not have permission to add members to this group');
      } else if (error.message?.includes('not found')) {
        toast.error('Group not found');
      } else {
        toast.error('Failed to add member. Please try again.');
      }
    }
  };

  const filteredResults = searchResults?.filter(
    (result) => !existingMemberIds.includes(result.userId.toString())
  ) || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add People to Group</DialogTitle>
          <DialogDescription>
            Search for users by username and add them to this group
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by username..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>

          <ScrollArea className="h-[300px] border rounded-md">
            {isSearching ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : searchTerm.trim() === '' ? (
              <div className="flex flex-col items-center justify-center py-12 text-center px-4">
                <Search className="h-12 w-12 text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground">
                  Start typing to search for users
                </p>
              </div>
            ) : filteredResults.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center px-4">
                <p className="text-sm text-muted-foreground">
                  {searchResults && searchResults.length > 0
                    ? 'All matching users are already members'
                    : 'No users found'}
                </p>
              </div>
            ) : (
              <div className="p-2 space-y-2">
                {filteredResults.map((result) => {
                  const isAdding = addMember.isPending;
                  
                  return (
                    <div
                      key={result.userId.toString()}
                      className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <Avatar className="h-10 w-10 flex-shrink-0">
                          <AvatarFallback>
                            {result.username.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{result.username}</p>
                          {result.bio && (
                            <p className="text-xs text-muted-foreground truncate">
                              {result.bio}
                            </p>
                          )}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleAddMember(result.userId, result.username)}
                        disabled={isAdding}
                        className="flex-shrink-0 ml-2"
                      >
                        {isAdding ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <UserPlus className="h-4 w-4 mr-1" />
                            Add
                          </>
                        )}
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
