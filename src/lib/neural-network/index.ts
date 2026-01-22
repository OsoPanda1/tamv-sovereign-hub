/**
 * NEURAL NETWORK - TAMV MD-X4™
 * Distributed Neural Network for AI Migration
 * Quantum-Inspired Node Architecture
 */

export type NodeType = 
  | 'processor'        // Computation nodes
  | 'storage'          // Data persistence
  | 'gateway'          // External connections
  | 'validator'        // Transaction validation
  | 'orchestrator'     // Task distribution
  | 'sentinel';        // Security monitoring

export type NodeStatus = 
  | 'online'
  | 'busy'
  | 'syncing'
  | 'maintenance'
  | 'offline'
  | 'compromised';

export interface NeuralNode {
  id: string;
  type: NodeType;
  status: NodeStatus;
  region: string;
  capacity: number; // 0-100
  load: number; // 0-100
  connections: string[]; // connected node IDs
  lastPing: Date;
  uptime: number; // seconds
  tasksProcessed: number;
  reputation: number;
}

export interface NetworkTopology {
  nodes: NeuralNode[];
  edges: NetworkEdge[];
  clusters: NetworkCluster[];
  globalLoad: number;
  totalCapacity: number;
  healthScore: number;
}

export interface NetworkEdge {
  fromNodeId: string;
  toNodeId: string;
  latency: number; // ms
  bandwidth: number; // Mbps
  encrypted: boolean;
}

export interface NetworkCluster {
  id: string;
  name: string;
  nodeIds: string[];
  primaryNodeId: string;
  region: string;
  specialization?: NodeType;
}

export interface AITask {
  id: string;
  type: AITaskType;
  priority: TaskPriority;
  status: TaskStatus;
  assignedNodeId?: string;
  payload: Record<string, unknown>;
  result?: Record<string, unknown>;
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  retries: number;
  maxRetries: number;
}

export type AITaskType = 
  | 'inference'
  | 'training'
  | 'embedding'
  | 'moderation'
  | 'generation'
  | 'analysis'
  | 'migration';

export type TaskPriority = 'low' | 'normal' | 'high' | 'critical';
export type TaskStatus = 'queued' | 'assigned' | 'running' | 'completed' | 'failed' | 'cancelled';

export interface AIMigration {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
  modelId: string;
  modelSize: number; // bytes
  progress: number; // 0-100
  status: 'pending' | 'transferring' | 'validating' | 'completed' | 'failed';
  startedAt: Date;
  estimatedCompletion?: Date;
  checkpointHash?: string;
}

/**
 * Node type capacities and roles
 */
export const NODE_TYPE_CONFIG: Record<NodeType, { 
  maxConnections: number; 
  baseCapacity: number;
  role: string;
}> = {
  processor: { maxConnections: 50, baseCapacity: 100, role: 'Computation' },
  storage: { maxConnections: 100, baseCapacity: 500, role: 'Data Storage' },
  gateway: { maxConnections: 200, baseCapacity: 75, role: 'External API' },
  validator: { maxConnections: 30, baseCapacity: 50, role: 'Validation' },
  orchestrator: { maxConnections: 150, baseCapacity: 80, role: 'Task Distribution' },
  sentinel: { maxConnections: 100, baseCapacity: 60, role: 'Security Monitor' },
};

/**
 * Create neural node
 */
export const createNeuralNode = (
  type: NodeType,
  region: string
): NeuralNode => ({
  id: `node_${type}_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
  type,
  status: 'online',
  region,
  capacity: NODE_TYPE_CONFIG[type].baseCapacity,
  load: 0,
  connections: [],
  lastPing: new Date(),
  uptime: 0,
  tasksProcessed: 0,
  reputation: 100,
});

/**
 * Calculate network health
 */
export const calculateNetworkHealth = (nodes: NeuralNode[]): number => {
  if (nodes.length === 0) return 0;
  
  const onlineNodes = nodes.filter(n => n.status === 'online' || n.status === 'busy');
  const avgLoad = nodes.reduce((sum, n) => sum + n.load, 0) / nodes.length;
  const avgReputation = nodes.reduce((sum, n) => sum + n.reputation, 0) / nodes.length;
  
  const availabilityScore = (onlineNodes.length / nodes.length) * 40;
  const loadScore = (1 - avgLoad / 100) * 30;
  const reputationScore = (avgReputation / 100) * 30;
  
  return Math.round(availabilityScore + loadScore + reputationScore);
};

/**
 * Find optimal node for task
 */
export const findOptimalNode = (
  nodes: NeuralNode[],
  taskType: AITaskType,
  priority: TaskPriority
): NeuralNode | null => {
  const preferredTypes: Record<AITaskType, NodeType[]> = {
    inference: ['processor', 'orchestrator'],
    training: ['processor'],
    embedding: ['processor', 'storage'],
    moderation: ['sentinel', 'processor'],
    generation: ['processor'],
    analysis: ['processor', 'validator'],
    migration: ['storage', 'orchestrator'],
  };
  
  const preferred = preferredTypes[taskType] || ['processor'];
  
  const candidates = nodes
    .filter(n => n.status === 'online' && n.load < 80)
    .filter(n => preferred.includes(n.type))
    .sort((a, b) => {
      // Priority affects load threshold
      const priorityMultiplier = priority === 'critical' ? 0.5 : 
                                   priority === 'high' ? 0.7 : 
                                   priority === 'normal' ? 0.85 : 1;
      
      const aScore = (100 - a.load) * a.reputation * priorityMultiplier;
      const bScore = (100 - b.load) * b.reputation * priorityMultiplier;
      
      return bScore - aScore;
    });
  
  return candidates[0] || null;
};

/**
 * Create AI task
 */
export const createAITask = (
  type: AITaskType,
  priority: TaskPriority,
  payload: Record<string, unknown>
): AITask => ({
  id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  type,
  priority,
  status: 'queued',
  payload,
  createdAt: new Date(),
  retries: 0,
  maxRetries: 3,
});

/**
 * Create initial network topology
 */
export const createNetworkTopology = (): NetworkTopology => {
  const nodes: NeuralNode[] = [
    { ...createNeuralNode('orchestrator', 'us-west'), id: 'orch-1', status: 'online', load: 35 },
    { ...createNeuralNode('processor', 'us-west'), id: 'proc-1', status: 'online', load: 65 },
    { ...createNeuralNode('processor', 'us-east'), id: 'proc-2', status: 'online', load: 42 },
    { ...createNeuralNode('processor', 'eu-west'), id: 'proc-3', status: 'busy', load: 88 },
    { ...createNeuralNode('storage', 'us-west'), id: 'stor-1', status: 'online', load: 28 },
    { ...createNeuralNode('gateway', 'global'), id: 'gate-1', status: 'online', load: 55 },
    { ...createNeuralNode('validator', 'us-west'), id: 'val-1', status: 'online', load: 20 },
    { ...createNeuralNode('sentinel', 'global'), id: 'sent-1', status: 'online', load: 15 },
  ];
  
  return {
    nodes,
    edges: [],
    clusters: [
      { id: 'cluster-1', name: 'Primary', nodeIds: ['orch-1', 'proc-1', 'stor-1'], primaryNodeId: 'orch-1', region: 'us-west' },
    ],
    globalLoad: nodes.reduce((sum, n) => sum + n.load, 0) / nodes.length,
    totalCapacity: nodes.reduce((sum, n) => sum + n.capacity, 0),
    healthScore: calculateNetworkHealth(nodes),
  };
};

/**
 * Simulate node ping
 */
export const pingNode = (node: NeuralNode): NeuralNode => ({
  ...node,
  lastPing: new Date(),
  uptime: node.uptime + 1,
});
