import { campaignStore } from './store';
import { Issue } from '@/src/types';

export const issuesService = {
  getIssues: async (): Promise<Issue[]> => {
    return campaignStore.getIssues();
  },
  getIssue: async (id: string): Promise<Issue | undefined> => {
    return campaignStore.getIssue(id);
  },
  createIssue: async (data: Omit<Issue, 'id' | 'createdAt' | 'updatedAt' | 'timeline'>): Promise<Issue> => {
    return campaignStore.createIssue(data);
  },
  updateIssue: async (id: string, updates: Partial<Issue>, logComment?: string): Promise<Issue | null> => {
    return campaignStore.updateIssue(id, updates, logComment);
  },
};
