import { useState } from 'react';
import { Tv, Play, Pause } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface TVChannel {
  id: string;
  name: string;
  category: 'entertainment' | 'news' | 'music';
  description: string;
  thumbnail: string;
}

export default function LiveTVPage() {
  const [selectedChannel, setSelectedChannel] = useState<TVChannel | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const channels: TVChannel[] = [
    {
      id: '1',
      name: 'Entertainment Plus',
      category: 'entertainment',
      description: 'Your favorite shows and series 24/7',
      thumbnail: '/assets/generated/live-tv-channels.dim_600x400.png',
    },
    {
      id: '2',
      name: 'Global News Network',
      category: 'news',
      description: 'Breaking news and current events',
      thumbnail: '/assets/generated/news-announcement.dim_300x300.png',
    },
    {
      id: '3',
      name: 'Music TV',
      category: 'music',
      description: 'Non-stop music videos and concerts',
      thumbnail: '/assets/generated/music-waveform-bg.dim_800x400.png',
    },
    {
      id: '4',
      name: 'Comedy Central',
      category: 'entertainment',
      description: 'Laugh all day with comedy shows',
      thumbnail: '/assets/generated/live-tv-channels.dim_600x400.png',
    },
    {
      id: '5',
      name: 'Sports Live',
      category: 'entertainment',
      description: 'Live sports events and highlights',
      thumbnail: '/assets/generated/live-tv-channels.dim_600x400.png',
    },
    {
      id: '6',
      name: 'Jazz & Blues',
      category: 'music',
      description: 'Smooth jazz and blues performances',
      thumbnail: '/assets/generated/vintage-radio-waves.dim_400x400.png',
    },
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'entertainment': return 'bg-purple-500/10 text-purple-500';
      case 'news': return 'bg-blue-500/10 text-blue-500';
      case 'music': return 'bg-pink-500/10 text-pink-500';
      default: return 'bg-gray-500/10 text-gray-500';
    }
  };

  const handleChannelSelect = (channel: TVChannel) => {
    setSelectedChannel(channel);
    setIsPlaying(true);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="relative h-48 bg-gradient-to-br from-purple-600 via-blue-600 to-pink-600 overflow-hidden">
        <img src="/assets/generated/live-tv-channels.dim_600x400.png" alt="Live TV" className="absolute inset-0 w-full h-full object-cover opacity-20" />
        <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <Tv className="h-10 w-10" />
              Live TV
            </h1>
            <p className="text-white/90">Watch simulated TV channels - Entertainment, News & Music</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="container mx-auto px-4 py-6 space-y-6">
            {/* Video Player */}
            {selectedChannel && (
              <Card className="overflow-hidden">
                <div className="relative aspect-video bg-black">
                  <img 
                    src={selectedChannel.thumbnail} 
                    alt={selectedChannel.name}
                    className="w-full h-full object-cover opacity-50"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Button
                      size="icon"
                      className="h-16 w-16 rounded-full"
                      onClick={() => setIsPlaying(!isPlaying)}
                    >
                      {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
                    </Button>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-black/70 backdrop-blur-sm rounded-lg p-3">
                      <h3 className="text-white font-semibold">{selectedChannel.name}</h3>
                      <p className="text-white/80 text-sm">{selectedChannel.description}</p>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Channel Grid */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">Available Channels</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {channels.map((channel) => (
                  <Card 
                    key={channel.id} 
                    className={`cursor-pointer hover:shadow-lg transition-all ${
                      selectedChannel?.id === channel.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => handleChannelSelect(channel)}
                  >
                    <CardHeader className="p-0">
                      <div className="relative aspect-video overflow-hidden rounded-t-lg">
                        <img 
                          src={channel.thumbnail} 
                          alt={channel.name}
                          className="w-full h-full object-cover"
                        />
                        <Badge className={`absolute top-2 right-2 ${getCategoryColor(channel.category)}`}>
                          {channel.category}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4">
                      <CardTitle className="text-lg mb-1">{channel.name}</CardTitle>
                      <CardDescription>{channel.description}</CardDescription>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
