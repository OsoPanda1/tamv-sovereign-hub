/**
 * MSR STAKING SYSTEM - TAMV MD-X4™
 * Pools, APY Dinámico, Auto-Compound
 * Distribución Económica: 20% Fénix / 30% Infra / 50% Utilidad
 */

// =====================================================
// TIPOS Y ENUMS
// =====================================================

export type StakingPoolType = 
  | 'flexible' 
  | 'locked_30' 
  | 'locked_90' 
  | 'locked_180' 
  | 'locked_365' 
  | 'governance';

export type StakingPositionStatus = 
  | 'active' 
  | 'unstaking' 
  | 'completed' 
  | 'cancelled';

export type StakingRewardType = 
  | 'yield' 
  | 'bonus' 
  | 'referral' 
  | 'governance' 
  | 'compound';

// =====================================================
// INTERFACES
// =====================================================

export interface StakingPool {
  id: string;
  name: string;
  description: string | null;
  pool_type: StakingPoolType;
  base_apy: number;
  max_apy: number;
  current_apy: number;
  fenix_share: number;
  infra_share: number;
  utility_share: number;
  min_stake: number;
  max_stake: number | null;
  total_staked: number;
  total_capacity: number | null;
  lock_days: number;
  early_unstake_penalty: number;
  auto_compound_enabled: boolean;
  compound_frequency_hours: number;
  is_active: boolean;
  is_featured: boolean;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface StakingPosition {
  id: string;
  user_id: string;
  pool_id: string;
  staked_amount: number;
  compounded_amount: number;
  total_earned: number;
  pending_rewards: number;
  locked_apy: number;
  staked_at: string;
  lock_until: string | null;
  last_compound_at: string;
  last_claim_at: string | null;
  unstaked_at: string | null;
  status: StakingPositionStatus;
  auto_compound: boolean;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  // Joined data
  pool?: StakingPool;
}

export interface StakingReward {
  id: string;
  position_id: string;
  user_id: string;
  pool_id: string;
  reward_type: StakingRewardType;
  gross_amount: number;
  fenix_amount: number;
  infra_amount: number;
  net_amount: number;
  apy_at_time: number;
  was_compounded: boolean;
  period_start: string;
  period_end: string;
  created_at: string;
}

export interface StakingConfig {
  id: string;
  tvl_threshold_low: number;
  tvl_threshold_high: number;
  apy_boost_low_tvl: number;
  apy_reduction_high_tvl: number;
  lock_30_bonus: number;
  lock_90_bonus: number;
  lock_180_bonus: number;
  lock_365_bonus: number;
  global_max_stake_per_user: number | null;
  min_compound_amount: number;
  default_fenix_share: number;
  default_infra_share: number;
  default_utility_share: number;
  updated_at: string;
  updated_by: string | null;
}

export interface StakingStats {
  totalTVL: number;
  totalStakers: number;
  averageAPY: number;
  totalRewardsDistributed: number;
  fenixCollected: number;
  infraCollected: number;
}

// =====================================================
// DISTRIBUCIÓN ECONÓMICA 20/30/50
// =====================================================

export const ECONOMIC_DISTRIBUTION = {
  FENIX_SHARE: 0.20,      // 20% - Protocolo Fénix (reparación/comunidad)
  INFRA_SHARE: 0.30,      // 30% - Infraestructura y operación
  UTILITY_SHARE: 0.50,    // 50% - Utilidad neta (usuario)
} as const;

/**
 * Calcula la distribución 20/30/50 sobre un monto de rewards
 */
export const calculateDistribution = (grossAmount: number) => ({
  gross: grossAmount,
  fenix: grossAmount * ECONOMIC_DISTRIBUTION.FENIX_SHARE,
  infra: grossAmount * ECONOMIC_DISTRIBUTION.INFRA_SHARE,
  utility: grossAmount * ECONOMIC_DISTRIBUTION.UTILITY_SHARE,
});

// =====================================================
// CÁLCULOS DE APY
// =====================================================

/**
 * Calcula el APY efectivo considerando auto-compound
 * APY Efectivo = (1 + APY/n)^n - 1, donde n = frecuencia de compound
 */
export const calculateEffectiveAPY = (
  baseAPY: number, 
  compoundFrequencyHours: number = 24
): number => {
  const compoundsPerYear = (365 * 24) / compoundFrequencyHours;
  const ratePerPeriod = (baseAPY / 100) / compoundsPerYear;
  const effectiveAPY = Math.pow(1 + ratePerPeriod, compoundsPerYear) - 1;
  return effectiveAPY * 100;
};

/**
 * Calcula rewards pendientes basado en tiempo transcurrido
 */
export const calculatePendingRewards = (
  stakedAmount: number,
  compoundedAmount: number,
  apy: number,
  lastCompoundAt: Date
): number => {
  const now = new Date();
  const hoursElapsed = (now.getTime() - lastCompoundAt.getTime()) / (1000 * 60 * 60);
  const totalStaked = stakedAmount + compoundedAmount;
  const hourlyRate = (apy / 100) / 365 / 24;
  return totalStaked * hourlyRate * hoursElapsed;
};

/**
 * Proyecta rewards futuros
 */
export const projectRewards = (
  amount: number,
  apy: number,
  days: number,
  autoCompound: boolean = true,
  compoundFrequencyHours: number = 24
): { grossReward: number; netReward: number; fenixAmount: number; infraAmount: number } => {
  let totalReward: number;
  
  if (autoCompound) {
    const effectiveAPY = calculateEffectiveAPY(apy, compoundFrequencyHours);
    const dailyRate = effectiveAPY / 100 / 365;
    totalReward = amount * (Math.pow(1 + dailyRate, days) - 1);
  } else {
    const dailyRate = (apy / 100) / 365;
    totalReward = amount * dailyRate * days;
  }
  
  const distribution = calculateDistribution(totalReward);
  
  return {
    grossReward: distribution.gross,
    netReward: distribution.utility,
    fenixAmount: distribution.fenix,
    infraAmount: distribution.infra,
  };
};

// =====================================================
// UTILIDADES DE POOL
// =====================================================

export const POOL_TYPE_LABELS: Record<StakingPoolType, string> = {
  flexible: 'Flexible',
  locked_30: '30 Días',
  locked_90: '90 Días',
  locked_180: '180 Días',
  locked_365: '1 Año',
  governance: 'Gobernanza',
};

export const POOL_TYPE_ICONS: Record<StakingPoolType, string> = {
  flexible: '🌊',
  locked_30: '🛡️',
  locked_90: '⚔️',
  locked_180: '👑',
  locked_365: '🏛️',
  governance: '🗳️',
};

/**
 * Calcula tiempo restante de lock
 */
export const calculateLockRemaining = (lockUntil: string | null): {
  isLocked: boolean;
  daysRemaining: number;
  hoursRemaining: number;
  percentComplete: number;
} => {
  if (!lockUntil) {
    return { isLocked: false, daysRemaining: 0, hoursRemaining: 0, percentComplete: 100 };
  }
  
  const now = new Date();
  const lockDate = new Date(lockUntil);
  const remaining = lockDate.getTime() - now.getTime();
  
  if (remaining <= 0) {
    return { isLocked: false, daysRemaining: 0, hoursRemaining: 0, percentComplete: 100 };
  }
  
  const daysRemaining = Math.floor(remaining / (1000 * 60 * 60 * 24));
  const hoursRemaining = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  
  return {
    isLocked: true,
    daysRemaining,
    hoursRemaining,
    percentComplete: 0, // Would need staked_at to calculate
  };
};

/**
 * Formatea APY para display
 */
export const formatAPY = (apy: number): string => {
  return `${apy.toFixed(2)}%`;
};

/**
 * Formatea MSR amount
 */
export const formatMSR = (amount: number): string => {
  return new Intl.NumberFormat('es-MX', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount) + ' MSR';
};

/**
 * Calcula penalización por retiro anticipado
 */
export const calculateEarlyUnstakePenalty = (
  stakedAmount: number,
  compoundedAmount: number,
  penaltyRate: number
): number => {
  return (stakedAmount + compoundedAmount) * penaltyRate;
};
