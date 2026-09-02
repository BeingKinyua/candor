/**
 * @file users.ts
 * @description Mock user directory providing pre-configured accounts representing every RBAC tier and account state.
 */

import { RoleId } from './roles';

export type UserAccountStatus = 'active' | 'inactive' | 'suspended' | 'pending_invite';

export interface MockUserRecord {
  id: string;
  name: string;
  email: string;
  roleId: RoleId;
  organizationId: string;
  status: UserAccountStatus;
  avatar?: string;
  assignedRegion?: string;
  badge?: string;
  lastLoginAt?: string;
  defaultPassword?: string;
  suspensionReason?: string;
  invitationToken?: string;
}

export const MOCK_ORGANIZATION = {
  id: 'org-candor-ke',
  name: 'Candor Kenya National Campaign HQ',
  slug: 'candor-ke',
  badge: 'National Operations Center',
  tier: 'Enterprise Command',
};

export const MOCK_USERS: MockUserRecord[] = [
  // 1. Administrator
  {
    id: 'usr-admin-001',
    name: 'Victor Kinyua',
    email: 'admin@example.com',
    roleId: 'administrator',
    organizationId: 'org-candor-ke',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    assignedRegion: 'National HQ - Nairobi Command',
    badge: 'HQ Chief of Staff',
    lastLoginAt: '2026-09-02T14:15:00Z',
    defaultPassword: 'password123',
  },

  // 2. Operations Manager
  {
    id: 'usr-mgr-002',
    name: 'Wanjiku Mwangi',
    email: 'manager@example.com',
    roleId: 'operations_manager',
    organizationId: 'org-candor-ke',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    assignedRegion: 'Central Rift & Eastern Corridors',
    badge: 'Operations Lead',
    lastLoginAt: '2026-09-02T12:30:00Z',
    defaultPassword: 'password123',
  },

  // 3. Field Officer
  {
    id: 'usr-fld-003',
    name: 'Juma Kiprop',
    email: 'field@example.com',
    roleId: 'field_officer',
    organizationId: 'org-candor-ke',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    assignedRegion: 'Nakuru County & South Rift',
    badge: 'Field Mobilizer',
    lastLoginAt: '2026-09-02T09:40:00Z',
    defaultPassword: 'password123',
  },

  // 4. Reviewer
  {
    id: 'usr-rev-004',
    name: 'Amina Hassan',
    email: 'reviewer@example.com',
    roleId: 'reviewer',
    organizationId: 'org-candor-ke',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    assignedRegion: 'Mombasa / Coast Verification Desk',
    badge: 'Verification Analyst',
    lastLoginAt: '2026-09-02T11:05:00Z',
    defaultPassword: 'password123',
  },

  // 5. Read-only / Viewer
  {
    id: 'usr-view-005',
    name: 'David Ochieng',
    email: 'viewer@example.com',
    roleId: 'viewer',
    organizationId: 'org-candor-ke',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    assignedRegion: 'National Advisory Board',
    badge: 'Senior Advisor / Observer',
    lastLoginAt: '2026-09-01T16:00:00Z',
    defaultPassword: 'password123',
  },

  // 6. Inactive Account
  {
    id: 'usr-inact-006',
    name: 'Titus Munene',
    email: 'inactive@example.com',
    roleId: 'field_officer',
    organizationId: 'org-candor-ke',
    status: 'inactive',
    assignedRegion: 'Kiambu Grassroots Team',
    badge: 'Volunteer Liaison',
    lastLoginAt: '2026-07-15T10:00:00Z',
    defaultPassword: 'password123',
  },

  // 7. Suspended Account
  {
    id: 'usr-susp-007',
    name: 'Grace Muthoni',
    email: 'suspended@example.com',
    roleId: 'field_officer',
    organizationId: 'org-candor-ke',
    status: 'suspended',
    suspensionReason: 'Access revoked following security review on voter telemetry credential leak.',
    assignedRegion: 'Nairobi Eastlands Sub-County',
    badge: 'Field Agent',
    lastLoginAt: '2026-08-20T08:15:00Z',
    defaultPassword: 'password123',
  },

  // 8. Pending Invitation Account
  {
    id: 'usr-pend-008',
    name: 'Hellen Chebet',
    email: 'pending@example.com',
    roleId: 'viewer',
    organizationId: 'org-candor-ke',
    status: 'pending_invite',
    invitationToken: 'invite-candor-2026-chebet',
    assignedRegion: 'Eldoret Regional Command',
    badge: 'Observer Designate',
    defaultPassword: 'password123',
  },
];
