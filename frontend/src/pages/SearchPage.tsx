import { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useSearchProfiles } from '../hooks/useQueries';
import UserCard from '../components/UserCard';

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: results = [], isLoading } = useSearchProfiles(searchTerm);

  return (
    <div className="h-full flex flex-col">
      <div className="relative h-48 bg-gradient-to-br from-purple-600 via-pink-600 to-orange-600 overflow-hidden">
        <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <Search className="h-10 w-10" />
              Search
            </h1>
            <p className="text-white/90">Find people and connect</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="container mx-auto px-4 py-6">
            <div className="max-w-4xl mx-auto space-y-6">
              <Card>
                <CardContent className="p-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      placeholder="Search for users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </CardContent>
              </Card>

              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : results.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {results.map((user) => (
                    <UserCard key={user.userId.toString()} user={user} />
                  ))}
                </div>
              ) : searchTerm.trim() ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-lg font-semibold mb-2">No results found</p>
                    <p className="text-sm text-muted-foreground">
                      Try searching with a different term
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-lg font-semibold mb-2">Start searching</p>
                    <p className="text-sm text-muted-foreground">
                      Enter a username to find people
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
