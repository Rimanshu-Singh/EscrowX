export type EscrowStatus = 
  | 'created' 
  | 'funded' 
  | 'delivered' 
  | 'approved' 
  | 'disputed' 
  | 'refunded' 
  | 'complete';

export type MilestoneType = 'single' | 'milestone';

export type DisputeStatus = 'under_review' | 'escalated' | 'resolved';

export interface Escrow {
  id: string;
  contractId: string;
  title: string;
  description: string;
  buyerAddress: string;
  sellerAddress: string;
  amount: number;
  status: EscrowStatus;
  deadline: string;
  createdAt: string;
  milestoneType: MilestoneType;
  deliveryHash?: string;
  ipfsHash?: string;
  githubLink?: string;
  txHistory: Transaction[];
}

export interface Transaction {
  id: string;
  type: 'created' | 'funded' | 'delivered' | 'approved' | 'disputed' | 'refunded';
  amount?: number;
  txHash: string;
  timestamp: string;
  from?: string;
  to?: string;
  note?: string;
}

export interface Dispute {
  id: string;
  escrowId: string;
  escrowTitle: string;
  amount: number;
  filedBy: string;
  filedByRole: 'buyer' | 'seller';
  respondent: string;
  status: DisputeStatus;
  createdAt: string;
  evidence: Evidence[];
  arbiterNotes?: string;
  resolution?: string;
  resolvedAt?: string;
}

export interface Evidence {
  id: string;
  type: 'text' | 'file' | 'link';
  content: string;
  submittedBy: string;
  submittedAt: string;
}

export interface ActivityItem {
  id: string;
  type: 'funded' | 'delivered' | 'approved' | 'disputed' | 'refunded' | 'created';
  escrowId: string;
  escrowTitle: string;
  amount?: number;
  timestamp: string;
  actor?: string;
}

export interface AnalyticsData {
  volumeOverTime: { date: string; volume: number; count: number }[];
  outcomeBreakdown: { name: string; value: number; color: string }[];
  categoryBreakdown: { name: string; value: number; color: string }[];
  topSellers: TopSeller[];
  kpis: {
    totalVolume: number;
    successRate: number;
    avgCompletionDays: number;
    activeUsers: number;
  };
}

export interface TopSeller {
  address: string;
  completedEscrows: number;
  totalVolume: number;
  successRate: number;
}

export type OnChainEscrowStatus =
  | 'PENDING'
  | 'FUNDED'
  | 'IN_PROGRESS'
  | 'DELIVERED'
  | 'REVISION_REQUESTED'
  | 'APPROVED'
  | 'DISPUTED'
  | 'REFUNDED'
  | 'COMPLETED';

export interface EscrowTransaction {
  escrowId: string;
  txHash: string;
  timestamp: string;
  action: 'CREATE' | 'FUND' | 'DELIVER' | 'APPROVE' | 'REFUND' | 'DISPUTE' | 'RESOLVE';
  walletAddress: string;
  status: string;
}

export interface ContractResponse<T = any> {
  success: boolean;
  txHash?: string;
  error?: string;
  data?: T;
}

export interface DisputeResolution {
  escrowId: string;
  winner: 'CLIENT' | 'FREELANCER';
  resolvedAt: string;
  adminAddress: string;
}

export type EscrowStateMachine = {
  [key in OnChainEscrowStatus]: OnChainEscrowStatus[];
};

export const ESCROW_STATE_TRANSITIONS: EscrowStateMachine = {
  PENDING: ['FUNDED'],
  FUNDED: ['IN_PROGRESS', 'DISPUTED', 'REFUNDED'],
  IN_PROGRESS: ['DELIVERED', 'REVISION_REQUESTED', 'DISPUTED', 'REFUNDED'],
  DELIVERED: ['COMPLETED', 'REVISION_REQUESTED', 'DISPUTED'],
  REVISION_REQUESTED: ['DELIVERED', 'DISPUTED', 'REFUNDED'],
  APPROVED: [],
  DISPUTED: ['COMPLETED', 'REFUNDED'],
  REFUNDED: [],
  COMPLETED: [],
};
