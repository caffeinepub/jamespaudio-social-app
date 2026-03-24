import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Store, Check, Clock, Search } from 'lucide-react';
import { useGetAvailableSearchEngines, useGetDefaultSearchEngine, useSetDefaultSearchEngine, useGetSearchHistory } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { toast } from 'sonner';
import { useState } from 'react';

export default function SearchEngineStorePage() {
  const { identity } = useInternetIdentity();
  const { data: searchEngines, isLoading: enginesLoading } = useGetAvailableSearchEngines();
  const { data: defaultEngine, isLoading: defaultLoading } = useGetDefaultSearchEngine();
  const { data: searchHistory, isLoading: historyLoading } = useGetSearchHistory();
  const setDefaultEngine = useSetDefaultSearchEngine();
  const [selectedEngine, setSelectedEngine] = useState<string | null>(null);

  const isAuthenticated = !!identity;

  const handleSetDefault = async (engineId: string) => {
    if (!isAuthenticated) {
      toast.error('Please sign in to set your default search engine');
      return;
    }

    try {
      setSelectedEngine(engineId);
      await setDefaultEngine.mutateAsync(engineId);
      toast.success('Default search engine updated successfully!');
    } catch (error: any) {
      console.error('Error setting default engine:', error);
      if (error.message?.includes('Unauthorized')) {
        toast.error('Please sign in to set your default search engine');
      } else {
        toast.error('Failed to update search engine. Please try again.');
      }
    } finally {
      setSelectedEngine(null);
    }
  };

  const formatTimestamp = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleString();
  };

  return (
    <ScrollArea className="h-full">
      <div className="container max-w-6xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-4 py-8">
          <div className="flex justify-center">
            <div className="relative">
              <Store className="h-16 w-16 text-primary" />
              <Search className="absolute -top-2 -right-2 h-8 w-8 text-accent" />
            </div>
          </div>
          <h1 className="text-4xl font-bold">Search Engine Store</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Browse and select your preferred search provider for the best search experience
          </p>
        </div>

        {/* Authentication Notice */}
        {!isAuthenticated && (
          <Card className="border-orange-500/50 bg-orange-500/5">
            <CardContent className="py-6 text-center">
              <p className="text-lg font-semibold mb-2">Sign in to customize your search experience</p>
              <p className="text-sm text-muted-foreground">
                You can browse available search engines, but you'll need to sign in to set your default provider and view search history.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Available Search Engines */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <Store className="h-6 w-6 text-primary" />
            Available Search Engines
          </h2>

          {enginesLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading search engines...</p>
            </div>
          ) : searchEngines && searchEngines.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {searchEngines.map((engine) => {
                const isDefault = defaultEngine === engine.id;
                const isSelecting = selectedEngine === engine.id;

                return (
                  <Card key={engine.id} className={`transition-all ${isDefault ? 'border-primary bg-primary/5' : ''}`}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="flex items-center gap-2">
                            {engine.name}
                            {isDefault && (
                              <Badge variant="default" className="gap-1">
                                <Check className="h-3 w-3" />
                                Default
                              </Badge>
                            )}
                          </CardTitle>
                          <CardDescription className="mt-2">{engine.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Button
                        onClick={() => handleSetDefault(engine.id)}
                        disabled={isDefault || isSelecting || !isAuthenticated || setDefaultEngine.isPending}
                        className="w-full"
                        variant={isDefault ? 'secondary' : 'default'}
                      >
                        {isSelecting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Setting...
                          </>
                        ) : isDefault ? (
                          'Current Default'
                        ) : (
                          'Set as Default'
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Store className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No search engines available</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Search History */}
        {isAuthenticated && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <Clock className="h-6 w-6 text-accent" />
              Recent Search History
            </h2>

            {historyLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-sm text-muted-foreground">Loading history...</p>
              </div>
            ) : searchHistory && searchHistory.length > 0 ? (
              <Card>
                <CardContent className="p-0">
                  <div className="divide-y">
                    {searchHistory.map((entry, index) => (
                      <div key={index} className="p-4 hover:bg-muted/50 transition-colors">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{entry.searchTerm}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {entry.searchType}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {formatTimestamp(entry.timestamp)}
                              </span>
                            </div>
                          </div>
                          <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No search history yet</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Your searches will appear here once you start using the search engine
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="text-center py-8 text-sm text-muted-foreground">
          <p>© 2026. Built with love using <a href="https://caffeine.ai" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">caffeine.ai</a></p>
        </div>
      </div>
    </ScrollArea>
  );
}
