import { useState, useEffect, useRef } from 'react';
import { useGetProfile, useGetMessagesWithUser, useUpdateLastOnline } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { Send, ArrowLeft, Loader2, Palette, Sparkles } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { toast } from 'sonner';
import type { Principal } from '@dfinity/principal';
import { formatDistanceToNow } from 'date-fns';
import { useActor } from '../hooks/useActor';
import { MessageColor, MessageEffect } from '../backend';
import { cycleMessageColor, getColorLabel, getColorClasses, getEffectLabel, renderEffectDecoration, normalizeColor, normalizeEffect } from '../utils/messageStyle';

interface ChatWindowProps {
  userId: Principal;
  onBack?: () => void;
}

export default function ChatWindow({ userId, onBack }: ChatWindowProps) {
  const { identity } = useInternetIdentity();
  const { actor } = useActor();
  const { data: profile } = useGetProfile(userId);
  const { data: messages = [], isLoading, refetch } = useGetMessagesWithUser(userId);
  const updateLastOnline = useUpdateLastOnline();
  const [messageText, setMessageText] = useState('');
  const [messageColor, setMessageColor] = useState<MessageColor>(MessageColor.normal);
  const [messageEffect, setMessageEffect] = useState<MessageEffect>(MessageEffect.none);
  const [sendButtonStyle, setSendButtonStyle] = useState<'normal' | 'emoji'>('normal');
  const [isSending, setIsSending] = useState(false);
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
    
    if (!messageText.trim() || !actor) {
      return;
    }

    setIsSending(true);
    try {
      // Note: DM functionality not yet implemented in backend
      toast.info('Direct messaging coming soon!');
      setMessageText('');
      // Reset to normal after sending
      setMessageColor(MessageColor.normal);
      setMessageEffect(MessageEffect.none);
    } catch (error: any) {
      toast.error(error.message || 'Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  const handleColorCycle = () => {
    setMessageColor(cycleMessageColor(messageColor));
  };

  const handleEffectCycle = () => {
    const effects = [MessageEffect.none, MessageEffect.skull, MessageEffect.fiery, MessageEffect.devil];
    const currentIndex = effects.indexOf(messageEffect);
    const nextIndex = (currentIndex + 1) % effects.length;
    setMessageEffect(effects[nextIndex]);
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
              const msgColor = normalizeColor(message.color);
              const msgEffect = normalizeEffect(message.effect);
              const effectDecoration = renderEffectDecoration(msgEffect);
              
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
                      <p className={`whitespace-pre-wrap break-words ${getColorClasses(msgColor, isOwn)}`}>
                        {effectDecoration && <span className="mr-1">{effectDecoration}</span>}
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
        <div className="flex gap-2 mb-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleColorCycle}
            title="Cycle text color"
          >
            <Palette className="h-4 w-4 mr-1" />
            {getColorLabel(messageColor)}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleEffectCycle}
            title="Cycle text effect"
          >
            <Sparkles className="h-4 w-4 mr-1" />
            {getEffectLabel(messageEffect)}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setSendButtonStyle(sendButtonStyle === 'normal' ? 'emoji' : 'normal')}
            title="Toggle send button style"
          >
            {sendButtonStyle === 'emoji' ? '☠️' : 'Normal'}
          </Button>
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="Type a message..."
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            disabled={isSending}
            className="flex-1"
          />
          <Button type="submit" disabled={isSending || !messageText.trim()}>
            {isSending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : sendButtonStyle === 'emoji' ? (
              <span className="text-lg">☠️</span>
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
