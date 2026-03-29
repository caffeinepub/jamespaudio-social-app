import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Smile, UserPlus, Video } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { GroupId, MediaAttachment } from "../../backend";
import { MembershipTier, MessageColor, MessageEffect } from "../../backend";
import { useActor } from "../../hooks/useActor";
import { useInternetIdentity } from "../../hooks/useInternetIdentity";
import {
  useGetCallerMembershipTier,
  useGetGroupMessages,
} from "../../hooks/useQueries";
import {
  getColorClasses,
  normalizeColor,
  normalizeEffect,
  renderEffectDecoration,
} from "../../utils/messageStyle";
import AddGroupMembersDialog from "./AddGroupMembersDialog";
import GroupComposerStylePicker from "./GroupComposerStylePicker";

interface GroupConversationProps {
  groupId: GroupId;
  groupName: string;
  memberIds: string[];
}

export default function GroupConversation({
  groupId,
  groupName,
  memberIds,
}: GroupConversationProps) {
  const { identity } = useInternetIdentity();
  const { actor } = useActor();
  const [messageText, setMessageText] = useState("");
  const [mediaAttachment, setMediaAttachment] =
    useState<MediaAttachment | null>(null);
  const [isAddMembersOpen, setIsAddMembersOpen] = useState(false);
  const [messageColor, setMessageColor] = useState<MessageColor>(
    MessageColor.blue,
  );
  const [messageEffect, setMessageEffect] = useState<MessageEffect>(
    MessageEffect.none,
  );
  const [sendButtonStyle, setSendButtonStyle] = useState<"normal" | "emoji">(
    "normal",
  );
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: messages, isLoading, refetch } = useGetGroupMessages(groupId);
  const { data: userTier = MembershipTier.free } = useGetCallerMembershipTier();

  const currentUserId = identity?.getPrincipal();

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  });

  // Refresh messages periodically
  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 5000);
    return () => clearInterval(interval);
  }, [refetch]);

  const handleSendMessage = async () => {
    if ((!messageText.trim() && !mediaAttachment) || !actor) {
      toast.error("Please enter a message or attach media");
      return;
    }

    setIsSending(true);
    try {
      await actor.sendGroupMessage(
        groupId,
        messageText,
        mediaAttachment,
        messageColor,
        messageEffect,
      );
      setMessageText("");
      setMediaAttachment(null);
      setMessageColor(MessageColor.blue);
      setMessageEffect(MessageEffect.none);
      toast.success("Message sent!");
      setTimeout(() => refetch(), 500);
    } catch (error: unknown) {
      console.error("Error sending message:", error);
      const msg = (error as Error).message ?? "";
      if (msg.includes("Unauthorized") || msg.includes("members")) {
        toast.error("You must be a group member to send messages");
      } else if (msg.includes("membership tier")) {
        toast.error("Your membership tier does not allow this message styling");
      } else {
        toast.error("Failed to send message. Please try again.");
      }
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleAttachVideo = () => {
    toast.info("Video attachment feature coming soon!");
  };

  const handleAddEmoji = () => {
    setMessageText((prev) => `${prev}😊`);
  };

  const formatTimestamp = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
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
          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
                <p className="text-sm text-muted-foreground">
                  Loading messages...
                </p>
              </div>
            ) : messages && messages.length > 0 ? (
              <div className="space-y-4">
                {messages.map((message) => {
                  const isOwnMessage =
                    currentUserId?.toString() === message.sender.toString();
                  const msgColor = normalizeColor(message.color);
                  const msgEffect = normalizeEffect(message.effect);
                  const effectDecoration = renderEffectDecoration(msgEffect);

                  return (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${
                        isOwnMessage ? "flex-row-reverse" : "flex-row"
                      }`}
                    >
                      <Avatar className="h-8 w-8 flex-shrink-0">
                        <AvatarFallback>
                          {message.sender
                            .toString()
                            .substring(0, 2)
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>

                      <div
                        className={`flex-1 ${
                          isOwnMessage ? "text-right" : "text-left"
                        }`}
                      >
                        <div
                          className={`inline-block max-w-[70%] rounded-lg p-3 ${
                            isOwnMessage
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}
                        >
                          <p
                            className={`text-sm break-words ${getColorClasses(msgColor, isOwnMessage)}`}
                          >
                            {effectDecoration && (
                              <span className="mr-1">{effectDecoration}</span>
                            )}
                            {message.content}
                          </p>

                          {message.mediaAttachment && (
                            <div className="mt-2">
                              {message.mediaAttachment.mediaType ===
                                "video" && (
                                // biome-ignore lint/a11y/useMediaCaption: user-generated content
                                <video
                                  src={message.mediaAttachment.url}
                                  controls
                                  className="max-w-full rounded"
                                  style={{ maxHeight: "200px" }}
                                />
                              )}
                              {message.mediaAttachment.mediaType ===
                                "image" && (
                                <img
                                  src={message.mediaAttachment.url}
                                  alt="Attachment"
                                  className="max-w-full rounded"
                                  style={{ maxHeight: "200px" }}
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

          <div className="p-4 border-t bg-blue-50 dark:bg-blue-950/20">
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

            <div className="mb-3">
              <GroupComposerStylePicker
                currentColor={messageColor}
                currentEffect={messageEffect}
                userTier={userTier}
                onColorChange={setMessageColor}
                onEffectChange={setMessageEffect}
              />
            </div>

            <div className="flex gap-2 mb-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() =>
                  setSendButtonStyle(
                    sendButtonStyle === "normal" ? "emoji" : "normal",
                  )
                }
                title="Toggle send button style"
              >
                {sendButtonStyle === "emoji" ? "☠️" : "Normal"}
              </Button>
            </div>

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
                className="flex-1 bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700 focus-visible:ring-blue-500"
                disabled={isSending}
              />

              <Button
                onClick={handleSendMessage}
                disabled={
                  (!messageText.trim() && !mediaAttachment) || isSending
                }
              >
                {isSending ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                ) : sendButtonStyle === "emoji" ? (
                  <span className="text-lg">☠️</span>
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
          refetch();
        }}
      />
    </div>
  );
}
