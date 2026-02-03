import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Principal } from '@dfinity/principal';
import type { UserProfile, SearchResult, FeedItem as BackendFeedItem, Timestamp, PointsTransaction, PointsStoreItem, MusicUpload, MysteryItem } from '../backend';
import type { Message, PublishedApp, PremiumContent, LiveStream, UpcomingFeature, UpcomingGame } from '../types/temporary';
import { useInternetIdentity } from './useInternetIdentity';
import { ExternalBlob } from '../backend';

// User Profile Queries
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor || !identity) return null;
      try {
        const principal = identity.getPrincipal();
        const profile = await actor.getProfile(principal);
        return profile;
      } catch {
        return null;
      }
    },
    enabled: !!actor && !actorFetching && !!identity,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useGetProfile(userId: Principal) {
  const { actor, isFetching } = useActor();

  return useQuery<UserProfile>({
    queryKey: ['profile', userId.toString()],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getProfile(userId);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ username, bio }: { username: string; bio: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createProfile(username, bio);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useUpdateProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      bio,
      profilePicture,
    }: {
      bio: string;
      profilePicture: { url: string; contentType: string };
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateProfile(bio, profilePicture);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// Last Online Queries
export function useGetLastOnline(userId: Principal) {
  const { actor, isFetching } = useActor();

  return useQuery<Timestamp>({
    queryKey: ['lastOnline', userId.toString()],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getLastOnline(userId);
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 30000,
  });
}

export function useGetLastOnlineForMultipleUsers(userIds: Principal[]) {
  const { actor, isFetching } = useActor();

  return useQuery<[Principal, Timestamp][]>({
    queryKey: ['lastOnlineMultiple', userIds.map(id => id.toString()).join(',')],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getLastOnlineForMultipleUsers(userIds);
    },
    enabled: !!actor && !isFetching && userIds.length > 0,
    refetchInterval: 30000,
  });
}

export function useUpdateLastOnline() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateLastOnline();
    },
  });
}

// Recent Statuses Query
export function useGetRecentStatuses(limit: number = 10) {
  const { actor, isFetching } = useActor();

  return useQuery<BackendFeedItem[]>({
    queryKey: ['recentStatuses', limit],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getRecentStatuses(BigInt(limit));
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 10000,
  });
}

// Search Queries
export function useSearchProfiles(searchTerm: string) {
  const { actor, isFetching } = useActor();

  return useQuery<SearchResult[]>({
    queryKey: ['searchProfiles', searchTerm],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      if (!searchTerm.trim()) return [];
      return actor.searchProfiles(searchTerm);
    },
    enabled: !!actor && !isFetching && searchTerm.trim().length > 0,
  });
}

export function useSearchContent(searchTerm: string, searchType: string) {
  const { actor, isFetching } = useActor();

  return useQuery<{ results: SearchResult[]; searchType: string }>({
    queryKey: ['searchContent', searchTerm, searchType],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      if (!searchTerm.trim()) return { results: [], searchType };
      return { results: [], searchType };
    },
    enabled: !!actor && !isFetching && searchTerm.trim().length > 0,
  });
}

// Follow/Unfollow Mutations
export function useFollowUser() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (targetUser: Principal) => {
      if (!actor) throw new Error('Actor not available');
      throw new Error('Follow functionality not yet implemented');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      queryClient.invalidateQueries({ queryKey: ['friendSuggestions'] });
      queryClient.invalidateQueries({ queryKey: ['homeFeed'] });
    },
  });
}

export function useUnfollowUser() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (targetUser: Principal) => {
      if (!actor) throw new Error('Actor not available');
      throw new Error('Unfollow functionality not yet implemented');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      queryClient.invalidateQueries({ queryKey: ['friendSuggestions'] });
      queryClient.invalidateQueries({ queryKey: ['homeFeed'] });
    },
  });
}

// Feed Queries
export function useGetHomeFeed() {
  const { actor, isFetching } = useActor();

  return useQuery<BackendFeedItem[]>({
    queryKey: ['homeFeed'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return [];
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetFriendSuggestions() {
  const { actor, isFetching } = useActor();

  return useQuery<SearchResult[]>({
    queryKey: ['friendSuggestions'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return [];
    },
    enabled: !!actor && !isFetching,
  });
}

// Messaging Queries
export function useGetMessagesWithUser(userId: Principal) {
  const { actor, isFetching } = useActor();

  return useQuery<Message[]>({
    queryKey: ['messages', userId.toString()],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return [];
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSendMessage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ receiver, content }: { receiver: Principal; content: string }) => {
      if (!actor) throw new Error('Actor not available');
      throw new Error('Messaging functionality not yet implemented');
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['messages', variables.receiver.toString()] });
    },
  });
}

// Daily Rewards
export function useClaimDailyReward() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.claimDailyReward();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      queryClient.invalidateQueries({ queryKey: ['pointsHistory'] });
    },
  });
}

// Points System Queries
export function useGetPointsBalance() {
  const { actor, isFetching } = useActor();

  return useQuery<bigint>({
    queryKey: ['pointsBalance'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getPointsBalance();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetPointsHistory() {
  const { actor, isFetching } = useActor();

  return useQuery<PointsTransaction[]>({
    queryKey: ['pointsHistory'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getPointsHistory();
    },
    enabled: !!actor && !isFetching,
  });
}

export function usePurchasePoints() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (pointsToBuy: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.purchasePoints(pointsToBuy);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      queryClient.invalidateQueries({ queryKey: ['pointsBalance'] });
      queryClient.invalidateQueries({ queryKey: ['pointsHistory'] });
    },
  });
}

export function useSpendPoints() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (amount: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.spendPoints(amount);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      queryClient.invalidateQueries({ queryKey: ['pointsBalance'] });
      queryClient.invalidateQueries({ queryKey: ['pointsHistory'] });
    },
  });
}

export function useGetStoreItems() {
  const { actor, isFetching } = useActor();

  return useQuery<PointsStoreItem[]>({
    queryKey: ['storeItems'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getStoreItems();
    },
    enabled: !!actor && !isFetching,
  });
}

export function usePurchaseStoreItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (storeItemId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.purchaseStoreItem(storeItemId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      queryClient.invalidateQueries({ queryKey: ['pointsBalance'] });
      queryClient.invalidateQueries({ queryKey: ['pointsHistory'] });
    },
  });
}

// Music Queries
export function useUploadMusic() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      title,
      artist,
      genre,
      file,
    }: {
      id: string;
      title: string;
      artist: string;
      genre: string;
      file: ExternalBlob;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.uploadMusic(id, title, artist, genre, file);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      queryClient.invalidateQueries({ queryKey: ['friendsMusic'] });
    },
  });
}

export function useGetFriendsMusicUploads() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<MusicUpload[]>({
    queryKey: ['friendsMusic'],
    queryFn: async () => {
      if (!actor || !identity) return [];
      try {
        const userId = identity.getPrincipal();
        return actor.getFriendsMusicUploads(userId);
      } catch (error) {
        console.error('Error fetching friends music:', error);
        return [];
      }
    },
    enabled: !!actor && !isFetching && !!identity,
    refetchInterval: 30000,
  });
}

// Published Apps
export function useGetAllPublishedApps() {
  const { actor, isFetching } = useActor();

  return useQuery<PublishedApp[]>({
    queryKey: ['publishedApps'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return [];
    },
    enabled: !!actor && !isFetching,
  });
}

export function usePublishApp() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      appTitle,
      devName,
      link,
      description,
      previewImage,
    }: {
      appTitle: string;
      devName: string;
      link: string;
      description: string;
      previewImage: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      throw new Error('App publishing functionality not yet implemented');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['publishedApps'] });
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// Premium Membership
export function useUpgradeToPremium() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (months: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.upgradeToPremium(months);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useActivateFreeTrial() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.activateFreeTrial();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useGetPremiumContent() {
  const { actor, isFetching } = useActor();

  return useQuery<PremiumContent[]>({
    queryKey: ['premiumContent'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return [];
    },
    enabled: !!actor && !isFetching,
  });
}

// Live Streams
export function useGetLiveStreams() {
  const { actor, isFetching } = useActor();

  return useQuery<LiveStream[]>({
    queryKey: ['liveStreams'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return [];
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateLiveStream() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      title,
      description,
      streamURL,
      thumbnailImage,
    }: {
      title: string;
      description: string;
      streamURL: string;
      thumbnailImage: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      throw new Error('Live streaming functionality not yet implemented');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['liveStreams'] });
    },
  });
}

export function useStopLiveStream() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (streamId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      throw new Error('Live streaming functionality not yet implemented');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['liveStreams'] });
    },
  });
}

// Upcoming Features
export function useGetUpcomingFeatures() {
  const { actor, isFetching } = useActor();

  return useQuery<UpcomingFeature[]>({
    queryKey: ['upcomingFeatures'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return [];
    },
    enabled: !!actor && !isFetching,
  });
}

// Upcoming Games
export function useGetUpcomingGames() {
  const { actor, isFetching } = useActor();

  return useQuery<UpcomingGame[]>({
    queryKey: ['upcomingGames'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return [];
    },
    enabled: !!actor && !isFetching,
  });
}

// Daily Items Secret Queries
export function useClaimDailyItemsSecret() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.claimDailyItemsSecret();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      queryClient.invalidateQueries({ queryKey: ['pointsHistory'] });
      queryClient.invalidateQueries({ queryKey: ['lastClaimedMysteryItem'] });
      queryClient.invalidateQueries({ queryKey: ['mysteryItemClaimAvailable'] });
    },
  });
}

export function useGetLastClaimedMysteryItem(userId: Principal | undefined) {
  const { actor, isFetching } = useActor();

  return useQuery<MysteryItem | null>({
    queryKey: ['lastClaimedMysteryItem', userId?.toString()],
    queryFn: async () => {
      if (!actor || !userId) return null;
      return actor.getLastClaimedMysteryItem(userId);
    },
    enabled: !!actor && !isFetching && !!userId,
  });
}

export function useIsMysteryItemClaimAvailable(userId: Principal | undefined) {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['mysteryItemClaimAvailable', userId?.toString()],
    queryFn: async () => {
      if (!actor || !userId) return false;
      return actor.isMysteryItemClaimAvailable(userId);
    },
    enabled: !!actor && !isFetching && !!userId,
    refetchInterval: 60000,
  });
}
