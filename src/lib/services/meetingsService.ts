import { campaignStore } from './store';
import { Meeting } from '@/src/types';

export const meetingsService = {
  getMeetings: async (): Promise<Meeting[]> => {
    return campaignStore.getMeetings();
  },
  getMeeting: async (id: string): Promise<Meeting | undefined> => {
    return campaignStore.getMeeting(id);
  },
  createMeeting: async (data: Omit<Meeting, 'id' | 'decisions' | 'commitmentsGenerated' | 'issuesGenerated'>): Promise<Meeting> => {
    return campaignStore.createMeeting(data);
  },
  updateMeeting: async (id: string, updates: Partial<Meeting>): Promise<Meeting | null> => {
    return campaignStore.updateMeeting(id, updates);
  },
};
