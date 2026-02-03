import { useState } from 'react';
import { useGetCallerUserProfile, useGetStoreItems, usePurchaseStoreItem, usePurchasePoints } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShoppingCart, Coins, Package, CreditCard, Sparkles, Zap, Crown, Gift } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';
import { useNavigate } from '@tanstack/react-router';

export default function PointsStorePage() {
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: storeItems = [], isLoading: itemsLoading } = useGetStoreItems();
  const purchaseStoreItem = usePurchaseStoreItem();
  const purchasePoints = usePurchasePoints();
  const navigate = useNavigate();

  const [pointsToBuy, setPointsToBuy] = useState('100');

  const userPoints = Number(userProfile?.points || 0n);

  const handlePurchaseItem = async (itemId: string, itemName: string, price: bigint) => {
    if (Number(price) > userPoints) {
      toast.error('Insufficient points', {
        description: `You need ${Number(price) - userPoints} more points to purchase this item.`,
      });
      return;
    }

    try {
      await purchaseStoreItem.mutateAsync(itemId);
      toast.success('Purchase successful!', {
        description: `You've redeemed ${itemName}`,
      });
    } catch (error: any) {
      toast.error('Purchase failed', {
        description: error.message || 'Unable to complete purchase',
      });
    }
  };

  const handleBuyPoints = async () => {
    const amount = parseInt(pointsToBuy);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Invalid amount', {
        description: 'Please enter a valid number of points',
      });
      return;
    }

    try {
      await purchasePoints.mutateAsync(BigInt(amount));
      toast.success('Points purchased!', {
        description: `${amount} points added to your balance`,
      });
      setPointsToBuy('100');
    } catch (error: any) {
      toast.error('Purchase failed', {
        description: error.message || 'Unable to purchase points',
      });
    }
  };

  const quickBuyAmounts = [100, 500, 1000, 5000];

  return (
    <ScrollArea className="h-full">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-gradient-to-br from-[oklch(var(--rewards-primary))] to-[oklch(var(--rewards-accent))]">
              <ShoppingCart className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Points Store</h1>
              <p className="text-muted-foreground">Purchase points and redeem rewards</p>
            </div>
          </div>
          <Button variant="outline" onClick={() => navigate({ to: '/points' })}>
            <Coins className="mr-2 h-4 w-4" />
            {userPoints.toLocaleString()} pts
          </Button>
        </div>

        {/* Hero Banner */}
        <Card className="border-2 bg-gradient-to-r from-[oklch(var(--rewards-primary)/0.2)] to-[oklch(var(--rewards-accent)/0.2)]">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <img 
                src="/assets/generated/points-store-hero.dim_800x600.png" 
                alt="Points Store" 
                className="w-full md:w-64 h-48 object-cover rounded-lg"
              />
              <div className="flex-1 space-y-2">
                <h2 className="text-2xl font-bold">Welcome to the Points Store!</h2>
                <p className="text-muted-foreground">
                  Purchase additional points or spend your earned points on exclusive content, apps, and features.
                  Build your collection and unlock premium experiences!
                </p>
                <div className="flex gap-2 pt-2">
                  <Badge variant="secondary" className="gap-1">
                    <Sparkles className="h-3 w-3" />
                    New Items Weekly
                  </Badge>
                  <Badge variant="secondary" className="gap-1">
                    <Zap className="h-3 w-3" />
                    Instant Delivery
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="buy-points" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="buy-points" className="gap-2">
              <CreditCard className="h-4 w-4" />
              Buy Points
            </TabsTrigger>
            <TabsTrigger value="redeem" className="gap-2">
              <Package className="h-4 w-4" />
              Redeem Items
            </TabsTrigger>
          </TabsList>

          {/* Buy Points Tab */}
          <TabsContent value="buy-points" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <img 
                    src="/assets/generated/points-wallet-icon-transparent.dim_64x64.png" 
                    alt="Wallet" 
                    className="h-6 w-6"
                  />
                  Purchase Points
                </CardTitle>
                <CardDescription>
                  Buy points to unlock more content and features (Stripe integration coming soon)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="points-amount">Enter Amount</Label>
                  <Input
                    id="points-amount"
                    type="number"
                    placeholder="100"
                    value={pointsToBuy}
                    onChange={(e) => setPointsToBuy(e.target.value)}
                    min="1"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Quick Select</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {quickBuyAmounts.map((amount) => (
                      <Button
                        key={amount}
                        variant="outline"
                        onClick={() => setPointsToBuy(amount.toString())}
                        className="h-20 flex flex-col gap-1"
                      >
                        <Coins className="h-5 w-5 text-[oklch(var(--rewards-primary))]" />
                        <span className="font-bold">{amount}</span>
                        <span className="text-xs text-muted-foreground">points</span>
                      </Button>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Points to purchase:</span>
                    <span className="font-medium">{parseInt(pointsToBuy) || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Current balance:</span>
                    <span className="font-medium">{userPoints.toLocaleString()}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold">
                    <span>New balance:</span>
                    <span className="text-[oklch(var(--rewards-primary))]">
                      {(userPoints + (parseInt(pointsToBuy) || 0)).toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full bg-gradient-to-r from-[oklch(var(--rewards-primary))] to-[oklch(var(--rewards-accent))] hover:opacity-90"
                  onClick={handleBuyPoints}
                  disabled={purchasePoints.isPending || !pointsToBuy || parseInt(pointsToBuy) <= 0}
                >
                  {purchasePoints.isPending ? (
                    'Processing...'
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-4 w-4" />
                      Purchase Points (Demo)
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>

            <Card className="border-blue-500/50 bg-blue-500/5">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-blue-500" />
                  Coming Soon: Stripe Integration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Real payment processing with Stripe will be available soon. For now, enjoy demo purchases to test the system!
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Redeem Items Tab */}
          <TabsContent value="redeem" className="space-y-6">
            {itemsLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading store items...</p>
              </div>
            ) : storeItems.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <img 
                    src="/assets/generated/points-shopping-cart.dim_300x300.png" 
                    alt="Empty Store" 
                    className="w-32 h-32 mx-auto mb-4 opacity-50"
                  />
                  <h3 className="text-lg font-semibold mb-2">No Items Available</h3>
                  <p className="text-muted-foreground">
                    Check back soon! New items are added regularly.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {storeItems.map((item) => (
                  <Card key={item.id} className="flex flex-col">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{item.name}</CardTitle>
                          <CardDescription className="mt-1">{item.description}</CardDescription>
                        </div>
                        <Badge variant="secondary" className="ml-2">
                          <Coins className="h-3 w-3 mr-1" />
                          {Number(item.price)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                        <Package className="h-12 w-12 text-muted-foreground" />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button
                        className="w-full"
                        onClick={() => handlePurchaseItem(item.id, item.name, item.price)}
                        disabled={purchaseStoreItem.isPending || Number(item.price) > userPoints}
                      >
                        {purchaseStoreItem.isPending ? (
                          'Processing...'
                        ) : Number(item.price) > userPoints ? (
                          <>
                            <Coins className="mr-2 h-4 w-4" />
                            Need {Number(item.price) - userPoints} more
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="mr-2 h-4 w-4" />
                            Redeem for {Number(item.price)} pts
                          </>
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </ScrollArea>
  );
}
