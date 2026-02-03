import { useState } from 'react';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { useClaimDailyItemsSecret, useGetLastClaimedMysteryItem, useIsMysteryItemClaimAvailable } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gift, Sparkles, Clock, TrendingUp, Star, MessageCircle, Image as ImageIcon } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { toast } from 'sonner';

export default function DailyItemsSecretPage() {
  const { identity } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: isClaimAvailable, isLoading: checkingAvailability } = useIsMysteryItemClaimAvailable(identity?.getPrincipal());
  const { data: lastClaimedItem } = useGetLastClaimedMysteryItem(identity?.getPrincipal());
  const claimMutation = useClaimDailyItemsSecret();
  const [isAnimating, setIsAnimating] = useState(false);
  const [revealedItem, setRevealedItem] = useState<any>(null);

  const handleClaimSecret = async () => {
    if (!isClaimAvailable) {
      toast.error('You have already claimed your daily secret today!');
      return;
    }

    setIsAnimating(true);
    
    try {
      const result = await claimMutation.mutateAsync();
      
      setTimeout(() => {
        setRevealedItem(result);
        setIsAnimating(false);
        
        if (result) {
          const itemTypeLabel = result.itemType === 'points' ? 'Bonus Points' :
                                result.itemType === 'badge' ? 'Special Badge' :
                                result.itemType === 'visual' ? 'Exclusive Visual' : 'Mystery Message';
          toast.success(`You received: ${result.name}!`, {
            description: result.description,
          });
        }
      }, 2000);
    } catch (error: any) {
      setIsAnimating(false);
      toast.error('Failed to claim daily secret', {
        description: error.message || 'Please try again later',
      });
    }
  };

  const getItemTypeIcon = (itemType: string) => {
    switch (itemType) {
      case 'points':
        return <TrendingUp className="h-5 w-5 text-yellow-500" />;
      case 'badge':
        return <Star className="h-5 w-5 text-purple-500" />;
      case 'visual':
        return <ImageIcon className="h-5 w-5 text-blue-500" />;
      case 'message':
        return <MessageCircle className="h-5 w-5 text-green-500" />;
      default:
        return <Gift className="h-5 w-5" />;
    }
  };

  const getItemTypeColor = (itemType: string) => {
    switch (itemType) {
      case 'points':
        return 'bg-yellow-500/10 border-yellow-500/50';
      case 'badge':
        return 'bg-purple-500/10 border-purple-500/50';
      case 'visual':
        return 'bg-blue-500/10 border-blue-500/50';
      case 'message':
        return 'bg-green-500/10 border-green-500/50';
      default:
        return 'bg-muted';
    }
  };

  const formatTimestamp = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <ScrollArea className="h-full">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="relative h-48 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 rounded-lg overflow-hidden">
          <img 
            src="/assets/generated/daily-items-secret-hero.dim_800x600.png" 
            alt="Daily Items Secret" 
            className="absolute inset-0 w-full h-full object-cover opacity-30" 
          />
          <div className="relative z-10 h-full flex items-center px-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Gift className="h-10 w-10 text-white" />
                <h1 className="text-4xl font-bold text-white">Daily Items Secret</h1>
              </div>
              <p className="text-white/90 text-lg">Unlock a mystery reward every day!</p>
            </div>
          </div>
        </div>

        {/* Mystery Box Card */}
        <Card className="border-2 bg-gradient-to-br from-card to-purple-500/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-purple-500" />
              Mystery Box
            </CardTitle>
            <CardDescription>Open once per day to reveal your surprise reward</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center space-y-6">
              {/* Mystery Box Animation */}
              <div className={`relative transition-all duration-500 ${isAnimating ? 'animate-bounce' : ''}`}>
                <img 
                  src="/assets/generated/daily-rewards-chest.dim_300x300.png" 
                  alt="Mystery Box" 
                  className={`h-48 w-48 object-contain ${isAnimating ? 'scale-110' : 'scale-100'} transition-transform`}
                />
                {isAnimating && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="h-16 w-16 text-yellow-500 animate-spin" />
                  </div>
                )}
              </div>

              {/* Claim Status */}
              <div className="text-center space-y-3 w-full">
                {checkingAvailability ? (
                  <p className="text-muted-foreground">Checking availability...</p>
                ) : isClaimAvailable ? (
                  <>
                    <Badge variant="outline" className="bg-green-500/10 border-green-500 text-green-700 dark:text-green-400">
                      <Clock className="h-3 w-3 mr-1" />
                      Available Now
                    </Badge>
                    <Button 
                      size="lg"
                      onClick={handleClaimSecret}
                      disabled={isAnimating || claimMutation.isPending}
                      className="w-full md:w-auto bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90"
                    >
                      {isAnimating ? (
                        <>
                          <Sparkles className="mr-2 h-5 w-5 animate-spin" />
                          Opening Mystery Box...
                        </>
                      ) : (
                        <>
                          <Gift className="mr-2 h-5 w-5" />
                          Open Mystery Box
                        </>
                      )}
                    </Button>
                  </>
                ) : (
                  <>
                    <Badge variant="outline" className="bg-orange-500/10 border-orange-500 text-orange-700 dark:text-orange-400">
                      <Clock className="h-3 w-3 mr-1" />
                      Already Claimed Today
                    </Badge>
                    <p className="text-sm text-muted-foreground">Come back tomorrow for another mystery reward!</p>
                  </>
                )}
              </div>

              {/* Revealed Item Display */}
              {revealedItem && (
                <Card className={`w-full border-2 ${getItemTypeColor(revealedItem.itemType)} animate-in fade-in slide-in-from-bottom-4`}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {getItemTypeIcon(revealedItem.itemType)}
                      {revealedItem.name}
                    </CardTitle>
                    <CardDescription>{revealedItem.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {revealedItem.pointsReward && (
                      <div className="flex items-center gap-2 text-lg font-semibold text-yellow-600 dark:text-yellow-400">
                        <TrendingUp className="h-5 w-5" />
                        +{Number(revealedItem.pointsReward)} Points Earned!
                      </div>
                    )}
                    {revealedItem.visualUrl && (
                      <img 
                        src={revealedItem.visualUrl} 
                        alt={revealedItem.name}
                        className="mt-3 rounded-lg max-h-32 object-contain mx-auto"
                      />
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Last Claimed Item */}
        {lastClaimedItem && !revealedItem && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Last Claimed Item
              </CardTitle>
              <CardDescription>Your most recent mystery reward</CardDescription>
            </CardHeader>
            <CardContent>
              <div className={`p-4 rounded-lg border-2 ${getItemTypeColor(lastClaimedItem.itemType)}`}>
                <div className="flex items-start gap-3">
                  {getItemTypeIcon(lastClaimedItem.itemType)}
                  <div className="flex-1">
                    <h3 className="font-semibold">{lastClaimedItem.name}</h3>
                    <p className="text-sm text-muted-foreground">{lastClaimedItem.description}</p>
                    {lastClaimedItem.pointsReward && (
                      <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400 mt-1">
                        +{Number(lastClaimedItem.pointsReward)} Points
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Possible Mystery Items */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-500" />
              Possible Mystery Items
            </CardTitle>
            <CardDescription>What you might discover in the mystery box</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/50">
                <TrendingUp className="h-5 w-5 text-yellow-500 mt-0.5" />
                <div>
                  <h3 className="font-semibold">Bonus Points</h3>
                  <p className="text-sm text-muted-foreground">Random amounts of extra points to boost your balance</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-purple-500/10 border border-purple-500/50">
                <Star className="h-5 w-5 text-purple-500 mt-0.5" />
                <div>
                  <h3 className="font-semibold">Temporary Badges</h3>
                  <p className="text-sm text-muted-foreground">Special badges to showcase on your profile</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-green-500/10 border border-green-500/50">
                <MessageCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <h3 className="font-semibold">Mystery Messages</h3>
                  <p className="text-sm text-muted-foreground">Fun messages and surprises from the JAMESPaudio team</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-500/10 border border-blue-500/50">
                <ImageIcon className="h-5 w-5 text-blue-500 mt-0.5" />
                <div>
                  <h3 className="font-semibold">Exclusive Visuals</h3>
                  <p className="text-sm text-muted-foreground">Unique images and graphics for your collection</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Separator />

        {/* Tips Section */}
        <Card className="bg-gradient-to-br from-card to-purple-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-500" />
              Tips for Maximizing Rewards
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <span>•</span>
                <span>Check back every day to claim your mystery reward</span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>Combine with Daily Rewards for maximum points earning</span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>Mystery items are randomized - you never know what you'll get!</span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>Some items may include bonus points to help you reach the 70-point threshold for publishing apps</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground py-4">
          <p>© 2025. Built with love using <a href="https://caffeine.ai" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">caffeine.ai</a></p>
        </div>
      </div>
    </ScrollArea>
  );
}
