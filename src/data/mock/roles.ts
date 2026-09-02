/**
 * @file roles.ts
 * @description Canonical roles mapping to specific permissions according to the campaign authorization matrix.
 */

import { PermissionKey } from './permissions';

export type RoleId =
  | 'administrator'
  | 'operations_manager'
  | 'field_officer'
  | 'reviewer'
  | 'viewer';

export interface RoleDefinition {
  id: RoleId;
  name: string;
  description: string;
  permissions: PermissionKey[];
  isSystemRole?: boolean;
}

export const MOCK_ROLES: Record<RoleId, RoleDefinition> = {
  administrator: {
    id: 'administrator',
    name: 'Administrator',
    description: 'Full workspace command authority across all data domains, user governance, and security audits.',
    isSystemRole: true,
    permissions: [
      // People
      'people.read',
      'people.create',
      'people.update',
      'people.archive',
      // Meetings
      'meetings.read',
      'meetings.create',
      'meetings.update',
      // Commitments
      'commitments.read',
      'commitments.create',
      'commitments.update',
      // Field
      'field.capture',
      'field.submissions.read',
      'field.review',
      // Knowledge
      'knowledge.read',
      'knowledge.upload',
      // Issues
      'issues.read',
      'issues.manage',
      // Governance
      'team.read',
      'team.invite',
      'team.manage',
      // Audit
      'audit.read',
      // AI
      'ai.access',
      'ai.execute',
    ],
  },

  operations_manager: {
    id: 'operations_manager',
    name: 'Campaign Operations Manager',
    description: 'Directs day-to-day campaign activities, tracks pledges, reviews field queues, and manages issues.',
    permissions: [
      // People
      'people.read',
      'people.create',
      'people.update',
      // Meetings
      'meetings.read',
      'meetings.create',
      'meetings.update',
      // Commitments
      'commitments.read',
      'commitments.create',
      'commitments.update',
      // Field
      'field.submissions.read',
      'field.review',
      // Knowledge
      'knowledge.read',
      'knowledge.upload',
      // Issues
      'issues.read',
      'issues.manage',
      // AI
      'ai.access',
      'ai.execute',
    ],
  },

  field_officer: {
    id: 'field_officer',
    name: 'Field Officer',
    description: 'Grassroots mobilizer capturing voter pledges, OCR form batches, and local contact sign-ups.',
    permissions: [
      'people.read',
      'field.capture',
      'field.submissions.read',
      'ai.access',
    ],
  },

  reviewer: {
    id: 'reviewer',
    name: 'Field Verification Reviewer',
    description: 'Audits OCR voter forms, validates citizen pledges against identity records, and approves submissions.',
    permissions: [
      'people.read',
      'field.submissions.read',
      'field.review',
      'knowledge.read',
      'ai.access',
    ],
  },

  viewer: {
    id: 'viewer',
    name: 'Campaign Observer / Viewer',
    description: 'Read-only access to campaign progress, policy papers, and operational tracking dashboards.',
    permissions: [
      'people.read',
      'meetings.read',
      'commitments.read',
      'knowledge.read',
      'issues.read',
    ],
  },
};

export const MOCK_ROLES_LIST: RoleDefinition[] = Object.values(MOCK_ROLES);
