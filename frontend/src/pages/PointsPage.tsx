import { useGetCallerUserProfile, useGetPointsHistory } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Coins, TrendingUp, Gift, ShoppingCart, History, Zap } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useNavigate } from '@tanstack/react-router';

export default function PointsPage() {
  const { data: userProfile, isLoading: profileLoading } = useGetCallerUserProfile();
  const { data: pointsHistory = [], isLoading: historyLoading } = useGetPointsHistory();
  const navigate = useNavigate();

  const userPoints = Number(userProfile?.points || 0n);

  const formatTimestamp = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'earn':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'spend':
        return <ShoppingCart className="h-4 w-4 text-red-500" />;
      case 'purchase':
        return <Coins className="h-4 w-4 text-blue-500" />;
      default:
        return <Coins className="h-4 w-4" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'earn':
        return 'text-green-600 dark:text-green-400';
      case 'spend':
        return 'text-red-600 dark:text-red-400';
      case 'purchase':
        return 'text-blue-600 dark:text-blue-400';
      default:
        return 'text-foreground';
    }
  };

  const sortedHistory = [...pointsHistory].sort((a, b) => {
    return Number(b.timestamp - a.timestamp);
  });

  return (
    <ScrollArea className="h-full">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-full bg-gradient-to-br from-[oklch(var(--rewards-primary))] to-[oklch(var(--rewards-accent))]">
            <Coins className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Points Wallet</h1>
            <p className="text-muted-foreground">Manage your points and rewards</p>
          </div>
        </div>

        {/* Points Balance Card */}
        <Card className="border-2 bg-gradient-to-br from-card to-[oklch(var(--rewards-accent)/0.1)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <img 
                src="/assets/generated/points-balance-coins-transparent.dim_200x200.png" 
                alt="Points" 
                className="h-8 w-8"
              />
              Your Balance
            </CardTitle>
            <CardDescription>Current points available</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-5xl font-bold bg-gradient-to-r from-[oklch(var(--rewards-primary))] to-[oklch(var(--rewards-accent))] bg-clip-text text-transparent">
                {profileLoading ? '...' : userPoints.toLocaleString()}
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={() => navigate({ to: '/points-store' })}
                  className="flex-1 bg-gradient-to-r from-[oklch(var(--rewards-primary))] to-[oklch(var(--rewards-accent))] hover:opacity-90"
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Visit Store
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => navigate({ to: '/rewards' })}
                  className="flex-1"
                >
                  <Gift className="mr-2 h-4 w-4" />
                  Daily Rewards
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                Total Earned
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {pointsHistory
                  .filter(t => t.transactionType === 'earn')
                  .reduce((sum, t) => sum + Number(t.amount), 0)
                  .toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <ShoppingCart className="h-4 w-4 text-red-500" />
                Total Spent
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.abs(
                  pointsHistory
                    .filter(t => t.transactionType === 'spend')
                    .reduce((sum, t) => sum + Number(t.amount), 0)
                ).toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <History className="h-4 w-4 text-blue-500" />
                Transactions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pointsHistory.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Ways to Earn Points */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              Ways to Earn Points
            </CardTitle>
            <CardDescription>Complete these actions to earn more points</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <Gift className="h-5 w-5 text-[oklch(var(--rewards-primary))]" />
                  <div>
                    <p className="font-medium">Daily Rewards</p>
                    <p className="text-sm text-muted-foreground">Claim once per day</p>
                  </div>
                </div>
                <Badge variant="secondary">+10 pts</Badge>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="font-medium">Daily Login Streak</p>
                    <p className="text-sm text-muted-foreground">Bonus for consecutive days</p>
                  </div>
                </div>
                <Badge variant="secondary">+5-20 pts</Badge>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <Coins className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="font-medium">User Interactions</p>
                    <p className="text-sm text-muted-foreground">Messaging, posting, engaging</p>
                  </div>
                </div>
                <Badge variant="secondary">+1-5 pts</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transaction History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Transaction History
            </CardTitle>
            <CardDescription>Your recent points activity</CardDescription>
          </CardHeader>
          <CardContent>
            {historyLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading history...</div>
            ) : sortedHistory.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <History className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No transactions yet</p>
                <p className="text-sm">Start earning points to see your history here</p>
              </div>
            ) : (
              <ScrollArea className="h-[400px]">
                <div className="space-y-2">
                  {sortedHistory.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center gap-3">
                        {getTransactionIcon(transaction.transactionType)}
                        <div>
                          <p className="font-medium">{transaction.description}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatTimestamp(transaction.timestamp)}
                          </p>
                        </div>
                      </div>
                      <div className={`font-bold ${getTransactionColor(transaction.transactionType)}`}>
                        {Number(transaction.amount) > 0 ? '+' : ''}
                        {Number(transaction.amount).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
}
