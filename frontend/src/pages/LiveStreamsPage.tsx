import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Wifi, WifiOff, Eye, Play, Users, Radio } from 'lucide-react';
import { useGetLiveStreams, useCreateLiveStream, useStopLiveStream } from '../hooks/useQueries';
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

export default function LiveStreamsPage() {
  const { data: liveStreams, isLoading } = useGetLiveStreams();
  const createStreamMutation = useCreateLiveStream();
  const stopStreamMutation = useStopLiveStream();
  const { identity } = useInternetIdentity();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [newStream, setNewStream] = useState({
    title: '',
    description: '',
    streamURL: '',
    thumbnailImage: '/assets/generated/live-stream-icon-transparent.dim_64x64.png',
  });

  const handleCreateStream = () => {
    if (!newStream.title || !newStream.streamURL) return;

    createStreamMutation.mutate(
      {
        title: newStream.title,
        description: newStream.description,
        streamURL: newStream.streamURL,
        thumbnailImage: newStream.thumbnailImage,
      },
      {
        onSuccess: () => {
          setNewStream({
            title: '',
            description: '',
            streamURL: '',
            thumbnailImage: '/assets/generated/live-stream-icon-transparent.dim_64x64.png',
          });
          setIsDialogOpen(false);
        },
      }
    );
  };

  const handleStopStream = (streamId: bigint) => {
    stopStreamMutation.mutate(streamId);
  };

  const isStreamOwner = (creatorId: string) => {
    return identity?.getPrincipal().toString() === creatorId;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading live streams...</p>
        </div>
      </div>
    );
  }

  const liveStreamsList = liveStreams?.filter((s) => s.isLive) || [];
  const scheduledStreamsList = liveStreams?.filter((s) => !s.isLive) || [];

  return (
    <ScrollArea className="h-full">
      <div className="container max-w-6xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Wifi className="h-8 w-8 text-red-500 animate-pulse" />
              Live Streams
            </h1>
            <p className="text-muted-foreground mt-1">
              Watch live broadcasts from creators around the platform
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-red-500 hover:bg-red-600">
                <Radio className="h-4 w-4 mr-2" />
                Start Streaming
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Live Stream</DialogTitle>
                <DialogDescription>
                  Set up your live stream and start broadcasting to your followers
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Stream Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter stream title..."
                    value={newStream.title}
                    onChange={(e) => setNewStream({ ...newStream, title: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your stream..."
                    value={newStream.description}
                    onChange={(e) => setNewStream({ ...newStream, description: e.target.value })}
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="streamURL">Stream URL (Simulated)</Label>
                  <Input
                    id="streamURL"
                    placeholder="https://example.com/stream"
                    value={newStream.streamURL}
                    onChange={(e) => setNewStream({ ...newStream, streamURL: e.target.value })}
                  />
                </div>
                <Button
                  onClick={handleCreateStream}
                  disabled={createStreamMutation.isPending || !newStream.title || !newStream.streamURL}
                  className="w-full bg-red-500 hover:bg-red-600"
                >
                  {createStreamMutation.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Wifi className="h-4 w-4 mr-2" />
                      Go Live
                    </>
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Live Now Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 bg-red-500 rounded-full animate-pulse"></div>
            <h2 className="text-2xl font-bold">Live Now</h2>
            <Badge variant="destructive" className="ml-2">
              {liveStreamsList.length}
            </Badge>
          </div>

          {liveStreamsList.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {liveStreamsList.map((stream) => (
                <Card key={Number(stream.id)} className="overflow-hidden hover:shadow-lg transition-shadow border-red-500/30">
                  <div className="relative aspect-video bg-muted">
                    <img
                      src={stream.thumbnailImage}
                      alt={stream.title}
                      className="w-full h-full object-cover"
                    />
                    <Badge className="absolute top-2 left-2 bg-red-500 text-white">
                      <Wifi className="h-3 w-3 mr-1" />
                      LIVE
                    </Badge>
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {Number(stream.viewerCount)}
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg line-clamp-1">{stream.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{stream.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Button variant="outline" size="sm" className="flex-1 mr-2">
                        <Play className="h-4 w-4 mr-2" />
                        Watch
                      </Button>
                      {isStreamOwner(stream.creatorId.toString()) && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleStopStream(stream.id)}
                          disabled={stopStreamMutation.isPending}
                        >
                          <WifiOff className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <WifiOff className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No live streams at the moment</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Be the first to go live and share your content!
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Scheduled Streams */}
        {scheduledStreamsList.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Users className="h-6 w-6" />
              Scheduled Streams
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {scheduledStreamsList.map((stream) => (
                <Card key={Number(stream.id)} className="opacity-75">
                  <CardHeader>
                    <CardTitle className="text-lg">{stream.title}</CardTitle>
                    <CardDescription>{stream.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Badge variant="outline">Scheduled</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center py-8 text-sm text-muted-foreground">
          <p>© 2025. Built with love using <a href="https://caffeine.ai" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">caffeine.ai</a></p>
        </div>
      </div>
    </ScrollArea>
  );
}
