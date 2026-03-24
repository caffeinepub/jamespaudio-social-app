import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';

export default function PageUnavailablePage() {
  const navigate = useNavigate();

  const handleGoHome = () => {
    // In the context of MainApp, we can't use navigate
    // This page is meant to be shown when there's an error
    window.location.reload();
  };

  return (
    <ScrollArea className="h-full">
      <div className="container max-w-4xl mx-auto p-6 flex items-center justify-center min-h-[80vh]">
        <Card className="w-full border-destructive/30">
          <CardContent className="py-16 text-center space-y-6">
            <div className="flex justify-center">
              <img
                src="/assets/generated/page-unavailable-error.dim_400x400.png"
                alt="Page Unavailable"
                className="w-48 h-48 object-contain opacity-75"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2 text-destructive">
                <AlertTriangle className="h-8 w-8" />
                <h1 className="text-3xl font-bold">Page Unavailable</h1>
              </div>
              <p className="text-xl text-muted-foreground">
                This page is unavailable or temporarily offline
              </p>
            </div>

            <div className="space-y-4 max-w-md mx-auto">
              <p className="text-muted-foreground">
                The page you're looking for might have been removed, had its name changed, or is temporarily unavailable.
              </p>
              <p className="text-sm text-muted-foreground">
                This could happen if:
              </p>
              <ul className="text-sm text-muted-foreground text-left space-y-1">
                <li>• The account has been deleted</li>
                <li>• There's a temporary system issue</li>
                <li>• The content is no longer available</li>
                <li>• You don't have permission to access this page</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
              <Button onClick={handleGoHome} size="lg">
                <Home className="h-5 w-5 mr-2" />
                Go to Home
              </Button>
              <Button onClick={() => window.location.reload()} variant="outline" size="lg">
                <RefreshCw className="h-5 w-5 mr-2" />
                Refresh Page
              </Button>
            </div>

            <div className="pt-8 text-xs text-muted-foreground">
              <p>Error Code: 404 | Page Not Found</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <div className="text-center py-8 text-sm text-muted-foreground">
        <p>© 2025. Built with love using <a href="https://caffeine.ai" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">caffeine.ai</a></p>
      </div>
    </ScrollArea>
  );
}
