import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Send, Paperclip, Mic, Video, Smile, UserPlus } from 'lucide-react';
import { useGetGroupMessages, useSendGroupMessage, useGetProfile } from '../../hooks/useQueries';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { toast } from 'sonner';
import type { GroupId, MediaAttachment } from '../../backend';
import { Principal } from '@dfinity/principal';
import AddGroupMembersDialog from './AddGroupMembersDialog';

interface GroupConversationProps {
  groupId: GroupId;
  groupName: string;
  memberIds: string[];
}

export default function GroupConversation({ groupId, groupName, memberIds }: GroupConversationProps) {
  const { identity } = useInternetIdentity();
  const [messageText, setMessageText] = useState('');
  const [mediaAttachment, setMediaAttachment] = useState<MediaAttachment | null>(null);
  const [isAddMembersOpen, setIsAddMembersOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: messages, isLoading, refetch } = useGetGroupMessages(groupId);
  const sendMessage = useSendGroupMessage();

  const currentUserId = identity?.getPrincipal();

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Refresh messages periodically
  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 5000);
    return () => clearInterval(interval);
  }, [refetch]);

  const handleSendMessage = async () => {
    if (!messageText.trim() && !mediaAttachment) {
      toast.error('Please enter a message or attach media');
      return;
    }

    try {
      await sendMessage.mutateAsync({
        groupId,
        content: messageText,
        mediaAttachment,
      });
      setMessageText('');
      setMediaAttachment(null);
      toast.success('Message sent!');
    } catch (error: any) {
      console.error('Error sending message:', error);
      if (error.message?.includes('Unauthorized') || error.message?.includes('members')) {
        toast.error('You must be a group member to send messages');
      } else {
        toast.error('Failed to send message. Please try again.');
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleAttachVideo = () => {
    // Placeholder for video attachment
    toast.info('Video attachment feature coming soon!');
  };

  const handleAddEmoji = () => {
    // Simple emoji insertion
    setMessageText(prev => prev + '😊');
  };

  const formatTimestamp = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-full">
      <Card className="flex-1 flex flex-col">
        <CardHeader className="border-b">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span>{groupName}</span>
              <Badge variant="outline">{messages?.length || 0} messages</Badge>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAddMembersOpen(true)}
              className="gap-2"
            >
              <UserPlus className="h-4 w-4" />
              Add People
            </Button>
          </CardTitle>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0">
          {/* Messages Area */}
          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-sm text-muted-foreground">Loading messages...</p>
              </div>
            ) : messages && messages.length > 0 ? (
              <div className="space-y-4">
                {messages.map((message) => {
                  const isOwnMessage = currentUserId?.toString() === message.sender.toString();
                  
                  return (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}
                    >
                      <Avatar className="h-8 w-8 flex-shrink-0">
                        <AvatarFallback>
                          {message.sender.toString().substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className={`flex-1 ${isOwnMessage ? 'text-right' : 'text-left'}`}>
                        <div
                          className={`inline-block max-w-[70%] rounded-lg p-3 ${
                            isOwnMessage
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          }`}
                        >
                          <p className="text-sm break-words">{message.content}</p>
                          
                          {message.mediaAttachment && (
                            <div className="mt-2">
                              {message.mediaAttachment.mediaType === 'video' && (
                                <video
                                  src={message.mediaAttachment.url}
                                  controls
                                  className="max-w-full rounded"
                                  style={{ maxHeight: '200px' }}
                                />
                              )}
                              {message.mediaAttachment.mediaType === 'image' && (
                                <img
                                  src={message.mediaAttachment.url}
                                  alt="Attachment"
                                  className="max-w-full rounded"
                                  style={{ maxHeight: '200px' }}
                                />
                              )}
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatTimestamp(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No messages yet</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Be the first to send a message in this group!
                </p>
              </div>
            )}
          </ScrollArea>

          {/* Voice Chat Section (Coming Soon) */}
          <div className="border-t border-b bg-muted/30 p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mic className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm font-medium">Voice Chat</span>
                <Badge variant="secondary" className="text-xs">Not Available</Badge>
              </div>
              <p className="text-xs text-muted-foreground">Coming soon</p>
            </div>
          </div>

          {/* Message Input */}
          <div className="p-4 border-t">
            {mediaAttachment && (
              <div className="mb-2 p-2 bg-muted rounded flex items-center justify-between">
                <span className="text-sm">Media attached</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setMediaAttachment(null)}
                >
                  Remove
                </Button>
              </div>
            )}
            
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleAttachVideo}
                title="Attach video"
              >
                <Video className="h-5 w-5" />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={handleAddEmoji}
                title="Add emoji"
              >
                <Smile className="h-5 w-5" />
              </Button>
              
              <Input
                placeholder="Type a message... (emoji supported 😊)"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
              
              <Button
                onClick={handleSendMessage}
                disabled={(!messageText.trim() && !mediaAttachment) || sendMessage.isPending}
              >
                {sendMessage.isPending ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <AddGroupMembersDialog
        open={isAddMembersOpen}
        onOpenChange={setIsAddMembersOpen}
        groupId={groupId}
        existingMemberIds={memberIds}
        onMemberAdded={() => {
          // Keep the conversation open and refresh
          refetch();
        }}
      />
    </div>
  );
}
