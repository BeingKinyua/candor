import { campaignStore } from './store';
import { Commitment } from '@/src/types';

export const commitmentsService = {
  getCommitments: async (): Promise<Commitment[]> => {
    return campaignStore.getCommitments();
  },
  getCommitment: async (id: string): Promise<Commitment | undefined> => {
    return campaignStore.getCommitment(id);
  },
  createCommitment: async (data: Omit<Commitment, 'id' | 'auditTrail'>): Promise<Commitment> => {
    return campaignStore.createCommitment(data);
  },
  completeCommitment: async (id: string, proofNote?: string): Promise<Commitment | null> => {
    return campaignStore.completeCommitment(id, proofNote);
  },
};
