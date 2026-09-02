import { campaignStore } from './store';
import { AIMessage, AIActionProposal, SourceChip } from '@/src/types';

export interface AIQueryContext {
  currentRoute: string;
  contextTitle?: string;
  entityType?: 'person' | 'meeting' | 'commitment' | 'field_submission' | 'document' | 'issue' | 'overview';
  entityId?: string;
  entityData?: any;
}

export const aiService = {
  getSuggestedPrompts(context: AIQueryContext): string[] {
    switch (context.entityType) {
      case 'person':
        return [
          `Prepare briefing on ${context.contextTitle || 'this contact'}`,
          'Show all linked commitments and overdue actions',
          'Summarize recent meetings and stakeholder influence',
          'Draft meeting agenda based on past grievances',
        ];
      case 'meeting':
        return [
          'Generate executive preparation brief for this meeting',
          'Identify potential conflict risks among participants',
          'Review previous commitments made by these attendees',
          'Suggest talking points for local agricultural policy',
        ];
      case 'commitment':
        return [
          'What is the blocker on this commitment?',
          'Draft urgent follow-up notification to owner',
          'Propose completion verification checklist',
        ];
      case 'field_submission':
        return [
          'Why was this submission flagged as possible duplicate?',
          'Explain OCR confidence breakdown on handwriting',
          'Compare against existing voter records in this ward',
        ];
      case 'document':
        return [
          'Extract top 3 operational action items from this memo',
          'Which community elders are referenced here?',
          'Cross-reference with recent field issues',
        ];
      case 'issue':
        return [
          'Synthesize chronological root cause of this issue',
          'Recommend escalation plan for campaign leadership',
          'Draft mitigation talking points for field teams',
        ];
      case 'overview':
      default:
        return [
          'What critical operational items require my attention today?',
          'Summarize field capture progress across Nakuru and Kiambu',
          'List high-risk overdue commitments across all regions',
          'Which meetings have unverified agendas this week?',
        ];
    }
  },

  async ask(prompt: string, context: AIQueryContext): Promise<AIMessage> {
    // Artificial delay to give natural streaming / thoughtful intelligence feel
    await new Promise((res) => setTimeout(res, 600));

    const query = prompt.toLowerCase();
    const people = campaignStore.getPeople();
    const meetings = campaignStore.getMeetings();
    const commitments = campaignStore.getCommitments();
    const issues = campaignStore.getIssues();
    const submissions = campaignStore.getSubmissions();
    const documents = campaignStore.getDocuments();

    let responseContent = '';
    const sourceChips: SourceChip[] = [];
    let proposedAction: AIActionProposal | undefined = undefined;

    // Entity-specific intelligence
    if (context.entityType === 'person' && context.entityData) {
      const person = context.entityData;
      sourceChips.push({ type: 'person', id: person.id, title: person.fullName });
      
      const relatedCommitments = commitments.filter((c) => c.relatedPersonId === person.id);
      const relatedMeetings = meetings.filter((m) => m.participants.some((p) => p.personId === person.id));
      const relatedIssues = issues.filter((i) => i.relatedPeopleIds.includes(person.id));

      if (query.includes('brief') || query.includes('prepare') || query.includes('who is')) {
        responseContent = `### Executive Briefing: ${person.fullName}\n\n` +
          `**Category:** ${person.category} | **Region:** ${person.ward}, ${person.constituency}, ${person.county}\n` +
          `**Influence Rating:** ${person.influenceScore}/10 | **Status:** ${person.status.toUpperCase()}\n\n` +
          `**Strategic Assessment:**\n` +
          `${person.notes}\n\n` +
          `**Operational Footprint:**\n` +
          `- **Linked Meetings:** ${relatedMeetings.length} recorded sessions.\n` +
          `- **Active Commitments:** ${relatedCommitments.filter(c => c.status === 'pending' || c.status === 'overdue').length} outstanding.\n` +
          `- **Related Operational Issues:** ${relatedIssues.length} filed.\n\n` +
          `**Tactical Guidance:** When engaging ${person.fullName}, address local community priorities directly and review outstanding pledges beforehand.`;
      } else if (query.includes('commitment') || query.includes('overdue')) {
        responseContent = `### Commitments Linked to ${person.fullName}\n\n` +
          (relatedCommitments.length > 0
            ? relatedCommitments.map(c => `- **[${c.status.toUpperCase()}]** ${c.title} (Owner: ${c.ownerName}, Due: ${c.dueDate})`).join('\n')
            : 'No commitments currently linked to this record.');
        
        const overdue = relatedCommitments.find(c => c.status === 'overdue' || c.status === 'pending');
        if (overdue) {
          proposedAction = {
            id: `act-${Date.now()}`,
            actionType: 'mark_commitment_completed',
            summary: `I can record and audit completion for: "${overdue.title}".`,
            payload: { commitmentId: overdue.id },
            confirmed: false,
            executed: false,
          };
        }
      } else {
        responseContent = `Based on institutional records for **${person.fullName}**, they have participated in ${relatedMeetings.length} strategic meetings and coordinate key networks in ${person.constituency}.\n\n` +
          `*Would you like me to draft an interaction summary or schedule a follow-up agenda?*`;
      }
    } else if (context.entityType === 'field_submission' && context.entityData) {
      const sub = context.entityData;
      sourceChips.push({ type: 'field_submission', id: sub.id, title: `Batch ${sub.batchNumber}` });

      if (sub.possibleDuplicate?.isDuplicate) {
        responseContent = `### Duplicate Analysis & Quality Telemetry\n\n` +
          `**Submission ID:** ${sub.id} (${sub.formType})\n` +
          `**Risk Rating:** ⚠️ High Potential Duplicate Match (${Math.round((sub.possibleDuplicate.similarityScore || 0.96) * 100)}% confidence)\n\n` +
          `**Comparison:**\n` +
          `- **Matched Existing Record:** ${sub.possibleDuplicate.matchedPersonName}\n` +
          `- **Conflict Reason:** ${sub.possibleDuplicate.reason}\n\n` +
          `**Optical Recognition Confidence:**\n` +
          sub.extractedFields.map(f => `- **${f.label}:** "${f.value}" (${Math.round(f.confidence * 100)}% match)`).join('\n') +
          `\n\n**Human Authorization Required:** Do not approve without confirming whether this is a re-engagement or an erroneous duplicate submission.`;
      } else {
        responseContent = `### Form Verification Summary\n\n` +
          `The document OCR extraction achieved an overall confidence of 97%. All critical fields (National ID, Phone, Ward) comply with format validation rules. No existing duplicates detected in ${sub.location.county}.`;
      }
    } else if (context.entityType === 'meeting' && context.entityData) {
      const meeting = context.entityData;
      sourceChips.push({ type: 'meeting', id: meeting.id, title: meeting.title });
      
      responseContent = `### AI Preparation: ${meeting.title}\n\n` +
        `**Date & Time:** ${meeting.date} at ${meeting.time} (${meeting.durationMinutes} min)\n` +
        `**Venue:** ${meeting.location} [${meeting.venueType}]\n\n` +
        `**Executive Summary:**\n${meeting.aiPreparationBrief?.summary || meeting.agenda}\n\n` +
        `**Key Objectives:**\n` +
        (meeting.aiPreparationBrief?.keyObjectives.map(o => `- ${o}`).join('\n') || '- Align regional campaign strategy') +
        `\n\n**Potential Risks to Navigate:**\n` +
        (meeting.aiPreparationBrief?.potentialRisks.map(r => `- ⚠️ ${r}`).join('\n') || '- Low risk detected') +
        `\n\n**Suggested Talking Points:**\n` +
        (meeting.aiPreparationBrief?.suggestedTalkingPoints.map(t => `- ${t}`).join('\n') || '- Emphasize transparent coordination');
    } else if (query.includes('overdue') || query.includes('attention') || query.includes('critical')) {
      const overdue = commitments.filter(c => c.status === 'overdue');
      const escalatedIssues = issues.filter(i => i.status === 'escalated' || i.priority === 'critical');
      const pendingReviews = submissions.filter(s => s.status === 'pending_review');

      responseContent = `### Campaign Attention Matrix\n\n` +
        `Here is the active operational status across all regional cells:\n\n` +
        `**1. Overdue Commitments (${overdue.length}):**\n` +
        overdue.map(c => `- **${c.title}** (Assigned to: ${c.ownerName}, Due: ${c.dueDate})`).join('\n') +
        `\n\n**2. Escalated & Critical Issues (${escalatedIssues.length}):**\n` +
        escalatedIssues.map(i => `- **${i.title}** in ${i.location} (Status: ${i.status.toUpperCase()})`).join('\n') +
        `\n\n**3. Field Submissions Awaiting Human Verification (${pendingReviews.length}):**\n` +
        pendingReviews.map(s => `- Batch **${s.batchNumber}** (${s.location.constituency} - ${s.formType})`).join('\n');

      if (overdue.length > 0) {
        sourceChips.push({ type: 'commitment', id: overdue[0].id, title: overdue[0].title });
      }
      if (escalatedIssues.length > 0) {
        sourceChips.push({ type: 'issue', id: escalatedIssues[0].id, title: escalatedIssues[0].title });
      }
    } else if (query.includes('kiambu') || query.includes('josephat') || query.includes('kariuki')) {
      const elder = people.find(p => p.id === 'per-101');
      if (elder) {
        sourceChips.push({ type: 'person', id: elder.id, title: elder.fullName });
        sourceChips.push({ type: 'meeting', id: 'mtg-201', title: 'Kiambu Agricultural Cooperatives Sync' });
        sourceChips.push({ type: 'document', id: 'doc-401', title: 'Kiambu & Murang’a Strategic Assessment' });
        
        responseContent = `### Cross-Domain Intelligence: Kiambu Operations\n\n` +
          `**Lead Contact:** ${elder.fullName} (${elder.category})\n` +
          `- **Upcoming Alignment:** Meeting mtg-201 scheduled on Sept 02 at 09:00 in Karuri.\n` +
          `- **Active Friction Point:** Overdue commitment COM-301 regarding rural feeder roads review.\n` +
          `- **Intelligence Memo:** Document doc-401 confirms Karuri ward presents the highest pledge density in the agrarian corridor.`;
      }
    } else {
      responseContent = `I have cross-referenced your query against the platform's operational memory:\n\n` +
        `- **People Registry:** ${people.length} active influencers & coordinators\n` +
        `- **Scheduled Meetings:** ${meetings.filter(m => m.status === 'scheduled').length} upcoming sessions\n` +
        `- **Active Commitments:** ${commitments.filter(c => c.status === 'pending').length} pending, ${commitments.filter(c => c.status === 'overdue').length} overdue\n` +
        `- **Field Queue:** ${submissions.filter(s => s.status === 'pending_review').length} records awaiting verification\n\n` +
        `Ask me about specific contacts, meeting preparation briefs, field anomalies, or document takeaways.`;
    }

    const newMsg: AIMessage = {
      id: `ai-msg-${Date.now()}`,
      role: 'assistant',
      content: responseContent,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      contextSummary: context.contextTitle ? `Context: ${context.contextTitle}` : undefined,
      sourceChips: sourceChips.length > 0 ? sourceChips : undefined,
      proposedAction,
    };

    return newMsg;
  },

  async executeProposedAction(action: AIActionProposal): Promise<{ success: boolean; message: string }> {
    await new Promise((res) => setTimeout(res, 500));
    
    if (action.actionType === 'mark_commitment_completed') {
      const commitmentId = action.payload.commitmentId;
      const res = campaignStore.completeCommitment(commitmentId, 'Completed via verified AI Assistant command.');
      if (res) {
        return { success: true, message: `Successfully marked commitment "${res.title}" as completed with audit trail.` };
      }
    }
    return { success: false, message: 'Action execution failed or was rejected.' };
  }
};
