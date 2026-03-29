import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Bell,
  Eye,
  Mic,
  Monitor,
  Music,
  Settings as SettingsIcon,
  Shield,
  Smartphone,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { notifyVoiceSettingsChange } from "../hooks/useVoiceSettings";

export default function SettingsPage() {
  const [bgMusicEnabled, setBgMusicEnabled] = useState(() => {
    const saved = localStorage.getItem("bgMusicEnabled");
    return saved ? JSON.parse(saved) : false;
  });

  const [musicVolume, setMusicVolume] = useState(() => {
    const saved = localStorage.getItem("musicVolume");
    return saved ? Number.parseInt(saved) : 50;
  });

  const [aiVoiceEnabled, setAiVoiceEnabled] = useState(() => {
    const saved = localStorage.getItem("aiVoiceEnabled");
    return saved !== null ? JSON.parse(saved) : true; // Default to enabled
  });

  const [aiVoiceVolume, setAiVoiceVolume] = useState(() => {
    const saved = localStorage.getItem("aiVoiceVolume");
    return saved ? Number.parseInt(saved) : 100; // Default to 100%
  });

  const [aiVoiceMuted, setAiVoiceMuted] = useState(() => {
    const saved = localStorage.getItem("aiVoiceMuted");
    return saved !== null ? JSON.parse(saved) : false; // Default to not muted
  });

  useEffect(() => {
    localStorage.setItem("bgMusicEnabled", JSON.stringify(bgMusicEnabled));
  }, [bgMusicEnabled]);

  useEffect(() => {
    localStorage.setItem("musicVolume", musicVolume.toString());
  }, [musicVolume]);

  useEffect(() => {
    localStorage.setItem("aiVoiceEnabled", JSON.stringify(aiVoiceEnabled));
    notifyVoiceSettingsChange();
  }, [aiVoiceEnabled]);

  useEffect(() => {
    localStorage.setItem("aiVoiceVolume", aiVoiceVolume.toString());
    notifyVoiceSettingsChange();
  }, [aiVoiceVolume]);

  useEffect(() => {
    localStorage.setItem("aiVoiceMuted", JSON.stringify(aiVoiceMuted));
    notifyVoiceSettingsChange();
  }, [aiVoiceMuted]);

  const handleBgMusicToggle = (enabled: boolean) => {
    setBgMusicEnabled(enabled);
    toast.success(
      enabled ? "Background music enabled" : "Background music disabled",
    );
  };

  const handleVolumeChange = (value: number[]) => {
    setMusicVolume(value[0]);
  };

  const handleAiVoiceToggle = (enabled: boolean) => {
    setAiVoiceEnabled(enabled);
    toast.success(
      enabled ? "AI voice responses enabled" : "AI voice responses disabled",
    );
  };

  const handleAiVoiceVolumeChange = (value: number[]) => {
    setAiVoiceVolume(value[0]);
  };

  const handleAiVoiceMuteToggle = (muted: boolean) => {
    setAiVoiceMuted(muted);
    toast.success(muted ? "AI voice muted" : "AI voice unmuted");
  };

  return (
    <div className="h-full flex flex-col">
      <div className="relative h-48 bg-gradient-to-br from-slate-600 via-gray-600 to-zinc-600 overflow-hidden">
        <img
          src="/assets/generated/settings-music-icon.dim_64x64.png"
          alt="Settings"
          className="absolute right-0 top-0 h-full opacity-20"
        />
        <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <SettingsIcon className="h-10 w-10" />
              Settings
            </h1>
            <p className="text-white/90">
              Customize your JAMESPaudio experience
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="container mx-auto px-4 py-6 space-y-6">
            {/* Audio Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Music className="h-5 w-5" />
                  Audio Settings
                </CardTitle>
                <CardDescription>
                  Control background music and volume levels
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Background Music Toggle */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="bg-music" className="text-base">
                      Background Music
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Play ambient music while browsing
                    </p>
                  </div>
                  <Switch
                    id="bg-music"
                    checked={bgMusicEnabled}
                    onCheckedChange={handleBgMusicToggle}
                  />
                </div>

                {/* Volume Control */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="volume"
                      className="text-base flex items-center gap-2"
                    >
                      <Volume2 className="h-4 w-4" />
                      Music Volume
                    </Label>
                    <span className="text-sm text-muted-foreground">
                      {musicVolume}%
                    </span>
                  </div>
                  <Slider
                    id="volume"
                    min={0}
                    max={100}
                    step={1}
                    value={[musicVolume]}
                    onValueChange={handleVolumeChange}
                    disabled={!bgMusicEnabled}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">
                    {bgMusicEnabled
                      ? "Adjust the volume of background music"
                      : "Enable background music to adjust volume"}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* AI Voice Assistant Settings */}
            <Card className="border-green-500/50 bg-green-500/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mic className="h-5 w-5 text-green-500" />
                  AI Voice Assistant
                </CardTitle>
                <CardDescription>
                  Control AI voice responses for math solver
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* AI Voice Toggle */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="ai-voice" className="text-base">
                      AI Voice Responses
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Enable spoken responses for math search results
                    </p>
                  </div>
                  <Switch
                    id="ai-voice"
                    checked={aiVoiceEnabled}
                    onCheckedChange={handleAiVoiceToggle}
                  />
                </div>

                {/* AI Voice Mute Toggle */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label
                      htmlFor="ai-voice-mute"
                      className="text-base flex items-center gap-2"
                    >
                      <VolumeX className="h-4 w-4" />
                      Mute AI Voice
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Temporarily mute voice responses without changing settings
                    </p>
                  </div>
                  <Switch
                    id="ai-voice-mute"
                    checked={aiVoiceMuted}
                    onCheckedChange={handleAiVoiceMuteToggle}
                  />
                </div>

                {/* AI Voice Volume Control */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="ai-voice-volume"
                      className="text-base flex items-center gap-2"
                    >
                      <Volume2 className="h-4 w-4" />
                      AI Voice Volume
                    </Label>
                    <span className="text-sm text-muted-foreground">
                      {aiVoiceVolume}%
                    </span>
                  </div>
                  <Slider
                    id="ai-voice-volume"
                    min={0}
                    max={100}
                    step={1}
                    value={[aiVoiceVolume]}
                    onValueChange={handleAiVoiceVolumeChange}
                    disabled={!aiVoiceEnabled}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">
                    {aiVoiceEnabled
                      ? "Adjust the volume of AI voice responses"
                      : "Enable AI voice responses to adjust volume"}
                  </p>
                </div>

                <div className="bg-muted p-4 rounded-lg space-y-2">
                  <div className="flex items-center gap-2">
                    <img
                      src="/assets/generated/ai-voice-assistant-transparent.dim_64x64.png"
                      alt="AI Voice"
                      className="h-8 w-8"
                    />
                    <p className="text-sm font-semibold">
                      About AI Voice Assistant
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    When enabled, the AI voice assistant will verbally respond
                    to your math queries with spoken answers. For example:
                    "Okay, I can help with that. 50 × 50 = 2500."
                  </p>
                  <p className="text-sm text-muted-foreground">
                    This feature uses your browser's built-in speech synthesis
                    technology and works best with the Math Search feature on
                    the Search Engine page.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card className="border-yellow-400/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-yellow-500" />
                  Notification Settings
                  <Badge className="bg-yellow-400 text-yellow-900 font-bold text-xs ml-1">
                    NEW
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Control how and when you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified about new messages and activity
                    </p>
                  </div>
                  <Switch
                    defaultChecked
                    onCheckedChange={() =>
                      toast.success("Push notifications updated")
                    }
                    data-ocid="settings.switch"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive weekly digest and alerts via email
                    </p>
                  </div>
                  <Switch
                    onCheckedChange={() =>
                      toast.success("Email notifications updated")
                    }
                    data-ocid="settings.switch"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Group Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Notify when someone posts in your groups
                    </p>
                  </div>
                  <Switch
                    defaultChecked
                    onCheckedChange={() =>
                      toast.success("Group alerts updated")
                    }
                    data-ocid="settings.switch"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Privacy Settings */}
            <Card className="border-yellow-400/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-yellow-500" />
                  Privacy Settings
                  <Badge className="bg-yellow-400 text-yellow-900 font-bold text-xs ml-1">
                    NEW
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Manage your privacy and visibility
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Public Profile</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow anyone to see your profile
                    </p>
                  </div>
                  <Switch
                    defaultChecked
                    onCheckedChange={() =>
                      toast.success("Profile visibility updated")
                    }
                    data-ocid="settings.switch"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Online Status</Label>
                    <p className="text-sm text-muted-foreground">
                      Show when you are active
                    </p>
                  </div>
                  <Switch
                    defaultChecked
                    onCheckedChange={() =>
                      toast.success("Online status updated")
                    }
                    data-ocid="settings.switch"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Read Receipts</Label>
                    <p className="text-sm text-muted-foreground">
                      Let others know when you've read their messages
                    </p>
                  </div>
                  <Switch
                    onCheckedChange={() =>
                      toast.success("Read receipts updated")
                    }
                    data-ocid="settings.switch"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Theme Preferences */}
            <Card className="border-yellow-400/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Monitor className="h-5 w-5 text-yellow-500" />
                  Theme Preferences
                  <Badge className="bg-yellow-400 text-yellow-900 font-bold text-xs ml-1">
                    NEW
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Choose your preferred display theme
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3">
                  {["Light", "Dark", "System"].map((theme) => (
                    <button
                      key={theme}
                      type="button"
                      className="flex-1 border rounded-lg py-3 text-sm font-medium hover:border-primary hover:bg-primary/5 transition-colors"
                      onClick={() => toast.info("Theme changes coming soon")}
                      data-ocid="settings.button"
                    >
                      {theme === "Light" ? "☀️" : theme === "Dark" ? "🌙" : "💻"}{" "}
                      {theme}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Info Card */}
            <Card>
              <CardHeader>
                <CardTitle>About Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p>• Settings are saved locally in your browser</p>
                <p>• Background music plays ambient tracks while you browse</p>
                <p>• Volume controls affect all audio playback in the app</p>
                <p>• AI voice responses enhance the math search experience</p>
                <p>• More settings options coming soon!</p>
              </CardContent>
            </Card>

            {/* Get the App */}
            <Card className="border-border/50 bg-muted/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5" />
                  Get the App
                </CardTitle>
                <CardDescription>
                  Download JAMESPaudio on your device
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 flex items-center gap-3 border rounded-xl px-4 py-3 opacity-60 bg-background">
                  <Eye className="h-8 w-8 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">GET IT ON</p>
                    <p className="font-bold">Google Play</p>
                    <Badge variant="outline" className="text-xs mt-1">
                      Coming Soon
                    </Badge>
                  </div>
                </div>
                <div className="flex-1 flex items-center gap-3 border rounded-xl px-4 py-3 opacity-60 bg-background">
                  <Monitor className="h-8 w-8 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">
                      AVAILABLE ON
                    </p>
                    <p className="font-bold">Chrome Extension</p>
                    <Badge variant="outline" className="text-xs mt-1">
                      Coming Soon
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
