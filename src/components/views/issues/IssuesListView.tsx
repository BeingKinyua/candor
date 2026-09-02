import React, { useState } from 'react';
import {
  AlertOctagon,
  Search,
  Filter,
  Plus,
  Sparkles,
  MapPin,
  AlertTriangle,
  Clock,
  CheckCircle2,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { useNavigation } from '@/src/lib/router/navigationContext';
import { useAuth } from '@/src/lib/auth/authContext';
import { campaignStore } from '@/src/lib/services/store';
import { IssueCategory, Priority, IssueStatus } from '@/src/types';
import { Button, Badge, Input } from '@/src/components/ui/Controls';
import { Modal } from '@/src/components/ui/Feedback';

export const IssuesListView: React.FC = () => {
  const { navigate, openAiDrawer } = useNavigation();
  const { can, user } = useAuth();
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showLogModal, setShowLogModal] = useState(false);

  const issues = campaignStore.getIssues();
  const people = campaignStore.getPeople();

  const [newIssue, setNewIssue] = useState({
    title: '',
    description: '',
    category: 'Field Friction' as IssueCategory,
    priority: 'high' as Priority,
    location: '',
    assignedTo: user?.name || 'Operations Lead',
  });

  const filtered = issues.filter((i) => {
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      i.title.toLowerCase().includes(q) ||
      i.description.toLowerCase().includes(q) ||
      i.location.toLowerCase().includes(q);

    const matchesPrio = priorityFilter === 'all' || i.priority === priorityFilter;
    const matchesStatus = statusFilter === 'all' || i.status === statusFilter;

    return matchesSearch && matchesPrio && matchesStatus;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIssue.title) return;

    campaignStore.createIssue({
      title: newIssue.title,
      description: newIssue.description,
      category: newIssue.category,
      priority: newIssue.priority,
      status: 'open',
      location: newIssue.location,
      assignedTo: newIssue.assignedTo,
      assignedToId: user?.id || 'usr-1',
      reportedBy: user?.name || 'Field Officer',
      reportedById: user?.id || 'usr-1',
      relatedPeopleIds: [],
      relatedMeetingIds: [],
      relatedCommitmentIds: [],
    });

    setShowLogModal(false);
    setNewIssue({
      title: '',
      description: '',
      category: 'Field Friction',
      priority: 'high',
      location: '',
      assignedTo: user?.name || 'Operations Lead',
    });
  };

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-mono tracking-widest text-[#E05252] uppercase font-semibold">
              Rapid Response Desk
            </span>
          </div>
          <h1 className="font-serif-heading text-2xl md:text-3xl font-semibold text-[#F1F7F6]">
            Operational Issues & Grievances
          </h1>
          <p className="text-xs md:text-sm text-[#AACBC4] mt-0.5">
            Log logistics friction, security threats, vendor blockers, and community grievances in real time.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="ai"
            size="sm"
            onClick={() => openAiDrawer('Synthesize top critical friction points across Nairobi and Kiambu')}
            icon={<Sparkles className="w-3.5 h-3.5 text-[#00DF81]" />}
          >
            AI Threat Brief
          </Button>

          {can('issues:edit') && (
            <Button
              variant="danger"
              size="sm"
              onClick={() => setShowLogModal(true)}
              icon={<Plus className="w-3.5 h-3.5" />}
            >
              Log Incident / Issue
            </Button>
          )}
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="glass-panel rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-3 border border-[#AACBC4]/20">
        <div className="w-full md:w-80">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search incident, location, keywords..."
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2 sm:space-x-3 w-full md:w-auto">
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 rounded-xl bg-[#032221] border border-[#AACBC4]/25 text-xs text-[#F1F7F6]"
          >
            <option value="all">All Priorities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 rounded-xl bg-[#032221] border border-[#AACBC4]/25 text-xs text-[#F1F7F6]"
          >
            <option value="all">All Statuses</option>
            <option value="open">Open</option>
            <option value="investigating">Investigating</option>
            <option value="escalated">Escalated</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      </div>

      {/* Issues List */}
      <div className="space-y-3.5">
        {filtered.map((issue) => (
          <div
            key={issue.id}
            onClick={() => navigate(`/issues/${issue.id}`)}
            className={`glass-panel rounded-2xl p-5 border transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 group ${
              issue.priority === 'critical'
                ? 'border-[#E05252]/50 bg-[#E05252]/5'
                : issue.status === 'resolved'
                ? 'border-[#00DF81]/20 opacity-80'
                : 'border-[#AACBC4]/20 hover:border-[#00DF81]/40'
            }`}
          >
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  variant={
                    issue.priority === 'critical'
                      ? 'danger'
                      : issue.priority === 'high'
                      ? 'warning'
                      : 'neutral'
                  }
                >
                  {issue.priority.toUpperCase()} PRIORITY
                </Badge>

                <Badge variant={issue.status === 'resolved' ? 'success' : issue.status === 'escalated' ? 'danger' : 'neutral'}>
                  {issue.status.toUpperCase()}
                </Badge>

                <span className="text-xs text-[#AACBC4] font-medium">{issue.category}</span>
              </div>

              <h3 className="font-serif-heading text-lg font-semibold text-[#F1F7F6] group-hover:text-[#00DF81] transition-colors">
                {issue.title}
              </h3>

              <p className="text-xs text-[#AACBC4] line-clamp-2 max-w-3xl leading-relaxed">
                {issue.description}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-[#AACBC4] pt-2 border-t border-[#AACBC4]/10">
                <span className="flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-[#00DF81]" />
                  <span>{issue.location}</span>
                </span>
                <span>&bull;</span>
                <span>Assigned: <strong className="text-[#F1F7F6]">{issue.assignedTo}</strong></span>
                <span>&bull;</span>
                <span>Reported by: {issue.reportedBy}</span>
              </div>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              <Button variant="outline" size="sm" className="group-hover:bg-[#00DF81] group-hover:text-[#032221]">
                Open Incident Terminal
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Log Issue Modal */}
      <Modal
        isOpen={showLogModal}
        onClose={() => setShowLogModal(false)}
        title="Log Operational Friction or Threat"
        subtitle="Route immediately to campaign secretariat or security team."
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Incident Title *"
            value={newIssue.title}
            onChange={(e) => setNewIssue({ ...newIssue, title: e.target.value })}
            placeholder="e.g. Rally Sound Permit Delayed by Municipal Council"
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#AACBC4] mb-1.5">Category</label>
              <select
                value={newIssue.category}
                onChange={(e) => setNewIssue({ ...newIssue, category: e.target.value as IssueCategory })}
                className="w-full px-3 py-2.5 rounded-xl bg-[#032221] border border-[#AACBC4]/25 text-sm text-[#F1F7F6]"
              >
                <option value="Field Friction">Field Friction</option>
                <option value="Logistics Breakdown">Logistics Breakdown</option>
                <option value="Security / Threat">Security / Threat</option>
                <option value="Opposition Activity">Opposition Activity</option>
                <option value="Legal & Regulatory">Legal & Regulatory</option>
                <option value="Media & Narrative">Media & Narrative</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#AACBC4] mb-1.5">Urgency Level</label>
              <select
                value={newIssue.priority}
                onChange={(e) => setNewIssue({ ...newIssue, priority: e.target.value as Priority })}
                className="w-full px-3 py-2.5 rounded-xl bg-[#032221] border border-[#AACBC4]/25 text-sm text-[#F1F7F6]"
              >
                <option value="critical">Critical (Immediate Escalation)</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          <Input
            label="Exact Location / Ward / Venue *"
            value={newIssue.location}
            onChange={(e) => setNewIssue({ ...newIssue, location: e.target.value })}
            placeholder="e.g. Karuri Community Center, Kiambu"
            required
          />

          <div>
            <label className="block text-xs font-medium text-[#AACBC4] mb-1.5">Incident Details & Situation Report *</label>
            <textarea
              rows={4}
              value={newIssue.description}
              onChange={(e) => setNewIssue({ ...newIssue, description: e.target.value })}
              placeholder="Detail what happened, who is impacted, and what immediate action is required..."
              className="w-full rounded-xl bg-[#032221] border border-[#AACBC4]/25 p-3 text-sm text-[#F1F7F6] focus:outline-none focus:border-[#00DF81]"
              required
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t border-[#AACBC4]/15">
            <Button variant="ghost" type="button" onClick={() => setShowLogModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" type="submit">
              Log & Dispatch Incident
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
