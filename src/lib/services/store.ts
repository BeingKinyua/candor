import {
  User,
  Person,
  Meeting,
  Commitment,
  FieldSubmission,
  KnowledgeDocument,
  Issue,
  AuditEvent,
  NotificationItem,
  AIActionProposal
} from '@/src/types';
import {
  INITIAL_USERS,
  INITIAL_PEOPLE,
  INITIAL_MEETINGS,
  INITIAL_COMMITMENTS,
  INITIAL_SUBMISSIONS,
  INITIAL_DOCUMENTS,
  INITIAL_ISSUES,
  INITIAL_AUDIT_LOGS,
  INITIAL_NOTIFICATIONS
} from '@/src/lib/mockData';

const STORAGE_KEYS = {
  USERS: 'vantage_users_v1',
  PEOPLE: 'vantage_people_v1',
  MEETINGS: 'vantage_meetings_v1',
  COMMITMENTS: 'vantage_commitments_v1',
  SUBMISSIONS: 'vantage_submissions_v1',
  DOCUMENTS: 'vantage_documents_v1',
  ISSUES: 'vantage_issues_v1',
  AUDIT: 'vantage_audit_v1',
  NOTIFICATIONS: 'vantage_notifs_v1',
  CURRENT_USER: 'vantage_current_user_v1',
};

function getStored<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function setStored<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Failed to persist to storage', e);
  }
}

// In-memory + storage singleton
class CampaignStore {
  private users: User[] = [];
  private people: Person[] = [];
  private meetings: Meeting[] = [];
  private commitments: Commitment[] = [];
  private submissions: FieldSubmission[] = [];
  private documents: KnowledgeDocument[] = [];
  private issues: Issue[] = [];
  private auditLogs: AuditEvent[] = [];
  private notifications: NotificationItem[] = [];
  private currentUser: User | null = null;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.init();
  }

  private init() {
    this.users = getStored(STORAGE_KEYS.USERS, INITIAL_USERS);
    this.people = getStored(STORAGE_KEYS.PEOPLE, INITIAL_PEOPLE);
    this.meetings = getStored(STORAGE_KEYS.MEETINGS, INITIAL_MEETINGS);
    this.commitments = getStored(STORAGE_KEYS.COMMITMENTS, INITIAL_COMMITMENTS);
    this.submissions = getStored(STORAGE_KEYS.SUBMISSIONS, INITIAL_SUBMISSIONS);
    this.documents = getStored(STORAGE_KEYS.DOCUMENTS, INITIAL_DOCUMENTS);
    this.issues = getStored(STORAGE_KEYS.ISSUES, INITIAL_ISSUES);
    this.auditLogs = getStored(STORAGE_KEYS.AUDIT, INITIAL_AUDIT_LOGS);
    this.notifications = getStored(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    this.currentUser = getStored(STORAGE_KEYS.CURRENT_USER, INITIAL_USERS[0]);
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((l) => l());
  }

  // --- Auth & Users ---
  public getCurrentUser(): User | null {
    return this.currentUser;
  }

  public setCurrentUser(user: User | null) {
    this.currentUser = user;
    setStored(STORAGE_KEYS.CURRENT_USER, user);
    this.notify();
  }

  public getUsers(): User[] {
    return [...this.users];
  }

  public addUser(user: Omit<User, 'id'>): User {
    const newUser: User = {
      ...user,
      id: `usr-${Date.now().toString().slice(-4)}`,
    };
    this.users.unshift(newUser);
    setStored(STORAGE_KEYS.USERS, this.users);
    this.logAudit('Security', 'Invited New User', newUser.id, newUser.name, `Role: ${newUser.role}`);
    this.notify();
    return newUser;
  }

  public createUser(user: Omit<User, 'id'>): User {
    return this.addUser(user);
  }

  public updateUser(id: string, updates: Partial<User>): User | null {
    const idx = this.users.findIndex((u) => u.id === id);
    if (idx === -1) return null;
    this.users[idx] = { ...this.users[idx], ...updates };
    if (this.currentUser?.id === id) {
      this.currentUser = this.users[idx];
      setStored(STORAGE_KEYS.CURRENT_USER, this.currentUser);
    }
    setStored(STORAGE_KEYS.USERS, this.users);
    this.logAudit('Security', 'Updated User Profile / Status', id, this.users[idx].name, JSON.stringify(updates));
    this.notify();
    return this.users[idx];
  }

  // --- People ---
  public getPeople(): Person[] {
    return [...this.people];
  }

  public getPerson(id: string): Person | undefined {
    return this.people.find((p) => p.id === id);
  }

  public createPerson(person: Omit<Person, 'id' | 'createdAt' | 'updatedAt' | 'metrics'>): Person {
    const newPerson: Person = {
      ...person,
      id: `per-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      metrics: {
        commitmentsCount: 0,
        meetingsCount: 0,
        issuesCount: 0,
        interactionsLast30Days: 1,
      },
    };
    this.people.unshift(newPerson);
    setStored(STORAGE_KEYS.PEOPLE, this.people);
    this.logAudit('People', 'Created Person Record', newPerson.id, newPerson.fullName, `County: ${newPerson.county}`);
    this.notify();
    return newPerson;
  }

  public updatePerson(id: string, updates: Partial<Person>): Person | null {
    const idx = this.people.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    this.people[idx] = {
      ...this.people[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    setStored(STORAGE_KEYS.PEOPLE, this.people);
    this.logAudit('People', 'Updated Person Record', id, this.people[idx].fullName, 'Edited details');
    this.notify();
    return this.people[idx];
  }

  // --- Meetings ---
  public getMeetings(): Meeting[] {
    return [...this.meetings];
  }

  public getMeeting(id: string): Meeting | undefined {
    return this.meetings.find((m) => m.id === id);
  }

  public createMeeting(meeting: Omit<Meeting, 'id' | 'decisions' | 'commitmentsGenerated' | 'issuesGenerated'>): Meeting {
    const newMeeting: Meeting = {
      ...meeting,
      id: `mtg-${Date.now().toString().slice(-4)}`,
      decisions: [],
      commitmentsGenerated: [],
      issuesGenerated: [],
    };
    this.meetings.unshift(newMeeting);
    setStored(STORAGE_KEYS.MEETINGS, this.meetings);
    this.logAudit('Meetings', 'Scheduled Meeting', newMeeting.id, newMeeting.title, `Date: ${newMeeting.date} ${newMeeting.time}`);
    this.notify();
    return newMeeting;
  }

  public updateMeeting(id: string, updates: Partial<Meeting>): Meeting | null {
    const idx = this.meetings.findIndex((m) => m.id === id);
    if (idx === -1) return null;
    this.meetings[idx] = { ...this.meetings[idx], ...updates };
    setStored(STORAGE_KEYS.MEETINGS, this.meetings);
    this.logAudit('Meetings', 'Updated Meeting', id, this.meetings[idx].title, 'Updated agenda/notes/status');
    this.notify();
    return this.meetings[idx];
  }

  // --- Commitments ---
  public getCommitments(): Commitment[] {
    return [...this.commitments];
  }

  public getCommitment(id: string): Commitment | undefined {
    return this.commitments.find((c) => c.id === id);
  }

  public createCommitment(commitment: Omit<Commitment, 'id' | 'auditTrail'>): Commitment {
    const newCommitment: Commitment = {
      ...commitment,
      id: `com-${Date.now().toString().slice(-4)}`,
      auditTrail: [
        {
          id: `aud-${Date.now()}`,
          timestamp: new Date().toISOString(),
          action: 'Created Commitment',
          performedBy: this.currentUser?.name || 'System',
        },
      ],
    };
    this.commitments.unshift(newCommitment);
    setStored(STORAGE_KEYS.COMMITMENTS, this.commitments);
    this.logAudit('Commitments', 'Created Commitment', newCommitment.id, newCommitment.title, `Due: ${newCommitment.dueDate}`);
    this.notify();
    return newCommitment;
  }

  public completeCommitment(id: string, proofNote?: string): Commitment | null {
    const idx = this.commitments.findIndex((c) => c.id === id);
    if (idx === -1) return null;
    const actorName = this.currentUser?.name || 'System';
    this.commitments[idx] = {
      ...this.commitments[idx],
      status: 'completed',
      completedAt: new Date().toISOString(),
      completedBy: actorName,
      completionProofNote: proofNote || 'Verified and completed by operational owner.',
      auditTrail: [
        ...this.commitments[idx].auditTrail,
        {
          id: `aud-${Date.now()}`,
          timestamp: new Date().toISOString(),
          action: 'Marked Completed with Audit Trail',
          performedBy: actorName,
          details: proofNote,
        },
      ],
    };
    setStored(STORAGE_KEYS.COMMITMENTS, this.commitments);
    this.logAudit('Commitments', 'Completed Commitment', id, this.commitments[idx].title, proofNote || 'Completed');
    this.notify();
    return this.commitments[idx];
  }

  // --- Field Operations & Submissions ---
  public getSubmissions(): FieldSubmission[] {
    return [...this.submissions];
  }

  public getSubmission(id: string): FieldSubmission | undefined {
    return this.submissions.find((s) => s.id === id);
  }

  public addSubmission(sub: Omit<FieldSubmission, 'id' | 'capturedAt'>): FieldSubmission {
    const newSub: FieldSubmission = {
      ...sub,
      id: `fs-${Math.floor(1000 + Math.random() * 9000)}`,
      capturedAt: new Date().toISOString(),
    };
    this.submissions.unshift(newSub);
    setStored(STORAGE_KEYS.SUBMISSIONS, this.submissions);
    this.logAudit('Field', 'Uploaded Field Submission', newSub.id, newSub.batchNumber, `Form: ${newSub.formType}`);
    this.notify();
    return newSub;
  }

  public verifySubmission(id: string, action: 'approved' | 'rejected', reason?: string): FieldSubmission | null {
    const idx = this.submissions.findIndex((s) => s.id === id);
    if (idx === -1) return null;
    const actorName = this.currentUser?.name || 'Authorized Verifier';
    
    this.submissions[idx] = {
      ...this.submissions[idx],
      status: action,
      verifiedBy: actorName,
      verifiedAt: new Date().toISOString(),
      rejectionReason: action === 'rejected' ? reason : undefined,
    };

    // If approved and has name/phone/ward, synchronize or create person if not existing
    if (action === 'approved') {
      const nameFld = this.submissions[idx].extractedFields.find((f) => f.name === 'fullName')?.value;
      const phoneFld = this.submissions[idx].extractedFields.find((f) => f.name === 'phone')?.value;
      const nationalIdFld = this.submissions[idx].extractedFields.find((f) => f.name === 'nationalId')?.value;
      const countyFld = this.submissions[idx].extractedFields.find((f) => f.name === 'county')?.value || this.submissions[idx].location.county;
      const constFld = this.submissions[idx].extractedFields.find((f) => f.name === 'constituency')?.value || this.submissions[idx].location.constituency;
      const wardFld = this.submissions[idx].extractedFields.find((f) => f.name === 'ward')?.value || this.submissions[idx].location.ward;

      if (nameFld && phoneFld) {
        const existing = this.people.find((p) => p.phone === phoneFld || (nationalIdFld && p.nationalId === nationalIdFld));
        if (existing) {
          this.updatePerson(existing.id, {
            status: 'active',
            duplicateFlag: false,
            updatedAt: new Date().toISOString(),
          });
        } else {
          this.createPerson({
            fullName: nameFld,
            phone: phoneFld,
            nationalId: nationalIdFld,
            county: countyFld,
            constituency: constFld,
            ward: wardFld,
            category: 'Grassroots Mobilizer',
            influenceScore: 6,
            status: 'active',
            notes: `Auto-ingested from approved field submission ${this.submissions[idx].id} (${this.submissions[idx].formType}).`,
            tags: ['Field-Ingested', this.submissions[idx].location.constituency],
          });
        }
      }
    }

    setStored(STORAGE_KEYS.SUBMISSIONS, this.submissions);
    this.logAudit('Field', `${action === 'approved' ? 'Approved' : 'Rejected'} Submission`, id, this.submissions[idx].batchNumber, reason || 'Human Verification Sign-off');
    this.notify();
    return this.submissions[idx];
  }

  // --- Knowledge Documents ---
  public getDocuments(): KnowledgeDocument[] {
    return [...this.documents];
  }

  public getDocument(id: string): KnowledgeDocument | undefined {
    return this.documents.find((d) => d.id === id);
  }

  public addDocument(doc: Omit<KnowledgeDocument, 'id' | 'date' | 'status'>): KnowledgeDocument {
    const newDoc: KnowledgeDocument = {
      ...doc,
      id: `doc-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString().split('T')[0],
      status: 'indexed',
    };
    this.documents.unshift(newDoc);
    setStored(STORAGE_KEYS.DOCUMENTS, this.documents);
    this.logAudit('Knowledge', 'Indexed Intelligence Document', newDoc.id, newDoc.title, `Classification: ${newDoc.classification}`);
    this.notify();
    return newDoc;
  }

  public createDocument(doc: any): KnowledgeDocument {
    return this.addDocument({
      title: doc.title,
      type: 'Strategy Memo',
      category: doc.category || 'Policy Memo',
      fileSize: doc.fileSize || '12 KB',
      author: doc.author || 'Policy Team',
      aiSummary: `Indexed policy document on ${doc.title}`,
      keyTakeaways: ['Policy guidelines recorded for field operation reference.'],
      tags: doc.tags || [],
      content: doc.content || '',
      classification: doc.classification || 'Confidential',
    });
  }

  // --- Issues ---
  public getIssues(): Issue[] {
    return [...this.issues];
  }

  public getIssue(id: string): Issue | undefined {
    return this.issues.find((i) => i.id === id);
  }

  public resolveIssue(id: string, resolutionNote: string): Issue | null {
    return this.updateIssue(id, { status: 'resolved' }, `Resolved: ${resolutionNote}`);
  }

  public createIssue(issue: Omit<Issue, 'id' | 'createdAt' | 'updatedAt' | 'timeline'>): Issue {
    const actorName = this.currentUser?.name || 'Operations Agent';
    const newIssue: Issue = {
      ...issue,
      id: `iss-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      timeline: [
        {
          id: `tle-${Date.now()}`,
          timestamp: new Date().toISOString(),
          author: actorName,
          content: `Issue logged: ${issue.title}`,
          statusChange: issue.status,
        },
      ],
    };
    this.issues.unshift(newIssue);
    setStored(STORAGE_KEYS.ISSUES, this.issues);
    this.logAudit('Issues', 'Logged Operational Issue', newIssue.id, newIssue.title, `Priority: ${newIssue.priority}`);
    this.notify();
    return newIssue;
  }

  public updateIssue(id: string, updates: Partial<Issue>, logComment?: string): Issue | null {
    const idx = this.issues.findIndex((i) => i.id === id);
    if (idx === -1) return null;
    const actorName = this.currentUser?.name || 'System';

    const timeline = [...this.issues[idx].timeline];
    if (logComment || updates.status) {
      timeline.push({
        id: `tle-${Date.now()}`,
        timestamp: new Date().toISOString(),
        author: actorName,
        content: logComment || `Status changed to ${updates.status}`,
        statusChange: updates.status,
      });
    }

    this.issues[idx] = {
      ...this.issues[idx],
      ...updates,
      timeline,
      updatedAt: new Date().toISOString(),
    };

    setStored(STORAGE_KEYS.ISSUES, this.issues);
    this.logAudit('Issues', 'Updated Issue Status', id, this.issues[idx].title, logComment || `Status: ${updates.status}`);
    this.notify();
    return this.issues[idx];
  }

  // --- Audit & Notifications ---
  public getAuditLogs(): AuditEvent[] {
    return [...this.auditLogs];
  }

  public logAudit(domain: AuditEvent['domain'], action: string, targetId: string, targetName: string, details: string) {
    const event: AuditEvent = {
      id: `aud-log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorId: this.currentUser?.id || 'sys',
      actorName: this.currentUser?.name || 'System Engine',
      actorRole: this.currentUser?.role || 'Admin',
      action,
      domain,
      targetId,
      targetName,
      details,
      ipAddress: '102.219.208.14',
    };
    this.auditLogs.unshift(event);
    setStored(STORAGE_KEYS.AUDIT, this.auditLogs.slice(0, 100));
  }

  public getNotifications(): NotificationItem[] {
    return [...this.notifications];
  }

  public markNotificationRead(id: string) {
    const idx = this.notifications.findIndex((n) => n.id === id);
    if (idx !== -1) {
      this.notifications[idx].read = true;
      setStored(STORAGE_KEYS.NOTIFICATIONS, this.notifications);
      this.notify();
    }
  }

  public clearAllNotifications() {
    this.notifications = this.notifications.map((n) => ({ ...n, read: true }));
    setStored(STORAGE_KEYS.NOTIFICATIONS, this.notifications);
    this.notify();
  }

  public resetToDefaults() {
    this.users = INITIAL_USERS;
    this.people = INITIAL_PEOPLE;
    this.meetings = INITIAL_MEETINGS;
    this.commitments = INITIAL_COMMITMENTS;
    this.submissions = INITIAL_SUBMISSIONS;
    this.documents = INITIAL_DOCUMENTS;
    this.issues = INITIAL_ISSUES;
    this.auditLogs = INITIAL_AUDIT_LOGS;
    this.notifications = INITIAL_NOTIFICATIONS;
    this.currentUser = INITIAL_USERS[0];
    
    setStored(STORAGE_KEYS.USERS, this.users);
    setStored(STORAGE_KEYS.PEOPLE, this.people);
    setStored(STORAGE_KEYS.MEETINGS, this.meetings);
    setStored(STORAGE_KEYS.COMMITMENTS, this.commitments);
    setStored(STORAGE_KEYS.SUBMISSIONS, this.submissions);
    setStored(STORAGE_KEYS.DOCUMENTS, this.documents);
    setStored(STORAGE_KEYS.ISSUES, this.issues);
    setStored(STORAGE_KEYS.AUDIT, this.auditLogs);
    setStored(STORAGE_KEYS.NOTIFICATIONS, this.notifications);
    setStored(STORAGE_KEYS.CURRENT_USER, this.currentUser);
    this.notify();
  }
}

export const campaignStore = new CampaignStore();
