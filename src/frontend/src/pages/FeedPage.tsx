import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Info, Users, Zap } from "lucide-react";
import FeedItem from "../components/FeedItem";
import { useGetHomeFeed, useGetRecentStatuses } from "../hooks/useQueries";

interface FeedPageProps {
  onNavigate?: (page: string) => void;
}

export default function FeedPage({ onNavigate }: FeedPageProps) {
  const { data: feed, isLoading: feedLoading } = useGetHomeFeed();
  const { data: recentStatuses, isLoading: recentLoading } =
    useGetRecentStatuses(5);

  return (
    <div className="h-full">
      <ScrollArea className="h-full">
        <div className="container max-w-4xl mx-auto p-4 space-y-6">
          {/* Access Update Announcement Banner */}
          <div className="rounded-xl border-2 border-orange-500 bg-orange-500/10 p-4 flex gap-3 items-start">
            <Info className="h-5 w-5 text-orange-400 mt-0.5 shrink-0" />
            <div>
              <p className="font-bold text-orange-400 text-sm uppercase tracking-wide mb-1">
                Page Update
              </p>
              <p className="text-sm font-semibold">
                We updated this page — you no longer have access to Friends. You
                now have access to{" "}
                <span className="text-orange-400">Groups only</span>.
              </p>
            </div>
          </div>

          {/* Groups CTA */}
          <Card className="border border-blue-500/30 bg-blue-500/5">
            <CardContent className="py-5 flex flex-col sm:flex-row items-center gap-4">
              <Users className="h-10 w-10 text-blue-400 shrink-0" />
              <div className="flex-1 text-center sm:text-left">
                <p className="font-bold text-lg">Connect via Groups</p>
                <p className="text-sm text-muted-foreground">
                  Friends have been replaced with Groups. Join or create a group
                  to chat and connect.
                </p>
              </div>
              {onNavigate && (
                <Button
                  onClick={() => onNavigate("groups")}
                  className="bg-blue-600 hover:bg-blue-700 text-white shrink-0"
                >
                  Go to Groups
                </Button>
              )}
            </CardContent>
          </Card>

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
                  <Card
                    key={`${item.userId.toString()}-${index}`}
                    className="border-orange-500/20 bg-orange-50/5"
                  >
                    <CardContent className="py-3">
                      <div className="flex items-start gap-3">
                        <div className="flex-1">
                          <p className="font-semibold text-sm">
                            {item.username}
                          </p>
                          {item.status && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {item.status}
                            </p>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(
                            Number(item.timestamp) / 1000000,
                          ).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
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
                    No recent activity yet. Join a group and start chatting!
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
                  <FeedItem
                    key={`${item.userId.toString()}-${index}`}
                    item={item}
                  />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">
                    No updates yet. Join a group to see activity here!
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
