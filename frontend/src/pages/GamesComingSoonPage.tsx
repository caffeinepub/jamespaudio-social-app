import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Gamepad2, Sparkles, Trophy, Users, Zap } from 'lucide-react';
import { useGetUpcomingGames } from '../hooks/useQueries';

export default function GamesComingSoonPage() {
  const { data: upcomingGames, isLoading } = useGetUpcomingGames();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading games...</p>
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
              <Gamepad2 className="h-20 w-20 text-primary" />
              <Sparkles className="h-8 w-8 text-primary absolute -top-2 -right-2 animate-pulse" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 bg-clip-text text-transparent">
            Games Coming Soon
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get ready for an exciting gaming experience on JAMESPaudio!
          </p>
        </div>

        {/* Hero Image */}
        <div className="relative rounded-lg overflow-hidden shadow-2xl">
          <img
            src="/assets/generated/gaming-teaser-hero.dim_800x600.png"
            alt="Gaming Teaser"
            className="w-full h-auto"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent flex items-end">
            <div className="p-8 w-full">
              <Badge className="mb-4 bg-purple-500 text-white">Coming Soon</Badge>
              <h2 className="text-3xl font-bold mb-2">Gaming Platform Launch</h2>
              <p className="text-muted-foreground max-w-2xl">
                Play, compete, and connect with friends through our upcoming gaming platform. Multiple genres, achievements, and more!
              </p>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-purple-500/30">
            <CardHeader>
              <Trophy className="h-10 w-10 text-yellow-500 mb-2" />
              <CardTitle>Achievements</CardTitle>
              <CardDescription>
                Earn badges and trophies as you complete challenges and reach milestones
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="border-pink-500/30">
            <CardHeader>
              <Users className="h-10 w-10 text-pink-500 mb-2" />
              <CardTitle>Multiplayer</CardTitle>
              <CardDescription>
                Challenge your friends and compete in real-time multiplayer matches
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="border-red-500/30">
            <CardHeader>
              <Zap className="h-10 w-10 text-red-500 mb-2" />
              <CardTitle>Leaderboards</CardTitle>
              <CardDescription>
                Climb the ranks and prove you're the best player on the platform
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Upcoming Games */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Gamepad2 className="h-6 w-6" />
            Upcoming Game Titles
          </h2>

          {upcomingGames && upcomingGames.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {upcomingGames.map((game, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow border-primary/30">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{game.title}</CardTitle>
                      <Badge variant="outline">{game.genre}</Badge>
                    </div>
                    <CardDescription className="mt-2">{game.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full" disabled>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Coming Soon
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { title: 'Puzzle Master', genre: 'Puzzle', description: 'Challenge your mind with brain-teasing puzzles' },
                { title: 'Speed Racer', genre: 'Racing', description: 'Race against friends in high-speed competitions' },
                { title: 'Word Quest', genre: 'Word', description: 'Expand your vocabulary in this word adventure' },
                { title: 'Strategy Wars', genre: 'Strategy', description: 'Build your empire and conquer opponents' },
                { title: 'Rhythm Beat', genre: 'Music', description: 'Feel the beat and hit the perfect notes' },
                { title: 'Trivia Challenge', genre: 'Trivia', description: 'Test your knowledge across various topics' },
              ].map((game, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{game.title}</CardTitle>
                      <Badge variant="outline">{game.genre}</Badge>
                    </div>
                    <CardDescription className="mt-2">{game.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full" disabled>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Coming Soon
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-red-500/10 border-primary/30">
          <CardContent className="py-12 text-center">
            <Gamepad2 className="h-16 w-16 text-primary mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">Stay Tuned!</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              We're working hard to bring you the best gaming experience. Follow us for updates and be the first to know when games launch!
            </p>
            <Button size="lg" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
              <Sparkles className="h-5 w-5 mr-2" />
              Get Notified
            </Button>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center py-8 text-sm text-muted-foreground">
          <p>© 2025. Built with love using <a href="https://caffeine.ai" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">caffeine.ai</a></p>
        </div>
      </div>
    </ScrollArea>
  );
}
