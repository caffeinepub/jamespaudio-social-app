import { Button } from '@/components/ui/button';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { MessageCircle, Users, Search, Sparkles, Music, Video, Film, Radio } from 'lucide-react';

export default function WelcomePage() {
  const { login, isLoggingIn } = useInternetIdentity();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <header className="border-b border-border/40 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <img src="/assets/generated/jamesppaudio-logo-transparent.dim_200x200.png" alt="JAMESPaudio" className="h-10 w-10" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              JAMESPaudio
            </span>
          </div>
          <Button onClick={login} disabled={isLoggingIn} size="lg">
            {isLoggingIn ? 'Connecting...' : 'Login'}
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl font-bold tracking-tight lg:text-6xl">
                Your Creative Social Hub
              </h1>
              <p className="text-xl text-muted-foreground">
                Connect, create, and share. Music, videos, apps, and more - all in one decentralized platform on the Internet Computer.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <FeatureItem
                icon={<MessageCircle className="h-6 w-6" />}
                title="Social Chat"
                description="Real-time messaging with friends"
              />
              <FeatureItem
                icon={<Music className="h-6 w-6" />}
                title="Music Library"
                description="Upload and share your tracks"
              />
              <FeatureItem
                icon={<Sparkles className="h-6 w-6" />}
                title="AI Generator"
                description="Create unique AI songs"
              />
              <FeatureItem
                icon={<Video className="h-6 w-6" />}
                title="Video Sharing"
                description="Upload and watch videos"
              />
              <FeatureItem
                icon={<Film className="h-6 w-6" />}
                title="Movies"
                description="Stream your favorite films"
              />
              <FeatureItem
                icon={<Radio className="h-6 w-6" />}
                title="Radio Stations"
                description="Listen to curated streams"
              />
            </div>

            <Button onClick={login} disabled={isLoggingIn} size="lg" className="w-full sm:w-auto">
              {isLoggingIn ? 'Connecting...' : 'Get Started'}
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-accent/20 blur-3xl" />
            <img
              src="/assets/generated/welcome-hero.dim_800x600.png"
              alt="JAMESPaudio Hero"
              className="relative rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      </main>

      <footer className="border-t border-border/40 bg-background/80 backdrop-blur-sm mt-24">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          © 2025. Built with ❤️ using{' '}
          <a href="https://caffeine.ai" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">
            caffeine.ai
          </a>
        </div>
      </footer>
    </div>
  );
}

function FeatureItem({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-sm">{title}</h3>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
