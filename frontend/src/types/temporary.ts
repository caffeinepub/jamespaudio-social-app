// Temporary type definitions for features not yet implemented in backend
// These should be removed once the backend is fully implemented

import type { Principal } from '@dfinity/principal';

export type UserId = Principal;
export type Timestamp = bigint;

export interface FeedItem {
  userId: UserId;
  username: string;
  status: string;
  timestamp: Timestamp;
}

export interface Message {
  id: bigint;
  sender: UserId;
  receiver: UserId;
  content: string;
  timestamp: Timestamp;
}

export interface PublishedApp {
  title: string;
  developerName: string;
  creatorId: UserId;
  link: string;
  publishedAt: Timestamp;
  description: string;
  previewImage: string;
}

export interface PremiumContent {
  id: string;
  title: string;
  description: string;
  releaseTime: Timestamp;
}

export interface LiveStream {
  id: bigint;
  creatorId: UserId;
  title: string;
  description: string;
  streamURL: string;
  isLive: boolean;
  startedAt?: Timestamp;
  scheduledTime?: Timestamp;
  viewerCount: bigint;
  thumbnailImage: string;
}

export interface UpcomingFeature {
  title: string;
  description: string;
  plannedRelease: Timestamp;
  status: FeatureStatus;
}

export interface UpcomingGame {
  title: string;
  description: string;
  genre: string;
}

export enum FeatureStatus {
  planned = 'planned',
  inProgress = 'inProgress',
  testing = 'testing',
  released = 'released',
}
