import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface SearchResult {
    bio: string;
    username: string;
    userId: UserId;
    followerCount: bigint;
    followingCount: bigint;
    profilePicture: {
        url: string;
        contentType: string;
    };
}
export type Timestamp = bigint;
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface SearchEngine {
    id: string;
    name: string;
    description: string;
    apiUrl: string;
}
export interface MusicUpload {
    id: string;
    title: string;
    file: ExternalBlob;
    genre: string;
    artist: string;
    uploadTime: Timestamp;
    uploadedBy: UserId;
}
export interface GroupMessage {
    id: string;
    content: string;
    mediaAttachment?: MediaAttachment;
    sender: UserId;
    groupId: GroupId;
    timestamp: Timestamp;
}
export interface DailyMysteryItemData {
    id: string;
    userId: UserId;
    lastDailyItemClaim?: Timestamp;
    newDailyItemResult?: MysteryItem;
    dailyItemBoxOpened: boolean;
}
export interface Group {
    id: GroupId;
    members: Array<UserId>;
    name: string;
    createdAt: Timestamp;
    createdBy: UserId;
    description: string;
}
export type GroupId = string;
export interface Badge {
    name: string;
    typeId: bigint;
    description: string;
    earnedAt: Timestamp;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export type StripeSessionStatus = {
    __kind__: "completed";
    completed: {
        userPrincipal?: string;
        response: string;
    };
} | {
    __kind__: "failed";
    failed: {
        error: string;
    };
};
export interface StripeConfiguration {
    allowedCountries: Array<string>;
    secretKey: string;
}
export interface DirectMessage {
    id: MessageId;
    content: string;
    sender: UserId;
    timestamp: Timestamp;
    receiver: UserId;
}
export interface PointsStoreItem {
    id: string;
    name: string;
    createdAt: Timestamp;
    description: string;
    price: bigint;
}
export interface PointsTransaction {
    id: string;
    transactionType: TransactionType;
    userId: UserId;
    description: string;
    timestamp: Timestamp;
    amount: bigint;
}
export interface http_header {
    value: string;
    name: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export type UserId = Principal;
export interface MediaAttachment {
    url: string;
    contentType: string;
    mediaType: Variant_audio_video_image;
}
export interface ShoppingItem {
    productName: string;
    currency: string;
    quantity: bigint;
    priceInCents: bigint;
    productDescription: string;
}
export type MessageId = bigint;
export interface FeedItem {
    status: Status;
    username: string;
    userId: UserId;
    timestamp: Timestamp;
}
export type Status = string;
export interface SearchHistoryEntry {
    userId: UserId;
    searchTerm: string;
    searchType: string;
    timestamp: Timestamp;
}
export interface MysteryItem {
    id: string;
    visualUrl?: string;
    name: string;
    description: string;
    rewardCooldown?: bigint;
    itemType: MysteryItemType;
    pointsReward?: bigint;
}
export interface UserProfile {
    bio: string;
    status: Status;
    username: string;
    createdAt: Timestamp;
    badges: Array<Badge>;
    publishedAppsCount: bigint;
    premiumExpiresAt?: Timestamp;
    updatedAt: Timestamp;
    rewardsClaimed: bigint;
    freeTrialStartTime?: Timestamp;
    freeTrialExpiresAt?: Timestamp;
    lastDailyRewardClaim?: Timestamp;
    dailyLoginStreak: bigint;
    lastOnline: Timestamp;
    followers: Array<UserId>;
    following: Array<UserId>;
    profilePicture: {
        url: string;
        contentType: string;
    };
    isPremiumMember: boolean;
    points: bigint;
    musicUploads: Array<MusicUpload>;
}
export enum MysteryItemType {
    message = "message",
    badge = "badge",
    visual = "visual",
    points = "points"
}
export enum TransactionType {
    earn = "earn",
    spend = "spend",
    purchase = "purchase"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum Variant_audio_video_image {
    audio = "audio",
    video = "video",
    image = "image"
}
export interface backendInterface {
    activateFreeTrial(): Promise<void>;
    addGroupMember(groupId: GroupId, userId: UserId): Promise<void>;
    addMysteryItem(mysteryItem: MysteryItem): Promise<void>;
    addStoreItem(item: PointsStoreItem): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    checkPointsEligibility(requiredPoints: bigint): Promise<string>;
    claimDailyItemsSecret(): Promise<MysteryItem | null>;
    claimDailyReward(): Promise<string>;
    createCheckoutSession(items: Array<ShoppingItem>, successUrl: string, cancelUrl: string): Promise<string>;
    createGroup(name: string, description: string): Promise<GroupId>;
    createProfile(username: string, bio: string): Promise<void>;
    deleteMysteryItem(id: string): Promise<void>;
    deleteStoreItem(id: string): Promise<void>;
    getAllMysteryItems(): Promise<Array<MysteryItem>>;
    getAllProfiles(): Promise<Array<UserProfile>>;
    getAvailableSearchEngines(): Promise<Array<SearchEngine>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getDefaultSearchEngine(): Promise<string>;
    getDirectMessagePartners(): Promise<Array<Principal>>;
    getDirectMessages(otherUser: Principal): Promise<Array<DirectMessage>>;
    getFriendsMusicUploads(userId: UserId): Promise<Array<MusicUpload>>;
    getGroup(groupId: GroupId): Promise<Group | null>;
    getGroupMessages(groupId: GroupId): Promise<Array<GroupMessage>>;
    getLastClaimedMysteryItem(userId: UserId): Promise<MysteryItem | null>;
    getLastOnline(userId: UserId): Promise<Timestamp>;
    getLastOnlineForMultipleUsers(userIds: Array<UserId>): Promise<Array<[UserId, Timestamp]>>;
    getPointsBalance(): Promise<bigint>;
    getPointsHistory(): Promise<Array<PointsTransaction>>;
    getProfile(userId: UserId): Promise<UserProfile>;
    getRecentStatuses(limit: bigint): Promise<Array<FeedItem>>;
    getSearchHistory(): Promise<Array<SearchHistoryEntry>>;
    getStoreItems(): Promise<Array<PointsStoreItem>>;
    getStripeSessionStatus(sessionId: string): Promise<StripeSessionStatus>;
    getUserGroups(): Promise<Array<Group>>;
    getUserMysteryItems(userId: UserId): Promise<Array<DailyMysteryItemData>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    isMysteryItemClaimAvailable(userId: UserId): Promise<boolean>;
    isStripeConfigured(): Promise<boolean>;
    purchasePoints(pointsToBuy: bigint): Promise<string>;
    purchaseStoreItem(storeItemId: string): Promise<string>;
    recordSearchHistory(searchTerm: string, searchEngineId: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    searchProfiles(searchTerm: string): Promise<Array<SearchResult>>;
    sendDirectMessage(receiver: Principal, content: string): Promise<void>;
    sendGroupMessage(groupId: GroupId, content: string, mediaAttachment: MediaAttachment | null): Promise<void>;
    setDefaultSearchEngine(searchEngineId: string): Promise<void>;
    setStripeConfiguration(config: StripeConfiguration): Promise<void>;
    spendPoints(amount: bigint): Promise<string>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    updateLastOnline(): Promise<void>;
    updateMysteryItem(id: string, name: string, description: string, pointsReward: bigint | null, visualUrl: string | null, rewardCooldown: bigint | null): Promise<void>;
    updateProfile(bio: string, profilePicture: {
        url: string;
        contentType: string;
    }): Promise<void>;
    updateStoreItem(id: string, name: string, description: string, price: bigint): Promise<void>;
    upgradeToPremium(months: bigint): Promise<void>;
    uploadMusic(id: string, title: string, artist: string, genre: string, file: ExternalBlob): Promise<void>;
}
