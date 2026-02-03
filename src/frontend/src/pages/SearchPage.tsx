import { useState } from 'react';
import { useSearchProfiles } from '../hooks/useQueries';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search } from 'lucide-react';
import UserCard from '../components/UserCard';

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: results, isLoading } = useSearchProfiles(searchTerm);

  return (
    <div className="h-full">
      <ScrollArea className="h-full">
        <div className="container max-w-4xl mx-auto p-4 space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-4">Search Users</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search by username..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 text-lg"
              />
            </div>
          </div>

          <div>
            {isLoading ? (
              <div className="text-center py-12">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              </div>
            ) : results && results.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {results.map((user) => (
                  <UserCard key={user.userId.toString()} user={user} />
                ))}
              </div>
            ) : searchTerm ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">No users found matching "{searchTerm}"</p>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">Start typing to search for users</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
