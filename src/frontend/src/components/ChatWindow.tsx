import { useState, useEffect, useRef } from 'react';
import { useGetProfile, useGetMessagesWithUser, useSendMessage, useUpdateLastOnline } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { Send, ArrowLeft, Loader2 } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { toast } from 'sonner';
import type { Principal } from '@dfinity/principal';
import { formatDistanceToNow } from 'date-fns';

interface ChatWindowProps {
  userId: Principal;
  onBack?: () => void;
}

export default function ChatWindow({ userId, onBack }: ChatWindowProps) {
  const { identity } = useInternetIdentity();
  const { data: profile } = useGetProfile(userId);
  const { data: messages, isLoading, refetch } = useGetMessagesWithUser(userId);
  const sendMessage = useSendMessage();
  const updateLastOnline = useUpdateLastOnline();
  const [messageText, setMessageText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Poll for new messages every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 3000);
    return () => clearInterval(interval);
  }, [refetch]);

  // Update last online timestamp every 30 seconds
  useEffect(() => {
    updateLastOnline.mutate();
    const interval = setInterval(() => {
      updateLastOnline.mutate();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!messageText.trim()) {
      return;
    }

    try {
      await sendMessage.mutateAsync({ receiver: userId, content: messageText.trim() });
      setMessageText('');
      // Refetch messages immediately after sending
      setTimeout(() => refetch(), 500);
    } catch (error: any) {
      toast.error(error.message || 'Failed to send message');
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

  const formatTimestamp = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return formatDistanceToNow(date, { addSuffix: true });
  };

  if (!profile) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const currentUserId = identity?.getPrincipal().toString();

  return (
    <div className="flex-1 flex flex-col">
      {/* Chat Header */}
      <div className="border-b border-border bg-card p-4 flex items-center gap-3">
        {onBack && (
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
        <Avatar>
          <AvatarImage src={profile.profilePicture.url} />
          <AvatarFallback>{getInitials(profile.username)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <p className="font-semibold">{profile.username}</p>
          {profile.status && (
            <p className="text-sm text-muted-foreground truncate">{profile.status}</p>
          )}
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : messages && messages.length > 0 ? (
          <div className="space-y-4">
            {messages.map((message) => {
              const isOwn = message.sender.toString() === currentUserId;
              return (
                <div
                  key={message.id.toString()}
                  className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[70%] ${isOwn ? 'order-2' : 'order-1'}`}>
                    <Card
                      className={`p-3 ${
                        isOwn
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      <p className={`whitespace-pre-wrap break-words ${
                        isOwn ? 'text-orange-500' : 'text-gray-600 dark:text-gray-300'
                      }`}>
                        {message.content}
                      </p>
                    </Card>
                    <p className={`text-xs text-muted-foreground mt-1 ${isOwn ? 'text-right' : 'text-left'}`}>
                      {formatTimestamp(message.timestamp)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">No messages yet. Start the conversation!</p>
          </div>
        )}
      </ScrollArea>

      {/* Message Input */}
      <form onSubmit={handleSend} className="border-t border-border bg-card p-4">
        <div className="flex gap-2">
          <Input
            placeholder="Type a message..."
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            disabled={sendMessage.isPending}
            className="flex-1"
          />
          <Button type="submit" disabled={sendMessage.isPending || !messageText.trim()}>
            {sendMessage.isPending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
