import React, { useState } from 'react';
import {
  ArrowLeft,
  AlertOctagon,
  Sparkles,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  User,
  Shield,
  Clock,
  Send,
} from 'lucide-react';
import { useNavigation } from '@/src/lib/router/navigationContext';
import { useAuth } from '@/src/lib/auth/authContext';
import { campaignStore } from '@/src/lib/services/store';
import { IssueStatus } from '@/src/types';
import { Button, Badge, Input } from '@/src/components/ui/Controls';
import { GlassCard, BentoCard } from '@/src/components/ui/Cards';
import { Modal } from '@/src/components/ui/Feedback';

export const IssueDetailView: React.FC<{ issueId: string }> = ({ issueId }) => {
  const { navigate, openAiDrawer } = useNavigation();
  const { can, user } = useAuth();
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [resolutionNote, setResolutionNote] = useState('');

  const issue = campaignStore.getIssue(issueId);

  if (!issue) {
    return (
      <div className="p-8 text-center space-y-4">
        <p className="text-[#AACBC4]">Incident record not found.</p>
        <Button variant="primary" onClick={() => navigate('/issues')}>
          Back to Issues
        </Button>
      </div>
    );
  }

  const handleEscalate = () => {
    campaignStore.updateIssue(issue.id, {
      status: 'escalated',
      priority: 'critical',
    });
  };

  const handleInvestigate = () => {
    campaignStore.updateIssue(issue.id, {
      status: 'investigating',
    });
  };

  const handleResolve = (e: React.FormEvent) => {
    e.preventDefault();
    campaignStore.resolveIssue(issue.id, resolutionNote || 'Resolved by operational response team.');
    setShowResolveModal(false);
  };

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/issues')}
          className="flex items-center space-x-2 text-xs text-[#AACBC4] hover:text-[#00DF81] transition-colors cursor-pointer hover:cursor-pointer px-3 py-1.5 rounded-full hover:bg-[#08453A]/50"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Issues Desk</span>
        </button>

        <div className="flex items-center space-x-2">
          <Button
            variant="ai"
            size="sm"
            onClick={() => openAiDrawer(`Generate tactical remediation plan for incident: "${issue.title}"`)}
            icon={<Sparkles className="w-3.5 h-3.5 text-[#00DF81]" />}
          >
            AI Remediation Plan
          </Button>

          {issue.status !== 'resolved' && can('issues:edit') && (
            <>
              {issue.status !== 'escalated' && (
                <Button variant="danger" size="sm" onClick={handleEscalate}>
                  Escalate Incident
                </Button>
              )}
              {issue.status === 'open' && (
                <Button variant="secondary" size="sm" onClick={handleInvestigate}>
                  Begin Investigation
                </Button>
              )}
              <Button
                variant="primary"
                size="sm"
                onClick={() => setShowResolveModal(true)}
                icon={<CheckCircle2 className="w-3.5 h-3.5" />}
              >
                Log Resolution
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Main Glass Header */}
      <GlassCard elevated className="space-y-4">
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

            <Badge variant={issue.status === 'resolved' ? 'success' : issue.status === 'escalated' ? 'danger' : 'warning'}>
              {issue.status.toUpperCase()}
            </Badge>

            <Badge variant="info">{issue.category}</Badge>
          </div>

          <h1 className="font-serif-heading text-2xl md:text-3xl font-bold text-[#F1F7F6]">
            {issue.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-[#AACBC4]">
            <span className="flex items-center space-x-1">
              <MapPin className="w-3.5 h-3.5 text-[#00DF81]" />
              <span>{issue.location}</span>
            </span>
            <span>&bull;</span>
            <span>Assigned Officer: <strong className="text-[#F1F7F6]">{issue.assignedTo}</strong></span>
            <span>&bull;</span>
            <span>Reported By: {issue.reportedBy} ({issue.createdAt.split('T')[0]})</span>
          </div>
        </div>
      </GlassCard>

      {/* AI Tactical Remediation Card */}
      <GlassCard borderAccent className="space-y-4">
        <div className="flex items-center space-x-2.5 pb-2 border-b border-[#AACBC4]/15">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-[#002DF8] to-[#00DF81] text-[#F1F7F6]">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-serif-heading text-base font-semibold text-[#F1F7F6]">
              AI Strategic De-escalation & Action Recommendations
            </h3>
            <span className="text-[10px] text-[#00DF81] font-mono">Synthesized from historical incident logs</span>
          </div>
        </div>

        <div className="space-y-2 text-xs text-[#AACBC4] leading-relaxed">
          <p>
            <strong className="text-[#F1F7F6]">1. De-escalation Strategy:</strong> Engage local municipal liaison officer before 14:00. If legal rights of stall vendors are in dispute, cite City County Markets Act Section 14.
          </p>
          <p>
            <strong className="text-[#F1F7F6]">2. Stakeholder Contact:</strong> Notify <strong>Hon. Beatrice Atieno</strong> so narrative alignment is maintained ahead of the afternoon market walk.
          </p>
          <p>
            <strong className="text-[#F1F7F6]">3. Media Protocol:</strong> Advise field marshals to avoid confrontation on camera; document impound serial numbers quietly.
          </p>
        </div>
      </GlassCard>

      {/* Incident Description & Resolution Status */}
      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-12 lg:col-span-8 space-y-5">
          <BentoCard title="Situation Report & Field Observation" eyebrow="Incident Dossier">
            <p className="text-sm text-[#F1F7F6] leading-relaxed whitespace-pre-wrap">
              {issue.description}
            </p>

            {issue.resolutionNote && (
              <div className="mt-6 p-4 rounded-xl bg-[#00DF81]/10 border border-[#00DF81]/30 space-y-1">
                <p className="text-xs font-semibold text-[#00DF81] flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Resolution Signed & Concluded:</span>
                </p>
                <p className="text-xs text-[#F1F7F6]">{issue.resolutionNote}</p>
                <p className="text-[10px] text-[#707D7D] font-mono">
                  Signed at: {issue.resolvedAt?.split('T')[0] || 'Today'}
                </p>
              </div>
            )}
          </BentoCard>
        </div>

        <div className="col-span-12 lg:col-span-4 space-y-5">
          <BentoCard title="Incident Metadata" eyebrow="Telemetry">
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-[#AACBC4]/10">
                <span className="text-[#AACBC4]">Incident ID:</span>
                <span className="font-mono text-[#F1F7F6]">{issue.id}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#AACBC4]/10">
                <span className="text-[#AACBC4]">Current Status:</span>
                <span className="font-semibold text-[#00DF81]">{issue.status.toUpperCase()}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#AACBC4]/10">
                <span className="text-[#AACBC4]">Primary Lead:</span>
                <span className="text-[#F1F7F6]">{issue.assignedTo}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-[#AACBC4]">Logged Time:</span>
                <span className="font-mono text-[#707D7D]">{issue.createdAt.replace('T', ' ').slice(0, 16)}</span>
              </div>
            </div>
          </BentoCard>
        </div>
      </div>

      {/* Resolve Modal */}
      <Modal
        isOpen={showResolveModal}
        onClose={() => setShowResolveModal(false)}
        title="Resolve & Close Operational Incident"
        subtitle={`Incident: ${issue.title}`}
      >
        <form onSubmit={handleResolve} className="space-y-4">
          <p className="text-xs text-[#AACBC4]">
            Provide full resolution debrief notes for permanent audit records.
          </p>
          <Input
            label="Resolution Summary *"
            value={resolutionNote}
            onChange={(e) => setResolutionNote(e.target.value)}
            placeholder="e.g. Legal team secured immediate bond release for market chair."
            required
          />
          <div className="flex justify-end space-x-2 pt-4 border-t border-[#AACBC4]/15">
            <Button variant="ghost" type="button" onClick={() => setShowResolveModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Sign Resolution
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
