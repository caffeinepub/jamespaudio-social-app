import { useState, useEffect } from 'react';
import { AppWindow, ExternalLink, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useGetCallerUserProfile, usePublishApp, useGetAllPublishedApps } from '../hooks/useQueries';
import { toast } from 'sonner';

export default function PublishedAppsPage() {
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: publishedApps = [], isLoading } = useGetAllPublishedApps();
  const publishApp = usePublishApp();
  const [appForm, setAppForm] = useState({ 
    title: '', 
    developerName: '', 
    link: '', 
    description: '',
    previewImage: ''
  });
  const [dialogOpen, setDialogOpen] = useState(false);

  const userPoints = Number(userProfile?.points || 0n);
  const canPublish = userPoints >= 70;

  const handlePublish = async () => {
    if (!canPublish) {
      toast.error('You need at least 70 points to publish an app');
      return;
    }

    if (!appForm.title || !appForm.developerName || !appForm.link) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Validate URL format
    try {
      new URL(appForm.link);
    } catch {
      toast.error('Please enter a valid URL (e.g., https://example.com)');
      return;
    }

    try {
      await publishApp.mutateAsync({
        appTitle: appForm.title,
        devName: appForm.developerName,
        link: appForm.link,
        description: appForm.description,
        previewImage: appForm.previewImage || '/assets/generated/published-apps-grid.dim_600x400.png',
      });
      toast.success('App published successfully!');
      setAppForm({ title: '', developerName: '', link: '', description: '', previewImage: '' });
      setDialogOpen(false);
    } catch (error: any) {
      if (error.message?.includes('Insufficient points')) {
        toast.error('You need at least 70 points to publish apps');
      } else {
        toast.error('Failed to publish app. Please try again.');
      }
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="relative h-48 bg-gradient-to-br from-apps-primary via-apps-secondary to-apps-accent overflow-hidden">
        <img src="/assets/generated/published-apps-grid.dim_600x400.png" alt="Apps" className="absolute inset-0 w-full h-full object-cover opacity-20" />
        <div className="relative z-10 container mx-auto px-4 h-full flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Published Apps</h1>
            <p className="text-white/90">Discover apps created by our community</p>
          </div>
          <Badge variant="secondary" className="text-lg px-4 py-2">
            Your Points: {userPoints}
          </Badge>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="container mx-auto px-4 py-6 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Community Apps</h2>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2" disabled={!canPublish}>
                    <Plus className="h-4 w-4" />
                    Publish App
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Publish Your App</DialogTitle>
                    <DialogDescription>
                      {canPublish 
                        ? 'Share your app with the community (requires 70 points)'
                        : `You need ${70 - userPoints} more points to publish apps`}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="appTitle">App Name *</Label>
                      <Input
                        id="appTitle"
                        value={appForm.title}
                        onChange={(e) => setAppForm({ ...appForm, title: e.target.value })}
                        placeholder="Enter app name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="developer">Developer Name *</Label>
                      <Input
                        id="developer"
                        value={appForm.developerName}
                        onChange={(e) => setAppForm({ ...appForm, developerName: e.target.value })}
                        placeholder="Enter developer name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="link">App Link (URL) *</Label>
                      <Input
                        id="link"
                        type="url"
                        value={appForm.link}
                        onChange={(e) => setAppForm({ ...appForm, link: e.target.value })}
                        placeholder="https://your-app-link.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={appForm.description}
                        onChange={(e) => setAppForm({ ...appForm, description: e.target.value })}
                        placeholder="Describe your app..."
                        rows={3}
                      />
                    </div>
                    <Button 
                      onClick={handlePublish} 
                      disabled={publishApp.isPending || !canPublish} 
                      className="w-full"
                    >
                      {publishApp.isPending ? 'Publishing...' : 'Publish App'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {!canPublish && (
              <Card className="border-warning bg-warning/5">
                <CardContent className="pt-6">
                  <p className="text-sm text-warning-foreground">
                    You need at least 70 points to publish apps. Keep interacting with the platform to earn more points!
                  </p>
                </CardContent>
              </Card>
            )}

            {isLoading ? (
              <Card>
                <CardContent className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
                    <p className="text-muted-foreground">Loading apps...</p>
                  </div>
                </CardContent>
              </Card>
            ) : publishedApps.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <AppWindow className="h-16 w-16 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground text-center">No apps published yet. Be the first to share your creation!</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {publishedApps.map((app) => (
                  <Card key={app.title + app.creatorId.toString()} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <AppWindow className="h-5 w-5" />
                        {app.title}
                      </CardTitle>
                      <CardDescription>by {app.developerName}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {app.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">{app.description}</p>
                      )}
                      <Button variant="outline" size="sm" className="w-full gap-2" asChild>
                        <a href={app.link} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                          Open App
                        </a>
                      </Button>
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
