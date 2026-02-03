import { useState } from 'react';
import { Radio, Play, Pause } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';

interface RadioStation {
  id: string;
  name: string;
  genre: string;
  description: string;
}

const stations: RadioStation[] = [
  { id: '1', name: 'Pop Hits Radio', genre: 'Pop', description: 'The latest pop hits 24/7' },
  { id: '2', name: 'Rock Classics', genre: 'Rock', description: 'Classic rock anthems' },
  { id: '3', name: 'Jazz Lounge', genre: 'Jazz', description: 'Smooth jazz for relaxation' },
  { id: '4', name: 'Electronic Beats', genre: 'Electronic', description: 'Electronic and EDM music' },
];

export default function RadioPage() {
  const [playingStation, setPlayingStation] = useState<string | null>(null);

  const togglePlay = (stationId: string) => {
    setPlayingStation(playingStation === stationId ? null : stationId);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="relative h-48 bg-gradient-to-br from-radio-primary via-radio-secondary to-radio-accent overflow-hidden">
        <img src="/assets/generated/vintage-radio-waves.dim_400x400.png" alt="Radio" className="absolute right-0 top-0 h-full opacity-20" />
        <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <Radio className="h-10 w-10" />
              Radio Stations
            </h1>
            <p className="text-white/90">Listen to your favorite radio stations</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="container mx-auto px-4 py-6 space-y-6">
            <h2 className="text-2xl font-semibold">Available Stations</h2>

            <div className="grid gap-4 md:grid-cols-2">
              {stations.map((station) => (
                <Card key={station.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Radio className="h-5 w-5" />
                      {station.name}
                    </CardTitle>
                    <CardDescription>{station.genre}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">{station.description}</p>
                    <Button
                      variant={playingStation === station.id ? 'default' : 'outline'}
                      size="sm"
                      className="w-full gap-2"
                      onClick={() => togglePlay(station.id)}
                    >
                      {playingStation === station.id ? (
                        <>
                          <Pause className="h-4 w-4" />
                          Stop
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4" />
                          Play
                        </>
                      )}
                    </Button>
                    {playingStation === station.id && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="flex gap-1">
                          <div className="w-1 h-4 bg-primary animate-pulse" />
                          <div className="w-1 h-4 bg-primary animate-pulse delay-75" />
                          <div className="w-1 h-4 bg-primary animate-pulse delay-150" />
                        </div>
                        Now playing...
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
