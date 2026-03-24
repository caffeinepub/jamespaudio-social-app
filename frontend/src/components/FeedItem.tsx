import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useGetProfile } from '../hooks/useQueries';
import type { FeedItem as FeedItemType } from '../types/temporary';
import { formatDistanceToNow } from 'date-fns';

interface FeedItemProps {
  item: FeedItemType;
}

export default function FeedItem({ item }: FeedItemProps) {
  const { data: profile } = useGetProfile(item.userId);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatTimestamp = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return formatDistanceToNow(date, { addSuffix: true });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4 space-y-0">
        <Avatar>
          <AvatarImage src={profile?.profilePicture.url} />
          <AvatarFallback>{getInitials(item.username)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <p className="font-semibold">{item.username}</p>
          <p className="text-sm text-muted-foreground">{formatTimestamp(item.timestamp)}</p>
        </div>
      </CardHeader>
      {item.status && (
        <CardContent>
          <p className="whitespace-pre-wrap">{item.status}</p>
        </CardContent>
      )}
    </Card>
  );
}
