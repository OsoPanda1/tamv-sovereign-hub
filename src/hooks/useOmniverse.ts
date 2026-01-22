/**
 * useOmniverse - React Hook for TAMV Omniverse State Management
 * Central hub for all TAMV systems
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  createOmniverseState, 
  calculateOmniverseHealth,
  processOmniverseEvent,
  type OmniverseState,
  type OmniverseEvent,
  MERGED_REPOSITORIES
} from '@/lib/omniverse';
import { useAuth } from './useAuth';

export interface UseOmniverseReturn {
  state: OmniverseState;
  health: number;
  isReady: boolean;
  repositories: typeof MERGED_REPOSITORIES;
  
  // Actions
  dispatchEvent: (event: OmniverseEvent) => void;
  updateMetrics: (updates: Partial<OmniverseState['metrics']>) => void;
  setFederationActive: (active: boolean) => void;
  
  // Computed
  isHealthy: boolean;
  activeFeatures: string[];
}

export const useOmniverse = (): UseOmniverseReturn => {
  const { user } = useAuth();
  const [state, setState] = useState<OmniverseState>(() => 
    createOmniverseState(user?.id)
  );
  const [isReady, setIsReady] = useState(false);

  // Initialize omniverse on mount
  useEffect(() => {
    const init = async () => {
      console.log('🌌 TAMV Omniverse initializing...');
      
      // Simulate initialization delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (user?.id) {
        setState(prev => ({
          ...prev,
          currentUserId: user.id,
          isabella: prev.isabella || createIsabellaContext(user.id),
        }));
      }
      
      setIsReady(true);
      console.log('✅ TAMV Omniverse ready');
    };

    init();
  }, [user?.id]);

  // Calculate health
  const health = useMemo(() => 
    calculateOmniverseHealth(state), [state]
  );

  // Dispatch omniverse events
  const dispatchEvent = useCallback((event: OmniverseEvent) => {
    setState(prev => processOmniverseEvent(prev, event));
  }, []);

  // Update metrics
  const updateMetrics = useCallback((updates: Partial<OmniverseState['metrics']>) => {
    setState(prev => ({
      ...prev,
      metrics: { ...prev.metrics, ...updates },
    }));
  }, []);

  // Toggle federation
  const setFederationActive = useCallback((active: boolean) => {
    setState(prev => ({
      ...prev,
      federationActive: active,
    }));
  }, []);

  // Computed values
  const isHealthy = health >= 80;
  
  const activeFeatures = useMemo(() => {
    return Object.values(MERGED_REPOSITORIES)
      .flatMap(repo => repo.features)
      .filter((feature, index, arr) => arr.indexOf(feature) === index);
  }, []);

  return {
    state,
    health,
    isReady,
    repositories: MERGED_REPOSITORIES,
    dispatchEvent,
    updateMetrics,
    setFederationActive,
    isHealthy,
    activeFeatures,
  };
};

// Helper to import Isabella context creator
import { createIsabellaContext } from '@/lib/isabella-ai';
