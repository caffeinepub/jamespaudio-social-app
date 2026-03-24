import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useFollowUser, useUnfollowUser } from '../hooks/useQueries';
import type { SearchResult } from '../hooks/useQueries';
import { toast } from 'sonner';
import { useStartGroupChat } from '../hooks/useStartGroupChat';
import { useNavigation } from '../contexts/NavigationContext';
import { useNavigate } from '@tanstack/react-router';

interface UserCardProps {
  user: SearchResult;
  isFollowing?: boolean;
}

export default function UserCard({ user, isFollowing = false }: UserCardProps) {
  const followUser = useFollowUser();
  const unfollowUser = useUnfollowUser();
  const startGroupChatMutation = useStartGroupChat();
  const { setTargetGroupId } = useNavigation();
  const navigate = useNavigate();

  const handleFollowToggle = async () => {
    try {
      if (isFollowing) {
        await unfollowUser.mutateAsync(user.userId);
        toast.success(`You unfollowed ${user.username}`);
      } else {
        await followUser.mutateAsync(user.userId);
        toast.success(`You are now following ${user.username}`);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to update follow status');
    }
  };

  const handleStartGroupChat = async () => {
    try {
      const groupId = await startGroupChatMutation.mutateAsync({
        userId: user.userId,
        username: user.username,
      });
      setTargetGroupId(groupId);
      navigate({ to: '/groups' });
      toast.success(`Group chat created with ${user.username}`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to create group chat');
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col items-center text-center gap-3">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user.profilePicture.url} />
            <AvatarFallback>{getInitials(user.username)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{user.username}</p>
            <p className="text-sm text-muted-foreground line-clamp-2">{user.bio}</p>
            <div className="flex gap-2 text-xs text-muted-foreground mt-1">
              <span>{Number(user.followerCount)} followers</span>
              <span>•</span>
              <span>{Number(user.followingCount)} following</span>
            </div>
          </div>
          <div className="flex gap-2 w-full">
            <Button
              size="sm"
              variant={isFollowing ? 'outline' : 'default'}
              onClick={handleFollowToggle}
              disabled={followUser.isPending || unfollowUser.isPending}
              className="flex-1"
            >
              {followUser.isPending || unfollowUser.isPending
                ? 'Loading...'
                : isFollowing
                ? 'Unfollow'
                : 'Follow'}
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={handleStartGroupChat}
              disabled={startGroupChatMutation.isPending}
              className="flex-1"
            >
              {startGroupChatMutation.isPending ? 'Creating...' : 'Start group chat'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
