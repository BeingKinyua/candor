import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Plus,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  Video,
} from 'lucide-react';
import { useNavigation } from '@/src/lib/router/navigationContext';
import { useAuth } from '@/src/lib/auth/authContext';
import { campaignStore } from '@/src/lib/services/store';
import { Meeting } from '@/src/types';
import { Button, Badge, Input } from '@/src/components/ui/Controls';
import { Modal } from '@/src/components/ui/Feedback';

export const MeetingsListView: React.FC = () => {
  const { navigate, openAiDrawer } = useNavigation();
  const { can, user } = useAuth();
  const [filter, setFilter] = useState<'all' | 'scheduled' | 'completed'>('all');
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  const meetings = campaignStore.getMeetings();
  const people = campaignStore.getPeople();

  const [newMeeting, setNewMeeting] = useState({
    title: '',
    agenda: '',
    location: '',
    venueType: 'Physical' as 'Physical' | 'Secure Virtual' | 'Hybrid',
    date: new Date().toISOString().split('T')[0],
    time: '10:00',
    durationMinutes: 60,
    status: 'scheduled' as const,
    selectedPersonId: people[0]?.id || '',
  });

  const filteredMeetings = meetings.filter((m) => {
    if (filter === 'all') return true;
    return m.status === filter;
  });

  const handleSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMeeting.title) return;

    const selectedPerson = people.find((p) => p.id === newMeeting.selectedPersonId);

    campaignStore.createMeeting({
      title: newMeeting.title,
      agenda: newMeeting.agenda,
      location: newMeeting.location,
      venueType: newMeeting.venueType,
      date: newMeeting.date,
      time: newMeeting.time,
      durationMinutes: newMeeting.durationMinutes,
      status: 'scheduled',
      leadOrganizer: user?.name || 'Campaign Secretariat',
      leadOrganizerId: user?.id || 'usr-1',
      participants: selectedPerson
        ? [
            { personId: selectedPerson.id, name: selectedPerson.fullName, role: selectedPerson.category, confirmed: true },
            { personId: user?.id || 'usr-1', name: user?.name || 'Lead', role: 'Organizer', confirmed: true },
          ]
        : [{ personId: user?.id || 'usr-1', name: user?.name || 'Lead', role: 'Organizer', confirmed: true }],
      aiPreparationBrief: {
        summary: `Newly scheduled strategic session: ${newMeeting.agenda}`,
        keyObjectives: ['Align field priorities and establish action commitments.'],
        potentialRisks: ['Ensure venue security and clear audio arrangements.'],
        suggestedTalkingPoints: ['Review grassroots voter targets and address regional questions.'],
        historicalContext: 'Community council alignment session.',
      },
    });

    setShowScheduleModal(false);
  };

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-mono tracking-widest text-[#00DF81] uppercase font-semibold">
              Strategic Coordination
            </span>
          </div>
          <h1 className="font-serif-heading text-2xl md:text-3xl font-semibold text-[#F1F7F6]">
            Meetings & Alignment Briefings
          </h1>
          <p className="text-xs md:text-sm text-[#AACBC4] mt-0.5">
            Coordinate interfaith councils, trader associations, elder forums, and mobilization syncs.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="ai"
            size="sm"
            onClick={() => openAiDrawer('Generate briefing for upcoming meetings this week')}
            icon={<Sparkles className="w-3.5 h-3.5 text-[#00DF81]" />}
          >
            AI Schedule Intelligence
          </Button>

          {can('meetings:edit') && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowScheduleModal(true)}
              icon={<Plus className="w-3.5 h-3.5" />}
            >
              Schedule Meeting
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 border-b border-[#AACBC4]/15 pb-2 overflow-x-auto scrollbar-thin">
        {[
          { id: 'all', label: `All Sessions (${meetings.length})` },
          { id: 'scheduled', label: `Upcoming (${meetings.filter((m) => m.status === 'scheduled').length})` },
          { id: 'completed', label: `Concluded (${meetings.filter((m) => m.status === 'completed').length})` },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setFilter(t.id as any)}
            className={`px-3 sm:px-4 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap shrink-0 ${
              filter === t.id
                ? 'bg-[#00DF81]/15 text-[#00DF81] border border-[#00DF81]/30'
                : 'text-[#AACBC4] hover:bg-[#08453A]/40'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Meetings List */}
      <div className="space-y-3.5">
        {filteredMeetings.map((meeting) => (
          <div
            key={meeting.id}
            onClick={() => navigate(`/meetings/${meeting.id}`)}
            className="glass-panel rounded-2xl p-5 border border-[#AACBC4]/20 hover:border-[#00DF81]/40 transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 group"
          >
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Badge variant={meeting.status === 'completed' ? 'success' : 'neutral'} size="sm">
                  {meeting.date} at {meeting.time} ({meeting.durationMinutes} min)
                </Badge>
                <span className="text-xs text-[#00DF81] font-medium flex items-center space-x-1">
                  {meeting.venueType === 'Secure Virtual' ? <Video className="w-3 h-3" /> : <MapPin className="w-3 h-3" />}
                  <span>{meeting.venueType}</span>
                </span>
              </div>

              <h3 className="font-serif-heading text-lg font-semibold text-[#F1F7F6] group-hover:text-[#00DF81] transition-colors">
                {meeting.title}
              </h3>

              <p className="text-xs text-[#AACBC4] line-clamp-1">{meeting.agenda}</p>

              {/* Participants */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {meeting.participants.map((p) => (
                  <span
                    key={p.personId}
                    className="px-2.5 py-1 rounded-lg bg-[#032221] border border-[#AACBC4]/15 text-[11px] text-[#AACBC4] flex items-center space-x-1"
                  >
                    <Users className="w-3 h-3 text-[#00DF81]" />
                    <span>{p.name}</span>
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-3 shrink-0">
              <Button
                variant="outline"
                size="sm"
                className="group-hover:bg-[#00DF81] group-hover:text-[#032221] group-hover:border-[#00DF81]"
              >
                View Brief & Talking Points
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Schedule Modal */}
      <Modal
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        title="Schedule Strategic Alignment Meeting"
        subtitle="Formalize campaign dialogue, assign attendees, and generate AI preparation."
      >
        <form onSubmit={handleSchedule} className="space-y-4">
          <Input
            label="Session Title *"
            value={newMeeting.title}
            onChange={(e) => setNewMeeting({ ...newMeeting, title: e.target.value })}
            placeholder="e.g. Kiambu Agricultural Cooperatives Strategic Alignment"
            required
          />

          <div>
            <label className="block text-xs font-medium text-[#AACBC4] mb-1.5">Strategic Agenda *</label>
            <textarea
              rows={3}
              value={newMeeting.agenda}
              onChange={(e) => setNewMeeting({ ...newMeeting, agenda: e.target.value })}
              placeholder="Outline objectives, expected policy agreements, or community friction points..."
              className="w-full rounded-xl bg-[#032221] border border-[#AACBC4]/25 p-3 text-sm text-[#F1F7F6]"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Date"
              type="date"
              value={newMeeting.date}
              onChange={(e) => setNewMeeting({ ...newMeeting, date: e.target.value })}
              required
            />
            <Input
              label="Time"
              type="time"
              value={newMeeting.time}
              onChange={(e) => setNewMeeting({ ...newMeeting, time: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Location / Venue"
              value={newMeeting.location}
              onChange={(e) => setNewMeeting({ ...newMeeting, location: e.target.value })}
              placeholder="e.g. Karuri Community Hall or Virtual Room"
              required
            />
            <div>
              <label className="block text-xs font-medium text-[#AACBC4] mb-1.5">Primary Key Stakeholder</label>
              <select
                value={newMeeting.selectedPersonId}
                onChange={(e) => setNewMeeting({ ...newMeeting, selectedPersonId: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-[#032221] border border-[#AACBC4]/25 text-sm text-[#F1F7F6]"
              >
                {people.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.fullName} ({p.category})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t border-[#AACBC4]/15">
            <Button variant="ghost" type="button" onClick={() => setShowScheduleModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Confirm & Generate Brief
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
