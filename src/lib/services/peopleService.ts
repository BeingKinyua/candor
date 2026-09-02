import { campaignStore } from './store';
import { Person } from '@/src/types';

export const peopleService = {
  getPeople: async (): Promise<Person[]> => {
    return campaignStore.getPeople();
  },
  getPerson: async (id: string): Promise<Person | undefined> => {
    return campaignStore.getPerson(id);
  },
  createPerson: async (data: Omit<Person, 'id' | 'createdAt' | 'updatedAt' | 'metrics'>): Promise<Person> => {
    return campaignStore.createPerson(data);
  },
  updatePerson: async (id: string, updates: Partial<Person>): Promise<Person | null> => {
    return campaignStore.updatePerson(id, updates);
  },
  searchPeople: async (query: string): Promise<Person[]> => {
    const q = query.toLowerCase().trim();
    if (!q) return campaignStore.getPeople();
    return campaignStore.getPeople().filter((p) => 
      p.fullName.toLowerCase().includes(q) ||
      p.phone.includes(q) ||
      p.county.toLowerCase().includes(q) ||
      p.constituency.toLowerCase().includes(q) ||
      p.ward.toLowerCase().includes(q) ||
      p.tags.some(t => t.toLowerCase().includes(q))
    );
  }
};
