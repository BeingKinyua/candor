/**
 * @file permissions.ts
 * @description Permission checking helpers, normalizers, and evaluation logic.
 *
 * Provides backwards compatibility for legacy colon notations (`people:view`, `field:verify`)
 * while standardizing on canonical resource.action keys (`people.read`, `field.review`).
 */

import { PermissionKey, MOCK_PERMISSIONS } from '@/src/data/mock/permissions';
import { MOCK_ROLES, RoleId } from '@/src/data/mock/roles';
import { AuthUser, Session } from './auth-types';

/**
 * Mapping legacy colon-notations from early views to canonical permission keys.
 */
export const LEGACY_PERMISSION_MAP: Record<string, PermissionKey> = {
  // People
  'people:view': 'people.read',
  'people:create': 'people.create',
  'people:edit': 'people.update',
  'people:delete': 'people.archive',

  // Meetings
  'meetings:view': 'meetings.read',
  'meetings:create': 'meetings.create',
  'meetings:edit': 'meetings.update',

  // Commitments
  'commitments:view': 'commitments.read',
  'commitments:manage': 'commitments.create',
  'commitments:edit': 'commitments.update',
  'commitments:audit': 'audit.read',

  // Field
  'field:view': 'field.submissions.read',
  'field:capture': 'field.capture',
  'field:verify': 'field.review',

  // Knowledge
  'knowledge:view': 'knowledge.read',
  'knowledge:manage': 'knowledge.upload',
  'knowledge:edit': 'knowledge.upload',

  // Issues
  'issues:view': 'issues.read',
  'issues:manage': 'issues.manage',
  'issues:edit': 'issues.manage',

  // Team & Governance
  'team:manage': 'team.manage',
  'users:manage': 'team.manage',
  'roles:manage': 'team.manage',
  'security:audit': 'audit.read',

  // AI
  'ai:access': 'ai.access',
  'ai:execute_actions': 'ai.execute',
};

/**
 * Normalizes any permission string (whether dot notation or colon notation)
 * into a canonical PermissionKey.
 */
export function normalizePermission(perm: string): PermissionKey {
  if (LEGACY_PERMISSION_MAP[perm]) {
    return LEGACY_PERMISSION_MAP[perm];
  }
  return perm as PermissionKey;
}

/**
 * Resolves permissions for a user or session or role ID.
 */
export function resolvePermissions(
  subject?: AuthUser | Session | { roleId?: string; role?: string; permissions?: string[] } | null
): PermissionKey[] {
  if (!subject) return [];

  // If explicit permissions array is present, normalize and return
  if ('permissions' in subject && Array.isArray(subject.permissions) && subject.permissions.length > 0) {
    return (subject.permissions as string[]).map(normalizePermission);
  }

  // If roleId is present
  const roleId = subject.roleId as RoleId;
  if (roleId && MOCK_ROLES[roleId]) {
    return MOCK_ROLES[roleId].permissions;
  }

  // Handle legacy role names
  if (subject.role) {
    const roleName = (typeof subject.role === 'string' ? subject.role : subject.role.name || '').toLowerCase();
    if (roleName.includes('admin')) return MOCK_ROLES.administrator.permissions;
    if (roleName.includes('director') || roleName.includes('lead') || roleName.includes('manager'))
      return MOCK_ROLES.operations_manager.permissions;
    if (roleName.includes('mobilizer') || roleName.includes('field'))
      return MOCK_ROLES.field_officer.permissions;
    if (roleName.includes('analyst') || roleName.includes('reviewer'))
      return MOCK_ROLES.reviewer.permissions;
    if (roleName.includes('viewer') || roleName.includes('observer'))
      return MOCK_ROLES.viewer.permissions;
  }

  return [];
}

/**
 * Checks if a subject has a specific permission.
 */
export function hasPermission(
  subject: AuthUser | Session | PermissionKey[] | null | undefined,
  permission: PermissionKey | string
): boolean {
  if (!subject) return false;

  const targetKey = normalizePermission(permission);
  const permissions: PermissionKey[] = Array.isArray(subject)
    ? (subject as string[]).map(normalizePermission)
    : resolvePermissions(subject);

  return permissions.includes(targetKey);
}

/**
 * Checks if a subject has ANY of the given permissions.
 */
export function hasAnyPermission(
  subject: AuthUser | Session | PermissionKey[] | null | undefined,
  permissions: (PermissionKey | string)[]
): boolean {
  return permissions.some((p) => hasPermission(subject, p));
}

/**
 * Checks if a subject has ALL of the given permissions.
 */
export function hasAllPermissions(
  subject: AuthUser | Session | PermissionKey[] | null | undefined,
  permissions: (PermissionKey | string)[]
): boolean {
  return permissions.every((p) => hasPermission(subject, p));
}

/**
 * Convenience alias for `hasPermission` matching standard frontend authorization calls.
 */
export const can = hasPermission;

export { MOCK_PERMISSIONS };
