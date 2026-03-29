import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  AppWindow,
  Bot,
  Crown,
  Film,
  Gamepad2,
  Gift,
  HelpCircle,
  Home,
  MapPin,
  MessageCircle,
  Music,
  Newspaper,
  Package,
  Palette,
  Radio,
  Search,
  SearchCode,
  Settings,
  Shield,
  Sparkles,
  Star,
  Store,
  Tv,
  User,
  Users,
  Video,
  Wifi,
  Wrench,
} from "lucide-react";
import { Menu } from "lucide-react";
import { useState } from "react";
import Header from "../components/Header";
import { NavigationProvider } from "../contexts/NavigationContext";
import AIChatbotPage from "./AIChatbotPage";
import AISongGeneratorPage from "./AISongGeneratorPage";
import ChatsPage from "./ChatsPage";
import CreatorStudioPage from "./CreatorStudioPage";
import DailyItemsSecretPage from "./DailyItemsSecretPage";
import DailyRewardsPage from "./DailyRewardsPage";
import FeedPage from "./FeedPage";
import GamesComingSoonPage from "./GamesComingSoonPage";
import GroupsPage from "./GroupsPage";
import HelpPage from "./HelpPage";
import LiveStreamsPage from "./LiveStreamsPage";
import LiveTVPage from "./LiveTVPage";
import MembersOnlyPage from "./MembersOnlyPage";
import MoviesPage from "./MoviesPage";
import MusicPage from "./MusicPage";
import PackageFixerPage from "./PackageFixerPage";
import PageUnavailablePage from "./PageUnavailablePage";
import PhoneProtectionPage from "./PhoneProtectionPage";
import ProfilePage from "./ProfilePage";
import PublishedAppsPage from "./PublishedAppsPage";
import RadioPage from "./RadioPage";
import RobuxSimulatorPage from "./RobuxSimulatorPage";
import SearchEnginePage from "./SearchEnginePage";
import SearchEngineStorePage from "./SearchEngineStorePage";
import SearchPage from "./SearchPage";
import SettingsPage from "./SettingsPage";
import ShinesPage from "./ShinesPage";
import VIPPage from "./VIPPage";
import VideosPage from "./VideosPage";
import WhatsNewPage from "./WhatsNewPage";
import WhatsNextPage from "./WhatsNextPage";

type PageType =
  | "feed"
  | "chats"
  | "search"
  | "profile"
  | "music"
  | "ai-song"
  | "apps"
  | "creator"
  | "videos"
  | "movies"
  | "livetv"
  | "radio"
  | "groups"
  | "protection"
  | "news"
  | "robux"
  | "rewards"
  | "daily-items-secret"
  | "settings"
  | "members-only"
  | "live-streams"
  | "whats-next"
  | "games-coming"
  | "search-engine"
  | "search-engine-store"
  | "page-unavailable"
  | "shines"
  | "help"
  | "ai-chatbot"
  | "package-fixer"
  | "vip";

interface NavItem {
  id: PageType;
  label: string;
  icon: React.ElementType;
  isNew?: boolean;
}

export default function MainApp() {
  const [activePage, setActivePage] = useState<PageType>("feed");
  const [targetGroupId, setTargetGroupId] = useState<string | null>(null);

  const navigationItems: NavItem[] = [
    { id: "feed", label: "Feed", icon: Home },
    { id: "chats", label: "Chats", icon: MessageCircle },
    { id: "search", label: "Search", icon: Search },
    { id: "profile", label: "Profile", icon: User },
    { id: "shines", label: "JAMESPaudio Shines", icon: Star },
    { id: "vip", label: "VIP Membership", icon: Crown, isNew: true },
    { id: "ai-chatbot", label: "AI Chatbot", icon: Bot, isNew: true },
    {
      id: "package-fixer",
      label: "Package Fixer AI",
      icon: Wrench,
      isNew: true,
    },
    { id: "music", label: "Music", icon: Music },
    { id: "ai-song", label: "AI Song Generator", icon: Sparkles },
    { id: "videos", label: "Videos", icon: Video },
    { id: "movies", label: "Movies", icon: Film },
    { id: "livetv", label: "Live TV", icon: Tv },
    { id: "live-streams", label: "Live Streams", icon: Wifi },
    { id: "radio", label: "Radio", icon: Radio },
    { id: "apps", label: "Published Apps", icon: AppWindow },
    { id: "creator", label: "Creator Studio", icon: Palette },
    { id: "groups", label: "Groups", icon: Users },
    { id: "members-only", label: "Members Only", icon: Crown },
    { id: "rewards", label: "Daily Rewards", icon: Gift },
    { id: "daily-items-secret", label: "Daily Items Secret", icon: Package },
    { id: "search-engine", label: "Search Engine", icon: SearchCode },
    { id: "search-engine-store", label: "Search Engine Store", icon: Store },
    { id: "whats-next", label: "What's Next", icon: MapPin },
    { id: "games-coming", label: "Games Coming Soon", icon: Gamepad2 },
    { id: "protection", label: "Phone Protection", icon: Shield },
    { id: "news", label: "What's New", icon: Newspaper },
    { id: "robux", label: "Robux Simulator", icon: Star },
    { id: "help", label: "Help", icon: HelpCircle },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const renderPage = () => {
    switch (activePage) {
      case "feed":
        return (
          <FeedPage onNavigate={(page) => setActivePage(page as PageType)} />
        );
      case "chats":
        return <ChatsPage />;
      case "search":
        return <SearchPage />;
      case "profile":
        return <ProfilePage />;
      case "music":
        return <MusicPage />;
      case "ai-song":
        return <AISongGeneratorPage />;
      case "apps":
        return <PublishedAppsPage />;
      case "creator":
        return <CreatorStudioPage />;
      case "videos":
        return <VideosPage />;
      case "movies":
        return <MoviesPage />;
      case "livetv":
        return <LiveTVPage />;
      case "live-streams":
        return <LiveStreamsPage />;
      case "radio":
        return <RadioPage />;
      case "groups":
        return (
          <GroupsPage
            targetGroupId={targetGroupId}
            onGroupSelected={() => setTargetGroupId(null)}
          />
        );
      case "members-only":
        return <MembersOnlyPage />;
      case "shines":
        return <ShinesPage />;
      case "rewards":
        return <DailyRewardsPage />;
      case "daily-items-secret":
        return <DailyItemsSecretPage />;
      case "search-engine":
        return <SearchEnginePage />;
      case "search-engine-store":
        return <SearchEngineStorePage />;
      case "whats-next":
        return <WhatsNextPage />;
      case "games-coming":
        return <GamesComingSoonPage />;
      case "protection":
        return <PhoneProtectionPage />;
      case "news":
        return <WhatsNewPage />;
      case "robux":
        return <RobuxSimulatorPage />;
      case "help":
        return <HelpPage />;
      case "settings":
        return <SettingsPage />;
      case "ai-chatbot":
        return <AIChatbotPage />;
      case "package-fixer":
        return <PackageFixerPage />;
      case "vip":
        return <VIPPage />;
      case "page-unavailable":
        return <PageUnavailablePage />;
      default:
        return (
          <FeedPage onNavigate={(page) => setActivePage(page as PageType)} />
        );
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
              variant={activePage === item.id ? "secondary" : "ghost"}
              className={`w-full justify-start gap-3 ${
                item.id === "shines" ? "text-yellow-400 font-semibold" : ""
              }`}
              onClick={() => setActivePage(item.id)}
              data-ocid={`nav.${item.id}.link`}
            >
              <Icon
                className={`h-5 w-5 flex-shrink-0 ${
                  item.id === "shines" ? "text-yellow-400" : ""
                }`}
              />
              <span className="flex-1 text-left">{item.label}</span>
              {item.isNew && (
                <span className="text-[10px] font-bold bg-yellow-400 text-yellow-900 rounded-full px-1.5 py-0.5 leading-none">
                  NEW
                </span>
              )}
            </Button>
          );
        })}
      </nav>
    </ScrollArea>
  );

  return (
    <NavigationProvider>
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
                <Button
                  size="icon"
                  className="h-12 w-12 rounded-full shadow-lg"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <div className="py-4">
                  <h2 className="px-4 text-lg font-semibold mb-2">
                    Navigation
                  </h2>
                  <NavContent />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Main Content */}
          <main className="flex-1 overflow-hidden">{renderPage()}</main>
        </div>
      </div>
    </NavigationProvider>
  );
}
