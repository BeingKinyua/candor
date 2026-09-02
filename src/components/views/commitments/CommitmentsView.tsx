import React, { useState } from 'react';
import {
  CheckSquare,
  AlertTriangle,
  Clock,
  User,
  Plus,
  Sparkles,
  CheckCircle2,
  Calendar,
  FileCheck,
  Shield,
  Search,
} from 'lucide-react';
import { useNavigation } from '@/src/lib/router/navigationContext';
import { useAuth } from '@/src/lib/auth/authContext';
import { campaignStore } from '@/src/lib/services/store';
import { Commitment, Priority } from '@/src/types';
import { Button, Badge, Input } from '@/src/components/ui/Controls';
import { Modal } from '@/src/components/ui/Feedback';

export const CommitmentsView: React.FC = () => {
  const { navigate, openAiDrawer } = useNavigation();
  const { can, user } = useAuth();
  const [filter, setFilter] = useState<'all' | 'overdue' | 'pending' | 'completed'>('all');
  const [search, setSearch] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [completingCommitment, setCompletingCommitment] = useState<Commitment | null>(null);
  const [completionProof, setCompletionProof] = useState('');

  const commitments = campaignStore.getCommitments();
  const people = campaignStore.getPeople();

  const [newCommitment, setNewCommitment] = useState({
    title: '',
    description: '',
    dueDate: new Date().toISOString().split('T')[0],
    priority: 'high' as Priority,
    selectedPersonId: people[0]?.id || '',
  });

  const overdueCount = commitments.filter((c) => c.status === 'overdue').length;

  const filtered = commitments.filter((c) => {
    const matchesFilter = filter === 'all' || c.status === filter;
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      c.title.toLowerCase().includes(q) ||
      c.ownerName.toLowerCase().includes(q) ||
      c.relatedPersonName?.toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommitment.title) return;

    const person = people.find((p) => p.id === newCommitment.selectedPersonId);

    campaignStore.createCommitment({
      title: newCommitment.title,
      description: newCommitment.description,
      ownerId: user?.id || 'usr-1',
      ownerName: user?.name || 'Lead Officer',
      relatedPersonId: person?.id,
      relatedPersonName: person?.fullName,
      dueDate: newCommitment.dueDate,
      priority: newCommitment.priority,
      status: 'pending',
    });

    setShowCreateModal(false);
    setNewCommitment({
      title: '',
      description: '',
      dueDate: new Date().toISOString().split('T')[0],
      priority: 'high',
      selectedPersonId: people[0]?.id || '',
    });
  };

  const handleCompleteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!completingCommitment) return;

    campaignStore.completeCommitment(completingCommitment.id, completionProof || 'Verified and completed by operational owner.');
    setCompletingCommitment(null);
    setCompletionProof('');
  };

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-mono tracking-widest text-[#00DF81] uppercase font-semibold">
              Accountability & Promises
            </span>
          </div>
          <h1 className="font-serif-heading text-2xl md:text-3xl font-semibold text-[#F1F7F6]">
            Commitments & Follow-Through Tracker
          </h1>
          <p className="text-xs md:text-sm text-[#AACBC4] mt-0.5">
            Never drop a campaign pledge made to a community elder, guild leader, or coalition partner.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="ai"
            size="sm"
            onClick={() => openAiDrawer('Show me all high-risk overdue commitments and suggest remediation actions')}
            icon={<Sparkles className="w-3.5 h-3.5 text-[#00DF81]" />}
          >
            AI Risk Assessment
          </Button>

          {can('commitments:edit') && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowCreateModal(true)}
              icon={<Plus className="w-3.5 h-3.5" />}
            >
              New Commitment
            </Button>
          )}
        </div>
      </div>

      {/* Overdue Warning Alert Banner */}
      {overdueCount > 0 && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-[#E05252]/20 via-[#08453A]/60 to-[#032221] border border-[#E05252]/40 flex items-center justify-between shadow-lg">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-[#E05252]/20 text-[#E05252]">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#F1F7F6]">
                {overdueCount} Campaign Commitments Have Passed Due Date
              </p>
              <p className="text-xs text-[#AACBC4]">
                Overdue promises degrade political trust and volunteer morale. Immediate dispatch or owner escalation required.
              </p>
            </div>
          </div>
          <Button
            variant="danger"
            size="sm"
            onClick={() => setFilter('overdue')}
          >
            Filter Overdue
          </Button>
        </div>
      )}

      {/* Search & Tabs */}
      <div className="glass-panel rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-3 border border-[#AACBC4]/20">
        <div className="w-full md:w-80">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search commitments, owners, contacts..."
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>

        <div className="flex items-center space-x-2 w-full md:w-auto overflow-x-auto scrollbar-thin pb-1">
          {[
            { id: 'all', label: `All (${commitments.length})` },
            { id: 'overdue', label: `Overdue (${overdueCount})`, isAlert: overdueCount > 0 },
            { id: 'pending', label: `Pending (${commitments.filter((c) => c.status === 'pending').length})` },
            { id: 'completed', label: `Completed (${commitments.filter((c) => c.status === 'completed').length})` },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setFilter(t.id as any)}
              className={`px-3 sm:px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all whitespace-nowrap shrink-0 ${
                filter === t.id
                  ? t.isAlert
                    ? 'bg-[#E05252]/20 text-[#E05252] border border-[#E05252]/40'
                    : 'bg-[#00DF81]/15 text-[#00DF81] border border-[#00DF81]/30'
                  : 'text-[#AACBC4] hover:bg-[#08453A]/40'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Commitments List */}
      <div className="space-y-3.5">
        {filtered.map((commitment) => (
          <div
            key={commitment.id}
            className={`glass-panel rounded-2xl p-5 border transition-all ${
              commitment.status === 'overdue'
                ? 'border-[#E05252]/40 bg-[#E05252]/5'
                : commitment.status === 'completed'
                ? 'border-[#00DF81]/20 opacity-80'
                : 'border-[#AACBC4]/20'
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge
                    variant={
                      commitment.status === 'completed'
                        ? 'success'
                        : commitment.status === 'overdue'
                        ? 'danger'
                        : 'warning'
                    }
                  >
                    {commitment.status.toUpperCase()}
                  </Badge>

                  <Badge
                    variant={
                      commitment.priority === 'critical'
                        ? 'danger'
                        : commitment.priority === 'high'
                        ? 'warning'
                        : 'neutral'
                    }
                  >
                    {commitment.priority.toUpperCase()} PRIORITY
                  </Badge>

                  <span className="text-xs text-[#AACBC4] flex items-center space-x-1">
                    <Calendar className="w-3.5 h-3.5 text-[#00DF81]" />
                    <span>Due: <strong>{commitment.dueDate}</strong></span>
                  </span>
                </div>

                <h3 className="font-serif-heading text-lg font-semibold text-[#F1F7F6]">
                  {commitment.title}
                </h3>

                <p className="text-xs text-[#AACBC4] leading-relaxed max-w-2xl">
                  {commitment.description}
                </p>

                {/* Metadata row */}
                <div className="flex flex-wrap items-center gap-4 text-xs text-[#AACBC4] pt-2 border-t border-[#AACBC4]/10">
                  <span>Assigned Owner: <strong className="text-[#F1F7F6]">{commitment.ownerName}</strong></span>
                  {commitment.relatedPersonName && (
                    <span>
                      Linked Stakeholder:{' '}
                      <button
                        onClick={() => commitment.relatedPersonId && navigate(`/people/${commitment.relatedPersonId}`)}
                        className="text-[#00DF81] hover:underline font-semibold"
                      >
                        {commitment.relatedPersonName}
                      </button>
                    </span>
                  )}
                  {commitment.relatedMeetingTitle && (
                    <span className="text-[#707D7D] truncate max-w-xs">Origin: {commitment.relatedMeetingTitle}</span>
                  )}
                </div>

                {/* Completion Proof if available */}
                {commitment.completionProofNote && (
                  <div className="p-3 rounded-xl bg-[#00DF81]/10 border border-[#00DF81]/25 text-xs text-[#00DF81] flex items-start space-x-2">
                    <FileCheck className="w-4 h-4 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold">Completion Proof Verified by {commitment.completedBy}:</p>
                      <p className="text-[#F1F7F6]/90 mt-0.5">{commitment.completionProofNote}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Action */}
              <div className="flex items-center space-x-2 shrink-0">
                {commitment.status !== 'completed' && can('commitments:edit') && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setCompletingCommitment(commitment)}
                    icon={<CheckCircle2 className="w-3.5 h-3.5" />}
                  >
                    Complete with Proof
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Completion Modal */}
      <Modal
        isOpen={!!completingCommitment}
        onClose={() => setCompletingCommitment(null)}
        title="Verify & Complete Commitment"
        subtitle={`Closing pledge: "${completingCommitment?.title}"`}
      >
        <form onSubmit={handleCompleteSubmit} className="space-y-4">
          <p className="text-xs text-[#AACBC4] leading-relaxed">
            All campaign completions require an auditable proof summary (e.g. dispatch tracking ID, radio broadcast spot confirmation, or photo note) to maintain platform integrity.
          </p>
          <Input
            label="Verification Proof Note *"
            value={completionProof}
            onChange={(e) => setCompletionProof(e.target.value)}
            placeholder="e.g. Confirmed delivery of 150 table-banking ledgers to Machakos office."
            required
          />
          <div className="flex justify-end space-x-2 pt-4 border-t border-[#AACBC4]/15">
            <Button variant="ghost" type="button" onClick={() => setCompletingCommitment(null)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Sign & Record Completion
            </Button>
          </div>
        </form>
      </Modal>

      {/* Create Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create Campaign Commitment"
        subtitle="Log an explicit operational promise to a leader or community council."
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Commitment / Pledge Title *"
            value={newCommitment.title}
            onChange={(e) => setNewCommitment({ ...newCommitment, title: e.target.value })}
            placeholder="e.g. Schedule Secondary Health Camp in Kondele"
            required
          />

          <div>
            <label className="block text-xs font-medium text-[#AACBC4] mb-1.5">Description & Scope</label>
            <textarea
              rows={3}
              value={newCommitment.description}
              onChange={(e) => setNewCommitment({ ...newCommitment, description: e.target.value })}
              placeholder="What specifically was agreed? What are the deliverables?"
              className="w-full rounded-xl bg-[#032221] border border-[#AACBC4]/25 p-3 text-sm text-[#F1F7F6]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Due Date *"
              type="date"
              value={newCommitment.dueDate}
              onChange={(e) => setNewCommitment({ ...newCommitment, dueDate: e.target.value })}
              required
            />
            <div>
              <label className="block text-xs font-medium text-[#AACBC4] mb-1.5">Priority</label>
              <select
                value={newCommitment.priority}
                onChange={(e) => setNewCommitment({ ...newCommitment, priority: e.target.value as Priority })}
                className="w-full px-3 py-2.5 rounded-xl bg-[#032221] border border-[#AACBC4]/25 text-sm text-[#F1F7F6]"
              >
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#AACBC4] mb-1.5">Linked Stakeholder</label>
            <select
              value={newCommitment.selectedPersonId}
              onChange={(e) => setNewCommitment({ ...newCommitment, selectedPersonId: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl bg-[#032221] border border-[#AACBC4]/25 text-sm text-[#F1F7F6]"
            >
              {people.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.fullName} ({p.category})
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t border-[#AACBC4]/15">
            <Button variant="ghost" type="button" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Log Commitment
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
