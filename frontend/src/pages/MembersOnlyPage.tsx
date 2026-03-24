import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Crown, Lock, Star, Sparkles, Zap, Clock, Gift } from 'lucide-react';
import { useGetCallerUserProfile, useGetPremiumContent, useUpgradeToPremium, useActivateFreeTrial } from '../hooks/useQueries';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';

export default function MembersOnlyPage() {
  const { data: userProfile, isLoading: profileLoading } = useGetCallerUserProfile();
  const { data: premiumContent, isLoading: contentLoading } = useGetPremiumContent();
  const upgradeMutation = useUpgradeToPremium();
  const activateTrialMutation = useActivateFreeTrial();
  const [selectedMonths, setSelectedMonths] = useState(1);

  const isPremium = userProfile?.isPremiumMember || false;
  const hasTrialStarted = userProfile?.freeTrialStartTime !== undefined && userProfile?.freeTrialStartTime !== null;
  const hasActiveFreeTrial = hasTrialStarted && userProfile?.freeTrialExpiresAt !== undefined && userProfile?.freeTrialExpiresAt !== null && 
    Date.now() * 1000000 < Number(userProfile.freeTrialExpiresAt);
  const isTrialExpired = hasTrialStarted && !hasActiveFreeTrial;
  const canAccessPremium = isPremium || hasActiveFreeTrial;

  const handleUpgrade = () => {
    upgradeMutation.mutate(BigInt(selectedMonths));
  };

  const handleActivateTrial = () => {
    activateTrialMutation.mutate();
  };

  const getTrialTimeRemaining = () => {
    if (!hasActiveFreeTrial || !userProfile?.freeTrialExpiresAt) return '';
    const expiresAt = Number(userProfile.freeTrialExpiresAt) / 1000000;
    const now = Date.now();
    const diff = expiresAt - now;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} remaining`;
    return `${hours} hour${hours > 1 ? 's' : ''} remaining`;
  };

  if (profileLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
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
            <div className="relative">
              <Crown className="h-20 w-20 text-yellow-500" />
              <Sparkles className="h-8 w-8 text-yellow-400 absolute -top-2 -right-2 animate-pulse" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 bg-clip-text text-transparent">
            Members-Only Area
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Exclusive content and early access previews for premium members
          </p>
        </div>

        {/* Premium Status */}
        {!canAccessPremium && !isTrialExpired ? (
          <Alert className="border-yellow-500/50 bg-yellow-500/10">
            <Lock className="h-5 w-5 text-yellow-500" />
            <AlertTitle className="text-yellow-500">Premium Membership Required</AlertTitle>
            <AlertDescription>
              Start your free 3-day trial or upgrade to premium to unlock exclusive content, early access to new features, and special perks!
            </AlertDescription>
          </Alert>
        ) : hasActiveFreeTrial ? (
          <Alert className="border-blue-500/50 bg-blue-500/10">
            <Gift className="h-5 w-5 text-blue-500" />
            <AlertTitle className="text-blue-500">Free Trial Active</AlertTitle>
            <AlertDescription>
              You're enjoying premium access! {getTrialTimeRemaining()} in your trial. Upgrade now to continue after your trial ends.
            </AlertDescription>
          </Alert>
        ) : isTrialExpired ? (
          <Alert className="border-orange-500/50 bg-orange-500/10">
            <Clock className="h-5 w-5 text-orange-500" />
            <AlertTitle className="text-orange-500">Trial Expired – Upgrade Now</AlertTitle>
            <AlertDescription>
              Your free trial has ended. Upgrade to premium to continue enjoying exclusive content and benefits!
            </AlertDescription>
          </Alert>
        ) : (
          <Alert className="border-green-500/50 bg-green-500/10">
            <Crown className="h-5 w-5 text-green-500" />
            <AlertTitle className="text-green-500">Premium Member</AlertTitle>
            <AlertDescription>
              Welcome back! Enjoy your exclusive access to premium content.
            </AlertDescription>
          </Alert>
        )}

        {/* Free Trial Banner */}
        {!hasTrialStarted && !isPremium && (
          <Card className="border-blue-500/50 bg-gradient-to-r from-blue-500/10 to-purple-500/10">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <Gift className="h-7 w-7 text-blue-500" />
                    Try Premium Free for 3 Days!
                  </CardTitle>
                  <CardDescription className="mt-2 text-base">
                    Experience all premium features with no commitment. Cancel anytime during your trial.
                  </CardDescription>
                </div>
                <img
                  src="/assets/generated/free-trial-banner.dim_600x200.png"
                  alt="Free Trial"
                  className="hidden md:block w-32 h-auto opacity-80"
                />
              </div>
            </CardHeader>
            <CardContent>
              <Button
                onClick={handleActivateTrial}
                disabled={activateTrialMutation.isPending}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold"
                size="lg"
              >
                {activateTrialMutation.isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Activating...
                  </>
                ) : (
                  <>
                    <Gift className="h-5 w-5 mr-2" />
                    Start Free Trial
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Upgrade Section */}
        {!isPremium && (
          <Card className="border-yellow-500/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-6 w-6 text-yellow-500" />
                Upgrade to Premium
              </CardTitle>
              <CardDescription>
                Choose your membership duration and unlock exclusive benefits
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { months: 1, price: '$9.99', popular: false },
                  { months: 3, price: '$24.99', popular: true },
                  { months: 12, price: '$79.99', popular: false },
                ].map((plan) => (
                  <Card
                    key={plan.months}
                    className={`cursor-pointer transition-all ${
                      selectedMonths === plan.months
                        ? 'border-yellow-500 shadow-lg shadow-yellow-500/20'
                        : 'hover:border-yellow-500/50'
                    } ${plan.popular ? 'border-yellow-500/50' : ''}`}
                    onClick={() => setSelectedMonths(plan.months)}
                  >
                    <CardHeader>
                      {plan.popular && (
                        <Badge className="w-fit mb-2 bg-yellow-500 text-black">Most Popular</Badge>
                      )}
                      <CardTitle>{plan.months} {plan.months === 1 ? 'Month' : 'Months'}</CardTitle>
                      <CardDescription className="text-2xl font-bold text-foreground">
                        {plan.price}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  Premium Benefits:
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    Early access to new features and updates
                  </li>
                  <li className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    Exclusive premium content and previews
                  </li>
                  <li className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    Priority support and assistance
                  </li>
                  <li className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    Special premium badge on your profile
                  </li>
                  <li className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    Ad-free experience across the platform
                  </li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={handleUpgrade}
                  disabled={upgradeMutation.isPending}
                  className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-semibold"
                  size="lg"
                >
                  {upgradeMutation.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Crown className="h-5 w-5 mr-2" />
                      Upgrade Now
                    </>
                  )}
                </Button>
                
                <Button
                  disabled
                  variant="outline"
                  className="flex-1 border-yellow-500/50 text-yellow-500 relative"
                  size="lg"
                >
                  <img
                    src="/assets/generated/yearly-membership-badge-transparent.dim_150x50.png"
                    alt="Yearly"
                    className="h-4 mr-2 opacity-70"
                  />
                  Yearly Membership
                  <Badge className="ml-2 bg-yellow-500/20 text-yellow-500 border-yellow-500/50">
                    Coming Soon
                  </Badge>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Premium Content */}
        {canAccessPremium && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-yellow-500" />
              Exclusive Premium Content
            </h2>

            {contentLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading premium content...</p>
              </div>
            ) : premiumContent && premiumContent.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {premiumContent.map((content) => (
                  <Card key={content.id} className="border-yellow-500/30 hover:border-yellow-500/50 transition-colors">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg">{content.title}</CardTitle>
                        <Badge variant="outline" className="border-yellow-500 text-yellow-500">
                          <Crown className="h-3 w-3 mr-1" />
                          Premium
                        </Badge>
                      </div>
                      <CardDescription>{content.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs text-muted-foreground">
                        Released: {new Date(Number(content.releaseTime) / 1000000).toLocaleDateString()}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <Lock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    No premium content available yet. Check back soon for exclusive updates!
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Preview for Non-Premium Users */}
        {!canAccessPremium && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Lock className="h-6 w-6 text-muted-foreground" />
              Premium Content Preview
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="relative overflow-hidden">
                  <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex items-center justify-center">
                    <div className="text-center">
                      {isTrialExpired ? (
                        <>
                          <img
                            src="/assets/generated/trial-expired-icon-transparent.dim_64x64.png"
                            alt="Trial Expired"
                            className="h-12 w-12 mx-auto mb-2"
                          />
                          <p className="text-sm font-semibold">Trial Expired</p>
                          <p className="text-xs text-muted-foreground">Upgrade to access</p>
                        </>
                      ) : (
                        <>
                          <Lock className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                          <p className="text-sm font-semibold">Premium Only</p>
                        </>
                      )}
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="blur-sm">Exclusive Content {i}</CardTitle>
                    <CardDescription className="blur-sm">
                      Amazing premium content awaits you...
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="blur-sm">
                    <p className="text-sm text-muted-foreground">
                      Unlock this and more with premium membership!
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center py-8 text-sm text-muted-foreground">
          <img
            src="/assets/generated/members-only-vault.dim_300x300.png"
            alt="Members Only"
            className="w-32 h-32 mx-auto mb-4 opacity-50"
          />
          <p>© 2025. Built with love using <a href="https://caffeine.ai" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">caffeine.ai</a></p>
        </div>
      </div>
    </ScrollArea>
  );
}
