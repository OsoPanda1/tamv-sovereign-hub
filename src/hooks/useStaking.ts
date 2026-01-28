/**
 * useStaking - React Hook para MSR Staking System
 * Maneja pools, posiciones, rewards y operaciones de staking
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';
import {
  type StakingPool,
  type StakingPosition,
  type StakingReward,
  type StakingConfig,
  type StakingStats,
  calculatePendingRewards,
  calculateEffectiveAPY,
  projectRewards,
  formatMSR,
} from '@/lib/staking';

export interface UseStakingReturn {
  // Data
  pools: StakingPool[];
  positions: StakingPosition[];
  rewards: StakingReward[];
  config: StakingConfig | null;
  stats: StakingStats;
  
  // Loading states
  isLoading: boolean;
  isStaking: boolean;
  isUnstaking: boolean;
  
  // Actions
  stake: (poolId: string, amount: number, autoCompound?: boolean) => Promise<string | null>;
  unstake: (positionId: string, forceEarly?: boolean) => Promise<number | null>;
  claimRewards: (positionId: string) => Promise<number | null>;
  
  // Helpers
  getPoolById: (poolId: string) => StakingPool | undefined;
  getPositionsByPool: (poolId: string) => StakingPosition[];
  getUserTotalStaked: () => number;
  getUserTotalEarned: () => number;
  getUserPendingRewards: () => number;
  refreshData: () => Promise<void>;
  
  // Projections
  calculateProjection: (poolId: string, amount: number, days: number) => ReturnType<typeof projectRewards>;
}

export const useStaking = (): UseStakingReturn => {
  const { user } = useAuth();
  
  const [pools, setPools] = useState<StakingPool[]>([]);
  const [positions, setPositions] = useState<StakingPosition[]>([]);
  const [rewards, setRewards] = useState<StakingReward[]>([]);
  const [config, setConfig] = useState<StakingConfig | null>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isStaking, setIsStaking] = useState(false);
  const [isUnstaking, setIsUnstaking] = useState(false);

  // Fetch all staking data
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Fetch pools
      const { data: poolsData, error: poolsError } = await supabase
        .from('staking_pools')
        .select('*')
        .eq('is_active', true)
        .order('is_featured', { ascending: false })
        .order('base_apy', { ascending: false });
      
      if (poolsError) throw poolsError;
      setPools((poolsData || []) as unknown as StakingPool[]);
      
      // Fetch config
      const { data: configData, error: configError } = await supabase
        .from('staking_config')
        .select('*')
        .limit(1)
        .single();
      
      if (!configError && configData) {
        setConfig(configData as unknown as StakingConfig);
      }
      
      // Fetch user positions if logged in
      if (user?.id) {
        const { data: positionsData, error: positionsError } = await supabase
          .from('staking_positions')
          .select('*, pool:staking_pools(*)')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .order('staked_at', { ascending: false });
        
        if (!positionsError && positionsData) {
          setPositions(positionsData as unknown as StakingPosition[]);
        }
        
        // Fetch user rewards
        const { data: rewardsData, error: rewardsError } = await supabase
          .from('staking_rewards')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(50);
        
        if (!rewardsError && rewardsData) {
          setRewards(rewardsData as unknown as StakingReward[]);
        }
      }
    } catch (error) {
      console.error('Error fetching staking data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Calculate stats
  const stats = useMemo<StakingStats>(() => {
    const totalTVL = pools.reduce((sum, p) => sum + Number(p.total_staked), 0);
    const averageAPY = pools.length > 0 
      ? pools.reduce((sum, p) => sum + Number(p.current_apy), 0) / pools.length 
      : 0;
    const totalRewardsDistributed = rewards.reduce((sum, r) => sum + Number(r.gross_amount), 0);
    const fenixCollected = rewards.reduce((sum, r) => sum + Number(r.fenix_amount), 0);
    const infraCollected = rewards.reduce((sum, r) => sum + Number(r.infra_amount), 0);
    
    return {
      totalTVL,
      totalStakers: 0, // Would need separate query
      averageAPY,
      totalRewardsDistributed,
      fenixCollected,
      infraCollected,
    };
  }, [pools, rewards]);

  // Stake MSR
  const stake = useCallback(async (
    poolId: string, 
    amount: number, 
    autoCompound: boolean = true
  ): Promise<string | null> => {
    if (!user?.id) {
      toast.error('Debes iniciar sesión para hacer staking');
      return null;
    }
    
    setIsStaking(true);
    try {
      const { data, error } = await supabase.rpc('execute_stake', {
        p_user_id: user.id,
        p_pool_id: poolId,
        p_amount: amount,
        p_auto_compound: autoCompound,
      });
      
      if (error) throw error;
      
      toast.success(`Staking exitoso: ${formatMSR(amount)}`);
      await fetchData();
      return data as string;
    } catch (error: any) {
      console.error('Stake error:', error);
      toast.error(error.message || 'Error al hacer staking');
      return null;
    } finally {
      setIsStaking(false);
    }
  }, [user?.id, fetchData]);

  // Unstake MSR
  const unstake = useCallback(async (
    positionId: string, 
    forceEarly: boolean = false
  ): Promise<number | null> => {
    if (!user?.id) {
      toast.error('Debes iniciar sesión');
      return null;
    }
    
    setIsUnstaking(true);
    try {
      const { data, error } = await supabase.rpc('execute_unstake', {
        p_position_id: positionId,
        p_force_early: forceEarly,
      });
      
      if (error) throw error;
      
      const amount = data as number;
      toast.success(`Unstake exitoso: ${formatMSR(amount)}`);
      await fetchData();
      return amount;
    } catch (error: any) {
      console.error('Unstake error:', error);
      toast.error(error.message || 'Error al hacer unstake');
      return null;
    } finally {
      setIsUnstaking(false);
    }
  }, [user?.id, fetchData]);

  // Claim rewards (without unstaking)
  const claimRewards = useCallback(async (positionId: string): Promise<number | null> => {
    if (!user?.id) {
      toast.error('Debes iniciar sesión');
      return null;
    }
    
    // For now, claiming is done via unstake/restake
    // Could implement separate claim function in DB
    toast.info('Los rewards se acumulan automáticamente con auto-compound');
    return null;
  }, [user?.id]);

  // Helpers
  const getPoolById = useCallback((poolId: string) => {
    return pools.find(p => p.id === poolId);
  }, [pools]);

  const getPositionsByPool = useCallback((poolId: string) => {
    return positions.filter(p => p.pool_id === poolId);
  }, [positions]);

  const getUserTotalStaked = useCallback(() => {
    return positions.reduce((sum, p) => 
      sum + Number(p.staked_amount) + Number(p.compounded_amount), 0);
  }, [positions]);

  const getUserTotalEarned = useCallback(() => {
    return positions.reduce((sum, p) => sum + Number(p.total_earned), 0);
  }, [positions]);

  const getUserPendingRewards = useCallback(() => {
    return positions.reduce((sum, p) => {
      const pending = calculatePendingRewards(
        Number(p.staked_amount),
        Number(p.compounded_amount),
        Number(p.locked_apy),
        new Date(p.last_compound_at)
      );
      return sum + pending;
    }, 0);
  }, [positions]);

  const calculateProjection = useCallback((poolId: string, amount: number, days: number) => {
    const pool = getPoolById(poolId);
    if (!pool) {
      return { grossReward: 0, netReward: 0, fenixAmount: 0, infraAmount: 0 };
    }
    return projectRewards(
      amount, 
      Number(pool.current_apy), 
      days, 
      pool.auto_compound_enabled,
      pool.compound_frequency_hours
    );
  }, [getPoolById]);

  return {
    pools,
    positions,
    rewards,
    config,
    stats,
    isLoading,
    isStaking,
    isUnstaking,
    stake,
    unstake,
    claimRewards,
    getPoolById,
    getPositionsByPool,
    getUserTotalStaked,
    getUserTotalEarned,
    getUserPendingRewards,
    refreshData: fetchData,
    calculateProjection,
  };
};
