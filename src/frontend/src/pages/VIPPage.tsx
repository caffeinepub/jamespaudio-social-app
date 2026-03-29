import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, Crown, Flame, Lock, Sparkles, Star, Zap } from "lucide-react";
import { toast } from "sonner";

const TRIAL_PERKS = [
  "All chat text effects (flames, skulls, dodge)",
  "Ultra Search engine",
  "Advanced AI Chatbot tools",
  "Package Fixer AI (priority)",
  "Exclusive purple & cyan text colors",
  "No ads during trial",
];

const MONTHLY_PERKS = [
  ...TRIAL_PERKS,
  "7-month price lock (save 30%)",
  "VIP badge on profile",
  "Early access to new features",
  "Priority customer support",
];

const ALL_VIP_PERKS = [
  { icon: Flame, label: "Advanced flame & dodge chat effects", tier: "Ultra" },
  { icon: Sparkles, label: "AI Chatbot full tool suite", tier: "Pro" },
  { icon: Crown, label: "VIP badge on your profile", tier: "VIP" },
  { icon: Star, label: "JAMESPaudio Shines bonus (2×)", tier: "VIP" },
  { icon: Zap, label: "Ultra Search engine access", tier: "Ultra" },
  { icon: Lock, label: "Members-only exclusive content", tier: "Pro" },
];

export default function VIPPage() {
  const handleCTA = (plan: string) => {
    toast.info(`Coming soon — ${plan} payments launching soon!`);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="relative h-48 bg-gradient-to-br from-yellow-600 via-amber-500 to-orange-600 overflow-hidden flex-shrink-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.15)_0%,transparent_70%)]" />
        <div className="relative z-10 container mx-auto px-4 h-full flex items-center gap-4">
          <div className="h-20 w-20 rounded-2xl bg-white/20 flex items-center justify-center">
            <Crown className="h-12 w-12 text-white" />
          </div>
          <div>
            <h1 className="text-5xl font-bold text-white">VIP Membership</h1>
            <p className="text-white/90 text-lg">
              Unlock the full JAMESPaudio experience
            </p>
          </div>
          <Badge className="ml-auto bg-white text-yellow-700 font-bold text-sm">
            NEW
          </Badge>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="container mx-auto px-4 py-8 max-w-4xl space-y-8">
          {/* Plan Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Free Trial */}
            <Card className="border-2 border-yellow-400 shadow-lg shadow-yellow-500/20 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 to-amber-400" />
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <Badge className="bg-yellow-400 text-yellow-900 font-bold">
                    FREE TRIAL
                  </Badge>
                  <Crown className="h-6 w-6 text-yellow-500" />
                </div>
                <CardTitle className="text-2xl mt-2">Try VIP Free</CardTitle>
                <div className="text-4xl font-bold text-yellow-500">6 Days</div>
                <p className="text-muted-foreground text-sm">
                  No credit card required to start
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {TRIAL_PERKS.map((perk) => (
                    <li key={perk} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                      {perk}
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-yellow-950 font-bold"
                  onClick={() => handleCTA("Free Trial")}
                  data-ocid="vip.primary_button"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Start Free Trial
                </Button>
              </CardContent>
            </Card>

            {/* 7-Month Plan */}
            <Card className="border-2 border-purple-500 shadow-lg shadow-purple-500/20 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-indigo-500" />
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <Badge className="bg-purple-500 text-white font-bold">
                    BEST VALUE
                  </Badge>
                  <Star className="h-6 w-6 text-purple-400" />
                </div>
                <CardTitle className="text-2xl mt-2">
                  VIP 7-Month Plan
                </CardTitle>
                <div>
                  <span className="text-4xl font-bold text-purple-400">
                    $9.99
                  </span>
                  <span className="text-muted-foreground">/mo</span>
                </div>
                <p className="text-sm text-emerald-500 font-medium">
                  Save 30% vs monthly billing
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {MONTHLY_PERKS.map((perk) => (
                    <li key={perk} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-purple-400 flex-shrink-0" />
                      {perk}
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full bg-purple-600 hover:bg-purple-700 font-bold"
                  onClick={() => handleCTA("7-Month Plan")}
                  data-ocid="vip.secondary_button"
                >
                  <Crown className="h-4 w-4 mr-2" />
                  Get 7-Month Plan
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* VIP Perks Showcase */}
          <div>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Zap className="h-6 w-6 text-yellow-500" />
              All VIP Perks
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {ALL_VIP_PERKS.map((perk) => {
                const Icon = perk.icon;
                return (
                  <Card key={perk.label} className="border-border/50">
                    <CardContent className="flex items-start gap-3 pt-4">
                      <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{perk.label}</p>
                        <Badge variant="outline" className="text-xs mt-1">
                          {perk.tier}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          <Card className="border-amber-500/30 bg-amber-500/5">
            <CardContent className="py-4 text-center">
              <p className="text-sm text-muted-foreground">
                💳 Payments launching soon — join the waitlist by starting your
                free trial!
              </p>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
}
