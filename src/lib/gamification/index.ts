/**
 * GAMIFICATION SYSTEM - TAMV MD-X4™
 * Achievements, Badges, Leaderboards, Rewards
 * Staking and Reputation Engine
 */

export type AchievementCategory = 
  | 'social'           // Interactions, followers
  | 'creator'          // Content creation
  | 'explorer'         // DreamSpaces visits
  | 'trader'           // Marketplace activity
  | 'scholar'          // University courses
  | 'citizen'          // DAO participation
  | 'collector'        // NFTs collected
  | 'philanthropist'   // Tips given
  | 'legendary';       // Special achievements

export type BadgeRarity = 
  | 'common'
  | 'uncommon'
  | 'rare'
  | 'epic'
  | 'legendary'
  | 'mythic';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  category: AchievementCategory;
  icon: string;
  rarity: BadgeRarity;
  xpReward: number;
  msrReward: number;
  requirement: AchievementRequirement;
  isSecret: boolean;
  unlockedBy: number; // % of users
}

export interface AchievementRequirement {
  type: 'count' | 'streak' | 'milestone' | 'special';
  target: number;
  metric: string;
  timeframe?: 'daily' | 'weekly' | 'monthly' | 'alltime';
}

export interface UserAchievement {
  achievementId: string;
  unlockedAt: Date;
  progress: number;
  claimed: boolean;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: BadgeRarity;
  category: string;
  expiresAt?: Date;
  isEquipped: boolean;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
  score: number;
  change: number; // position change
  tier?: string;
}

export interface Leaderboard {
  id: string;
  name: string;
  type: 'xp' | 'msr' | 'reputation' | 'followers' | 'custom';
  period: 'daily' | 'weekly' | 'monthly' | 'alltime';
  entries: LeaderboardEntry[];
  updatedAt: Date;
  rewards: LeaderboardReward[];
}

export interface LeaderboardReward {
  rank: number | [number, number]; // single or range
  msrReward: number;
  xpReward: number;
  badge?: string;
}

export interface StakingPool {
  id: string;
  name: string;
  description: string;
  totalStaked: number;
  apy: number;
  lockPeriodDays: number;
  minStake: number;
  maxStake?: number;
  stakersCount: number;
  rewardsDistributed: number;
  isActive: boolean;
}

export interface UserStake {
  poolId: string;
  amount: number;
  stakedAt: Date;
  unlocksAt: Date;
  earnedRewards: number;
  claimedRewards: number;
  autoCompound: boolean;
}

export interface ReputationScore {
  total: number;
  breakdown: {
    social: number;
    creator: number;
    governance: number;
    economic: number;
    longevity: number;
  };
  level: ReputationLevel;
  nextLevelAt: number;
}

export type ReputationLevel = 
  | 'newcomer'
  | 'citizen'
  | 'contributor'
  | 'pioneer'
  | 'elder'
  | 'sovereign';

/**
 * Rarity colors and multipliers
 */
export const RARITY_CONFIG: Record<BadgeRarity, { color: string; multiplier: number }> = {
  common: { color: '#9CA3AF', multiplier: 1 },
  uncommon: { color: '#10B981', multiplier: 1.5 },
  rare: { color: '#3B82F6', multiplier: 2 },
  epic: { color: '#8B5CF6', multiplier: 3 },
  legendary: { color: '#D4AF37', multiplier: 5 },
  mythic: { color: '#EC4899', multiplier: 10 },
};

/**
 * Reputation level thresholds
 */
export const REPUTATION_LEVELS: Record<ReputationLevel, number> = {
  newcomer: 0,
  citizen: 100,
  contributor: 500,
  pioneer: 2000,
  elder: 10000,
  sovereign: 50000,
};

/**
 * Default achievements
 */
export const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_post',
    name: 'Primera Voz',
    description: 'Publica tu primer contenido',
    category: 'creator',
    icon: '✨',
    rarity: 'common',
    xpReward: 50,
    msrReward: 10,
    requirement: { type: 'count', target: 1, metric: 'posts' },
    isSecret: false,
    unlockedBy: 85,
  },
  {
    id: 'dreamspace_visitor',
    name: 'Explorador de Sueños',
    description: 'Visita 10 DreamSpaces diferentes',
    category: 'explorer',
    icon: '🌌',
    rarity: 'uncommon',
    xpReward: 150,
    msrReward: 25,
    requirement: { type: 'count', target: 10, metric: 'dreamspaces_visited' },
    isSecret: false,
    unlockedBy: 45,
  },
  {
    id: 'generous_soul',
    name: 'Alma Generosa',
    description: 'Envía propinas por un total de 1000 MSR',
    category: 'philanthropist',
    icon: '💝',
    rarity: 'rare',
    xpReward: 300,
    msrReward: 50,
    requirement: { type: 'milestone', target: 1000, metric: 'tips_sent_total' },
    isSecret: false,
    unlockedBy: 12,
  },
  {
    id: 'art_collector',
    name: 'Coleccionista de Arte',
    description: 'Posee 25 NFTs en tu galería',
    category: 'collector',
    icon: '🎨',
    rarity: 'epic',
    xpReward: 500,
    msrReward: 100,
    requirement: { type: 'count', target: 25, metric: 'nfts_owned' },
    isSecret: false,
    unlockedBy: 5,
  },
  {
    id: 'sovereign_voice',
    name: 'Voz Soberana',
    description: 'Participa en 50 votaciones del DAO',
    category: 'citizen',
    icon: '👑',
    rarity: 'legendary',
    xpReward: 1000,
    msrReward: 250,
    requirement: { type: 'count', target: 50, metric: 'dao_votes' },
    isSecret: false,
    unlockedBy: 1,
  },
  {
    id: 'isabella_friend',
    name: 'Amigo de Isabella',
    description: 'Conversa con Isabella 100 veces',
    category: 'legendary',
    icon: '🤖',
    rarity: 'mythic',
    xpReward: 2000,
    msrReward: 500,
    requirement: { type: 'count', target: 100, metric: 'isabella_conversations' },
    isSecret: true,
    unlockedBy: 0.5,
  },
];

/**
 * Calculate reputation level from score
 */
export const getReputationLevel = (score: number): ReputationLevel => {
  const levels = Object.entries(REPUTATION_LEVELS).reverse();
  for (const [level, threshold] of levels) {
    if (score >= threshold) {
      return level as ReputationLevel;
    }
  }
  return 'newcomer';
};

/**
 * Calculate XP needed for next level
 */
export const getNextLevelXP = (currentXP: number): number => {
  const currentLevel = getReputationLevel(currentXP);
  const levels = Object.entries(REPUTATION_LEVELS);
  const currentIndex = levels.findIndex(([l]) => l === currentLevel);
  
  if (currentIndex === levels.length - 1) {
    return currentXP; // Max level
  }
  
  return levels[currentIndex + 1][1];
};

/**
 * Calculate staking rewards
 */
export const calculateStakingRewards = (
  stake: UserStake,
  pool: StakingPool
): number => {
  const now = new Date();
  const stakedDays = (now.getTime() - stake.stakedAt.getTime()) / (1000 * 60 * 60 * 24);
  const dailyRate = pool.apy / 365 / 100;
  const baseReward = stake.amount * dailyRate * stakedDays;
  
  // Bonus for auto-compound
  if (stake.autoCompound) {
    return baseReward * 1.1;
  }
  
  return baseReward;
};

/**
 * Check if achievement is unlocked
 */
export const checkAchievementProgress = (
  achievement: Achievement,
  currentValue: number
): { unlocked: boolean; progress: number } => {
  const progress = Math.min(100, (currentValue / achievement.requirement.target) * 100);
  return {
    unlocked: currentValue >= achievement.requirement.target,
    progress,
  };
};

/**
 * Format leaderboard rank with medal
 */
export const formatRank = (rank: number): string => {
  switch (rank) {
    case 1: return '🥇';
    case 2: return '🥈';
    case 3: return '🥉';
    default: return `#${rank}`;
  }
};
