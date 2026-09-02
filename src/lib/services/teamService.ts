import { campaignStore } from './store';
import { User, AuditEvent } from '@/src/types';

export const teamService = {
  getMembers: async (): Promise<User[]> => {
    return campaignStore.getUsers();
  },
  inviteMember: async (data: Omit<User, 'id'>): Promise<User> => {
    return campaignStore.addUser(data);
  },
  updateMemberStatus: async (id: string, status: 'active' | 'suspended'): Promise<User | null> => {
    return campaignStore.updateUser(id, { status });
  },
  updateMemberRole: async (id: string, role: User['role']): Promise<User | null> => {
    return campaignStore.updateUser(id, { role });
  }
};

export const auditService = {
  getAuditLogs: async (): Promise<AuditEvent[]> => {
    return campaignStore.getAuditLogs();
  },
};
