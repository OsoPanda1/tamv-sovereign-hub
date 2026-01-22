/**
 * DAO GOVERNANCE - TAMV MD-X4™
 * Hybrid Decentralized Autonomous Organization
 * Democratic voting with quantum-weighted consensus
 */

export type ProposalType = 
  | 'treasury'           // Fund allocation
  | 'policy'             // Rule changes
  | 'election'           // Role elections
  | 'integration'        // New system integration
  | 'emergency'          // Critical actions
  | 'community';         // Community initiatives

export type ProposalStatus = 
  | 'draft'
  | 'discussion'
  | 'voting'
  | 'passed'
  | 'rejected'
  | 'executed'
  | 'cancelled';

export type VoteChoice = 'yes' | 'no' | 'abstain';

export interface Proposal {
  id: string;
  title: string;
  description: string;
  fullText: string;
  type: ProposalType;
  status: ProposalStatus;
  creatorId: string;
  creatorName: string;
  createdAt: Date;
  discussionEndAt: Date;
  votingStartAt: Date;
  votingEndAt: Date;
  executionDelay: number; // hours
  quorumRequired: number; // percentage
  passingThreshold: number; // percentage
  votes: Vote[];
  voteStats: VoteStats;
  tags: string[];
  attachments: string[];
}

export interface Vote {
  id: string;
  proposalId: string;
  voterId: string;
  voterName: string;
  choice: VoteChoice;
  votingPower: number;
  reason?: string;
  timestamp: Date;
  signature?: string;
}

export interface VoteStats {
  totalVotes: number;
  totalVotingPower: number;
  yesVotes: number;
  yesPower: number;
  noVotes: number;
  noPower: number;
  abstainVotes: number;
  abstainPower: number;
  quorumReached: boolean;
  currentPercentage: number;
}

export interface DAOMember {
  userId: string;
  username: string;
  displayName: string;
  votingPower: number;
  reputation: number;
  role: DAORole;
  delegations: Delegation[];
  proposalsCreated: number;
  votesCount: number;
  joinedAt: Date;
}

export type DAORole = 
  | 'citizen'
  | 'delegate'
  | 'councilor'
  | 'guardian'
  | 'sovereign';

export interface Delegation {
  fromUserId: string;
  toUserId: string;
  power: number;
  activeUntil?: Date;
  categories?: ProposalType[];
}

export interface DAOConfig {
  name: string;
  description: string;
  treasury: number;
  memberCount: number;
  totalVotingPower: number;
  defaultQuorum: number;
  defaultThreshold: number;
  discussionPeriodHours: number;
  votingPeriodHours: number;
  executionDelayHours: number;
  proposalCost: number;
}

/**
 * Default DAO configuration
 */
export const DEFAULT_DAO_CONFIG: DAOConfig = {
  name: 'TAMV Sovereign DAO',
  description: 'Gobernanza descentralizada del ecosistema TAMV',
  treasury: 0,
  memberCount: 0,
  totalVotingPower: 0,
  defaultQuorum: 10, // 10%
  defaultThreshold: 60, // 60%
  discussionPeriodHours: 72,
  votingPeriodHours: 168, // 1 week
  executionDelayHours: 48,
  proposalCost: 100, // MSR
};

/**
 * Role voting power multipliers
 */
export const ROLE_POWER_MULTIPLIER: Record<DAORole, number> = {
  citizen: 1,
  delegate: 1.5,
  councilor: 2,
  guardian: 3,
  sovereign: 5,
};

/**
 * Calculate voting power for a user
 */
export const calculateVotingPower = (
  baseStake: number,
  reputation: number,
  role: DAORole,
  delegatedPower: number = 0
): number => {
  const multiplier = ROLE_POWER_MULTIPLIER[role];
  const reputationBonus = Math.sqrt(reputation) / 10;
  const basePower = (baseStake + delegatedPower) * multiplier;
  return Math.floor(basePower * (1 + reputationBonus));
};

/**
 * Check if quorum is reached
 */
export const isQuorumReached = (
  totalVotingPower: number,
  castedPower: number,
  quorumRequired: number
): boolean => {
  if (totalVotingPower === 0) return false;
  const percentage = (castedPower / totalVotingPower) * 100;
  return percentage >= quorumRequired;
};

/**
 * Check if proposal passed
 */
export const hasProposalPassed = (stats: VoteStats, threshold: number): boolean => {
  if (!stats.quorumReached) return false;
  const totalDeciding = stats.yesPower + stats.noPower;
  if (totalDeciding === 0) return false;
  return (stats.yesPower / totalDeciding) * 100 >= threshold;
};

/**
 * Create vote stats from votes array
 */
export const calculateVoteStats = (
  votes: Vote[],
  totalVotingPower: number,
  quorumRequired: number
): VoteStats => {
  const stats: VoteStats = {
    totalVotes: votes.length,
    totalVotingPower: 0,
    yesVotes: 0,
    yesPower: 0,
    noVotes: 0,
    noPower: 0,
    abstainVotes: 0,
    abstainPower: 0,
    quorumReached: false,
    currentPercentage: 0,
  };

  for (const vote of votes) {
    stats.totalVotingPower += vote.votingPower;
    
    switch (vote.choice) {
      case 'yes':
        stats.yesVotes++;
        stats.yesPower += vote.votingPower;
        break;
      case 'no':
        stats.noVotes++;
        stats.noPower += vote.votingPower;
        break;
      case 'abstain':
        stats.abstainVotes++;
        stats.abstainPower += vote.votingPower;
        break;
    }
  }

  stats.quorumReached = isQuorumReached(
    totalVotingPower,
    stats.totalVotingPower,
    quorumRequired
  );
  
  const decidingPower = stats.yesPower + stats.noPower;
  stats.currentPercentage = decidingPower > 0 
    ? (stats.yesPower / decidingPower) * 100 
    : 0;

  return stats;
};

/**
 * Create new proposal
 */
export const createProposal = (
  title: string,
  description: string,
  type: ProposalType,
  creatorId: string,
  creatorName: string,
  config: DAOConfig = DEFAULT_DAO_CONFIG
): Proposal => {
  const now = new Date();
  const discussionEnd = new Date(now.getTime() + config.discussionPeriodHours * 60 * 60 * 1000);
  const votingStart = discussionEnd;
  const votingEnd = new Date(votingStart.getTime() + config.votingPeriodHours * 60 * 60 * 1000);

  return {
    id: `prop_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    title,
    description,
    fullText: description,
    type,
    status: 'discussion',
    creatorId,
    creatorName,
    createdAt: now,
    discussionEndAt: discussionEnd,
    votingStartAt: votingStart,
    votingEndAt: votingEnd,
    executionDelay: config.executionDelayHours,
    quorumRequired: config.defaultQuorum,
    passingThreshold: config.defaultThreshold,
    votes: [],
    voteStats: {
      totalVotes: 0,
      totalVotingPower: 0,
      yesVotes: 0,
      yesPower: 0,
      noVotes: 0,
      noPower: 0,
      abstainVotes: 0,
      abstainPower: 0,
      quorumReached: false,
      currentPercentage: 0,
    },
    tags: [],
    attachments: [],
  };
};

/**
 * Cast vote on proposal
 */
export const castVote = (
  proposalId: string,
  voterId: string,
  voterName: string,
  choice: VoteChoice,
  votingPower: number,
  reason?: string
): Vote => ({
  id: `vote_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  proposalId,
  voterId,
  voterName,
  choice,
  votingPower,
  reason,
  timestamp: new Date(),
});
