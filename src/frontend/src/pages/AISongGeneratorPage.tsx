import { useState } from 'react';
import { Sparkles, Music, Play, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';

const genres = ['Pop', 'Rock', 'Jazz', 'Electronic', 'Hip Hop', 'Classical', 'Country', 'R&B'];

interface GeneratedSong {
  id: string;
  genre: string;
  title: string;
  timestamp: Date;
}

export default function AISongGeneratorPage() {
  const [selectedGenre, setSelectedGenre] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSongs, setGeneratedSongs] = useState<GeneratedSong[]>([]);

  const handleGenerate = async () => {
    if (!selectedGenre) {
      toast.error('Please select a genre');
      return;
    }

    setIsGenerating(true);
    try {
      // Simulate AI generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newSong: GeneratedSong = {
        id: Date.now().toString(),
        genre: selectedGenre,
        title: `AI ${selectedGenre} Track ${Date.now()}`,
        timestamp: new Date(),
      };
      
      setGeneratedSongs([newSong, ...generatedSongs]);
      toast.success('Song generated successfully!');
    } catch (error) {
      toast.error('Failed to generate song');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="relative h-48 bg-gradient-to-br from-ai-primary via-ai-secondary to-ai-accent overflow-hidden">
        <img src="/assets/generated/ai-music-generator.dim_300x300.png" alt="AI Generator" className="absolute right-0 top-0 h-full opacity-20" />
        <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <Sparkles className="h-10 w-10" />
              AI Song Generator
            </h1>
            <p className="text-white/90">Create unique AI-generated music for entertainment</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="container mx-auto px-4 py-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Generate Your Song</CardTitle>
                <CardDescription>Select a genre and let AI create a unique track for you</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="genre">Select Genre</Label>
                  <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                    <SelectTrigger id="genre">
                      <SelectValue placeholder="Choose a genre" />
                    </SelectTrigger>
                    <SelectContent>
                      {genres.map((genre) => (
                        <SelectItem key={genre} value={genre}>
                          {genre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleGenerate} disabled={isGenerating} className="w-full gap-2">
                  {isGenerating ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Generate Song
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {generatedSongs.length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold mb-4">Generated Songs</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {generatedSongs.map((song) => (
                    <Card key={song.id}>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Music className="h-5 w-5" />
                          {song.title}
                        </CardTitle>
                        <CardDescription>
                          {song.genre} • {song.timestamp.toLocaleString()}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="gap-2">
                            <Play className="h-4 w-4" />
                            Play
                          </Button>
                          <Button variant="outline" size="sm" className="gap-2">
                            <Download className="h-4 w-4" />
                            Save
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
