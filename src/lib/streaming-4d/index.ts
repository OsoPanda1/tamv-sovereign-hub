/**
 * STREAMING 4D - TAMV MD-X4™
 * WebRTC 4D Live Streaming with MSR Tipping
 * Chaotic Encryption for Premium Content
 */

export type StreamQuality = '480p' | '720p' | '1080p' | '4K';
export type StreamType = 'live' | 'premiere' | 'replay' | 'vod';
export type StreamCategory = 
  | 'gaming'
  | 'music'
  | 'art'
  | 'talk'
  | 'education'
  | 'ceremony'
  | 'metaverse'
  | 'auction';

export interface Stream {
  id: string;
  title: string;
  description: string;
  hostId: string;
  hostName: string;
  hostAvatar?: string;
  isVerified: boolean;
  thumbnailUrl: string;
  streamUrl?: string;
  category: StreamCategory;
  type: StreamType;
  quality: StreamQuality;
  isLive: boolean;
  isPremium: boolean;
  premiumPrice?: number;
  viewerCount: number;
  peakViewers: number;
  totalTips: number;
  tipCount: number;
  startedAt?: Date;
  scheduledAt?: Date;
  duration: number;
  tags: string[];
  chat: StreamChat;
  settings: StreamSettings;
}

export interface StreamChat {
  enabled: boolean;
  slowMode: number; // seconds between messages
  subscriberOnly: boolean;
  emoteOnly: boolean;
  moderators: string[];
}

export interface StreamSettings {
  allowClips: boolean;
  allowRewind: boolean;
  ageRestricted: boolean;
  chaoticEncryption: boolean;
  spatialAudio: boolean;
  vrEnabled: boolean;
  maxQuality: StreamQuality;
}

export interface StreamTip {
  id: string;
  streamId: string;
  senderId: string;
  senderName: string;
  amount: number;
  message?: string;
  animation?: TipAnimation;
  timestamp: Date;
  isHighlighted: boolean;
}

export type TipAnimation = 
  | 'none'
  | 'confetti'
  | 'fireworks'
  | 'rain'
  | 'quantum'
  | 'imperial';

export interface StreamEvent {
  id: string;
  streamId: string;
  type: StreamEventType;
  data: Record<string, unknown>;
  timestamp: Date;
}

export type StreamEventType = 
  | 'viewer_join'
  | 'viewer_leave'
  | 'tip_received'
  | 'raid'
  | 'subscription'
  | 'milestone'
  | 'poll_started'
  | 'poll_ended';

export interface StreamPoll {
  id: string;
  streamId: string;
  question: string;
  options: PollOption[];
  totalVotes: number;
  endsAt: Date;
  isActive: boolean;
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
  percentage: number;
}

export interface StreamRaid {
  fromStreamId: string;
  fromHostName: string;
  viewerCount: number;
  timestamp: Date;
}

/**
 * Tip animation thresholds
 */
export const TIP_ANIMATION_THRESHOLDS: Record<TipAnimation, number> = {
  none: 0,
  confetti: 10,
  fireworks: 50,
  rain: 100,
  quantum: 500,
  imperial: 1000,
};

/**
 * Stream quality bitrates
 */
export const QUALITY_BITRATES: Record<StreamQuality, number> = {
  '480p': 1500,
  '720p': 3000,
  '1080p': 6000,
  '4K': 15000,
};

/**
 * Get tip animation based on amount
 */
export const getTipAnimation = (amount: number): TipAnimation => {
  const entries = Object.entries(TIP_ANIMATION_THRESHOLDS).reverse();
  for (const [animation, threshold] of entries) {
    if (amount >= threshold) {
      return animation as TipAnimation;
    }
  }
  return 'none';
};

/**
 * Create stream tip
 */
export const createStreamTip = (
  streamId: string,
  senderId: string,
  senderName: string,
  amount: number,
  message?: string
): StreamTip => ({
  id: `tip_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  streamId,
  senderId,
  senderName,
  amount,
  message,
  animation: getTipAnimation(amount),
  timestamp: new Date(),
  isHighlighted: amount >= 100,
});

/**
 * Format viewer count
 */
export const formatViewerCount = (count: number): string => {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
};

/**
 * Format stream duration
 */
export const formatStreamDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Create default stream settings
 */
export const createDefaultStreamSettings = (): StreamSettings => ({
  allowClips: true,
  allowRewind: true,
  ageRestricted: false,
  chaoticEncryption: false,
  spatialAudio: true,
  vrEnabled: false,
  maxQuality: '1080p',
});

/**
 * Create default stream chat settings
 */
export const createDefaultChatSettings = (): StreamChat => ({
  enabled: true,
  slowMode: 0,
  subscriberOnly: false,
  emoteOnly: false,
  moderators: [],
});

/**
 * Calculate stream health score
 */
export const calculateStreamHealth = (
  viewerCount: number,
  tipCount: number,
  chatActivity: number,
  quality: StreamQuality
): number => {
  let score = 50; // Base score
  
  // Viewers boost
  score += Math.min(20, Math.log10(viewerCount + 1) * 10);
  
  // Engagement boost
  score += Math.min(15, tipCount * 0.5);
  score += Math.min(10, chatActivity * 0.1);
  
  // Quality boost
  const qualityBonus: Record<StreamQuality, number> = {
    '480p': 0,
    '720p': 2,
    '1080p': 4,
    '4K': 5,
  };
  score += qualityBonus[quality];
  
  return Math.min(100, Math.round(score));
};
