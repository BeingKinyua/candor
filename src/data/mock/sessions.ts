/**
 * @file sessions.ts
 * @description Utilities and factories for generating frontend mock sessions.
 */

import { MockUserRecord, MOCK_ORGANIZATION } from './users';
import { MOCK_ROLES, RoleDefinition } from './roles';
import { PermissionKey } from './permissions';

export interface MockSession {
  id: string;
  userId: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    roleId: string;
    role: string;
    organizationId: string;
    status: string;
    assignedRegion?: string;
    badge?: string;
    lastLoginAt?: string;
  };
  organizationId: string;
  organization: {
    id: string;
    name: string;
    slug: string;
    badge?: string;
    tier?: string;
  };
  roleId: string;
  role: RoleDefinition;
  permissions: PermissionKey[];
  createdAt: string;
  expiresAt: string;
  status: 'active' | 'expired' | 'revoked';
}

export function createMockSessionForUser(user: MockUserRecord): MockSession {
  const roleDef = MOCK_ROLES[user.roleId] || MOCK_ROLES.viewer;
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24h simulated expiry

  return {
    id: `sess-${Math.random().toString(36).substring(2, 9)}-${Date.now()}`,
    userId: user.id,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      roleId: user.roleId,
      role: roleDef.name,
      organizationId: user.organizationId,
      status: user.status,
      assignedRegion: user.assignedRegion,
      badge: user.badge,
      lastLoginAt: now.toISOString(),
    },
    organizationId: MOCK_ORGANIZATION.id,
    organization: MOCK_ORGANIZATION,
    roleId: roleDef.id,
    role: roleDef,
    permissions: [...roleDef.permissions],
    createdAt: now.toISOString(),
    expiresAt: expiresAt.toISOString(),
    status: 'active',
  };
}
