import React, { useState } from 'react';
import {
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Star,
  Sparkles,
  Calendar,
  CheckSquare,
  AlertOctagon,
  Edit,
  Shield,
  Tag,
  AlertTriangle,
  Clock,
  Plus,
  CheckCircle2
} from 'lucide-react';
import { useNavigation } from '@/src/lib/router/navigationContext';
import { useAuth } from '@/src/lib/auth/authContext';
import { campaignStore } from '@/src/lib/services/store';
import { Button, Badge, Input } from '@/src/components/ui/Controls';
import { GlassCard, BentoCard } from '@/src/components/ui/Cards';
import { Modal } from '@/src/components/ui/Feedback';

export const PersonDetailView: React.FC<{ personId: string; initialEditMode?: boolean }> = ({
  personId,
  initialEditMode = false,
}) => {
  const { navigate, openAiDrawer } = useNavigation();
  const { can } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'commitments' | 'meetings' | 'issues'>('overview');
  const [showEditModal, setShowEditModal] = useState(initialEditMode);

  const person = campaignStore.getPerson(personId);

  if (!person) {
    return (
      <div className="p-8 text-center space-y-4">
        <p className="text-[#AACBC4]">Stakeholder record not found.</p>
        <Button variant="primary" onClick={() => navigate('/people')}>
          Back to Directory
        </Button>
      </div>
    );
  }

  const commitments = campaignStore.getCommitments().filter((c) => c.relatedPersonId === person.id);
  const meetings = campaignStore.getMeetings().filter((m) => m.participants.some((p) => p.personId === person.id));
  const issues = campaignStore.getIssues().filter((i) => i.relatedPeopleIds.includes(person.id));

  const [editState, setEditState] = useState({
    fullName: person.fullName,
    phone: person.phone,
    alternativePhone: person.alternativePhone || '',
    nationalId: person.nationalId || '',
    email: person.email || '',
    notes: person.notes,
    influenceScore: person.influenceScore,
    county: person.county,
    constituency: person.constituency,
    ward: person.ward,
  });

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    campaignStore.updatePerson(person.id, editState);
    setShowEditModal(false);
  };

  const handleResolveDuplicate = () => {
    campaignStore.updatePerson(person.id, {
      duplicateFlag: false,
      duplicateNotes: undefined,
    });
  };

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-200">
      {/* Top Navigation / Breadcrumb action */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/people')}
          className="flex items-center space-x-2 text-xs text-[#AACBC4] hover:text-[#00DF81] transition-colors cursor-pointer hover:cursor-pointer px-3 py-1.5 rounded-full hover:bg-[#08453A]/50"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to People Registry</span>
        </button>

        <div className="flex items-center space-x-2">
          <Button
            variant="ai"
            size="sm"
            onClick={() => openAiDrawer(`Prepare comprehensive briefing on ${person.fullName}`)}
            icon={<Sparkles className="w-3.5 h-3.5 text-[#00DF81]" />}
          >
            AI Executive Briefing
          </Button>
          {can('people:edit') && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowEditModal(true)}
              icon={<Edit className="w-3.5 h-3.5" />}
            >
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      {/* Duplicate Alert Banner if flagged */}
      {person.duplicateFlag && (
        <div className="p-4 rounded-2xl bg-[#E5A93C]/15 border border-[#E5A93C]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-5 h-5 text-[#E5A93C] shrink-0" />
            <div>
              <p className="text-xs font-semibold text-[#F1F7F6]">
                Potential Identity Conflict / Duplicate Record Detected
              </p>
              <p className="text-xs text-[#AACBC4]">{person.duplicateNotes || 'Incoming field submission matches phone/ID.'}</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={handleResolveDuplicate}>
            Mark Verified & Resolve
          </Button>
        </div>
      )}

      {/* Profile Header Glass Panel */}
      <GlassCard elevated className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#002DF8] via-[#03624C] to-[#00DF81] p-0.5 shadow-lg shrink-0">
              <div className="w-full h-full bg-[#032221] rounded-[14px] flex items-center justify-center text-xl font-bold text-[#00DF81]">
                {person.fullName.charAt(0)}
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-serif-heading text-2xl font-bold text-[#F1F7F6]">
                  {person.fullName}
                </h1>
                <Badge variant="info">{person.category}</Badge>
                <Badge variant={person.status === 'active' ? 'success' : 'neutral'}>
                  {person.status.toUpperCase()}
                </Badge>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-[#AACBC4]">
                <span className="flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-[#00DF81]" />
                  <span>{person.ward}, {person.constituency}, {person.county}</span>
                </span>
                <span>&bull;</span>
                <span className="flex items-center space-x-1">
                  <Phone className="w-3.5 h-3.5 text-[#AACBC4]" />
                  <span className="font-mono text-[#F1F7F6]">{person.phone}</span>
                </span>
                {person.nationalId && (
                  <>
                    <span>&bull;</span>
                    <span className="font-mono">National ID: {person.nationalId}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Influence Score Box */}
          <div className="p-3 rounded-2xl bg-[#08453A]/80 border border-[#00DF81]/30 flex items-center space-x-3 shrink-0">
            <div className="text-right">
              <p className="text-[10px] uppercase font-semibold text-[#AACBC4] tracking-wider">Stakeholder Weight</p>
              <p className="font-serif-heading text-xl font-bold text-[#00DF81]">
                {person.influenceScore} <span className="text-xs text-[#AACBC4]">/ 10</span>
              </p>
            </div>
            <div className="p-2 rounded-xl bg-[#00DF81]/15 text-[#00DF81]">
              <Star className="w-5 h-5 fill-[#00DF81]" />
            </div>
          </div>
        </div>

        {/* Quick Nav Tabs */}
        <div className="flex items-center space-x-2 border-b border-[#AACBC4]/15 pb-2 overflow-x-auto scrollbar-thin">
          {[
            { id: 'overview', label: 'Overview & Context' },
            { id: 'commitments', label: `Pledges & Commitments (${commitments.length})` },
            { id: 'meetings', label: `Meetings & Alignment (${meetings.length})` },
            { id: 'issues', label: `Issues & Grievances (${issues.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 sm:px-4 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap shrink-0 ${
                activeTab === tab.id
                  ? 'bg-[#00DF81]/15 text-[#00DF81] border border-[#00DF81]/30 shadow-sm'
                  : 'text-[#AACBC4] hover:text-[#F1F7F6] hover:bg-[#08453A]/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </GlassCard>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-12 gap-5">
          {/* Notes & Strategic Context */}
          <div className="col-span-12 lg:col-span-8 space-y-5">
            <BentoCard title="Strategic Background & Field Intelligence" eyebrow="Institutional Memory">
              <p className="text-sm text-[#F1F7F6] leading-relaxed whitespace-pre-wrap">
                {person.notes}
              </p>

              <div className="mt-6 pt-4 border-t border-[#AACBC4]/15">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#AACBC4] mb-2">
                  Assigned Classification Tags:
                </p>
                <div className="flex flex-wrap gap-2">
                  {person.tags.map((t) => (
                    <span
                      key={t}
                      className="px-3 py-1 rounded-xl bg-[#08453A] border border-[#00DF81]/30 text-xs text-[#00DF81]"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            </BentoCard>
          </div>

          {/* Quick Stats & Meta */}
          <div className="col-span-12 lg:col-span-4 space-y-5">
            <BentoCard title="Engagement Telemetry" eyebrow="Activity Metrics">
              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-2 border-b border-[#AACBC4]/10">
                  <span className="text-[#AACBC4]">Active Commitments:</span>
                  <span className="font-semibold text-[#F1F7F6]">{commitments.length}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-[#AACBC4]/10">
                  <span className="text-[#AACBC4]">Meetings Attended:</span>
                  <span className="font-semibold text-[#F1F7F6]">{meetings.length}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-[#AACBC4]/10">
                  <span className="text-[#AACBC4]">30-Day Touchpoints:</span>
                  <span className="font-semibold text-[#00DF81]">{person.metrics.interactionsLast30Days} interactions</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-[#AACBC4]">Record Created:</span>
                  <span className="text-[#707D7D] font-mono">{person.createdAt.split('T')[0]}</span>
                </div>
              </div>
            </BentoCard>
          </div>
        </div>
      )}

      {activeTab === 'commitments' && (
        <div className="space-y-3">
          {commitments.length === 0 ? (
            <p className="p-8 text-center text-xs text-[#AACBC4]">No commitments linked to this contact yet.</p>
          ) : (
            commitments.map((c) => (
              <div
                key={c.id}
                className="glass-panel rounded-2xl p-4 flex items-center justify-between border border-[#AACBC4]/20"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <Badge variant={c.status === 'completed' ? 'success' : c.status === 'overdue' ? 'danger' : 'warning'}>
                      {c.status.toUpperCase()}
                    </Badge>
                    <span className="text-xs text-[#AACBC4]">Due: {c.dueDate}</span>
                  </div>
                  <h4 className="text-sm font-semibold text-[#F1F7F6]">{c.title}</h4>
                  <p className="text-xs text-[#AACBC4]">{c.description}</p>
                </div>

                {c.status !== 'completed' && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      campaignStore.completeCommitment(c.id, 'Verified on stakeholder profile page');
                    }}
                  >
                    Mark Done
                  </Button>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'meetings' && (
        <div className="space-y-3">
          {meetings.length === 0 ? (
            <p className="p-8 text-center text-xs text-[#AACBC4]">No recorded meetings with this contact yet.</p>
          ) : (
            meetings.map((m) => (
              <div
                key={m.id}
                onClick={() => navigate(`/meetings/${m.id}`)}
                className="glass-panel rounded-2xl p-4 flex items-center justify-between border border-[#AACBC4]/20 hover:border-[#00DF81]/40 cursor-pointer"
              >
                <div>
                  <Badge variant="neutral">{m.date} at {m.time}</Badge>
                  <h4 className="text-sm font-semibold text-[#F1F7F6] mt-1">{m.title}</h4>
                  <p className="text-xs text-[#AACBC4]">{m.location}</p>
                </div>
                <Button variant="outline" size="sm">
                  View Brief
                </Button>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'issues' && (
        <div className="space-y-3">
          {issues.length === 0 ? (
            <p className="p-8 text-center text-xs text-[#AACBC4]">No active operational issues or grievances linked to this contact.</p>
          ) : (
            issues.map((i) => (
              <div
                key={i.id}
                onClick={() => navigate(`/issues/${i.id}`)}
                className="glass-panel rounded-2xl p-4 flex items-center justify-between border border-[#AACBC4]/20 hover:border-[#E05252]/40 cursor-pointer"
              >
                <div>
                  <Badge variant={i.priority === 'critical' ? 'danger' : 'warning'}>{i.priority.toUpperCase()}</Badge>
                  <h4 className="text-sm font-semibold text-[#F1F7F6] mt-1">{i.title}</h4>
                  <p className="text-xs text-[#AACBC4]">{i.description}</p>
                </div>
                <Button variant="outline" size="sm">
                  View Incident
                </Button>
              </div>
            ))
          )}
        </div>
      )}

      {/* Edit Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Stakeholder Profile"
        subtitle={`Updating records for ${person.fullName}`}
      >
        <form onSubmit={handleUpdate} className="space-y-4">
          <Input
            label="Full Name"
            value={editState.fullName}
            onChange={(e) => setEditState({ ...editState, fullName: e.target.value })}
            required
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Primary Phone"
              value={editState.phone}
              onChange={(e) => setEditState({ ...editState, phone: e.target.value })}
              required
            />
            <Input
              label="National ID"
              value={editState.nationalId}
              onChange={(e) => setEditState({ ...editState, nationalId: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Input
              label="County"
              value={editState.county}
              onChange={(e) => setEditState({ ...editState, county: e.target.value })}
            />
            <Input
              label="Constituency"
              value={editState.constituency}
              onChange={(e) => setEditState({ ...editState, constituency: e.target.value })}
            />
            <Input
              label="Ward"
              value={editState.ward}
              onChange={(e) => setEditState({ ...editState, ward: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#AACBC4] mb-1.5">Strategic Notes</label>
            <textarea
              rows={4}
              value={editState.notes}
              onChange={(e) => setEditState({ ...editState, notes: e.target.value })}
              className="w-full rounded-xl bg-[#032221] border border-[#AACBC4]/25 p-3 text-sm text-[#F1F7F6]"
            />
          </div>
          <div className="flex justify-end space-x-2 pt-4 border-t border-[#AACBC4]/15">
            <Button variant="ghost" type="button" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
