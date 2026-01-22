/**
 * MSR LEDGER - TAMV MD-X4™
 * Economic Justice System with 70/20/10 Distribution
 * Immutable blockchain-based ledger
 */

// Justice Distribution Constants
export const MSR_DISTRIBUTION = {
  CREATOR_SHARE: 0.70,      // 70% to Creator/Citizen
  RESILIENCE_SHARE: 0.20,   // 20% to Fénix Resilience Fund
  KERNEL_SHARE: 0.10,       // 10% to Infrastructure/Kernel
} as const;

export type TransactionType = 
  | 'tip'
  | 'purchase'
  | 'subscription'
  | 'lottery'
  | 'reward'
  | 'staking'
  | 'governance'
  | 'refund';

export type TransactionStatus = 
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'reversed';

export interface MSRTransaction {
  id: string;
  type: TransactionType;
  status: TransactionStatus;
  amount: number;
  fromUserId: string;
  toUserId: string;
  distribution: {
    creator: number;
    resilience: number;
    kernel: number;
  };
  description: string;
  referenceId?: string;
  blockHash?: string;
  timestamp: Date;
}

export interface WalletBalance {
  available: number;
  pending: number;
  staked: number;
  total: number;
}

export interface MSRLedgerState {
  transactions: MSRTransaction[];
  walletBalance: WalletBalance;
  lastBlockHash: string;
  totalDistributed: {
    toCreators: number;
    toResilience: number;
    toKernel: number;
  };
}

/**
 * Calculate 70/20/10 distribution
 */
export const calculateDistribution = (amount: number): MSRTransaction['distribution'] => ({
  creator: Math.floor(amount * MSR_DISTRIBUTION.CREATOR_SHARE * 100) / 100,
  resilience: Math.floor(amount * MSR_DISTRIBUTION.RESILIENCE_SHARE * 100) / 100,
  kernel: Math.floor(amount * MSR_DISTRIBUTION.KERNEL_SHARE * 100) / 100,
});

/**
 * Create new MSR transaction
 */
export const createTransaction = (
  type: TransactionType,
  amount: number,
  fromUserId: string,
  toUserId: string,
  description: string,
  referenceId?: string
): MSRTransaction => {
  const distribution = calculateDistribution(amount);
  
  return {
    id: `msr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type,
    status: 'pending',
    amount,
    fromUserId,
    toUserId,
    distribution,
    description,
    referenceId,
    timestamp: new Date(),
  };
};

/**
 * Generate pseudo block hash for transaction
 */
export const generateBlockHash = (transaction: MSRTransaction): string => {
  const data = `${transaction.id}:${transaction.amount}:${transaction.timestamp.getTime()}`;
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return `0x${Math.abs(hash).toString(16).padStart(16, '0')}`;
};

/**
 * Create initial ledger state
 */
export const createLedgerState = (): MSRLedgerState => ({
  transactions: [],
  walletBalance: {
    available: 0,
    pending: 0,
    staked: 0,
    total: 0,
  },
  lastBlockHash: '0x0000000000000000',
  totalDistributed: {
    toCreators: 0,
    toResilience: 0,
    toKernel: 0,
  },
});

/**
 * Process transaction and update ledger
 */
export const processTransaction = (
  state: MSRLedgerState,
  transaction: MSRTransaction
): MSRLedgerState => {
  const completedTransaction: MSRTransaction = {
    ...transaction,
    status: 'completed',
    blockHash: generateBlockHash(transaction),
  };

  return {
    ...state,
    transactions: [...state.transactions, completedTransaction],
    lastBlockHash: completedTransaction.blockHash!,
    totalDistributed: {
      toCreators: state.totalDistributed.toCreators + transaction.distribution.creator,
      toResilience: state.totalDistributed.toResilience + transaction.distribution.resilience,
      toKernel: state.totalDistributed.toKernel + transaction.distribution.kernel,
    },
  };
};

/**
 * Validate transaction before processing
 */
export const validateTransaction = (
  transaction: MSRTransaction,
  balance: WalletBalance
): { valid: boolean; error?: string } => {
  if (transaction.amount <= 0) {
    return { valid: false, error: 'Amount must be positive' };
  }
  
  if (transaction.amount > balance.available) {
    return { valid: false, error: 'Insufficient balance' };
  }
  
  if (transaction.fromUserId === transaction.toUserId) {
    return { valid: false, error: 'Cannot transfer to yourself' };
  }
  
  return { valid: true };
};

/**
 * Format MSR amount for display
 */
export const formatMSR = (amount: number): string => {
  return `${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MSR`;
};
