import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Music, Sparkles, Users, Video, Radio, Film, MessageCircle, Zap } from 'lucide-react';

export default function LoginPage() {
  const { login, isLoggingIn } = useInternetIdentity();

  const features = [
    { icon: Music, label: 'Music Library', color: 'text-orange-500' },
    { icon: Video, label: 'Video Sharing', color: 'text-orange-600' },
    { icon: Sparkles, label: 'AI Generator', color: 'text-orange-400' },
    { icon: MessageCircle, label: 'Real-time Chat', color: 'text-orange-500' },
    { icon: Film, label: 'Movies & TV', color: 'text-orange-600' },
    { icon: Radio, label: 'Radio Stations', color: 'text-orange-400' },
    { icon: Users, label: 'Social Network', color: 'text-orange-500' },
    { icon: Zap, label: 'Points System', color: 'text-orange-600' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-background to-orange-50 dark:from-orange-950/20 dark:via-background dark:to-orange-950/20">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <img 
              src="/assets/generated/jamesppaudio-logo-transparent.dim_200x200.png" 
              alt="JAMESPaudio" 
              className="h-10 w-10" 
            />
            <span className="text-xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
              JAMESPaudio
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 md:py-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center max-w-6xl mx-auto">
          {/* Left Side - Branding & Info */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-block">
                <div className="flex items-center gap-3 mb-4">
                  <img 
                    src="/assets/generated/jamesppaudio-logo-transparent.dim_200x200.png" 
                    alt="JAMESPaudio" 
                    className="h-16 w-16" 
                  />
                  <div>
                    <h1 className="text-5xl font-bold tracking-tight lg:text-6xl bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                      JAMESPaudio
                    </h1>
                    <p className="text-lg text-muted-foreground">Your Creative Social Hub</p>
                  </div>
                </div>
              </div>
              
              <p className="text-xl text-muted-foreground">
                Connect, create, and share. Music, videos, apps, and more - all in one decentralized platform on the Internet Computer.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div 
                    key={feature.label}
                    className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border/50 hover:border-orange-500/50 transition-colors"
                  >
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-500/10 ${feature.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-medium">{feature.label}</span>
                  </div>
                );
              })}
            </div>

            {/* Hero Image */}
            <div className="relative hidden lg:block">
              <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/20 to-orange-600/20 blur-3xl" />
              <img
                src="/assets/generated/login-page-bg.dim_800x600.png"
                alt="JAMESPaudio Platform"
                className="relative rounded-2xl shadow-2xl"
              />
            </div>
          </div>

          {/* Right Side - Login Card */}
          <div className="flex items-center justify-center">
            <Card className="w-full max-w-md border-orange-500/20 shadow-xl">
              <CardHeader className="space-y-3 text-center pb-6">
                <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                  <Music className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-3xl font-bold">Welcome Back</CardTitle>
                <CardDescription className="text-base">
                  Sign in to access your creative social hub
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Login Button */}
                <Button 
                  onClick={login} 
                  disabled={isLoggingIn}
                  size="lg"
                  className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg hover:shadow-xl transition-all"
                >
                  {isLoggingIn ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Connecting...</span>
                    </div>
                  ) : (
                    'Login with Internet Identity'
                  )}
                </Button>

                {/* Signup Info */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">New to JAMESPaudio?</span>
                  </div>
                </div>

                <Button 
                  onClick={login} 
                  disabled={isLoggingIn}
                  variant="outline"
                  size="lg"
                  className="w-full h-12 text-lg font-semibold border-orange-500/50 hover:bg-orange-500/10 hover:border-orange-500 transition-all"
                >
                  {isLoggingIn ? 'Connecting...' : 'Sign Up'}
                </Button>

                {/* Info Text */}
                <div className="space-y-3 pt-4">
                  <div className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Zap className="h-4 w-4 text-orange-500 mt-0.5 shrink-0" />
                    <p>Secure authentication powered by Internet Identity</p>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Sparkles className="h-4 w-4 text-orange-500 mt-0.5 shrink-0" />
                    <p>Start earning points and unlock premium features</p>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4 text-orange-500 mt-0.5 shrink-0" />
                    <p>Join a vibrant community of creators</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-background/80 backdrop-blur-sm mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          © 2025. Built with ❤️ using{' '}
          <a href="https://caffeine.ai" target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:text-orange-600 underline transition-colors">
            caffeine.ai
          </a>
        </div>
      </footer>
    </div>
  );
}
