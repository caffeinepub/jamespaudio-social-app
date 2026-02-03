import { Users, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function GroupsPage() {
  return (
    <div className="h-full flex flex-col">
      <div className="relative h-48 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 overflow-hidden">
        <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <Users className="h-10 w-10" />
              Groups
            </h1>
            <p className="text-white/90">Create and manage your own communities</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="container mx-auto px-4 py-6">
            <Card className="max-w-2xl mx-auto">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="h-24 w-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                    <Clock className="h-12 w-12 text-white" />
                  </div>
                </div>
                <CardTitle className="text-2xl">Coming Soon</CardTitle>
                <CardDescription className="text-base">
                  Group creation is on its way!
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <p className="text-muted-foreground">
                  You'll soon be able to create and manage your own groups, bringing together communities with shared interests.
                </p>
                <div className="bg-muted/50 rounded-lg p-4 space-y-2 text-sm text-left">
                  <p className="font-semibold">Upcoming features:</p>
                  <ul className="space-y-1 ml-4">
                    <li>• Create public and private groups</li>
                    <li>• Invite members and manage permissions</li>
                    <li>• Share content within your group</li>
                    <li>• Group chat and discussions</li>
                    <li>• Organize events and activities</li>
                  </ul>
                </div>
                <p className="text-sm text-muted-foreground">
                  Stay tuned for updates on the What's New page!
                </p>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
