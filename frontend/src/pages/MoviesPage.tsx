import { Film, Play } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';

const sampleMovies = [
  { id: '1', title: 'Sample Movie 1', genre: 'Action', duration: '2h 15m' },
  { id: '2', title: 'Sample Movie 2', genre: 'Drama', duration: '1h 45m' },
  { id: '3', title: 'Sample Movie 3', genre: 'Comedy', duration: '1h 30m' },
];

export default function MoviesPage() {
  return (
    <div className="h-full flex flex-col">
      <div className="relative h-48 bg-gradient-to-br from-movie-primary via-movie-secondary to-movie-accent overflow-hidden">
        <img src="/assets/generated/movie-theater-scene.dim_800x600.png" alt="Movies" className="absolute inset-0 w-full h-full object-cover opacity-30" />
        <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Movies</h1>
            <p className="text-white/90">Stream and discover amazing films</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="container mx-auto px-4 py-6 space-y-6">
            <h2 className="text-2xl font-semibold">Available Movies</h2>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {sampleMovies.map((movie) => (
                <Card key={movie.id} className="hover:shadow-lg transition-shadow">
                  <div className="aspect-video bg-gradient-to-br from-muted to-muted-foreground/20 relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Film className="h-16 w-16 text-muted-foreground/50" />
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg">{movie.title}</CardTitle>
                    <CardDescription>{movie.genre} • {movie.duration}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="default" size="sm" className="w-full gap-2">
                      <Play className="h-4 w-4" />
                      Watch Now
                    </Button>
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
