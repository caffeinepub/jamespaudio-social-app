import { useState } from 'react';
import { Video, Upload, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';

interface VideoItem {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnail: string;
}

export default function VideosPage() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [uploadForm, setUploadForm] = useState({ title: '', description: '' });
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async () => {
    if (!videoFile || !uploadForm.title) {
      toast.error('Please provide a title and select a video file');
      return;
    }

    setIsUploading(true);
    try {
      const newVideo: VideoItem = {
        id: Date.now().toString(),
        title: uploadForm.title,
        description: uploadForm.description,
        url: URL.createObjectURL(videoFile),
        thumbnail: '/assets/generated/video-player-mockup.dim_600x400.png',
      };
      setVideos([...videos, newVideo]);
      toast.success('Video uploaded successfully!');
      setUploadForm({ title: '', description: '' });
      setVideoFile(null);
    } catch (error) {
      toast.error('Failed to upload video');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="relative h-48 bg-gradient-to-br from-video-primary via-video-secondary to-video-accent overflow-hidden">
        <img src="/assets/generated/video-player-mockup.dim_600x400.png" alt="Videos" className="absolute inset-0 w-full h-full object-cover opacity-20" />
        <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Videos</h1>
            <p className="text-white/90">Upload and share your video content</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="container mx-auto px-4 py-6 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Your Videos</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Upload className="h-4 w-4" />
                    Upload Video
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Upload Video</DialogTitle>
                    <DialogDescription>Share your video with the community</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="videoTitle">Video Title</Label>
                      <Input
                        id="videoTitle"
                        value={uploadForm.title}
                        onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                        placeholder="Enter video title"
                      />
                    </div>
                    <div>
                      <Label htmlFor="videoDesc">Description</Label>
                      <Input
                        id="videoDesc"
                        value={uploadForm.description}
                        onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                        placeholder="Enter video description"
                      />
                    </div>
                    <div>
                      <Label htmlFor="videoFile">Video File</Label>
                      <Input
                        id="videoFile"
                        type="file"
                        accept="video/*"
                        onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                      />
                    </div>
                    <Button onClick={handleUpload} disabled={isUploading} className="w-full">
                      {isUploading ? 'Uploading...' : 'Upload Video'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {videos.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Video className="h-16 w-16 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground text-center">No videos yet. Upload your first video to get started!</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {videos.map((video) => (
                  <Card key={video.id} className="hover:shadow-lg transition-shadow">
                    <div className="aspect-video bg-muted relative overflow-hidden">
                      <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <Play className="h-12 w-12 text-white" />
                      </div>
                    </div>
                    <CardHeader>
                      <CardTitle className="text-lg">{video.title}</CardTitle>
                      <CardDescription>{video.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <video src={video.url} controls className="w-full rounded" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
