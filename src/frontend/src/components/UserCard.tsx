import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useFollowUser, useUnfollowUser, useGetCallerUserProfile } from '../hooks/useQueries';
import { UserPlus, UserMinus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import type { SearchResult } from '../backend';

interface UserCardProps {
  user: SearchResult;
}

export default function UserCard({ user }: UserCardProps) {
  const { data: currentProfile } = useGetCallerUserProfile();
  const followUser = useFollowUser();
  const unfollowUser = useUnfollowUser();

  const isFollowing = currentProfile?.following.some(
    (id) => id.toString() === user.userId.toString()
  );

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleFollow = async () => {
    try {
      await followUser.mutateAsync(user.userId);
      toast.success(`You are now following ${user.username}`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to follow user');
    }
  };

  const handleUnfollow = async () => {
    try {
      await unfollowUser.mutateAsync(user.userId);
      toast.success(`You unfollowed ${user.username}`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to unfollow user');
    }
  };

  const isPending = followUser.isPending || unfollowUser.isPending;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4 space-y-0">
        <Avatar className="h-12 w-12">
          <AvatarImage src={user.profilePicture.url} />
          <AvatarFallback>{getInitials(user.username)}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="font-semibold truncate">{user.username}</p>
          <div className="flex gap-3 text-sm text-muted-foreground">
            <span>{Number(user.followerCount)} followers</span>
            <span>{Number(user.followingCount)} following</span>
          </div>
        </div>
      </CardHeader>
      {user.bio && (
        <CardContent className="pt-0">
          <p className="text-sm text-muted-foreground line-clamp-2">{user.bio}</p>
        </CardContent>
      )}
      <CardContent className="pt-2">
        {isFollowing ? (
          <Button
            onClick={handleUnfollow}
            disabled={isPending}
            variant="outline"
            className="w-full gap-2"
            size="sm"
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <UserMinus className="h-4 w-4" />
            )}
            Unfollow
          </Button>
        ) : (
          <Button
            onClick={handleFollow}
            disabled={isPending}
            className="w-full gap-2"
            size="sm"
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <UserPlus className="h-4 w-4" />
            )}
            Follow
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
