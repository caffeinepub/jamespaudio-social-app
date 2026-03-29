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
export type Timestamp = bigint;
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
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
    color: MessageColor;
    effect: MessageEffect;
    sender: UserId;
    groupId: GroupId;
    timestamp: Timestamp;
}
export interface Group {
    id: GroupId;
    members: Array<UserId>;
    name: string;
    createdAt: Timestamp;
    createdBy: UserId;
    description: string;
}
export interface MediaAttachment {
    url: string;
    contentType: string;
    mediaType: Variant_audio_video_image;
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
export type GroupId = string;
export type UserId = Principal;
export interface Badge {
    name: string;
    typeId: bigint;
    description: string;
    earnedAt: Timestamp;
}
export interface ShoppingItem {
    productName: string;
    currency: string;
    quantity: bigint;
    priceInCents: bigint;
    productDescription: string;
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
export type Status = string;
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
    membershipTier: MembershipTier;
    isPremiumMember: boolean;
    points: bigint;
    musicUploads: Array<MusicUpload>;
}
export enum MembershipTier {
    pro = "pro",
    free = "free",
    ultra = "ultra",
    ultimate = "ultimate"
}
export enum MessageColor {
    normal = "normal",
    blue = "blue",
    cyan = "cyan",
    orange = "orange",
    purple = "purple",
    black = "black"
}
export enum MessageEffect {
    fiery = "fiery",
    none = "none",
    skull = "skull",
    animated = "animated",
    spooky = "spooky",
    devil = "devil",
    dodge = "dodge"
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
    addGroupMember(groupId: GroupId, userId: UserId): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createCheckoutSession(items: Array<ShoppingItem>, successUrl: string, cancelUrl: string): Promise<string>;
    createGroup(name: string, description: string): Promise<GroupId>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getGroup(groupId: GroupId): Promise<Group | null>;
    getGroupMessages(groupId: GroupId): Promise<Array<GroupMessage>>;
    getMembershipTier(userId: UserId): Promise<MembershipTier>;
    getStripeSessionStatus(sessionId: string): Promise<StripeSessionStatus>;
    getUserGroups(): Promise<Array<Group>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    isStripeConfigured(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    sendGroupMessage(groupId: GroupId, content: string, mediaAttachment: MediaAttachment | null, color: MessageColor, effect: MessageEffect): Promise<void>;
    sendGroupMessageLegacy(groupId: GroupId, content: string, mediaAttachment: MediaAttachment | null): Promise<void>;
    setMembershipTier(userId: UserId, tier: MembershipTier): Promise<void>;
    setStripeConfiguration(config: StripeConfiguration): Promise<void>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
}
