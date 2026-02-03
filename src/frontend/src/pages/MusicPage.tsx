import { useState } from 'react';
import { Music, Upload, Play, Pause, Users, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { useGetCallerUserProfile, useUploadMusic, useGetFriendsMusicUploads } from '../hooks/useQueries';
import { ExternalBlob } from '../backend';
import { Skeleton } from '@/components/ui/skeleton';

export default function MusicPage() {
  const { data: userProfile, isLoading: profileLoading } = useGetCallerUserProfile();
  const { data: friendsMusic, isLoading: friendsMusicLoading } = useGetFriendsMusicUploads();
  const uploadMusicMutation = useUploadMusic();

  const [currentTrack, setCurrentTrack] = useState<{ id: string; url: string } | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [uploadForm, setUploadForm] = useState({ title: '', artist: '', genre: '' });
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleUpload = async () => {
    if (!audioFile || !uploadForm.title || !uploadForm.artist) {
      toast.error('Please fill in all fields and select an audio file');
      return;
    }

    try {
      const arrayBuffer = await audioFile.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      const blob = ExternalBlob.fromBytes(uint8Array).withUploadProgress((percentage) => {
        setUploadProgress(percentage);
      });

      const musicId = `music_${Date.now()}`;
      await uploadMusicMutation.mutateAsync({
        id: musicId,
        title: uploadForm.title,
        artist: uploadForm.artist,
        genre: uploadForm.genre,
        file: blob,
      });

      toast.success('Track uploaded successfully!');
      setUploadForm({ title: '', artist: '', genre: '' });
      setAudioFile(null);
      setUploadProgress(0);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload track');
    }
  };

  const handlePlayPause = (trackId: string, trackUrl: string) => {
    if (currentTrack?.id === trackId) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentTrack({ id: trackId, url: trackUrl });
      setIsPlaying(true);
    }
  };

  const userTracks = userProfile?.musicUploads || [];

  return (
    <div className="h-full flex flex-col">
      <div className="relative h-48 bg-gradient-to-br from-music-primary via-music-secondary to-music-accent overflow-hidden">
        <img src="/assets/generated/music-waveform-bg.dim_800x400.png" alt="Music" className="absolute inset-0 w-full h-full object-cover opacity-30" />
        <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Music Library</h1>
            <p className="text-white/90">Discover and share your favorite tracks</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="container mx-auto px-4 py-6 space-y-8">
            {/* Friends' Music Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Users className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-semibold">Friends' Music</h2>
              </div>
              <p className="text-muted-foreground mb-4">Discover what your friends are listening to</p>

              {friendsMusicLoading ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {[1, 2, 3].map((i) => (
                    <Card key={i}>
                      <CardHeader>
                        <Skeleton className="h-6 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-1/2" />
                      </CardHeader>
                      <CardContent>
                        <Skeleton className="h-10 w-full" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : friendsMusic && friendsMusic.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {friendsMusic.map((track) => {
                    const trackUrl = track.file.getDirectURL();
                    const trackId = track.id;
                    return (
                      <Card key={trackId} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <CardTitle className="text-lg">{track.title}</CardTitle>
                          <CardDescription className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {track.artist}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-muted-foreground">{track.genre}</span>
                            <Button
                              size="icon"
                              variant={currentTrack?.id === trackId && isPlaying ? 'default' : 'outline'}
                              onClick={() => handlePlayPause(trackId, trackUrl)}
                            >
                              {currentTrack?.id === trackId && isPlaying ? (
                                <Pause className="h-4 w-4" />
                              ) : (
                                <Play className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                          {currentTrack?.id === trackId && (
                            <audio src={currentTrack.url} autoPlay={isPlaying} className="w-full mt-2" controls />
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <img 
                      src="/assets/generated/friends-music-recommendations.dim_600x400.png" 
                      alt="Friends Music" 
                      className="h-32 w-auto mb-4 opacity-50" 
                    />
                    <p className="text-muted-foreground text-center">
                      No music from friends yet. Follow more users to discover their tracks!
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>

            <Separator />

            {/* Your Tracks Section */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Your Tracks</h2>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="gap-2">
                      <Upload className="h-4 w-4" />
                      Upload Track
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Upload Music Track</DialogTitle>
                      <DialogDescription>Share your music with the community</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="title">Track Title</Label>
                        <Input
                          id="title"
                          value={uploadForm.title}
                          onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                          placeholder="Enter track title"
                        />
                      </div>
                      <div>
                        <Label htmlFor="artist">Artist Name</Label>
                        <Input
                          id="artist"
                          value={uploadForm.artist}
                          onChange={(e) => setUploadForm({ ...uploadForm, artist: e.target.value })}
                          placeholder="Enter artist name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="genre">Genre</Label>
                        <Input
                          id="genre"
                          value={uploadForm.genre}
                          onChange={(e) => setUploadForm({ ...uploadForm, genre: e.target.value })}
                          placeholder="e.g., Pop, Rock, Jazz"
                        />
                      </div>
                      <div>
                        <Label htmlFor="audio">Audio File</Label>
                        <Input
                          id="audio"
                          type="file"
                          accept="audio/*"
                          onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
                        />
                      </div>
                      {uploadProgress > 0 && uploadProgress < 100 && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Uploading...</span>
                            <span>{uploadProgress}%</span>
                          </div>
                          <div className="w-full bg-secondary rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full transition-all duration-300" 
                              style={{ width: `${uploadProgress}%` }}
                            />
                          </div>
                        </div>
                      )}
                      <Button 
                        onClick={handleUpload} 
                        disabled={uploadMusicMutation.isPending || (uploadProgress > 0 && uploadProgress < 100)} 
                        className="w-full"
                      >
                        {uploadMusicMutation.isPending ? 'Uploading...' : 'Upload Track'}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {profileLoading ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {[1, 2, 3].map((i) => (
                    <Card key={i}>
                      <CardHeader>
                        <Skeleton className="h-6 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-1/2" />
                      </CardHeader>
                      <CardContent>
                        <Skeleton className="h-10 w-full" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : userTracks.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Music className="h-16 w-16 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground text-center">No tracks yet. Upload your first track to get started!</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {userTracks.map((track) => {
                    const trackUrl = track.file.getDirectURL();
                    const trackId = track.id;
                    return (
                      <Card key={trackId} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <CardTitle className="text-lg">{track.title}</CardTitle>
                          <CardDescription>{track.artist}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-muted-foreground">{track.genre}</span>
                            <Button
                              size="icon"
                              variant={currentTrack?.id === trackId && isPlaying ? 'default' : 'outline'}
                              onClick={() => handlePlayPause(trackId, trackUrl)}
                            >
                              {currentTrack?.id === trackId && isPlaying ? (
                                <Pause className="h-4 w-4" />
                              ) : (
                                <Play className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                          {currentTrack?.id === trackId && (
                            <audio src={currentTrack.url} autoPlay={isPlaying} className="w-full mt-2" controls />
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
