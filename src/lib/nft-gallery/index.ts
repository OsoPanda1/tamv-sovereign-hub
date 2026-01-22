/**
 * NFT GALLERY - TAMV MD-X4™
 * Art Galleries with Live Auctions
 * 3D Visualization and MSR Bidding
 */

export type NFTCategory = 
  | 'digital_art'
  | 'generative'
  | 'photography'
  | '3d_sculpture'
  | 'music'
  | 'video'
  | 'collectible'
  | 'avatar_wearable';

export type AuctionStatus = 
  | 'upcoming'
  | 'live'
  | 'ended'
  | 'sold'
  | 'cancelled';

export interface NFTArtwork {
  id: string;
  title: string;
  description: string;
  creatorId: string;
  creatorName: string;
  category: NFTCategory;
  mediaUrl: string;
  thumbnailUrl: string;
  is3D: boolean;
  modelUrl?: string;
  metadata: NFTMetadata;
  royaltyPercent: number;
  edition: {
    current: number;
    total: number;
  };
  createdAt: Date;
}

export interface NFTMetadata {
  attributes: { trait_type: string; value: string }[];
  externalUrl?: string;
  animationUrl?: string;
  backgroundColor?: string;
}

export interface Auction {
  id: string;
  artworkId: string;
  artwork?: NFTArtwork;
  sellerId: string;
  startPrice: number;
  currentBid: number;
  minimumIncrement: number;
  reservePrice?: number;
  highestBidderId?: string;
  highestBidderName?: string;
  bidCount: number;
  bids: Bid[];
  status: AuctionStatus;
  startTime: Date;
  endTime: Date;
  autoExtend: boolean;
  extensionMinutes: number;
}

export interface Bid {
  id: string;
  auctionId: string;
  bidderId: string;
  bidderName: string;
  amount: number;
  timestamp: Date;
  isWinning: boolean;
}

export interface Gallery {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  curatorIds: string[];
  artworks: NFTArtwork[];
  theme: GalleryTheme;
  isPublic: boolean;
  visitCount: number;
  featuredUntil?: Date;
}

export interface GalleryTheme {
  backgroundColor: string;
  accentColor: string;
  lighting: 'ambient' | 'spotlight' | 'dramatic' | 'natural';
  layout: 'linear' | 'circular' | 'grid' | 'freeform';
  musicPreset?: string;
}

/**
 * Default gallery themes
 */
export const GALLERY_THEMES: Record<string, GalleryTheme> = {
  obsidian: {
    backgroundColor: '#020202',
    accentColor: '#D4AF37',
    lighting: 'spotlight',
    layout: 'linear',
    musicPreset: 'ambient_dreamscape',
  },
  ethereal: {
    backgroundColor: '#0a0a0f',
    accentColor: '#2DD4BF',
    lighting: 'ambient',
    layout: 'circular',
    musicPreset: 'quantum_meditation',
  },
  imperial: {
    backgroundColor: '#0f0f0f',
    accentColor: '#D4AF37',
    lighting: 'dramatic',
    layout: 'grid',
    musicPreset: 'cyber_imperial',
  },
  void: {
    backgroundColor: '#000000',
    accentColor: '#ffffff',
    lighting: 'natural',
    layout: 'freeform',
    musicPreset: 'void_exploration',
  },
};

/**
 * Calculate auction time remaining
 */
export const getAuctionTimeRemaining = (endTime: Date): {
  hours: number;
  minutes: number;
  seconds: number;
  isEnded: boolean;
} => {
  const now = new Date();
  const diff = endTime.getTime() - now.getTime();
  
  if (diff <= 0) {
    return { hours: 0, minutes: 0, seconds: 0, isEnded: true };
  }
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  
  return { hours, minutes, seconds, isEnded: false };
};

/**
 * Calculate minimum next bid
 */
export const calculateMinimumBid = (auction: Auction): number => {
  if (auction.bidCount === 0) {
    return auction.startPrice;
  }
  return auction.currentBid + auction.minimumIncrement;
};

/**
 * Validate bid amount
 */
export const validateBid = (
  auction: Auction,
  bidAmount: number,
  bidderId: string
): { valid: boolean; error?: string } => {
  if (auction.status !== 'live') {
    return { valid: false, error: 'Auction is not active' };
  }
  
  if (auction.sellerId === bidderId) {
    return { valid: false, error: 'Cannot bid on your own auction' };
  }
  
  const minBid = calculateMinimumBid(auction);
  if (bidAmount < minBid) {
    return { valid: false, error: `Minimum bid is ${minBid} MSR` };
  }
  
  if (auction.highestBidderId === bidderId) {
    return { valid: false, error: 'You are already the highest bidder' };
  }
  
  return { valid: true };
};

/**
 * Create new bid
 */
export const createBid = (
  auctionId: string,
  bidderId: string,
  bidderName: string,
  amount: number
): Bid => ({
  id: `bid_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  auctionId,
  bidderId,
  bidderName,
  amount,
  timestamp: new Date(),
  isWinning: true,
});

/**
 * Format auction countdown
 */
export const formatAuctionCountdown = (endTime: Date): string => {
  const { hours, minutes, seconds, isEnded } = getAuctionTimeRemaining(endTime);
  
  if (isEnded) return 'Finalizada';
  
  if (hours > 24) {
    const days = Math.floor(hours / 24);
    return `${days}d ${hours % 24}h`;
  }
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};
