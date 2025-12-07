export interface TrackerResponse {
  data: PlayerData;
}

export interface PlayerData {
  platformInfo: PlatformInfo;
  userInfo: UserInfo;
  metadata: any;
  segments: Segment[];
  expiryDate: string;
}

export interface PlatformInfo {
  platformSlug: string;
  platformUserId: string;
  platformUserHandle: string;
  platformUserIdentifier: string;
  avatarUrl: string;
  additionalParameters: any;
}

export interface UserInfo {
  userId: number;
  isPremium: boolean;
  isVerified: boolean;
  isInfluencer: boolean;
  isPartner: boolean;
  countryCode: string;
  customAvatarUrl: string;
  customHeroUrl: string;
  socialAccounts: any[];
  pageviews: number;
  isSuspicious: boolean;
}

export interface Segment {
  type: string;
  attributes: any;
  metadata: SegmentMetadata;
  stats: Stats;
}

export interface SegmentMetadata {
  name: string;
}

export interface Stats {
  [key: string]: StatDetail;
}

export interface StatDetail {
  rank: number | null;
  percentile: number | null;
  displayName: string;
  displayCategory: string;
  category: string;
  metadata: any;
  value: number;
  displayValue: string;
  displayType: string;
}

export interface SearchResult {
  data: SearchData[];
}

export interface SearchData {
  platformId: number;
  platformSlug: string;
  platformUserIdentifier: string;
  platformUserHandle: string;
  avatarUrl: string;
  additionalParameters: any;
}

