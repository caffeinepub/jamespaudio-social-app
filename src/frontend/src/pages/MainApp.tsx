import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  AppWindow,
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
} from "lucide-react";
import { Menu } from "lucide-react";
import { useState } from "react";
import Header from "../components/Header";
import { NavigationProvider } from "../contexts/NavigationContext";
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
  | "help";

export default function MainApp() {
  const [activePage, setActivePage] = useState<PageType>("feed");
  const [targetGroupId, setTargetGroupId] = useState<string | null>(null);

  const navigationItems = [
    { id: "feed" as PageType, label: "Feed", icon: Home },
    { id: "chats" as PageType, label: "Chats", icon: MessageCircle },
    { id: "search" as PageType, label: "Search", icon: Search },
    { id: "profile" as PageType, label: "Profile", icon: User },
    { id: "shines" as PageType, label: "JAMESPaudio Shines", icon: Star },
    { id: "music" as PageType, label: "Music", icon: Music },
    { id: "ai-song" as PageType, label: "AI Song Generator", icon: Sparkles },
    { id: "videos" as PageType, label: "Videos", icon: Video },
    { id: "movies" as PageType, label: "Movies", icon: Film },
    { id: "livetv" as PageType, label: "Live TV", icon: Tv },
    { id: "live-streams" as PageType, label: "Live Streams", icon: Wifi },
    { id: "radio" as PageType, label: "Radio", icon: Radio },
    { id: "apps" as PageType, label: "Published Apps", icon: AppWindow },
    { id: "creator" as PageType, label: "Creator Studio", icon: Palette },
    { id: "groups" as PageType, label: "Groups", icon: Users },
    { id: "members-only" as PageType, label: "Members Only", icon: Crown },
    { id: "rewards" as PageType, label: "Daily Rewards", icon: Gift },
    {
      id: "daily-items-secret" as PageType,
      label: "Daily Items Secret",
      icon: Package,
    },
    {
      id: "search-engine" as PageType,
      label: "Search Engine",
      icon: SearchCode,
    },
    {
      id: "search-engine-store" as PageType,
      label: "Search Engine Store",
      icon: Store,
    },
    { id: "whats-next" as PageType, label: "What's Next", icon: MapPin },
    {
      id: "games-coming" as PageType,
      label: "Games Coming Soon",
      icon: Gamepad2,
    },
    { id: "protection" as PageType, label: "Phone Protection", icon: Shield },
    { id: "news" as PageType, label: "What's New", icon: Newspaper },
    { id: "robux" as PageType, label: "Robux Simulator", icon: Star },
    { id: "help" as PageType, label: "Help", icon: HelpCircle },
    { id: "settings" as PageType, label: "Settings", icon: Settings },
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
            >
              <Icon
                className={`h-5 w-5 ${item.id === "shines" ? "text-yellow-400" : ""}`}
              />
              <span>{item.label}</span>
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
