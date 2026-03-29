import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Newspaper } from "lucide-react";

export default function WhatsNewPage() {
  const content = `Welcome to JAMESPaudio Social App!

🎵 New Features:
• Music Library - Upload and share your favorite tracks
• AI Song Generator - Create unique AI-generated music
• Video & Movie Streaming - Watch and share content
• Live TV - Watch simulated TV channels (Entertainment, News, Music)
• Radio Stations - Listen to curated music streams
• Published Apps - Share your creations with the community
• Creator Studio - Manage all your content in one place
• Daily Rewards - Claim random points once per day
• Badges System - Earn badges for achievements
• Groups - Coming soon! Create and manage your own communities

🎉 Recent Updates:
• Enhanced user profiles with points system and badges
• Daily rewards system with login streaks
• Live TV section with multiple channels
• Improved media playback experience
• New creative tools for content creators
• Better navigation and user interface
• Settings page for background music control
• Persistent storage for published content

🏆 Achievements:
• Earn badges for daily logins, publishing apps, and more
• Build your login streak with daily rewards
• Unlock features by earning points

Stay tuned for more exciting features coming soon!`;

  return (
    <div className="h-full flex flex-col">
      <div className="relative h-48 bg-gradient-to-br from-news-primary via-news-secondary to-news-accent overflow-hidden">
        <img
          src="/assets/generated/news-announcement.dim_300x300.png"
          alt="News"
          className="absolute right-0 top-0 h-full opacity-20"
        />
        <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <Newspaper className="h-10 w-10" />
              What's New
            </h1>
            <p className="text-white/90">Latest updates and announcements</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="container mx-auto px-4 py-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Platform Announcements</CardTitle>
                <CardDescription>
                  Stay updated with the latest news
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="prose dark:prose-invert max-w-none">
                  <pre className="whitespace-pre-wrap font-sans text-sm">
                    {content}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
