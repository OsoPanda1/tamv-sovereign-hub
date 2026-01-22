/**
 * KAOS AUDIO 3D - TAMV MD-X4™
 * Proprietary Spatial Audio Engine
 * Binaural and ritualized sound environments
 */

export type AudioPreset = 
  | 'ambient_dreamscape'
  | 'ceremonial_ritual'
  | 'quantum_meditation'
  | 'cyber_imperial'
  | 'void_exploration'
  | 'concert_4d'
  | 'silent_sovereignty';

export interface SpatialAudioConfig {
  binauralEnabled: boolean;
  hrtfProfile: 'default' | 'custom';
  reverbLevel: number; // 0-100
  spatializationQuality: 'low' | 'medium' | 'high' | 'ultra';
  frequencyRange: [number, number]; // Hz range
}

export interface AudioNode3D {
  id: string;
  position: { x: number; y: number; z: number };
  source: string;
  volume: number;
  loop: boolean;
  spatialBlend: number; // 0 = 2D, 1 = 3D
}

export interface KaosState {
  preset: AudioPreset;
  config: SpatialAudioConfig;
  activeNodes: AudioNode3D[];
  masterVolume: number;
  muted: boolean;
}

/**
 * Preset configurations for different environments
 */
export const AUDIO_PRESETS: Record<AudioPreset, Partial<SpatialAudioConfig>> = {
  ambient_dreamscape: {
    binauralEnabled: true,
    reverbLevel: 70,
    spatializationQuality: 'high',
    frequencyRange: [20, 8000],
  },
  ceremonial_ritual: {
    binauralEnabled: true,
    reverbLevel: 85,
    spatializationQuality: 'ultra',
    frequencyRange: [40, 12000],
  },
  quantum_meditation: {
    binauralEnabled: true,
    reverbLevel: 60,
    spatializationQuality: 'high',
    frequencyRange: [1, 6000],
  },
  cyber_imperial: {
    binauralEnabled: false,
    reverbLevel: 40,
    spatializationQuality: 'medium',
    frequencyRange: [80, 16000],
  },
  void_exploration: {
    binauralEnabled: true,
    reverbLevel: 95,
    spatializationQuality: 'ultra',
    frequencyRange: [10, 4000],
  },
  concert_4d: {
    binauralEnabled: true,
    reverbLevel: 50,
    spatializationQuality: 'ultra',
    frequencyRange: [20, 20000],
  },
  silent_sovereignty: {
    binauralEnabled: false,
    reverbLevel: 0,
    spatializationQuality: 'low',
    frequencyRange: [0, 0],
  },
};

/**
 * Create default KAOS state
 */
export const createKaosState = (): KaosState => ({
  preset: 'ambient_dreamscape',
  config: {
    binauralEnabled: true,
    hrtfProfile: 'default',
    reverbLevel: 50,
    spatializationQuality: 'high',
    frequencyRange: [20, 20000],
  },
  activeNodes: [],
  masterVolume: 0.8,
  muted: false,
});

/**
 * Binaural beat frequencies for different states
 */
export const BINAURAL_FREQUENCIES = {
  delta: { carrier: 100, beat: 2 },      // Deep sleep, healing
  theta: { carrier: 200, beat: 6 },      // Meditation, creativity
  alpha: { carrier: 300, beat: 10 },     // Relaxation, learning
  beta: { carrier: 400, beat: 20 },      // Focus, alertness
  gamma: { carrier: 500, beat: 40 },     // Higher cognition
} as const;

/**
 * Apply preset to current config
 */
export const applyPreset = (state: KaosState, preset: AudioPreset): KaosState => ({
  ...state,
  preset,
  config: {
    ...state.config,
    ...AUDIO_PRESETS[preset],
  },
});

/**
 * Add 3D audio node
 */
export const addAudioNode = (
  state: KaosState, 
  node: Omit<AudioNode3D, 'id'>
): KaosState => ({
  ...state,
  activeNodes: [
    ...state.activeNodes,
    { ...node, id: `node_${Date.now()}` },
  ],
});

/**
 * Calculate 3D panning based on position
 */
export const calculate3DPanning = (
  listenerPosition: { x: number; y: number; z: number },
  sourcePosition: { x: number; y: number; z: number }
): { pan: number; volume: number } => {
  const dx = sourcePosition.x - listenerPosition.x;
  const dy = sourcePosition.y - listenerPosition.y;
  const dz = sourcePosition.z - listenerPosition.z;
  
  const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
  const pan = Math.max(-1, Math.min(1, dx / 10));
  const volume = Math.max(0, 1 - distance / 100);
  
  return { pan, volume };
};
