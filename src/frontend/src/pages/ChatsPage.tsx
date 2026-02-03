import { useState } from 'react';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import ChatList from '../components/ChatList';
import ChatWindow from '../components/ChatWindow';
import type { Principal } from '@dfinity/principal';

export default function ChatsPage() {
  const { data: userProfile } = useGetCallerUserProfile();
  const [selectedUserId, setSelectedUserId] = useState<Principal | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Get list of users to chat with (following + followers)
  const chatUsers = userProfile
    ? Array.from(
        new Set([
          ...userProfile.following.map((p) => p.toString()),
          ...userProfile.followers.map((p) => p.toString()),
        ])
      )
    : [];

  const filteredUsers = chatUsers.filter((userId) =>
    userId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex">
      {/* Chat List Sidebar */}
      <div className="w-full sm:w-80 border-r border-border flex flex-col">
        <div className="p-4 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        <ScrollArea className="flex-1">
          <ChatList
            userIds={filteredUsers}
            selectedUserId={selectedUserId}
            onSelectUser={setSelectedUserId}
          />
        </ScrollArea>
      </div>

      {/* Chat Window */}
      <div className="flex-1 hidden sm:flex">
        {selectedUserId ? (
          <ChatWindow userId={selectedUserId} />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">Select a chat to start messaging</p>
            </Card>
          </div>
        )}
      </div>

      {/* Mobile Chat Window */}
      {selectedUserId && (
        <div className="fixed inset-0 bg-background z-50 sm:hidden">
          <ChatWindow userId={selectedUserId} onBack={() => setSelectedUserId(null)} />
        </div>
      )}
    </div>
  );
}
