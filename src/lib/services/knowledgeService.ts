import { campaignStore } from './store';
import { KnowledgeDocument } from '@/src/types';

export const knowledgeService = {
  getDocuments: async (): Promise<KnowledgeDocument[]> => {
    return campaignStore.getDocuments();
  },
  getDocument: async (id: string): Promise<KnowledgeDocument | undefined> => {
    return campaignStore.getDocument(id);
  },
  createDocument: async (data: Omit<KnowledgeDocument, 'id' | 'date' | 'status'>): Promise<KnowledgeDocument> => {
    return campaignStore.addDocument(data);
  },
};
