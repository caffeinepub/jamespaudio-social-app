import type { Principal } from "@dfinity/principal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  Group,
  GroupId,
  GroupMessage,
  MediaAttachment,
  Timestamp,
  UserProfile,
} from "../backend";
import {
  MembershipTier,
  type MessageColor,
  type MessageEffect,
} from "../backend";
import type { ExternalBlob } from "../backend";
import type {
  FeedItem,
  LiveStream,
  PremiumContent,
  PublishedApp,
  UpcomingFeature,
  UpcomingGame,
} from "../types/temporary";
import { useActor } from "./useActor";
import { useInternetIdentity } from "./useInternetIdentity";

// Temporary types for missing backend functionality
export interface SearchResult {
  userId: Principal;
  username: string;
  bio: string;
  profilePicture: { url: string; contentType: string };
  followerCount: bigint;
  followingCount: bigint;
}

export interface PointsTransaction {
  id: string;
  userId: Principal;
  amount: bigint;
  transactionType: "earn" | "spend" | "purchase";
  description: string;
  timestamp: Timestamp;
}

export interface PointsStoreItem {
  id: string;
  name: string;
  description: string;
  price: bigint;
  createdAt: Timestamp;
}

export interface MusicUpload {
  id: string;
  title: string;
  artist: string;
  genre: string;
  file: ExternalBlob;
  uploadedBy: Principal;
  uploadTime: Timestamp;
}

export interface MysteryItem {
  id: string;
  itemType: "points" | "badge" | "visual" | "message";
  name: string;
  description: string;
  pointsReward?: bigint;
  visualUrl?: string;
  rewardCooldown?: bigint;
}

export interface SearchEngine {
  id: string;
  name: string;
  description: string;
  apiUrl: string;
}

export interface SearchHistoryEntry {
  userId: Principal;
  searchTerm: string;
  searchType: string;
  timestamp: Timestamp;
}

export interface DirectMessage {
  id: bigint;
  sender: Principal;
  receiver: Principal;
  content: string;
  timestamp: Timestamp;
  color: MessageColor;
  effect: MessageEffect;
}

// User Profile Queries
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  const query = useQuery<UserProfile | null>({
    queryKey: ["currentUserProfile"],
    queryFn: async () => {
      if (!actor || !identity) return null;
      try {
        const profile = await actor.getCallerUserProfile();
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

  return useQuery<UserProfile | null>({
    queryKey: ["profile", userId.toString()],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      const profile = await actor.getUserProfile(userId);
      return profile;
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      username,
      bio,
    }: { username: string; bio: string }) => {
      if (!actor) throw new Error("Actor not available");
      const profile: UserProfile = {
        username,
        bio,
        profilePicture: {
          url: "/assets/generated/default-avatar.dim_200x200.png",
          contentType: "image/png",
        },
        followers: [],
        following: [],
        status: "",
        points: BigInt(0),
        createdAt: BigInt(Date.now() * 1000000),
        updatedAt: BigInt(Date.now() * 1000000),
        lastDailyRewardClaim: undefined,
        rewardsClaimed: BigInt(0),
        dailyLoginStreak: BigInt(0),
        publishedAppsCount: BigInt(0),
        badges: [],
        isPremiumMember: false,
        premiumExpiresAt: undefined,
        freeTrialStartTime: undefined,
        freeTrialExpiresAt: undefined,
        lastOnline: BigInt(Date.now() * 1000000),
        musicUploads: [],
        membershipTier: MembershipTier.free,
      };
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUserProfile"] });
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
      if (!actor) throw new Error("Actor not available");
      const currentProfile = await actor.getCallerUserProfile();
      if (!currentProfile) throw new Error("Profile not found");
      const updatedProfile = {
        ...currentProfile,
        bio,
        profilePicture,
        updatedAt: BigInt(Date.now() * 1000000),
      };
      return actor.saveCallerUserProfile(updatedProfile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUserProfile"] });
    },
  });
}

// Membership Tier Query
export function useGetCallerMembershipTier() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<MembershipTier>({
    queryKey: ["callerMembershipTier"],
    queryFn: async () => {
      if (!actor || !identity) return MembershipTier.free;
      try {
        const profile = await actor.getCallerUserProfile();
        return profile?.membershipTier ?? MembershipTier.free;
      } catch {
        return MembershipTier.free;
      }
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}

// Last Online Queries
export function useGetLastOnline(userId: Principal) {
  const { actor, isFetching } = useActor();

  return useQuery<Timestamp>({
    queryKey: ["lastOnline", userId.toString()],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      const profile = await actor.getUserProfile(userId);
      return profile?.lastOnline ?? BigInt(0);
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 30000,
  });
}

export function useGetLastOnlineForMultipleUsers(userIds: Principal[]) {
  const { actor, isFetching } = useActor();

  return useQuery<[Principal, Timestamp][]>({
    queryKey: [
      "lastOnlineMultiple",
      userIds.map((id) => id.toString()).join(","),
    ],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      const results: [Principal, Timestamp][] = [];
      for (const userId of userIds) {
        try {
          const profile = await actor.getUserProfile(userId);
          if (profile) {
            results.push([userId, profile.lastOnline]);
          }
        } catch {
          // Skip users we can't fetch
        }
      }
      return results;
    },
    enabled: !!actor && !isFetching && userIds.length > 0,
    refetchInterval: 30000,
  });
}

export function useUpdateLastOnline() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Actor not available");
      const profile = await actor.getCallerUserProfile();
      if (!profile) return;
      const updatedProfile = {
        ...profile,
        lastOnline: BigInt(Date.now() * 1000000),
      };
      return actor.saveCallerUserProfile(updatedProfile);
    },
  });
}

// Recent Statuses Query
export function useGetRecentStatuses(limit = 10) {
  const { actor, isFetching } = useActor();

  return useQuery<FeedItem[]>({
    queryKey: ["recentStatuses", limit],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return [];
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 10000,
  });
}

// Search Queries
export function useSearchProfiles(searchTerm: string) {
  const { actor, isFetching } = useActor();

  return useQuery<SearchResult[]>({
    queryKey: ["searchProfiles", searchTerm],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      if (!searchTerm.trim()) return [];
      return [];
    },
    enabled: !!actor && !isFetching && searchTerm.trim().length > 0,
  });
}

export function useSearchContent(searchTerm: string, searchType: string) {
  const { actor, isFetching } = useActor();

  return useQuery<{ results: SearchResult[]; searchType: string }>({
    queryKey: ["searchContent", searchTerm, searchType],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      if (!searchTerm.trim()) return { results: [], searchType };
      return { results: [], searchType };
    },
    enabled: !!actor && !isFetching && searchTerm.trim().length > 0,
  });
}

// Search Engine Store Queries
export function useGetAvailableSearchEngines() {
  const { actor, isFetching } = useActor();

  return useQuery<SearchEngine[]>({
    queryKey: ["availableSearchEngines"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return [];
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetDefaultSearchEngine() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<string>({
    queryKey: ["defaultSearchEngine"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      try {
        return "ultra_search";
      } catch (error: any) {
        if (error.message?.includes("Unauthorized")) {
          return "ultra_search";
        }
        throw error;
      }
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

export function useSetDefaultSearchEngine() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (_searchEngineId: string) => {
      if (!actor) throw new Error("Actor not available");
      return;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["defaultSearchEngine"] });
    },
  });
}

export function useRecordSearchHistory() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (_params: {
      searchTerm: string;
      searchEngineId: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["searchHistory"] });
    },
  });
}

export function useGetSearchHistory() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<SearchHistoryEntry[]>({
    queryKey: ["searchHistory"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      try {
        return [];
      } catch (error: any) {
        if (error.message?.includes("Unauthorized")) {
          return [];
        }
        throw error;
      }
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

// Group Queries
export function useGetUserGroups() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<Group[]>({
    queryKey: ["userGroups"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      try {
        return await actor.getUserGroups();
      } catch (error: any) {
        if (error.message?.includes("Unauthorized")) {
          return [];
        }
        throw error;
      }
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

export function useGetGroup(groupId: GroupId) {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<Group | null>({
    queryKey: ["group", groupId],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      try {
        return await actor.getGroup(groupId);
      } catch (error: any) {
        if (
          error.message?.includes("Unauthorized") ||
          error.message?.includes("members")
        ) {
          return null;
        }
        throw error;
      }
    },
    enabled: !!actor && !isFetching && !!identity && !!groupId,
  });
}

export function useCreateGroup() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      name,
      description,
    }: { name: string; description: string }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createGroup(name, description);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userGroups"] });
    },
  });
}

export function useAddGroupMember() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      groupId,
      userId,
    }: { groupId: GroupId; userId: Principal }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.addGroupMember(groupId, userId);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["userGroups"] });
      queryClient.invalidateQueries({ queryKey: ["group", variables.groupId] });
    },
  });
}

export function useGetGroupMessages(groupId: GroupId) {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<GroupMessage[]>({
    queryKey: ["groupMessages", groupId],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      try {
        return await actor.getGroupMessages(groupId);
      } catch (error: any) {
        if (
          error.message?.includes("Unauthorized") ||
          error.message?.includes("members")
        ) {
          return [];
        }
        throw error;
      }
    },
    enabled: !!actor && !isFetching && !!identity && !!groupId,
  });
}

export function useSendGroupMessage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      groupId,
      content,
      mediaAttachment,
      color,
      effect,
    }: {
      groupId: GroupId;
      content: string;
      mediaAttachment: MediaAttachment | null;
      color: MessageColor;
      effect: MessageEffect;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.sendGroupMessage(
        groupId,
        content,
        mediaAttachment,
        color,
        effect,
      );
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["groupMessages", variables.groupId],
      });
    },
  });
}

// Direct Messaging Queries
export function useGetDirectMessagePartners() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<Principal[]>({
    queryKey: ["directMessagePartners"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      try {
        return [];
      } catch (error: any) {
        if (error.message?.includes("Unauthorized")) {
          return [];
        }
        throw error;
      }
    },
    enabled: !!actor && !isFetching && !!identity,
    refetchInterval: 10000,
  });
}

export function useGetMessagesWithUser(userId: Principal) {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<DirectMessage[]>({
    queryKey: ["directMessages", userId.toString()],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      try {
        return [];
      } catch (error: any) {
        if (error.message?.includes("Unauthorized")) {
          return [];
        }
        throw error;
      }
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

export function useSendMessage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (_params: {
      receiver: Principal;
      content: string;
      color: MessageColor;
      effect: MessageEffect;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["directMessages"],
      });
      queryClient.invalidateQueries({ queryKey: ["directMessagePartners"] });
    },
  });
}

// Follow/Unfollow Mutations
export function useFollowUser() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (_targetUser: Principal) => {
      if (!actor) throw new Error("Actor not available");
      throw new Error("Follow functionality not yet implemented");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUserProfile"] });
      queryClient.invalidateQueries({ queryKey: ["friendSuggestions"] });
      queryClient.invalidateQueries({ queryKey: ["homeFeed"] });
    },
  });
}

export function useUnfollowUser() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (_targetUser: Principal) => {
      if (!actor) throw new Error("Actor not available");
      throw new Error("Unfollow functionality not yet implemented");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUserProfile"] });
      queryClient.invalidateQueries({ queryKey: ["friendSuggestions"] });
      queryClient.invalidateQueries({ queryKey: ["homeFeed"] });
    },
  });
}

// Feed Queries
export function useGetHomeFeed() {
  const { actor, isFetching } = useActor();

  return useQuery<FeedItem[]>({
    queryKey: ["homeFeed"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return [];
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetFriendSuggestions() {
  const { actor, isFetching } = useActor();

  return useQuery<SearchResult[]>({
    queryKey: ["friendSuggestions"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return [];
    },
    enabled: !!actor && !isFetching,
  });
}

// Daily Rewards
export function useClaimDailyReward() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUserProfile"] });
      queryClient.invalidateQueries({ queryKey: ["pointsHistory"] });
    },
  });
}

// Points System Queries
export function useGetPointsBalance() {
  const { actor, isFetching } = useActor();

  return useQuery<bigint>({
    queryKey: ["pointsBalance"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return BigInt(0);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetPointsHistory() {
  const { actor, isFetching } = useActor();

  return useQuery<PointsTransaction[]>({
    queryKey: ["pointsHistory"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return [];
    },
    enabled: !!actor && !isFetching,
  });
}

export function usePurchasePoints() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (_pointsToBuy: bigint) => {
      if (!actor) throw new Error("Actor not available");
      return;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUserProfile"] });
      queryClient.invalidateQueries({ queryKey: ["pointsBalance"] });
      queryClient.invalidateQueries({ queryKey: ["pointsHistory"] });
    },
  });
}

export function useSpendPoints() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (_amount: bigint) => {
      if (!actor) throw new Error("Actor not available");
      return;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUserProfile"] });
      queryClient.invalidateQueries({ queryKey: ["pointsBalance"] });
      queryClient.invalidateQueries({ queryKey: ["pointsHistory"] });
    },
  });
}

export function useGetStoreItems() {
  const { actor, isFetching } = useActor();

  return useQuery<PointsStoreItem[]>({
    queryKey: ["storeItems"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return [];
    },
    enabled: !!actor && !isFetching,
  });
}

export function usePurchaseStoreItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (_storeItemId: string) => {
      if (!actor) throw new Error("Actor not available");
      return;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUserProfile"] });
      queryClient.invalidateQueries({ queryKey: ["pointsBalance"] });
      queryClient.invalidateQueries({ queryKey: ["pointsHistory"] });
    },
  });
}

// Music Queries
export function useUploadMusic() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (_params: {
      id: string;
      title: string;
      artist: string;
      genre: string;
      file: ExternalBlob;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUserProfile"] });
      queryClient.invalidateQueries({ queryKey: ["friendsMusic"] });
    },
  });
}

export function useGetFriendsMusicUploads() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<MusicUpload[]>({
    queryKey: ["friendsMusic"],
    queryFn: async () => {
      if (!actor || !identity) return [];
      try {
        return [];
      } catch (error) {
        console.error("Error fetching friends music:", error);
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
    queryKey: ["publishedApps"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return [];
    },
    enabled: !!actor && !isFetching,
  });
}

export function usePublishApp() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (_params: {
      appTitle: string;
      devName: string;
      link: string;
      description: string;
      previewImage: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      throw new Error("App publishing functionality not yet implemented");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["publishedApps"] });
      queryClient.invalidateQueries({ queryKey: ["currentUserProfile"] });
    },
  });
}

// Premium Membership
export function useUpgradeToPremium() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (_months: bigint) => {
      if (!actor) throw new Error("Actor not available");
      return;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUserProfile"] });
    },
  });
}

export function useActivateFreeTrial() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUserProfile"] });
    },
  });
}

export function useGetPremiumContent() {
  const { actor, isFetching } = useActor();

  return useQuery<PremiumContent[]>({
    queryKey: ["premiumContent"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return [];
    },
    enabled: !!actor && !isFetching,
  });
}

// Live Streams
export function useGetLiveStreams() {
  const { actor, isFetching } = useActor();

  return useQuery<LiveStream[]>({
    queryKey: ["liveStreams"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return [];
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateLiveStream() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (_params: {
      title: string;
      description: string;
      streamURL: string;
      thumbnailImage: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      throw new Error("Live streaming functionality not yet implemented");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["liveStreams"] });
    },
  });
}

export function useStopLiveStream() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (_streamId: bigint) => {
      if (!actor) throw new Error("Actor not available");
      throw new Error("Live streaming functionality not yet implemented");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["liveStreams"] });
    },
  });
}

// Upcoming Features
export function useGetUpcomingFeatures() {
  const { actor, isFetching } = useActor();

  return useQuery<UpcomingFeature[]>({
    queryKey: ["upcomingFeatures"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return [];
    },
    enabled: !!actor && !isFetching,
  });
}

// Upcoming Games
export function useGetUpcomingGames() {
  const { actor, isFetching } = useActor();

  return useQuery<UpcomingGame[]>({
    queryKey: ["upcomingGames"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
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
      if (!actor) throw new Error("Actor not available");
      return;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUserProfile"] });
      queryClient.invalidateQueries({ queryKey: ["pointsHistory"] });
      queryClient.invalidateQueries({ queryKey: ["lastClaimedMysteryItem"] });
      queryClient.invalidateQueries({
        queryKey: ["mysteryItemClaimAvailable"],
      });
    },
  });
}

export function useGetLastClaimedMysteryItem() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<MysteryItem | null>({
    queryKey: ["lastClaimedMysteryItem"],
    queryFn: async () => {
      if (!actor || !identity) return null;
      return null;
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

export function useIsMysteryItemClaimAvailable() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<boolean>({
    queryKey: ["mysteryItemClaimAvailable"],
    queryFn: async () => {
      if (!actor || !identity) return false;
      return false;
    },
    enabled: !!actor && !isFetching && !!identity,
    refetchInterval: 60000,
  });
}
