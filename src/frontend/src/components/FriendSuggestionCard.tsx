import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { useFollowUser } from "../hooks/useQueries";
import type { SearchResult } from "../hooks/useQueries";

interface FriendSuggestionCardProps {
  user: SearchResult;
}

export default function FriendSuggestionCard({
  user,
}: FriendSuggestionCardProps) {
  const followUser = useFollowUser();

  const handleFollow = async () => {
    try {
      await followUser.mutateAsync(user.userId);
      toast.success(`You are now following ${user.username}`);
    } catch (error: any) {
      toast.error(error.message || "Failed to follow user");
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={user.profilePicture.url} />
            <AvatarFallback>{getInitials(user.username)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-semibold truncate">{user.username}</p>
            <p className="text-sm text-muted-foreground truncate">{user.bio}</p>
          </div>
          <Button
            size="sm"
            onClick={handleFollow}
            disabled={followUser.isPending}
          >
            {followUser.isPending ? "Following..." : "Follow"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
