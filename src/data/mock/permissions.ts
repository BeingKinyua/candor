/**
 * @file permissions.ts
 * @description Canonical catalog of application permissions following resource.action convention.
 *
 * NOTE: Frontend permissions are for UX control and user flow protection only.
 * Hard security enforcement must be performed on the backend (e.g., Supabase RLS, API Gateway).
 */

export type PermissionKey =
  // People
  | 'people.read'
  | 'people.create'
  | 'people.update'
  | 'people.archive'
  // Meetings
  | 'meetings.read'
  | 'meetings.create'
  | 'meetings.update'
  // Commitments
  | 'commitments.read'
  | 'commitments.create'
  | 'commitments.update'
  // Field Operations
  | 'field.capture'
  | 'field.submissions.read'
  | 'field.review'
  // Knowledge Base
  | 'knowledge.read'
  | 'knowledge.upload'
  // Issues Desk
  | 'issues.read'
  | 'issues.manage'
  // Team Governance & Administration
  | 'team.read'
  | 'team.invite'
  | 'team.manage'
  // Security Audit
  | 'audit.read'
  // AI Copilot
  | 'ai.access'
  | 'ai.execute';

export interface PermissionDefinition {
  id: string;
  key: PermissionKey;
  resource: string;
  action: string;
  description: string;
  isSensitive?: boolean;
}

export const MOCK_PERMISSIONS: PermissionDefinition[] = [
  // People Directory
  {
    id: 'perm-people-read',
    key: 'people.read',
    resource: 'people',
    action: 'read',
    description: 'View contacts, community leaders, elders, and influencer profiles',
  },
  {
    id: 'perm-people-create',
    key: 'people.create',
    resource: 'people',
    action: 'create',
    description: 'Enroll new grassroots contacts and community leaders',
  },
  {
    id: 'perm-people-update',
    key: 'people.update',
    resource: 'people',
    action: 'update',
    description: 'Edit personal records, influence scores, and affiliations',
  },
  {
    id: 'perm-people-archive',
    key: 'people.archive',
    resource: 'people',
    action: 'archive',
    description: 'Archive or flag duplicate contact profiles',
    isSensitive: true,
  },

  // Meetings
  {
    id: 'perm-meetings-read',
    key: 'meetings.read',
    resource: 'meetings',
    action: 'read',
    description: 'View meeting schedules, strategic briefs, and attendee rosters',
  },
  {
    id: 'perm-meetings-create',
    key: 'meetings.create',
    resource: 'meetings',
    action: 'create',
    description: 'Schedule campaign sessions, town halls, and delegations',
  },
  {
    id: 'perm-meetings-update',
    key: 'meetings.update',
    resource: 'meetings',
    action: 'update',
    description: 'Record meeting decisions, outcomes, and generated commitments',
  },

  // Commitments
  {
    id: 'perm-commitments-read',
    key: 'commitments.read',
    resource: 'commitments',
    action: 'read',
    description: 'View campaign promises, stakeholder pledges, and progress metrics',
  },
  {
    id: 'perm-commitments-create',
    key: 'commitments.create',
    resource: 'commitments',
    action: 'create',
    description: 'Create new accountable commitments and pledges',
  },
  {
    id: 'perm-commitments-update',
    key: 'commitments.update',
    resource: 'commitments',
    action: 'update',
    description: 'Update pledge statuses, attach proofs, and mark completion',
  },

  // Field Operations
  {
    id: 'perm-field-capture',
    key: 'field.capture',
    resource: 'field',
    action: 'capture',
    description: 'Capture paper registration forms via OCR camera and digital forms',
  },
  {
    id: 'perm-field-submissions-read',
    key: 'field.submissions.read',
    resource: 'field',
    action: 'submissions.read',
    description: 'Access the ingestion telemetry queue and field batch lists',
  },
  {
    id: 'perm-field-review',
    key: 'field.review',
    resource: 'field',
    action: 'review',
    description: 'Perform human audit, approve/reject submissions, and merge duplicates',
    isSensitive: true,
  },

  // Knowledge Base
  {
    id: 'perm-knowledge-read',
    key: 'knowledge.read',
    resource: 'knowledge',
    action: 'read',
    description: 'Access strategy memos, constituency research, and policy documents',
  },
  {
    id: 'perm-knowledge-upload',
    key: 'knowledge.upload',
    resource: 'knowledge',
    action: 'upload',
    description: 'Upload campaign documents and research briefs into intelligence repository',
  },

  // Issues Desk
  {
    id: 'perm-issues-read',
    key: 'issues.read',
    resource: 'issues',
    action: 'read',
    description: 'View field friction, logistics hurdles, and incident reports',
  },
  {
    id: 'perm-issues-manage',
    key: 'issues.manage',
    resource: 'issues',
    action: 'manage',
    description: 'Create, assign, escalate, and resolve operational issues',
  },

  // Team Governance
  {
    id: 'perm-team-read',
    key: 'team.read',
    resource: 'team',
    action: 'read',
    description: 'View organization team rosters and active personnel roles',
  },
  {
    id: 'perm-team-invite',
    key: 'team.invite',
    resource: 'team',
    action: 'invite',
    description: 'Issue invitations to new campaign operators and field officers',
    isSensitive: true,
  },
  {
    id: 'perm-team-manage',
    key: 'team.manage',
    resource: 'team',
    action: 'manage',
    description: 'Suspend accounts, modify role assignments, and govern access policies',
    isSensitive: true,
  },

  // Security Audit
  {
    id: 'perm-audit-read',
    key: 'audit.read',
    resource: 'audit',
    action: 'read',
    description: 'Inspect cryptographic access logs, system changes, and verification history',
    isSensitive: true,
  },

  // AI Copilot
  {
    id: 'perm-ai-access',
    key: 'ai.access',
    resource: 'ai',
    action: 'access',
    description: 'Interact with the context-aware campaign AI copilot',
  },
  {
    id: 'perm-ai-execute',
    key: 'ai.execute',
    resource: 'ai',
    action: 'execute',
    description: 'Permit AI to propose and execute operational mutations upon confirmation',
    isSensitive: true,
  },
];
