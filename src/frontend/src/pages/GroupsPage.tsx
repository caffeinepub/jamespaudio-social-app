import { Users, Plus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useGetUserGroups, useCreateGroup } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import GroupConversation from '../components/groups/GroupConversation';
import CreateGroupDialog from '../components/groups/CreateGroupDialog';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export default function GroupsPage() {
  const { identity } = useInternetIdentity();
  const { data: groups, isLoading } = useGetUserGroups();
  const createGroup = useCreateGroup();
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [createError, setCreateError] = useState<string>('');

  const isAuthenticated = !!identity;

  const selectedGroup = groups?.find(g => g.id === selectedGroupId);

  const handleCreateGroup = async (name: string, description: string) => {
    setCreateError('');
    try {
      const newGroupId = await createGroup.mutateAsync({ name, description });
      toast.success('Group created successfully!');
      setIsCreateDialogOpen(false);
      // Auto-select the newly created group
      setSelectedGroupId(newGroupId);
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to create group';
      setCreateError(errorMessage);
      toast.error(errorMessage);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="h-full flex flex-col">
        <div className="relative h-48 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 overflow-hidden">
          <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                <Users className="h-10 w-10" />
                Groups
              </h1>
              <p className="text-white/90">Create and manage your own communities</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="container mx-auto px-4 py-6">
              <Card className="max-w-2xl mx-auto border-orange-500/50 bg-orange-500/5">
                <CardContent className="py-12 text-center">
                  <Users className="h-16 w-16 text-orange-500 mx-auto mb-4" />
                  <p className="text-lg font-semibold mb-2">Sign in to access groups</p>
                  <p className="text-sm text-muted-foreground">
                    You need to be signed in to view and participate in groups.
                  </p>
                </CardContent>
              </Card>
            </div>
          </ScrollArea>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="relative h-48 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 overflow-hidden">
        <div className="relative z-10 container mx-auto px-4 h-full flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <Users className="h-10 w-10" />
              Groups
            </h1>
            <p className="text-white/90">Connect with your communities</p>
          </div>
          <Button 
            variant="secondary" 
            size="lg" 
            className="gap-2"
            onClick={() => setIsCreateDialogOpen(true)}
          >
            <Plus className="h-5 w-5" />
            Create Group
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="h-full flex">
          {/* Groups List Sidebar */}
          <div className="w-80 border-r bg-card">
            <ScrollArea className="h-full">
              <div className="p-4 space-y-2">
                <h2 className="text-lg font-semibold mb-4">Your Groups</h2>
                
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-sm text-muted-foreground">Loading groups...</p>
                  </div>
                ) : groups && groups.length > 0 ? (
                  groups.map((group) => (
                    <Card
                      key={group.id}
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        selectedGroupId === group.id ? 'border-primary bg-primary/5' : ''
                      }`}
                      onClick={() => setSelectedGroupId(group.id)}
                    >
                      <CardHeader className="p-4">
                        <CardTitle className="text-base flex items-center justify-between">
                          <span className="truncate">{group.name}</span>
                          <Badge variant="secondary" className="text-xs">
                            {group.members.length}
                          </Badge>
                        </CardTitle>
                        <CardDescription className="text-xs line-clamp-2">
                          {group.description}
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  ))
                ) : (
                  <Card>
                    <CardContent className="py-8 text-center">
                      <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-sm text-muted-foreground">No groups yet</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Create or join a group to get started
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Group Conversation Area */}
          <div className="flex-1 overflow-hidden">
            {selectedGroup ? (
              <GroupConversation
                groupId={selectedGroup.id}
                groupName={selectedGroup.name}
                memberIds={selectedGroup.members.map(m => m.toString())}
              />
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg font-semibold mb-2">Select a group</p>
                  <p className="text-sm text-muted-foreground">
                    Choose a group from the sidebar to view messages
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <CreateGroupDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreateGroup}
        isSubmitting={createGroup.isPending}
        error={createError}
      />
    </div>
  );
}
