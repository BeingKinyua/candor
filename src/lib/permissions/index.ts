import { Permission, Role, User } from '@/src/types';

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  'Admin': [
    'people:view', 'people:create', 'people:edit', 'people:delete',
    'field:view', 'field:capture', 'field:verify',
    'meetings:view', 'meetings:create', 'meetings:edit',
    'commitments:view', 'commitments:manage', 'commitments:edit', 'commitments:audit',
    'knowledge:view', 'knowledge:manage', 'knowledge:edit',
    'issues:view', 'issues:manage', 'issues:edit',
    'ai:access', 'ai:execute_actions',
    'team:manage', 'users:manage', 'roles:manage', 'security:audit',
  ],
  'Campaign Director': [
    'people:view', 'people:create', 'people:edit',
    'field:view', 'field:capture', 'field:verify',
    'meetings:view', 'meetings:create', 'meetings:edit',
    'commitments:view', 'commitments:manage', 'commitments:edit', 'commitments:audit',
    'knowledge:view', 'knowledge:manage', 'knowledge:edit',
    'issues:view', 'issues:manage', 'issues:edit',
    'ai:access', 'ai:execute_actions',
    'team:manage', 'users:manage', 'security:audit',
  ],
  'Operations Lead': [
    'people:view', 'people:create', 'people:edit',
    'field:view', 'field:capture', 'field:verify',
    'meetings:view', 'meetings:create', 'meetings:edit',
    'commitments:view', 'commitments:manage', 'commitments:edit',
    'knowledge:view',
    'issues:view', 'issues:manage', 'issues:edit',
    'ai:access', 'ai:execute_actions',
  ],
  'Intelligence Analyst': [
    'people:view', 'people:edit',
    'field:view', 'field:verify',
    'meetings:view',
    'commitments:view', 'commitments:manage', 'commitments:edit',
    'knowledge:view', 'knowledge:manage', 'knowledge:edit',
    'issues:view', 'issues:manage', 'issues:edit',
    'ai:access', 'ai:execute_actions',
    'security:audit',
  ],
  'Field Mobilizer': [
    'people:view', 'people:create',
    'field:view', 'field:capture',
    'meetings:view',
    'commitments:view',
    'knowledge:view',
    'issues:view',
    'ai:access',
  ],
};

/**
 * Checks whether a given user possesses the specified permission.
 * Note: Client-side checks control UI visibility and interaction states only;
 * backend authorization rules and RLS enforce hard security boundaries.
 */
export function can(user: User | null | undefined, permission: Permission): boolean {
  if (!user) return false;
  if (user.status !== 'active') return false;
  const permissions = ROLE_PERMISSIONS[user.role] || [];
  return permissions.includes(permission);
}

export function hasAnyPermission(user: User | null | undefined, permissions: Permission[]): boolean {
  if (!user) return false;
  return permissions.some(p => can(user, p));
}

export function hasAllPermissions(user: User | null | undefined, permissions: Permission[]): boolean {
  if (!user) return false;
  return permissions.every(p => can(user, p));
}
