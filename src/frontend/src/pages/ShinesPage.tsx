import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Heart, Music, Sparkles, Star, Trophy, Users, Zap } from "lucide-react";

const shines = [
  {
    id: 1,
    title: "Top Group Chats",
    description:
      "The most active groups are lighting up the platform right now.",
    icon: Users,
    color: "text-blue-400",
    bg: "bg-blue-500/10 border-blue-500/30",
    badge: "Trending",
    badgeColor: "bg-blue-600",
  },
  {
    id: 2,
    title: "Music Spotlight",
    description:
      "Discover the hottest tracks being played across JAMESPaudio today.",
    icon: Music,
    color: "text-purple-400",
    bg: "bg-purple-500/10 border-purple-500/30",
    badge: "Hot",
    badgeColor: "bg-purple-600",
  },
  {
    id: 3,
    title: "AI Creator Picks",
    description: "AI-generated songs getting the most love from the community.",
    icon: Sparkles,
    color: "text-yellow-400",
    bg: "bg-yellow-500/10 border-yellow-500/30",
    badge: "Featured",
    badgeColor: "bg-yellow-600",
  },
  {
    id: 4,
    title: "Community Champions",
    description: "Members who are shining the brightest this week.",
    icon: Trophy,
    color: "text-orange-400",
    bg: "bg-orange-500/10 border-orange-500/30",
    badge: "Weekly",
    badgeColor: "bg-orange-600",
  },
  {
    id: 5,
    title: "Most Loved Content",
    description:
      "The content that the community can't stop sharing and enjoying.",
    icon: Heart,
    color: "text-pink-400",
    bg: "bg-pink-500/10 border-pink-500/30",
    badge: "Popular",
    badgeColor: "bg-pink-600",
  },
  {
    id: 6,
    title: "Rising Stars",
    description: "New members making a big splash on JAMESPaudio this week.",
    icon: Zap,
    color: "text-cyan-400",
    bg: "bg-cyan-500/10 border-cyan-500/30",
    badge: "New",
    badgeColor: "bg-cyan-600",
  },
];

export default function ShinesPage() {
  return (
    <ScrollArea className="h-full">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500">
            <Star className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">JAMESPaudio Shines ✨</h1>
            <p className="text-muted-foreground">
              Spotlight on what's glowing across the platform
            </p>
          </div>
        </div>

        {/* Shines Hero Banner */}
        <div className="rounded-2xl bg-gradient-to-br from-yellow-500/20 via-orange-500/15 to-pink-500/10 border border-yellow-500/30 p-6 text-center space-y-2">
          <div className="text-4xl">✨🌟💫</div>
          <h2 className="text-2xl font-bold">What's Shining Today</h2>
          <p className="text-muted-foreground max-w-lg mx-auto text-sm">
            Every day, JAMESPaudio highlights the best groups, music, creators,
            and moments across the platform. This is your spotlight.
          </p>
        </div>

        {/* Shines Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {shines.map((shine) => {
            const Icon = shine.icon;
            return (
              <Card
                key={shine.id}
                className={`border ${shine.bg} transition-all hover:scale-[1.01]`}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className={`h-5 w-5 ${shine.color}`} />
                      <span className="text-base">{shine.title}</span>
                    </div>
                    <Badge className={`${shine.badgeColor} text-white text-xs`}>
                      {shine.badge}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {shine.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Coming Soon note */}
        <Card className="border-dashed border-muted">
          <CardContent className="py-8 text-center space-y-2">
            <Sparkles className="h-8 w-8 mx-auto text-yellow-500 opacity-60" />
            <p className="font-semibold text-muted-foreground">
              More Shines Coming Soon
            </p>
            <p className="text-sm text-muted-foreground">
              Live leaderboards, featured group spotlights, and creator rankings
              are on the way.
            </p>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
}
