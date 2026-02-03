import { useState } from 'react';
import { Home, MessageCircle, Search, User, Music, Sparkles, AppWindow, Video, Film, Radio, Shield, Newspaper, Coins, Palette, Tv, Gift, Users, Settings, Crown, Wifi, MapPin, Gamepad2, SearchCode, Wallet, HelpCircle, Package, Store } from 'lucide-react';
import Header from '../components/Header';
import FeedPage from './FeedPage';
import ChatsPage from './ChatsPage';
import SearchPage from './SearchPage';
import ProfilePage from './ProfilePage';
import MusicPage from './MusicPage';
import AISongGeneratorPage from './AISongGeneratorPage';
import PublishedAppsPage from './PublishedAppsPage';
import CreatorStudioPage from './CreatorStudioPage';
import VideosPage from './VideosPage';
import MoviesPage from './MoviesPage';
import RadioPage from './RadioPage';
import PhoneProtectionPage from './PhoneProtectionPage';
import WhatsNewPage from './WhatsNewPage';
import RobuxSimulatorPage from './RobuxSimulatorPage';
import LiveTVPage from './LiveTVPage';
import DailyRewardsPage from './DailyRewardsPage';
import DailyItemsSecretPage from './DailyItemsSecretPage';
import GroupsPage from './GroupsPage';
import SettingsPage from './SettingsPage';
import MembersOnlyPage from './MembersOnlyPage';
import LiveStreamsPage from './LiveStreamsPage';
import WhatsNextPage from './WhatsNextPage';
import GamesComingSoonPage from './GamesComingSoonPage';
import SearchEnginePage from './SearchEnginePage';
import SearchEngineStorePage from './SearchEngineStorePage';
import PageUnavailablePage from './PageUnavailablePage';
import PointsPage from './PointsPage';
import PointsStorePage from './PointsStorePage';
import HelpPage from './HelpPage';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';

type PageType = 'feed' | 'chats' | 'search' | 'profile' | 'music' | 'ai-song' | 'apps' | 'creator' | 'videos' | 'movies' | 'livetv' | 'radio' | 'groups' | 'protection' | 'news' | 'robux' | 'rewards' | 'daily-items-secret' | 'settings' | 'members-only' | 'live-streams' | 'whats-next' | 'games-coming' | 'search-engine' | 'search-engine-store' | 'page-unavailable' | 'points' | 'points-store' | 'help';

export default function MainApp() {
  const [activePage, setActivePage] = useState<PageType>('feed');

  const navigationItems = [
    { id: 'feed' as PageType, label: 'Feed', icon: Home },
    { id: 'chats' as PageType, label: 'Chats', icon: MessageCircle },
    { id: 'search' as PageType, label: 'Search', icon: Search },
    { id: 'profile' as PageType, label: 'Profile', icon: User },
    { id: 'music' as PageType, label: 'Music', icon: Music },
    { id: 'ai-song' as PageType, label: 'AI Song Generator', icon: Sparkles },
    { id: 'videos' as PageType, label: 'Videos', icon: Video },
    { id: 'movies' as PageType, label: 'Movies', icon: Film },
    { id: 'livetv' as PageType, label: 'Live TV', icon: Tv },
    { id: 'live-streams' as PageType, label: 'Live Streams', icon: Wifi },
    { id: 'radio' as PageType, label: 'Radio', icon: Radio },
    { id: 'apps' as PageType, label: 'Published Apps', icon: AppWindow },
    { id: 'creator' as PageType, label: 'Creator Studio', icon: Palette },
    { id: 'groups' as PageType, label: 'Groups', icon: Users },
    { id: 'members-only' as PageType, label: 'Members Only', icon: Crown },
    { id: 'points' as PageType, label: 'Points', icon: Wallet },
    { id: 'points-store' as PageType, label: 'Points Store', icon: Coins },
    { id: 'rewards' as PageType, label: 'Daily Rewards', icon: Gift },
    { id: 'daily-items-secret' as PageType, label: 'Daily Items Secret', icon: Package },
    { id: 'search-engine' as PageType, label: 'Search Engine', icon: SearchCode },
    { id: 'search-engine-store' as PageType, label: 'Search Engine Store', icon: Store },
    { id: 'whats-next' as PageType, label: "What's Next", icon: MapPin },
    { id: 'games-coming' as PageType, label: 'Games Coming Soon', icon: Gamepad2 },
    { id: 'protection' as PageType, label: 'Phone Protection', icon: Shield },
    { id: 'news' as PageType, label: "What's New", icon: Newspaper },
    { id: 'robux' as PageType, label: 'Robux Simulator', icon: Coins },
    { id: 'help' as PageType, label: 'Help', icon: HelpCircle },
    { id: 'settings' as PageType, label: 'Settings', icon: Settings },
  ];

  const renderPage = () => {
    switch (activePage) {
      case 'feed': return <FeedPage />;
      case 'chats': return <ChatsPage />;
      case 'search': return <SearchPage />;
      case 'profile': return <ProfilePage />;
      case 'music': return <MusicPage />;
      case 'ai-song': return <AISongGeneratorPage />;
      case 'apps': return <PublishedAppsPage />;
      case 'creator': return <CreatorStudioPage />;
      case 'videos': return <VideosPage />;
      case 'movies': return <MoviesPage />;
      case 'livetv': return <LiveTVPage />;
      case 'live-streams': return <LiveStreamsPage />;
      case 'radio': return <RadioPage />;
      case 'groups': return <GroupsPage />;
      case 'members-only': return <MembersOnlyPage />;
      case 'points': return <PointsPage />;
      case 'points-store': return <PointsStorePage />;
      case 'rewards': return <DailyRewardsPage />;
      case 'daily-items-secret': return <DailyItemsSecretPage />;
      case 'search-engine': return <SearchEnginePage />;
      case 'search-engine-store': return <SearchEngineStorePage />;
      case 'whats-next': return <WhatsNextPage />;
      case 'games-coming': return <GamesComingSoonPage />;
      case 'protection': return <PhoneProtectionPage />;
      case 'news': return <WhatsNewPage />;
      case 'robux': return <RobuxSimulatorPage />;
      case 'help': return <HelpPage />;
      case 'settings': return <SettingsPage />;
      case 'page-unavailable': return <PageUnavailablePage />;
      default: return <FeedPage />;
    }
  };

  const NavContent = () => (
    <ScrollArea className="h-full">
      <nav className="space-y-1 p-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.id}
              variant={activePage === item.id ? 'secondary' : 'ghost'}
              className="w-full justify-start gap-3"
              onClick={() => setActivePage(item.id)}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Button>
          );
        })}
      </nav>
    </ScrollArea>
  );

  return (
    <div className="flex h-screen flex-col bg-background">
      <Header />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 border-r border-border bg-card">
          <NavContent />
        </aside>

        {/* Mobile Menu */}
        <div className="lg:hidden fixed bottom-4 left-4 z-50">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" className="h-12 w-12 rounded-full shadow-lg">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <div className="py-4">
                <h2 className="px-4 text-lg font-semibold mb-2">Navigation</h2>
                <NavContent />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-hidden">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}
