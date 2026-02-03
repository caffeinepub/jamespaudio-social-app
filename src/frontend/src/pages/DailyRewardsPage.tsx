import { useState } from 'react';
import { useGetCallerUserProfile, useClaimDailyReward } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gift, Coins, TrendingUp, Calendar, Zap } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export default function DailyRewardsPage() {
  const { data: userProfile, isLoading } = useGetCallerUserProfile();
  const claimReward = useClaimDailyReward();
  const [showAnimation, setShowAnimation] = useState(false);

  const handleClaimReward = async () => {
    try {
      const result = await claimReward.mutateAsync();
      setShowAnimation(true);
      toast.success('Daily reward claimed!', {
        description: 'You earned 10 points!',
      });
      setTimeout(() => setShowAnimation(false), 2000);
    } catch (error: any) {
      toast.error('Unable to claim reward', {
        description: error.message || 'You may have already claimed today\'s reward',
      });
    }
  };

  const userPoints = Number(userProfile?.points || 0n);
  const rewardsClaimed = Number(userProfile?.rewardsClaimed || 0n);
  const dailyStreak = Number(userProfile?.dailyLoginStreak || 0n);

  const canClaim = userProfile?.lastDailyRewardClaim 
    ? Date.now() - Number(userProfile.lastDailyRewardClaim) / 1000000 > 24 * 60 * 60 * 1000
    : true;

  return (
    <ScrollArea className="h-full">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-full bg-gradient-to-br from-[oklch(var(--rewards-primary))] to-[oklch(var(--rewards-accent))]">
            <Gift className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Daily Rewards</h1>
            <p className="text-muted-foreground">Claim your daily points and build your streak</p>
          </div>
        </div>

        {/* Reward Chest Card */}
        <Card className="border-2 bg-gradient-to-br from-card to-[oklch(var(--rewards-accent)/0.1)]">
          <CardContent className="p-8">
            <div className="flex flex-col items-center text-center space-y-6">
              <div className={`relative ${showAnimation ? 'animate-bounce' : ''}`}>
                <img 
                  src="/assets/generated/daily-rewards-chest.dim_300x300.png" 
                  alt="Reward Chest" 
                  className="w-48 h-48 object-contain"
                />
                {showAnimation && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Coins className="h-16 w-16 text-yellow-500 animate-ping" />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-bold">Daily Reward Available!</h2>
                <p className="text-muted-foreground">
                  Claim your daily reward to earn points and maintain your streak
                </p>
              </div>

              <Button
                size="lg"
                onClick={handleClaimReward}
                disabled={claimReward.isPending || !canClaim || isLoading}
                className="bg-gradient-to-r from-[oklch(var(--rewards-primary))] to-[oklch(var(--rewards-accent))] hover:opacity-90 text-lg px-8 py-6"
              >
                {claimReward.isPending ? (
                  'Claiming...'
                ) : !canClaim ? (
                  'Already Claimed Today'
                ) : (
                  <>
                    <Gift className="mr-2 h-5 w-5" />
                    Claim 10 Points
                  </>
                )}
              </Button>

              {!canClaim && (
                <p className="text-sm text-muted-foreground">
                  Come back tomorrow for your next reward!
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Coins className="h-4 w-4 text-[oklch(var(--rewards-primary))]" />
                Current Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{userPoints.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">Total points</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                Rewards Claimed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{rewardsClaimed}</div>
              <p className="text-xs text-muted-foreground mt-1">Total claims</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-500" />
                Daily Streak
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{dailyStreak}</div>
              <p className="text-xs text-muted-foreground mt-1">Consecutive days</p>
            </CardContent>
          </Card>
        </div>

        {/* Streak Bonuses Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              Streak Bonuses
            </CardTitle>
            <CardDescription>Keep your streak alive for bonus rewards</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="font-medium">7-Day Streak</p>
                    <p className="text-sm text-muted-foreground">Bonus points multiplier</p>
                  </div>
                </div>
                <Badge variant="secondary">+5 pts</Badge>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="font-medium">30-Day Streak</p>
                    <p className="text-sm text-muted-foreground">Special badge unlock</p>
                  </div>
                </div>
                <Badge variant="secondary">+20 pts</Badge>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  <div>
                    <p className="font-medium">100-Day Streak</p>
                    <p className="text-sm text-muted-foreground">Legendary status</p>
                  </div>
                </div>
                <Badge variant="secondary">+100 pts</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
}
