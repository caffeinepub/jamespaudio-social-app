import { useGetProfile, useGetLastOnline } from '../hooks/useQueries';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Principal } from '@dfinity/principal';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface ChatListProps {
  userIds: string[];
  selectedUserId: Principal | null;
  onSelectUser: (userId: Principal) => void;
}

export default function ChatList({ userIds, selectedUserId, onSelectUser }: ChatListProps) {
  if (userIds.length === 0) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        <p>No chats yet</p>
        <p className="text-sm mt-1">Follow users to start chatting</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-border">
      {userIds.map((userId) => (
        <ChatListItem
          key={userId}
          userId={Principal.fromText(userId)}
          isSelected={selectedUserId?.toString() === userId}
          onSelect={onSelectUser}
        />
      ))}
    </div>
  );
}

function ChatListItem({
  userId,
  isSelected,
  onSelect,
}: {
  userId: Principal;
  isSelected: boolean;
  onSelect: (userId: Principal) => void;
}) {
  const { data: profile } = useGetProfile(userId);
  const { data: lastOnline } = useGetLastOnline(userId);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatLastOnline = (timestamp: bigint) => {
    if (!timestamp || timestamp === 0n) return 'Never';
    const date = new Date(Number(timestamp) / 1000000);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / 60000);
    
    if (diffMinutes < 5) return 'Active now';
    return formatDistanceToNow(date, { addSuffix: true });
  };

  if (!profile) {
    return null;
  }

  return (
    <Button
      variant="ghost"
      className={cn(
        'w-full justify-start gap-3 h-auto py-3 px-4 rounded-none',
        isSelected && 'bg-accent'
      )}
      onClick={() => onSelect(userId)}
    >
      <Avatar>
        <AvatarImage src={profile.profilePicture.url} />
        <AvatarFallback>{getInitials(profile.username)}</AvatarFallback>
      </Avatar>
      <div className="flex-1 text-left min-w-0">
        <p className="font-semibold truncate">{profile.username}</p>
        <p className="text-xs text-muted-foreground truncate">
          {lastOnline ? formatLastOnline(lastOnline) : 'Loading...'}
        </p>
      </div>
    </Button>
  );
}
