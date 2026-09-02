import React, { useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Users,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Shield,
  FileText,
  Zap,
} from 'lucide-react';
import { useNavigation } from '@/src/lib/router/navigationContext';
import { useAuth } from '@/src/lib/auth/authContext';
import { campaignStore } from '@/src/lib/services/store';
import { Button, Badge, Input } from '@/src/components/ui/Controls';
import { GlassCard, BentoCard } from '@/src/components/ui/Cards';
import { Modal } from '@/src/components/ui/Feedback';

export const MeetingDetailView: React.FC<{ meetingId: string }> = ({ meetingId }) => {
  const { navigate, openAiDrawer } = useNavigation();
  const { can, user } = useAuth();
  const [newDecision, setNewDecision] = useState('');
  const [showCommitmentModal, setShowCommitmentModal] = useState(false);
  const [newCommitmentTitle, setNewCommitmentTitle] = useState('');
  const [newCommitmentDue, setNewCommitmentDue] = useState(new Date().toISOString().split('T')[0]);

  const meeting = campaignStore.getMeeting(meetingId);

  if (!meeting) {
    return (
      <div className="p-8 text-center space-y-4">
        <p className="text-[#AACBC4]">Meeting record not found.</p>
        <Button variant="primary" onClick={() => navigate('/meetings')}>
          Back to Meetings
        </Button>
      </div>
    );
  }

  const handleAddDecision = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDecision.trim()) return;

    campaignStore.updateMeeting(meeting.id, {
      decisions: [...meeting.decisions, newDecision.trim()],
    });
    setNewDecision('');
  };

  const handleCreateCommitment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommitmentTitle) return;

    const primaryParticipant = meeting.participants[0];

    const created = campaignStore.createCommitment({
      title: newCommitmentTitle,
      description: `Generated from meeting ${meeting.title}`,
      ownerId: user?.id || 'usr-1',
      ownerName: user?.name || 'Lead Officer',
      relatedPersonId: primaryParticipant?.personId,
      relatedPersonName: primaryParticipant?.name,
      relatedMeetingId: meeting.id,
      relatedMeetingTitle: meeting.title,
      dueDate: newCommitmentDue,
      priority: 'high',
      status: 'pending',
      location: meeting.location,
    });

    campaignStore.updateMeeting(meeting.id, {
      commitmentsGenerated: [...meeting.commitmentsGenerated, created.id],
    });

    setShowCommitmentModal(false);
    setNewCommitmentTitle('');
  };

  const handleCompleteMeeting = () => {
    campaignStore.updateMeeting(meeting.id, { status: 'completed' });
  };

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/meetings')}
          className="flex items-center space-x-2 text-xs text-[#AACBC4] hover:text-[#00DF81] transition-colors cursor-pointer hover:cursor-pointer px-3 py-1.5 rounded-full hover:bg-[#08453A]/50"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Meetings</span>
        </button>

        <div className="flex items-center space-x-2">
          <Button
            variant="ai"
            size="sm"
            onClick={() => openAiDrawer(`Generate real-time talking points and potential objections for: ${meeting.title}`)}
            icon={<Sparkles className="w-3.5 h-3.5 text-[#00DF81]" />}
          >
            AI Talking Points
          </Button>

          {meeting.status !== 'completed' && can('meetings:edit') && (
            <Button variant="primary" size="sm" onClick={handleCompleteMeeting}>
              Conclude Session
            </Button>
          )}
        </div>
      </div>

      {/* Main Glass Header */}
      <GlassCard elevated className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Badge variant={meeting.status === 'completed' ? 'success' : 'neutral'}>
                {meeting.status.toUpperCase()}
              </Badge>
              <span className="text-xs font-medium text-[#00DF81]">{meeting.venueType}</span>
            </div>
            <h1 className="font-serif-heading text-2xl md:text-3xl font-bold text-[#F1F7F6]">
              {meeting.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-xs text-[#AACBC4]">
              <span className="flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5 text-[#00DF81]" />
                <span>{meeting.date} at {meeting.time} ({meeting.durationMinutes} min)</span>
              </span>
              <span>&bull;</span>
              <span className="flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-[#00DF81]" />
                <span>{meeting.location}</span>
              </span>
              <span>&bull;</span>
              <span>Lead Organizer: <strong className="text-[#F1F7F6]">{meeting.leadOrganizer}</strong></span>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* AI Preparation Briefing Card (High-Impact Operational Asset) */}
      {meeting.aiPreparationBrief && (
        <GlassCard borderAccent className="space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#AACBC4]/15">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-xl bg-gradient-to-tr from-[#002DF8] to-[#00DF81] text-[#F1F7F6]">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-serif-heading text-base font-semibold text-[#F1F7F6]">
                  AI Executive Preparation Brief
                </h3>
                <span className="text-[10px] text-[#00DF81] font-mono">Synthesized from historical minutes & pledges</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#032221]/80 border border-[#AACBC4]/15 space-y-2">
            <p className="text-xs uppercase font-semibold tracking-wider text-[#AACBC4]">Executive Summary</p>
            <p className="text-sm text-[#F1F7F6] leading-relaxed">{meeting.aiPreparationBrief.summary}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Objectives */}
            <div className="p-4 rounded-xl bg-[#06302B]/60 border border-[#AACBC4]/15 space-y-2">
              <p className="text-xs uppercase font-semibold tracking-wider text-[#00DF81] flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Key Strategic Objectives</span>
              </p>
              <ul className="space-y-1.5 text-xs text-[#AACBC4]">
                {meeting.aiPreparationBrief.keyObjectives.map((obj, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <span className="text-[#00DF81] font-bold">&bull;</span>
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Potential Risks */}
            <div className="p-4 rounded-xl bg-[#E05252]/10 border border-[#E05252]/25 space-y-2">
              <p className="text-xs uppercase font-semibold tracking-wider text-[#E05252] flex items-center space-x-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Potential Friction Risks</span>
              </p>
              <ul className="space-y-1.5 text-xs text-[#AACBC4]">
                {meeting.aiPreparationBrief.potentialRisks.map((risk, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <span className="text-[#E05252] font-bold">&bull;</span>
                    <span>{risk}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Talking points */}
          <div className="p-4 rounded-xl bg-[#06302B]/60 border border-[#AACBC4]/15 space-y-2">
            <p className="text-xs uppercase font-semibold tracking-wider text-[#F1F7F6]">Suggested Talking Points</p>
            <div className="space-y-2 text-xs text-[#AACBC4]">
              {meeting.aiPreparationBrief.suggestedTalkingPoints.map((tp, i) => (
                <div key={i} className="p-2.5 rounded-lg bg-[#032221] border border-[#AACBC4]/10 text-[#F1F7F6]">
                  &ldquo;{tp}&rdquo;
                </div>
              ))}
            </div>
          </div>
        </GlassCard>
      )}

      {/* Participants & Decisions Section */}
      <div className="grid grid-cols-12 gap-5">
        {/* Participants */}
        <div className="col-span-12 lg:col-span-5 space-y-5">
          <BentoCard title="Attendees & Stakeholders" eyebrow="Delegation Roster" icon={<Users className="w-4 h-4" />}>
            <div className="space-y-2.5">
              {meeting.participants.map((p) => (
                <div
                  key={p.personId}
                  onClick={() => p.personId.startsWith('per-') && navigate(`/people/${p.personId}`)}
                  className="p-3 rounded-xl bg-[#032221] border border-[#AACBC4]/15 flex items-center justify-between hover:border-[#00DF81]/40 transition-colors cursor-pointer"
                >
                  <div className="space-y-0.5">
                    <p className="text-sm font-semibold text-[#F1F7F6]">{p.name}</p>
                    <p className="text-xs text-[#AACBC4]">{p.role}</p>
                  </div>
                  <Badge variant={p.confirmed ? 'success' : 'warning'} size="sm">
                    {p.confirmed ? 'Confirmed' : 'Invited'}
                  </Badge>
                </div>
              ))}
            </div>
          </BentoCard>
        </div>

        {/* Decisions & Generated Action Items */}
        <div className="col-span-12 lg:col-span-7 space-y-5">
          <BentoCard
            title="Recorded Decisions & Pledges"
            eyebrow="Accountability Engine"
            action={
              <Button
                variant="primary"
                size="sm"
                onClick={() => setShowCommitmentModal(true)}
                icon={<Plus className="w-3.5 h-3.5" />}
              >
                Log New Commitment
              </Button>
            }
          >
            <div className="space-y-3">
              {meeting.decisions.length === 0 ? (
                <p className="text-xs text-[#AACBC4] py-3">No formal decisions logged yet. Add one below:</p>
              ) : (
                meeting.decisions.map((d, i) => (
                  <div key={i} className="p-3 rounded-xl bg-[#032221] border border-[#00DF81]/30 flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00DF81] shrink-0 mt-0.5" />
                    <p className="text-xs text-[#F1F7F6] leading-relaxed">{d}</p>
                  </div>
                ))
              )}

              {/* Add Decision Form */}
              <form onSubmit={handleAddDecision} className="flex items-center space-x-2 pt-2">
                <input
                  value={newDecision}
                  onChange={(e) => setNewDecision(e.target.value)}
                  placeholder="Record strategic agreement or consensus point..."
                  className="flex-1 px-3 py-2 rounded-xl bg-[#032221] border border-[#AACBC4]/25 text-xs text-[#F1F7F6] focus:outline-none focus:border-[#00DF81]"
                />
                <Button type="submit" size="sm" variant="secondary">
                  Record
                </Button>
              </form>
            </div>
          </BentoCard>
        </div>
      </div>

      {/* New Commitment Modal */}
      <Modal
        isOpen={showCommitmentModal}
        onClose={() => setShowCommitmentModal(false)}
        title="Generate Operational Commitment"
        subtitle={`Linking pledge to meeting: ${meeting.title}`}
      >
        <form onSubmit={handleCreateCommitment} className="space-y-4">
          <Input
            label="Pledge / Commitment Title *"
            value={newCommitmentTitle}
            onChange={(e) => setNewCommitmentTitle(e.target.value)}
            placeholder="e.g. Deliver Subsidized Fertilizer Logistics Map"
            required
          />
          <Input
            label="Due Date *"
            type="date"
            value={newCommitmentDue}
            onChange={(e) => setNewCommitmentDue(e.target.value)}
            required
          />
          <div className="flex justify-end space-x-2 pt-4 border-t border-[#AACBC4]/15">
            <Button variant="ghost" type="button" onClick={() => setShowCommitmentModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Create & Assign Pledge
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
