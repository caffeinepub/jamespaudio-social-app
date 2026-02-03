import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar, CheckCircle2, Clock, Wrench, TestTube } from 'lucide-react';
import { useGetUpcomingFeatures } from '../hooks/useQueries';
import { FeatureStatus } from '../types/temporary';

export default function WhatsNextPage() {
  const { data: upcomingFeatures, isLoading } = useGetUpcomingFeatures();

  const getStatusIcon = (status: FeatureStatus) => {
    switch (status) {
      case FeatureStatus.released:
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case FeatureStatus.testing:
        return <TestTube className="h-5 w-5 text-blue-500" />;
      case FeatureStatus.inProgress:
        return <Wrench className="h-5 w-5 text-orange-500" />;
      case FeatureStatus.planned:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: FeatureStatus) => {
    const variants: Record<FeatureStatus, { label: string; className: string }> = {
      [FeatureStatus.released]: { label: 'Released', className: 'bg-green-500/10 text-green-500 border-green-500/30' },
      [FeatureStatus.testing]: { label: 'Testing', className: 'bg-blue-500/10 text-blue-500 border-blue-500/30' },
      [FeatureStatus.inProgress]: { label: 'In Progress', className: 'bg-orange-500/10 text-orange-500 border-orange-500/30' },
      [FeatureStatus.planned]: { label: 'Planned', className: 'bg-gray-500/10 text-gray-500 border-gray-500/30' },
    };

    const variant = variants[status];
    return (
      <Badge variant="outline" className={variant.className}>
        {variant.label}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading roadmap...</p>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="container max-w-6xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-4 py-8">
          <div className="flex justify-center">
            <MapPin className="h-16 w-16 text-primary" />
          </div>
          <h1 className="text-4xl font-bold">What's Next</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore our roadmap and see what exciting features are coming to JAMESPaudio
          </p>
        </div>

        {/* Roadmap Image */}
        <div className="flex justify-center">
          <img
            src="/assets/generated/roadmap-timeline.dim_600x400.png"
            alt="Roadmap Timeline"
            className="rounded-lg shadow-lg max-w-full h-auto"
          />
        </div>

        {/* Upcoming Features */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Upcoming Features</h2>

          {upcomingFeatures && upcomingFeatures.length > 0 ? (
            <div className="space-y-4">
              {upcomingFeatures.map((feature, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        {getStatusIcon(feature.status)}
                        <div className="flex-1">
                          <CardTitle className="text-xl">{feature.title}</CardTitle>
                          <CardDescription className="mt-2">{feature.description}</CardDescription>
                        </div>
                      </div>
                      {getStatusBadge(feature.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>
                        Planned Release: {new Date(Number(feature.plannedRelease) / 1000000).toLocaleDateString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  No upcoming features announced yet. Check back soon for exciting updates!
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Highlighted Features */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Coming Soon Highlights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-primary/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Badge className="bg-primary">New</Badge>
                  Groups & Communities
                </CardTitle>
                <CardDescription>
                  Create and join groups to connect with like-minded users. Share content, organize events, and build your community.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-primary/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Badge className="bg-primary">New</Badge>
                  Gaming Platform
                </CardTitle>
                <CardDescription>
                  Play games directly on JAMESPaudio! Compete with friends, earn achievements, and climb the leaderboards.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-8 text-sm text-muted-foreground">
          <p>© 2025. Built with love using <a href="https://caffeine.ai" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">caffeine.ai</a></p>
        </div>
      </div>
    </ScrollArea>
  );
}
