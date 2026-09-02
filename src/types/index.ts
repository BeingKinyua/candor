export type Role = 'Admin' | 'Campaign Director' | 'Operations Lead' | 'Field Mobilizer' | 'Intelligence Analyst';

export type Permission = 
  | 'people:view' 
  | 'people:create' 
  | 'people:edit' 
  | 'people:delete'
  | 'field:view' 
  | 'field:capture' 
  | 'field:verify' 
  | 'meetings:view' 
  | 'meetings:create' 
  | 'meetings:edit'
  | 'commitments:view' 
  | 'commitments:manage' 
  | 'commitments:edit'
  | 'commitments:audit'
  | 'knowledge:view' 
  | 'knowledge:manage' 
  | 'knowledge:edit'
  | 'issues:view' 
  | 'issues:manage' 
  | 'issues:edit'
  | 'ai:access' 
  | 'ai:execute_actions'
  | 'team:manage' 
  | 'users:manage'
  | 'roles:manage' 
  | 'security:audit';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  badge?: string;
  assignedRegion?: string;
  status: 'active' | 'suspended' | 'pending_invite';
}

export type PersonCategory = 
  | 'Community Elder' 
  | 'Grassroots Mobilizer' 
  | 'Youth Coordinator' 
  | 'Business Guild Leader' 
  | 'Religious Leader' 
  | 'Key Influencer' 
  | 'Volunteer';

export interface Person {
  id: string;
  fullName: string;
  nationalId?: string;
  phone: string;
  alternativePhone?: string;
  email?: string;
  county: string;
  constituency: string;
  ward: string;
  category: PersonCategory;
  influenceScore: number; // 1-10
  status: 'active' | 'draft' | 'archived';
  duplicateFlag?: boolean;
  duplicateNotes?: string;
  notes: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  metrics: {
    commitmentsCount: number;
    meetingsCount: number;
    issuesCount: number;
    interactionsLast30Days: number;
  };
}

export interface MeetingParticipant {
  personId: string;
  name: string;
  role: string;
  confirmed: boolean;
  notes?: string;
}

export interface Meeting {
  id: string;
  title: string;
  agenda: string;
  location: string;
  venueType: 'Physical' | 'Secure Virtual' | 'Field Delegation' | 'Hybrid';
  date: string;
  time: string;
  durationMinutes: number;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  leadOrganizer: string;
  leadOrganizerId: string;
  participants: MeetingParticipant[];
  aiPreparationBrief?: {
    summary: string;
    keyObjectives: string[];
    potentialRisks: string[];
    suggestedTalkingPoints: string[];
    historicalContext: string;
  };
  notes?: string;
  decisions: string[];
  commitmentsGenerated: string[]; // commitment IDs
  issuesGenerated: string[]; // issue IDs
}

export type CommitmentStatus = 'pending' | 'completed' | 'overdue' | 'cancelled';
export type PriorityLevel = 'low' | 'medium' | 'high' | 'critical';

export interface CommitmentAuditEntry {
  id: string;
  timestamp: string;
  action: string;
  performedBy: string;
  details?: string;
}

export interface Commitment {
  id: string;
  title: string;
  description: string;
  ownerId: string;
  ownerName: string;
  relatedPersonId?: string;
  relatedPersonName?: string;
  relatedMeetingId?: string;
  relatedMeetingTitle?: string;
  dueDate: string;
  priority: PriorityLevel;
  status: CommitmentStatus;
  completedAt?: string;
  completedBy?: string;
  completionProofNote?: string;
  auditTrail: CommitmentAuditEntry[];
  location?: string;
}

export interface ExtractedField {
  id: string;
  name: string;
  label: string;
  value: string;
  confidence: number; // 0.0 - 1.0
  isEdited?: boolean;
  originalValue?: string;
  validationWarning?: string;
  boundingBox?: { x: number; y: number; width: number; height: number };
}

export type SubmissionStatus = 
  | 'processing' 
  | 'processed' 
  | 'pending_review' 
  | 'approved' 
  | 'rejected';

export interface FieldSubmission {
  id: string;
  batchNumber: string;
  formType: 'Voter Mobilization & Pledges' | 'Event Sign-up' | 'Community Grievance Log' | 'Delegate Registry';
  capturedAt: string;
  capturedBy: string;
  capturedById: string;
  location: {
    county: string;
    constituency: string;
    ward: string;
    pollingStation?: string;
  };
  status: SubmissionStatus;
  originalImageUrl: string;
  extractedFields: ExtractedField[];
  possibleDuplicate?: {
    isDuplicate: boolean;
    matchedPersonId?: string;
    matchedPersonName?: string;
    similarityScore?: number;
    reason?: string;
  };
  rejectionReason?: string;
  verifiedBy?: string;
  verifiedAt?: string;
  notes?: string;
}

export interface KnowledgeDocument {
  id: string;
  title: string;
  type: 'Strategy Memo' | 'Field Report' | 'Legal/Compliance' | 'Constituency Research' | 'Voter Demographics';
  category: string;
  date: string;
  fileSize: string;
  status: 'indexed' | 'processing' | 'flagged';
  author: string;
  aiSummary: string;
  keyTakeaways: string[];
  tags: string[];
  relatedPeopleIds?: string[];
  relatedMeetingIds?: string[];
  content: string;
  classification: 'Confidential' | 'Internal Ops' | 'Field Dissemination';
}

export type IssueStatus = 'open' | 'investigating' | 'escalated' | 'resolved' | 'archived';

export interface IssueTimelineEvent {
  id: string;
  timestamp: string;
  author: string;
  content: string;
  statusChange?: IssueStatus;
}

export interface Issue {
  id: string;
  title: string;
  description: string;
  category: IssueCategory;
  priority: PriorityLevel;
  status: IssueStatus;
  location: string;
  reportedBy: string;
  reportedById: string;
  assignedTo: string;
  assignedToId: string;
  createdAt: string;
  updatedAt: string;
  resolutionNote?: string;
  resolvedAt?: string;
  timeline: IssueTimelineEvent[];
  relatedPeopleIds: string[];
  relatedMeetingIds: string[];
  relatedCommitmentIds: string[];
}

export interface SourceChip {
  type: 'person' | 'meeting' | 'commitment' | 'field_submission' | 'document' | 'issue';
  id: string;
  title: string;
}

export interface AIActionProposal {
  id: string;
  actionType: 'mark_commitment_completed' | 'create_issue' | 'schedule_meeting' | 'flag_duplicate' | 'create_commitment';
  summary: string;
  payload: Record<string, any>;
  confirmed: boolean;
  executed: boolean;
  statusText?: string;
}

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  contextSummary?: string;
  sourceChips?: SourceChip[];
  proposedAction?: AIActionProposal;
  isStreaming?: boolean;
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  actorId: string;
  actorName: string;
  actorRole: string;
  action: string;
  domain: 'People' | 'Field' | 'Meetings' | 'Commitments' | 'Issues' | 'Knowledge' | 'Security' | 'AI';
  targetId: string;
  targetName: string;
  details: string;
  ipAddress: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'urgent' | 'info' | 'success' | 'warning';
  read: boolean;
  linkUrl?: string;
}

// Aliases for broad compatibility
export type Priority = PriorityLevel;
export type UserRole = Role;
export type PermissionAction = Permission;
export type FieldFormType = 'Voter Mobilization & Pledges' | 'Event Sign-up' | 'Community Grievance Log' | 'Delegate Registry';
export type DocumentCategory = 'Strategy Memo' | 'Field Report' | 'Legal/Compliance' | 'Constituency Research' | 'Voter Demographics' | 'Policy Memo' | 'Legal Brief' | 'Coalition Accord' | 'Speech Draft';
export type ClassificationLevel = 'Confidential' | 'Internal Ops' | 'Field Dissemination' | 'Public' | 'Strictly Confidential';
export type CampaignDocument = KnowledgeDocument;
export type IssueCategory = 'Field Friction' | 'Logistics & Transport' | 'Security & Intimidation' | 'Material Shortage' | 'Messaging Dispute' | 'Logistics Breakdown' | 'Security / Threat' | 'Opposition Activity' | 'Legal & Regulatory' | 'Media & Narrative';
export type AuditLogDomain = 'People' | 'Field' | 'Meetings' | 'Commitments' | 'Issues' | 'Knowledge' | 'Security' | 'AI' | 'AUTH' | 'PEOPLE' | 'MEETINGS' | 'COMMITMENTS' | 'FIELD' | 'KNOWLEDGE' | 'ISSUES' | 'ADMIN';

