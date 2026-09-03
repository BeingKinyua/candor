import { User } from "@/src/types";

export const INITIAL_USERS: User[] = [
  {
    id: 'usr-1',
    name: 'Dr. Wanjiku Mwangi',
    email: 'wanjiku.mwangi@campaign.ops',
    role: 'Campaign Director',
    badge: 'HQ Director',
    assignedRegion: 'National HQ',
    status: 'active',
  },
  {
    id: 'usr-2',
    name: 'David Ochieng',
    email: 'david.ochieng@campaign.ops',
    role: 'Admin',
    badge: 'Lead Systems Architect',
    assignedRegion: 'Central Command',
    status: 'active',
  },
  {
    id: 'usr-3',
    name: 'Fatuma Hassan',
    email: 'fatuma.hassan@campaign.ops',
    role: 'Operations Lead',
    badge: 'Field Ops Central',
    assignedRegion: 'Nairobi & Coast Corridors',
    status: 'active',
  },
  {
    id: 'usr-4',
    name: 'Ezekiel Kiprop',
    email: 'ezekiel.kiprop@campaign.ops',
    role: 'Field Mobilizer',
    badge: 'Rift & Western Cell',
    assignedRegion: 'Nakuru County',
    status: 'active',
  },
  {
    id: 'usr-5',
    name: 'Grace Nyambura',
    email: 'grace.nyambura@campaign.ops',
    role: 'Intelligence Analyst',
    badge: 'Strategic Intel',
    assignedRegion: 'National HQ',
    status: 'active',
  },
];
