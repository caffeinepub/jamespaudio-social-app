import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Search, Star } from "lucide-react";
import { useState } from "react";
import UserCard from "../components/UserCard";
import { useSearchProfiles } from "../hooks/useQueries";

interface DemoApp {
  name: string;
  category: string;
  description: string;
  rating: number;
}

const DEMO_APPS: DemoApp[] = [
  {
    name: "JAMESPaudio Music",
    category: "Music",
    description: "Stream and share music with your groups",
    rating: 4.8,
  },
  {
    name: "JAMESPaudio Radio",
    category: "Radio",
    description: "Live radio stations from around the world",
    rating: 4.6,
  },
  {
    name: "JAMESPaudio Math Solver",
    category: "Education",
    description: "Solve any math problem with AI step-by-step",
    rating: 4.9,
  },
  {
    name: "Group Messenger",
    category: "Social",
    description: "Instant messaging with text effects & media",
    rating: 4.7,
  },
  {
    name: "AI Song Maker",
    category: "AI Tools",
    description: "Generate original songs with AI in seconds",
    rating: 4.5,
  },
  {
    name: "Live TV Stream",
    category: "Video",
    description: "Watch live TV channels and events",
    rating: 4.4,
  },
  {
    name: "Daily Rewards",
    category: "Games",
    description: "Earn JAMESPaudio Shines with daily login rewards",
    rating: 4.8,
  },
  {
    name: "Video Gallery",
    category: "Video",
    description: "Browse and share video content with your network",
    rating: 4.3,
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  Music: "bg-orange-500/10 text-orange-500 border-orange-500/30",
  Radio: "bg-blue-500/10 text-blue-500 border-blue-500/30",
  Education: "bg-green-500/10 text-green-500 border-green-500/30",
  Social: "bg-purple-500/10 text-purple-500 border-purple-500/30",
  "AI Tools": "bg-indigo-500/10 text-indigo-500 border-indigo-500/30",
  Video: "bg-red-500/10 text-red-500 border-red-500/30",
  Games: "bg-yellow-500/10 text-yellow-600 border-yellow-500/30",
};

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [appSearch, setAppSearch] = useState("");
  const { data: results = [], isLoading } = useSearchProfiles(searchTerm);

  const filteredApps = DEMO_APPS.filter(
    (a) =>
      appSearch.trim() === "" ||
      a.name.toLowerCase().includes(appSearch.toLowerCase()) ||
      a.category.toLowerCase().includes(appSearch.toLowerCase()) ||
      a.description.toLowerCase().includes(appSearch.toLowerCase()),
  );

  return (
    <div className="h-full flex flex-col">
      <div className="relative h-48 bg-gradient-to-br from-purple-600 via-pink-600 to-orange-600 overflow-hidden">
        <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <Search className="h-10 w-10" />
              Search
            </h1>
            <p className="text-white/90">Find people and explore apps</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="container mx-auto px-4 py-6">
            <div className="max-w-4xl mx-auto">
              <Tabs defaultValue="people">
                <TabsList className="mb-6">
                  <TabsTrigger value="people" data-ocid="search.tab">
                    People
                  </TabsTrigger>
                  <TabsTrigger
                    value="apps"
                    className="flex items-center gap-1.5"
                    data-ocid="search.tab"
                  >
                    App Search
                    <span className="text-[10px] font-bold bg-yellow-400 text-yellow-900 rounded-full px-1.5 py-0.5 leading-none">
                      NEW
                    </span>
                  </TabsTrigger>
                </TabsList>

                {/* People Tab */}
                <TabsContent value="people" className="space-y-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                          placeholder="Search for users..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                          data-ocid="search.search_input"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : results.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {results.map((user) => (
                        <UserCard key={user.userId.toString()} user={user} />
                      ))}
                    </div>
                  ) : searchTerm.trim() ? (
                    <Card>
                      <CardContent
                        className="py-12 text-center"
                        data-ocid="search.empty_state"
                      >
                        <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-lg font-semibold mb-2">
                          No results found
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Try searching with a different term
                        </p>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card>
                      <CardContent
                        className="py-12 text-center"
                        data-ocid="search.empty_state"
                      >
                        <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-lg font-semibold mb-2">
                          Start searching
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Enter a username to find people
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                {/* App Search Tab */}
                <TabsContent value="apps" className="space-y-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                          placeholder="Search apps by name or category..."
                          value={appSearch}
                          onChange={(e) => setAppSearch(e.target.value)}
                          className="pl-10"
                          data-ocid="search.search_input"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {filteredApps.length === 0 ? (
                    <Card>
                      <CardContent
                        className="py-12 text-center"
                        data-ocid="search.empty_state"
                      >
                        <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-lg font-semibold">No apps found</p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filteredApps.map((app, i) => (
                        <Card
                          key={app.name}
                          className="hover:border-primary/50 transition-colors"
                          data-ocid={`search.item.${i + 1}`}
                        >
                          <CardContent className="p-4 flex items-start gap-3">
                            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <span className="text-2xl">
                                {app.category === "Music"
                                  ? "🎵"
                                  : app.category === "Radio"
                                    ? "📻"
                                    : app.category === "Education"
                                      ? "📐"
                                      : app.category === "Social"
                                        ? "💬"
                                        : app.category === "AI Tools"
                                          ? "🤖"
                                          : app.category === "Video"
                                            ? "🎬"
                                            : "🎮"}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="font-semibold truncate">
                                  {app.name}
                                </h3>
                                <Badge
                                  variant="outline"
                                  className={`text-xs ${CATEGORY_COLORS[app.category] ?? ""}`}
                                >
                                  {app.category}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mt-0.5">
                                {app.description}
                              </p>
                              <div className="flex items-center gap-1 mt-1">
                                <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                                <span className="text-xs font-medium">
                                  {app.rating}
                                </span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
