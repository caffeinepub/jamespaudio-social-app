import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useFollowUser } from '../hooks/useQueries';
import { UserPlus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import type { SearchResult } from '../backend';

interface FriendSuggestionCardProps {
  user: SearchResult;
}

export default function FriendSuggestionCard({ user }: FriendSuggestionCardProps) {
  const followUser = useFollowUser();

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

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4 space-y-0">
        <Avatar>
          <AvatarImage src={user.profilePicture.url} />
          <AvatarFallback>{getInitials(user.username)}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="font-semibold truncate">{user.username}</p>
          <p className="text-sm text-muted-foreground">
            {Number(user.followerCount)} followers
          </p>
        </div>
      </CardHeader>
      {user.bio && (
        <CardContent className="pt-0">
          <p className="text-sm text-muted-foreground line-clamp-2">{user.bio}</p>
        </CardContent>
      )}
      <CardContent className="pt-2">
        <Button
          onClick={handleFollow}
          disabled={followUser.isPending}
          className="w-full gap-2"
          size="sm"
        >
          {followUser.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <UserPlus className="h-4 w-4" />
          )}
          Follow
        </Button>
      </CardContent>
    </Card>
  );
}
