import { Palette, Music, Video, Film, Radio } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function CreatorStudioPage() {
  return (
    <div className="h-full flex flex-col">
      <div className="relative h-48 bg-gradient-to-br from-creator-primary via-creator-secondary to-creator-accent overflow-hidden">
        <img src="/assets/generated/creator-studio-workspace.dim_800x600.png" alt="Creator Studio" className="absolute inset-0 w-full h-full object-cover opacity-20" />
        <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <Palette className="h-10 w-10" />
              Creator Studio
            </h1>
            <p className="text-white/90">Manage all your creative content in one place</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="container mx-auto px-4 py-6">
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="music">Music</TabsTrigger>
                <TabsTrigger value="videos">Videos</TabsTrigger>
                <TabsTrigger value="movies">Movies</TabsTrigger>
                <TabsTrigger value="radio">Radio</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Tracks</CardTitle>
                      <Music className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">0</div>
                      <p className="text-xs text-muted-foreground">Music uploads</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Videos</CardTitle>
                      <Video className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">0</div>
                      <p className="text-xs text-muted-foreground">Video uploads</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Movies</CardTitle>
                      <Film className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">0</div>
                      <p className="text-xs text-muted-foreground">Movie uploads</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Radio Stations</CardTitle>
                      <Radio className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">0</div>
                      <p className="text-xs text-muted-foreground">Active stations</p>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Welcome to Creator Studio</CardTitle>
                    <CardDescription>Your central hub for managing all creative content</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Use the tabs above to manage your music tracks, videos, movies, and radio content. 
                      Upload new content, track engagement, and organize your creative portfolio all in one place.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="music">
                <Card>
                  <CardHeader>
                    <CardTitle>Music Management</CardTitle>
                    <CardDescription>Manage your music tracks and albums</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Your music tracks will appear here. Visit the Music page to upload new tracks.</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="videos">
                <Card>
                  <CardHeader>
                    <CardTitle>Video Management</CardTitle>
                    <CardDescription>Manage your video content</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Your videos will appear here. Visit the Videos page to upload new content.</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="movies">
                <Card>
                  <CardHeader>
                    <CardTitle>Movie Management</CardTitle>
                    <CardDescription>Manage your movie collection</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Your movies will appear here. Visit the Movies page to upload new content.</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="radio">
                <Card>
                  <CardHeader>
                    <CardTitle>Radio Management</CardTitle>
                    <CardDescription>Manage your radio stations and streams</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Your radio stations will appear here. Visit the Radio page to manage stations.</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
