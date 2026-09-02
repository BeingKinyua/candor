import { campaignStore } from './store';
import { FieldSubmission } from '@/src/types';

export const fieldService = {
  getSubmissions: async (): Promise<FieldSubmission[]> => {
    return campaignStore.getSubmissions();
  },
  getSubmission: async (id: string): Promise<FieldSubmission | undefined> => {
    return campaignStore.getSubmission(id);
  },
  createSubmission: async (data: Omit<FieldSubmission, 'id' | 'capturedAt'>): Promise<FieldSubmission> => {
    return campaignStore.addSubmission(data);
  },
  verifySubmission: async (id: string, action: 'approved' | 'rejected', reason?: string): Promise<FieldSubmission | null> => {
    return campaignStore.verifySubmission(id, action, reason);
  },
  simulateAiExtraction: async (imageFile: File | string, formType: FieldSubmission['formType']) => {
    // Generates high-fidelity OCR telemetry
    await new Promise((res) => setTimeout(res, 900));
    return {
      batchNumber: `BATCH-MOB-${Date.now().toString().slice(-4)}`,
      formType,
      confidenceOverall: 0.94,
    };
  }
};
