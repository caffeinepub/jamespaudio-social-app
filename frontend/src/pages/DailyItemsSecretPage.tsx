import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useClaimDailyItemsSecret, useGetLastClaimedMysteryItem, useIsMysteryItemClaimAvailable } from '../hooks/useQueries';
import { toast } from 'sonner';
import { Gift, Sparkles } from 'lucide-react';

export default function DailyItemsSecretPage() {
  const [isOpening, setIsOpening] = useState(false);
  const claimMystery = useClaimDailyItemsSecret();
  const { data: lastItem } = useGetLastClaimedMysteryItem();
  const { data: canClaim = false } = useIsMysteryItemClaimAvailable();

  const handleOpenBox = async () => {
    if (!canClaim) {
      toast.error('You have already claimed your daily mystery item. Come back tomorrow!');
      return;
    }

    setIsOpening(true);
    try {
      await claimMystery.mutateAsync();
      toast.success('Mystery box opened! Check your rewards.');
    } catch (error: any) {
      toast.error(error.message || 'Failed to open mystery box');
    } finally {
      setTimeout(() => setIsOpening(false), 2000);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Daily Items Secret</h1>
        <p className="text-muted-foreground">
          Open your daily mystery box to discover exclusive rewards!
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Mystery Box */}
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10" />
          <CardHeader className="relative">
            <CardTitle className="flex items-center gap-2">
              <Gift className="h-6 w-6" />
              Mystery Box
            </CardTitle>
            <CardDescription>
              {canClaim
                ? 'Your daily mystery box is ready to open!'
                : 'Come back tomorrow for a new mystery box'}
            </CardDescription>
          </CardHeader>
          <CardContent className="relative">
            <div className="flex flex-col items-center gap-4 py-8">
              <div
                className={`text-8xl transition-transform duration-500 ${
                  isOpening ? 'animate-bounce scale-110' : ''
                }`}
              >
                🎁
              </div>
              <Button
                size="lg"
                onClick={handleOpenBox}
                disabled={!canClaim || isOpening}
                className="w-full"
              >
                {isOpening ? (
                  <>
                    <Sparkles className="mr-2 h-5 w-5 animate-spin" />
                    Opening...
                  </>
                ) : canClaim ? (
                  'Open Mystery Box'
                ) : (
                  'Already Claimed Today'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Last Reward */}
        <Card>
          <CardHeader>
            <CardTitle>Last Reward</CardTitle>
            <CardDescription>
              {lastItem ? 'Your most recent mystery item' : 'No items claimed yet'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {lastItem ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="text-4xl">
                    {lastItem.itemType === 'points' && '💰'}
                    {lastItem.itemType === 'badge' && '🏆'}
                    {lastItem.itemType === 'visual' && '🎨'}
                    {lastItem.itemType === 'message' && '💌'}
                  </div>
                  <div>
                    <p className="font-semibold">{lastItem.name}</p>
                    <p className="text-sm text-muted-foreground">{lastItem.description}</p>
                  </div>
                </div>
                {lastItem.pointsReward && (
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm font-medium">
                      Bonus: +{Number(lastItem.pointsReward)} points
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>Open your first mystery box to see rewards here!</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Information Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>About Mystery Boxes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h3 className="font-semibold mb-2">Possible Rewards</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <span>💰</span>
                    <span>Bonus Points</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span>🏆</span>
                    <span>Special Badges</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span>🎨</span>
                    <span>Exclusive Visuals</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span>💌</span>
                    <span>Mystery Messages</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">How It Works</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Open one mystery box per day</li>
                  <li>• Rewards are randomly selected</li>
                  <li>• Come back daily for new chances</li>
                  <li>• Collect rare items over time</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
