import { HelpCircle, Coins, AppWindow, Crown, Mail, MessageCircle, BookOpen, Zap, Calculator, Mic, Sparkles, Volume2, Package } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

export default function HelpPage() {
  const helpSections = [
    {
      icon: BookOpen,
      title: 'Getting Started',
      description: 'Learn the basics of using JAMESPaudio',
      color: 'text-blue-500',
    },
    {
      icon: Coins,
      title: 'Earning Points',
      description: 'Discover all the ways to earn points',
      color: 'text-yellow-500',
    },
    {
      icon: AppWindow,
      title: 'Publishing Apps',
      description: 'Share your apps with the community',
      color: 'text-green-500',
    },
    {
      icon: Crown,
      title: 'Premium Features',
      description: 'Unlock exclusive content and benefits',
      color: 'text-purple-500',
    },
  ];

  const faqs = [
    {
      question: 'How do I create an account?',
      answer: 'Click the "Login" button and authenticate using Internet Identity. After logging in for the first time, you\'ll be prompted to create your profile with a username and bio.',
    },
    {
      question: 'How do I earn points?',
      answer: 'You can earn points through various activities: claiming daily rewards (10 points per day), opening daily mystery boxes, sending messages, posting updates, uploading content, following other users, and engaging with the community. Check the Points page to see your earning history and available actions.',
    },
    {
      question: 'What are daily rewards?',
      answer: 'Daily rewards allow you to claim random points once per day. Visit the Daily Rewards page to claim your reward. Building a streak by claiming rewards consecutively can earn you bonus points!',
    },
    {
      question: 'What is the Daily Items Secret?',
      answer: 'Daily Items Secret is a fun feature where you can open a mystery box once per day to reveal a random surprise reward. Rewards include bonus points, temporary badges, mystery messages, and exclusive visuals. Visit the Daily Items Secret page to claim your daily mystery item!',
    },
    {
      question: 'How do I publish an app?',
      answer: 'To publish an app, you need at least 70 points. Once you have enough points, go to the Published Apps page, fill in your app details (title, developer name, link, description), and submit. Your app will be visible to the entire community.',
    },
    {
      question: 'What is the Points Store?',
      answer: 'The Points Store allows you to spend your earned points on exclusive items, content, and features. You can also purchase additional points if needed. Visit the Points Store to browse available items.',
    },
    {
      question: 'How do I get premium membership?',
      answer: 'New users can activate a free 3-day trial in the Members-Only area. After the trial, you can upgrade to premium membership for exclusive content, early access to features, and special benefits. Yearly membership options are coming soon!',
    },
    {
      question: 'What are badges and how do I earn them?',
      answer: 'Badges are achievements you earn for specific actions like daily logins, publishing apps, and following other users. Your earned badges are displayed on your profile page.',
    },
    {
      question: 'How do I upload music?',
      answer: 'Go to the Music page and click "Upload Track". Fill in the track details (title, artist, genre) and select your audio file. Your uploaded music will be visible to your friends and can be played directly in the app.',
    },
    {
      question: 'Can I see what my friends are listening to?',
      answer: 'Yes! The Music page automatically displays songs uploaded by your friends in the "Friends\' Music" section, making it easy to discover and play their tracks.',
    },
    {
      question: 'How does the chat system work?',
      answer: 'Navigate to the Chats page to send and receive messages with other users. Your messages appear in orange, while received messages appear in gray. The chat list shows when each contact was last online.',
    },
    {
      question: 'What is the Creator Studio?',
      answer: 'The Creator Studio is your dashboard for managing all your uploaded content including music, videos, movies, and radio streams. You can also view analytics and engagement metrics for your content.',
    },
    {
      question: 'How do I search for content?',
      answer: 'Use the Search page to find users by username, or visit the Search Engine page for comprehensive searches across apps, music, videos, movies, and math problems with advanced filters and voice search.',
    },
    {
      question: 'How do I use Voice Search?',
      answer: 'On the Search Engine page, click the microphone icon in the search bar and speak your query. Voice search works for all search types including math problems. Make sure to allow microphone access when prompted.',
    },
    {
      question: 'How do I use Math Search?',
      answer: 'Go to the Search Engine page and select the Math tab, or enter a math problem in the search bar. The advanced solver can handle quadratic equations, sequences, geometry, statistics, and more. Results include detailed step-by-step solutions.',
    },
    {
      question: 'What is the AI Voice Assistant?',
      answer: 'The AI Voice Assistant verbally responds to your math queries with spoken answers. When you solve a math problem, the assistant will say the result aloud, like "Okay, I can help with that. 50 × 50 = 2500." You can enable or disable this feature in Settings.',
    },
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="relative h-48 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 overflow-hidden">
        <img 
          src="/assets/generated/customer-support-hero.dim_400x300.png" 
          alt="Help & Support" 
          className="absolute inset-0 w-full h-full object-cover opacity-20" 
        />
        <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <img 
                src="/assets/generated/help-support-icon-transparent.dim_64x64.png" 
                alt="Help" 
                className="h-12 w-12" 
              />
              <h1 className="text-4xl font-bold text-white">Help & Support</h1>
            </div>
            <p className="text-white/90">Everything you need to know about JAMESPaudio</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="container mx-auto px-4 py-8 space-y-8">
            {/* Quick Help Sections */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">Quick Help</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {helpSections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <Card key={section.title} className="hover:shadow-lg transition-shadow cursor-pointer">
                      <CardHeader>
                        <Icon className={`h-8 w-8 ${section.color} mb-2`} />
                        <CardTitle className="text-lg">{section.title}</CardTitle>
                        <CardDescription>{section.description}</CardDescription>
                      </CardHeader>
                    </Card>
                  );
                })}
              </div>
            </div>

            <Separator />

            {/* Earning Points Guide */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Coins className="h-6 w-6 text-yellow-500" />
                  <CardTitle>How to Earn Points</CardTitle>
                </div>
                <CardDescription>Multiple ways to grow your points balance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Zap className="h-4 w-4 text-yellow-500" />
                      Daily Activities
                    </h3>
                    <ul className="space-y-1 text-sm text-muted-foreground ml-6">
                      <li>• Claim daily rewards (10 points/day)</li>
                      <li>• Open daily mystery boxes (random rewards)</li>
                      <li>• Build login streaks for bonus points</li>
                      <li>• Send messages to friends</li>
                      <li>• Post status updates</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Zap className="h-4 w-4 text-green-500" />
                      Content Creation
                    </h3>
                    <ul className="space-y-1 text-sm text-muted-foreground ml-6">
                      <li>• Upload music tracks</li>
                      <li>• Share videos and movies</li>
                      <li>• Publish apps (requires 70 points)</li>
                      <li>• Engage with community content</li>
                    </ul>
                  </div>
                </div>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm">
                    <strong>Tip:</strong> Visit the Points page to track your earning history and see all available ways to earn more points!
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Daily Items Secret Section */}
            <Card className="border-purple-500/50 bg-purple-500/5">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Package className="h-6 w-6 text-purple-500" />
                  <CardTitle>Daily Items Secret</CardTitle>
                </div>
                <CardDescription>Unlock mystery rewards every day</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <img 
                    src="/assets/generated/mystery-box-animation.dim_300x300.png" 
                    alt="Mystery Box" 
                    className="h-12 w-12 object-contain"
                  />
                  <div>
                    <h3 className="font-semibold">Daily Mystery Rewards</h3>
                    <p className="text-sm text-muted-foreground">
                      Open a secret box once per day for surprise items
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold mb-2">How to Use Daily Items Secret:</h4>
                    <ol className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex gap-2">
                        <span className="font-semibold text-foreground">1.</span>
                        <span>Navigate to the Daily Items Secret page from the sidebar</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="font-semibold text-foreground">2.</span>
                        <span>Click "Open Mystery Box" to reveal your daily reward</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="font-semibold text-foreground">3.</span>
                        <span>Watch the animation as your mystery item is revealed</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="font-semibold text-foreground">4.</span>
                        <span>Receive your reward (points, badges, messages, or visuals)</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="font-semibold text-foreground">5.</span>
                        <span>Come back tomorrow for another mystery reward!</span>
                      </li>
                    </ol>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold mb-2">Possible Mystery Items:</h4>
                    <div className="grid gap-2 md:grid-cols-2">
                      <div className="bg-background p-2 rounded border border-border">
                        <p className="font-semibold text-sm">🎁 Bonus Points</p>
                        <p className="text-xs text-muted-foreground">Random amounts of extra points</p>
                      </div>
                      <div className="bg-background p-2 rounded border border-border">
                        <p className="font-semibold text-sm">⭐ Temporary Badges</p>
                        <p className="text-xs text-muted-foreground">Special badges for your profile</p>
                      </div>
                      <div className="bg-background p-2 rounded border border-border">
                        <p className="font-semibold text-sm">💬 Mystery Messages</p>
                        <p className="text-xs text-muted-foreground">Fun messages and surprises</p>
                      </div>
                      <div className="bg-background p-2 rounded border border-border">
                        <p className="font-semibold text-sm">🖼️ Exclusive Visuals</p>
                        <p className="text-xs text-muted-foreground">Unique images for your collection</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm">
                      <strong>Pro Tip:</strong> Combine Daily Items Secret with Daily Rewards to maximize your points earning! Both features refresh daily, so check back every day for maximum rewards.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Publishing Apps Guide */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <AppWindow className="h-6 w-6 text-green-500" />
                  <CardTitle>Publishing Apps</CardTitle>
                </div>
                <CardDescription>Share your applications with the community</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                      1
                    </div>
                    <div>
                      <h4 className="font-semibold">Earn 70 Points</h4>
                      <p className="text-sm text-muted-foreground">
                        You need at least 70 points to publish an app. Earn points through daily activities and content creation.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold">Prepare Your App Details</h4>
                      <p className="text-sm text-muted-foreground">
                        Have your app title, developer name, external link, description, and preview image ready.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                      3
                    </div>
                    <div>
                      <h4 className="font-semibold">Submit Your App</h4>
                      <p className="text-sm text-muted-foreground">
                        Go to the Published Apps page and fill in the submission form. Your app will be visible to all users!
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Premium Features Guide */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Crown className="h-6 w-6 text-purple-500" />
                  <CardTitle>Premium Membership</CardTitle>
                </div>
                <CardDescription>Unlock exclusive benefits and early access</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <h3 className="font-semibold">Free Trial</h3>
                    <p className="text-sm text-muted-foreground">
                      New users get a 3-day free trial with full premium access. Activate it in the Members-Only area.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold">Premium Benefits</h3>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Access to exclusive content</li>
                      <li>• Early access to new features</li>
                      <li>• Premium member badge</li>
                      <li>• Special community perks</li>
                    </ul>
                  </div>
                </div>
                <div className="bg-purple-500/10 border border-purple-500/20 p-4 rounded-lg">
                  <p className="text-sm">
                    <strong>Coming Soon:</strong> Yearly membership options with additional benefits!
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Voice Search Guide */}
            <Card className="border-blue-500/50 bg-blue-500/5">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Mic className="h-6 w-6 text-blue-500" />
                  <CardTitle>Voice Search Guide</CardTitle>
                </div>
                <CardDescription>Use your voice to search across the platform</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <img 
                    src="/assets/generated/voice-search-microphone-transparent.dim_64x64.png" 
                    alt="Voice Search" 
                    className="h-12 w-12"
                  />
                  <div>
                    <h3 className="font-semibold">Voice-Powered Search</h3>
                    <p className="text-sm text-muted-foreground">
                      Search hands-free using speech recognition technology
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold mb-2">How to Use Voice Search:</h4>
                    <ol className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex gap-2">
                        <span className="font-semibold text-foreground">1.</span>
                        <span>Go to the Search Engine page</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="font-semibold text-foreground">2.</span>
                        <span>Click the microphone icon in the search bar</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="font-semibold text-foreground">3.</span>
                        <span>Allow microphone access when prompted by your browser</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="font-semibold text-foreground">4.</span>
                        <span>Speak your search query clearly</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="font-semibold text-foreground">5.</span>
                        <span>Your speech will be converted to text automatically</span>
                      </li>
                    </ol>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold mb-2">Voice Search Tips:</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex gap-2">
                        <span>•</span>
                        <span>Speak clearly and at a normal pace</span>
                      </li>
                      <li className="flex gap-2">
                        <span>•</span>
                        <span>Minimize background noise for better accuracy</span>
                      </li>
                      <li className="flex gap-2">
                        <span>•</span>
                        <span>Works for all search types: users, music, videos, and math problems</span>
                      </li>
                      <li className="flex gap-2">
                        <span>•</span>
                        <span>You can say math problems like "square root of 144" or "5 to the power of 3"</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm">
                      <strong>Note:</strong> Voice search requires a modern browser with speech recognition support (Chrome, Edge, Safari). Make sure to grant microphone permissions when prompted.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Voice Assistant Section */}
            <Card className="border-green-500/50 bg-green-500/5">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Volume2 className="h-6 w-6 text-green-500" />
                  <CardTitle>Voice Assistant</CardTitle>
                </div>
                <CardDescription>AI-powered spoken responses for math problems</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <img 
                    src="/assets/generated/ai-voice-assistant-transparent.dim_64x64.png" 
                    alt="AI Voice Assistant" 
                    className="h-12 w-12"
                  />
                  <div>
                    <h3 className="font-semibold">AI Voice Math Solver</h3>
                    <p className="text-sm text-muted-foreground">
                      Get spoken answers to your math queries
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold mb-2">What is the Voice Assistant?</h4>
                    <p className="text-sm text-muted-foreground">
                      The AI Voice Assistant verbally responds to your math queries with spoken answers. When you solve a math problem using the Math Search feature, the assistant will say the result aloud, making it easier to understand and verify your calculations.
                    </p>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold mb-2">Example Voice Interactions:</h4>
                    <div className="space-y-2">
                      <div className="bg-background p-3 rounded-lg border border-border">
                        <p className="text-sm font-mono mb-1">Query: 50 × 50</p>
                        <p className="text-sm text-muted-foreground">
                          <Volume2 className="h-3 w-3 inline mr-1" />
                          Response: "Okay, I can help with that. 50 × 50 = 2500."
                        </p>
                      </div>
                      <div className="bg-background p-3 rounded-lg border border-border">
                        <p className="text-sm font-mono mb-1">Query: sqrt(144)</p>
                        <p className="text-sm text-muted-foreground">
                          <Volume2 className="h-3 w-3 inline mr-1" />
                          Response: "The square root of 144 is approximately 12."
                        </p>
                      </div>
                      <div className="bg-background p-3 rounded-lg border border-border">
                        <p className="text-sm font-mono mb-1">Query: x^2 + 5x + 6 = 0</p>
                        <p className="text-sm text-muted-foreground">
                          <Volume2 className="h-3 w-3 inline mr-1" />
                          Response: "The quadratic equation has two solutions: x1 equals -2, and x2 equals -3."
                        </p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold mb-2">How to Enable/Disable Voice Responses:</h4>
                    <ol className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex gap-2">
                        <span className="font-semibold text-foreground">1.</span>
                        <span>Navigate to the Settings page from the sidebar menu</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="font-semibold text-foreground">2.</span>
                        <span>Find the "AI Voice Assistant" section</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="font-semibold text-foreground">3.</span>
                        <span>Toggle the "AI Voice Responses" switch on or off</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="font-semibold text-foreground">4.</span>
                        <span>Your preference is saved automatically</span>
                      </li>
                    </ol>
                  </div>

                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm">
                      <strong>Pro Tip:</strong> The Voice Assistant works best when combined with Voice Search! Speak your math problem, and the AI will respond with a spoken answer. This creates a fully hands-free math solving experience.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Advanced Math Search Help Section */}
            <Card className="border-green-500/50 bg-green-500/5">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Calculator className="h-6 w-6 text-green-500" />
                  <CardTitle>Advanced Math Search</CardTitle>
                </div>
                <CardDescription>Solve complex mathematical problems with detailed explanations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <img 
                    src="/assets/generated/advanced-math-calculator.dim_400x300.png" 
                    alt="Advanced Math" 
                    className="h-12 w-12 object-cover rounded"
                  />
                  <div>
                    <h3 className="font-semibold">Advanced Math Solver</h3>
                    <p className="text-sm text-muted-foreground">
                      Solve complex equations with step-by-step explanations and mathematical reasoning
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold mb-2">How to Use Advanced Math Search:</h4>
                    <ol className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex gap-2">
                        <span className="font-semibold text-foreground">1.</span>
                        <span>Go to the Search Engine page</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="font-semibold text-foreground">2.</span>
                        <span>Click on the "Math" tab or enter your problem in the search bar</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="font-semibold text-foreground">3.</span>
                        <span>Type your math problem using standard notation (or use voice search)</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="font-semibold text-foreground">4.</span>
                        <span>Press Enter or click Search to get detailed results with step-by-step solutions</span>
                      </li>
                    </ol>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold mb-2">Supported Advanced Operations:</h4>
                    <div className="grid gap-3 md:grid-cols-2">
                      <div className="bg-background p-3 rounded-lg">
                        <p className="font-semibold text-sm mb-1">Quadratic Equations</p>
                        <p className="text-xs text-muted-foreground">Solve ax² + bx + c = 0 with discriminant analysis</p>
                        <p className="text-xs font-mono mt-1">Example: x^2 + 5x + 6 = 0</p>
                      </div>
                      <div className="bg-background p-3 rounded-lg">
                        <p className="font-semibold text-sm mb-1">Arithmetic Sequences</p>
                        <p className="text-xs text-muted-foreground">Find nth term of arithmetic progressions</p>
                        <p className="text-xs font-mono mt-1">Example: a=2 d=3 n=10</p>
                      </div>
                      <div className="bg-background p-3 rounded-lg">
                        <p className="font-semibold text-sm mb-1">Geometric Sequences</p>
                        <p className="text-xs text-muted-foreground">Calculate nth term with common ratio</p>
                        <p className="text-xs font-mono mt-1">Example: a=2 r=3 n=5</p>
                      </div>
                      <div className="bg-background p-3 rounded-lg">
                        <p className="font-semibold text-sm mb-1">Advanced Geometry</p>
                        <p className="text-xs text-muted-foreground">Circle area, sphere volume, Pythagorean theorem</p>
                        <p className="text-xs font-mono mt-1">Example: volume sphere radius 3</p>
                      </div>
                      <div className="bg-background p-3 rounded-lg">
                        <p className="font-semibold text-sm mb-1">Statistics</p>
                        <p className="text-xs text-muted-foreground">Mean, median, mode calculations</p>
                        <p className="text-xs font-mono mt-1">Example: mean 10 20 30 40</p>
                      </div>
                      <div className="bg-background p-3 rounded-lg">
                        <p className="font-semibold text-sm mb-1">Basic Operations</p>
                        <p className="text-xs text-muted-foreground">Arithmetic, roots, exponents, percentages, factorials</p>
                        <p className="text-xs font-mono mt-1">Example: sqrt(144), 5^3, 10!</p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold mb-2">Example Complex Problems:</h4>
                    <div className="space-y-2">
                      <div className="bg-background p-2 rounded border border-border">
                        <p className="text-sm font-mono">x^2 + 5x + 6 = 0</p>
                        <p className="text-xs text-muted-foreground">Solve quadratic equation with two real solutions</p>
                      </div>
                      <div className="bg-background p-2 rounded border border-border">
                        <p className="text-sm font-mono">pythagorean a=3 b=4</p>
                        <p className="text-xs text-muted-foreground">Find hypotenuse using Pythagorean theorem</p>
                      </div>
                      <div className="bg-background p-2 rounded border border-border">
                        <p className="text-sm font-mono">volume sphere radius 5</p>
                        <p className="text-xs text-muted-foreground">Calculate volume of a sphere</p>
                      </div>
                      <div className="bg-background p-2 rounded border border-border">
                        <p className="text-sm font-mono">mean 15 20 25 30 35</p>
                        <p className="text-xs text-muted-foreground">Calculate statistical mean of numbers</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm">
                      <strong>Pro Tip:</strong> Advanced Math Search provides detailed step-by-step solutions with mathematical reasoning and explanations, helping you understand not just the answer, but the entire problem-solving process!
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Coming Soon Features */}
            <Card className="border-yellow-500/50 bg-yellow-500/5">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-6 w-6 text-yellow-500" />
                  <CardTitle>Coming Soon Features</CardTitle>
                </div>
                <CardDescription>Exciting new features on the horizon</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Badge variant="outline" className="mt-1">Coming Soon</Badge>
                    <div>
                      <h4 className="font-semibold">Intelligent Spelling Correction</h4>
                      <p className="text-sm text-muted-foreground">
                        Advanced typo detection and automatic correction for all search inputs. The system will suggest corrections and help you find what you're looking for even with misspellings.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Badge variant="outline" className="mt-1">Coming Soon</Badge>
                    <div>
                      <h4 className="font-semibold">Yearly Premium Membership</h4>
                      <p className="text-sm text-muted-foreground">
                        Subscribe to yearly premium membership with exclusive benefits and significant savings compared to monthly plans.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Badge variant="outline" className="mt-1">Coming Soon</Badge>
                    <div>
                      <h4 className="font-semibold">Groups & Communities</h4>
                      <p className="text-sm text-muted-foreground">
                        Create and manage your own groups, build communities around shared interests, and collaborate with other users.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Separator />

            {/* FAQs */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            <Separator />

            {/* Contact Support */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-6 w-6 text-blue-500" />
                  <CardTitle>Need More Help?</CardTitle>
                </div>
                <CardDescription>Get in touch with our support team</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-semibold">Email Support</p>
                    <p className="text-sm text-muted-foreground">support@jamesppaudio.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <MessageCircle className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-semibold">Community Chat</p>
                    <p className="text-sm text-muted-foreground">Join our community chat for quick help from other users</p>
                  </div>
                </div>
                <Button className="w-full md:w-auto">
                  Contact Support
                </Button>
              </CardContent>
            </Card>

            {/* Footer */}
            <div className="text-center text-sm text-muted-foreground py-4">
              <p>© 2025. Built with love using <a href="https://caffeine.ai" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">caffeine.ai</a></p>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
