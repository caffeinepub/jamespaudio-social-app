import { useGetHomeFeed, useGetFriendSuggestions, useGetRecentStatuses } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import FeedItem from '../components/FeedItem';
import FriendSuggestionCard from '../components/FriendSuggestionCard';
import { Sparkles, Zap } from 'lucide-react';

export default function FeedPage() {
  const { data: feed, isLoading: feedLoading } = useGetHomeFeed();
  const { data: suggestions, isLoading: suggestionsLoading } = useGetFriendSuggestions();
  const { data: recentStatuses, isLoading: recentLoading } = useGetRecentStatuses(5);

  return (
    <div className="h-full">
      <ScrollArea className="h-full">
        <div className="container max-w-4xl mx-auto p-4 space-y-6">
          {/* What's Recent Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Zap className="h-5 w-5 text-orange-500" />
              <h2 className="text-2xl font-bold">What's Recent</h2>
            </div>
            {recentLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Card key={i}>
                    <CardContent className="py-3">
                      <Skeleton className="h-4 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : recentStatuses && recentStatuses.length > 0 ? (
              <div className="space-y-3">
                {recentStatuses.map((item, index) => (
                  <Card key={`${item.userId.toString()}-${index}`} className="border-orange-500/20 bg-orange-50/5">
                    <CardContent className="py-3">
                      <div className="flex items-start gap-3">
                        <div className="flex-1">
                          <p className="font-semibold text-sm">{item.username}</p>
                          {item.status && (
                            <p className="text-sm text-muted-foreground mt-1">{item.status}</p>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(Number(item.timestamp) / 1000000).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground text-sm">
                    No recent activity yet. Follow friends to see their updates!
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Your Feed Section */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Your Feed</h2>
            {feedLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i}>
                    <CardHeader>
                      <Skeleton className="h-4 w-32" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-4 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : feed && feed.length > 0 ? (
              <div className="space-y-4">
                {feed.map((item, index) => (
                  <FeedItem key={`${item.userId.toString()}-${index}`} item={item} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">
                    No updates yet. Follow some friends to see their status updates here!
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Friend Suggestions Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-bold">Friend Suggestions</h2>
            </div>
            {suggestionsLoading ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {[1, 2, 3, 4].map((i) => (
                  <Card key={i}>
                    <CardHeader>
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <Skeleton className="h-4 w-24" />
                    </CardHeader>
                  </Card>
                ))}
              </div>
            ) : suggestions && suggestions.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {suggestions.slice(0, 6).map((user) => (
                  <FriendSuggestionCard key={user.userId.toString()} user={user} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">No suggestions available at the moment.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
