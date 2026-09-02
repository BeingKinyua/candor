import React, { useState, useEffect } from 'react';
import {
  Users,
  Calendar,
  CheckSquare,
  Radio,
  AlertOctagon,
  Sparkles,
  ArrowRight,
  Plus,
  Clock,
  MapPin,
  TrendingUp,
  ShieldCheck,
  AlertTriangle,
  FileCheck,
  ArrowUpRight,
} from 'lucide-react';
import { useNavigation } from '@/src/lib/router/navigationContext';
import { useAuth } from '@/src/lib/auth/authContext';
import { campaignStore } from '@/src/lib/services/store';
import { MetricCard, BentoCard, GlassCard } from '@/src/components/ui/Cards';
import { Button, Badge } from '@/src/components/ui/Controls';

export const OverviewView: React.FC = () => {
  const { navigate, openAiDrawer } = useNavigation();
  const { user } = useAuth();
  const [, setTick] = useState(0);

  useEffect(() => {
    const unsub = campaignStore.subscribe(() => setTick((t) => t + 1));
    return unsub;
  }, []);

  const people = campaignStore.getPeople();
  const meetings = campaignStore.getMeetings();
  const commitments = campaignStore.getCommitments();
  const submissions = campaignStore.getSubmissions();
  const issues = campaignStore.getIssues();
  const auditLogs = campaignStore.getAuditLogs();

  const overdueCommitments = commitments.filter((c) => c.status === 'overdue');
  const pendingSubmissions = submissions.filter((s) => s.status === 'pending_review');
  const criticalIssues = issues.filter((i) => i.priority === 'critical' || i.status === 'escalated');
  const upcomingMeetings = meetings.filter((m) => m.status === 'scheduled');

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-200">
      {/* Executive Command Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-mono tracking-widest text-[#00DF81] uppercase font-semibold">
              Live Operations Intelligence
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#00DF81] animate-ping" />
          </div>
          <h1 className="font-serif-heading text-2xl md:text-3xl font-semibold text-[#F1F7F6] tracking-tight">
            Operational Command Center
          </h1>
          <p className="text-xs md:text-sm text-[#AACBC4] mt-0.5">
            Welcome back, {user?.name}. Regional telemetry and action items across 6 electoral sectors.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="ai"
            size="sm"
            onClick={() => openAiDrawer('Generate executive daily briefing for today’s campaign schedule')}
            icon={<Sparkles className="w-3.5 h-3.5 text-[#00DF81]" />}
          >
            AI Daily Brief
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/field/capture')}
            icon={<Radio className="w-3.5 h-3.5" />}
          >
            Capture Field Form
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/people')}
            icon={<Plus className="w-3.5 h-3.5" />}
          >
            New Contact
          </Button>
        </div>
      </div>

      {/* Critical Overdue / Verification Banner if applicable */}
      {(overdueCommitments.length > 0 || pendingSubmissions.length > 0) && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-[#E05252]/15 via-[#08453A]/60 to-[#032221] border border-[#E05252]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-[#E05252]/20 text-[#E05252] border border-[#E05252]/30">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#F1F7F6]">
                Operational Priority Gates: {overdueCommitments.length} Overdue Pledges &bull; {pendingSubmissions.length} Field Submissions Pending Verification
              </p>
              <p className="text-[11px] text-[#AACBC4]">
                Human verification required before field submissions enter central voter directory.
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/field/submissions')}
              className="text-xs"
            >
              Verify Field Queue ({pendingSubmissions.length})
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => navigate('/commitments')}
              className="text-xs"
            >
              Resolve Overdue ({overdueCommitments.length})
            </Button>
          </div>
        </div>
      )}

      {/* 5-Column Operational KPI Bento Strip */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <MetricCard
          label="Key People"
          value={people.length}
          change="+14% this week"
          changeType="positive"
          subtext="High-influence nodes"
          icon={<Users className="w-5 h-5" />}
          onClick={() => navigate('/people')}
        />

        <MetricCard
          label="Upcoming Meetings"
          value={upcomingMeetings.length}
          change="3 Today"
          changeType="neutral"
          subtext="Strategic alignments"
          icon={<Calendar className="w-5 h-5" />}
          onClick={() => navigate('/meetings')}
        />

        <MetricCard
          label="Active Pledges"
          value={commitments.filter((c) => c.status === 'pending' || c.status === 'overdue').length}
          change={`${overdueCommitments.length} Overdue`}
          changeType={overdueCommitments.length > 0 ? 'negative' : 'positive'}
          subtext="Accountability tracker"
          icon={<CheckSquare className="w-5 h-5" />}
          onClick={() => navigate('/commitments')}
        />

        <MetricCard
          label="Field Verification"
          value={pendingSubmissions.length}
          change="97.4% OCR Conf."
          changeType="positive"
          subtext="Pending human audit"
          icon={<Radio className="w-5 h-5" />}
          onClick={() => navigate('/field/submissions')}
        />

        <MetricCard
          label="Active Issues"
          value={issues.filter((i) => i.status !== 'resolved').length}
          change={`${criticalIssues.length} Critical`}
          changeType={criticalIssues.length > 0 ? 'negative' : 'neutral'}
          subtext="Escalations active"
          icon={<AlertOctagon className="w-5 h-5" />}
          onClick={() => navigate('/issues')}
        />
      </div>

      {/* Main Command Bento Grid */}
      <div className="grid grid-cols-12 gap-5">
        
        {/* Left Column: AI Daily Briefing & Scheduled Sessions (7 cols) */}
        <div className="col-span-12 lg:col-span-7 space-y-5">
          
          {/* AI Intelligence Card */}
          <GlassCard borderAccent className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#AACBC4]/15">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-gradient-to-tr from-[#002DF8] to-[#00DF81] text-[#F1F7F6]">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif-heading text-base font-semibold text-[#F1F7F6]">
                    AI Daily Operational Intelligence
                  </h3>
                  <span className="text-[10px] text-[#00DF81] font-mono">Synthesized 10m ago from 6 data domains</span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => openAiDrawer('Provide full strategic risk breakdown for today')}
                icon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                Deep Brief
              </Button>
            </div>

            <div className="space-y-2.5 text-xs text-[#AACBC4] leading-relaxed">
              <p>
                <strong className="text-[#F1F7F6]">1. Kiambu Agrarian Belt:</strong> Meeting with <strong>Elder Josephat Kariuki</strong> is in 45 minutes at Karuri Community Hall. Recommend addressing overdue feeder road commitment COM-301 early to secure 120 polling marshals.
              </p>
              <p>
                <strong className="text-[#F1F7F6]">2. Eastlands Market Tension:</strong> Issue ISS-501 (Kayole market stall impoundment) has escalated. <strong>Hon. Beatrice Atieno</strong> expects legal update before afternoon caravan.
              </p>
              <p>
                <strong className="text-[#F1F7F6]">3. OCR Telemetry Alert:</strong> Nakuru youth team uploaded Batch BATCH-NBI-2026-088 with 1 duplicate candidate matching John Kamau Karanja.
              </p>
            </div>

            <div className="pt-2 flex flex-wrap gap-2">
              <button
                onClick={() => openAiDrawer('Prepare talking points for Elder Josephat Kariuki meeting')}
                className="px-3 py-1.5 rounded-xl bg-[#08453A] hover:bg-[#09544F] border border-[#00DF81]/30 text-[11px] text-[#00DF81] font-medium transition-colors"
              >
                &ldquo;Prepare talking points for Elder Kariuki&rdquo;
              </button>
              <button
                onClick={() => openAiDrawer('What is the latest status on the Kayole hawkers confiscation?')}
                className="px-3 py-1.5 rounded-xl bg-[#08453A] hover:bg-[#09544F] border border-[#00DF81]/30 text-[11px] text-[#00DF81] font-medium transition-colors"
              >
                &ldquo;Kayole issue escalation brief&rdquo;
              </button>
            </div>
          </GlassCard>

          {/* Today's Scheduled Operations */}
          <BentoCard
            title="Scheduled Engagements Today"
            eyebrow="Chronological Operations"
            icon={<Calendar className="w-4 h-4" />}
            action={
              <Button variant="ghost" size="sm" onClick={() => navigate('/meetings')}>
                View All ({meetings.length})
              </Button>
            }
          >
            <div className="space-y-3">
              {meetings.slice(0, 3).map((m) => (
                <div
                  key={m.id}
                  onClick={() => navigate(`/meetings/${m.id}`)}
                  className="p-3.5 rounded-xl bg-[#06302B]/60 hover:bg-[#08453A] border border-[#AACBC4]/15 hover:border-[#00DF81]/40 transition-all cursor-pointer flex items-start justify-between group"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center space-x-2">
                      <Badge variant={m.status === 'completed' ? 'success' : 'neutral'} size="sm">
                        {m.time} &bull; {m.durationMinutes} min
                      </Badge>
                      <span className="text-[11px] font-medium text-[#AACBC4]">{m.venueType}</span>
                    </div>
                    <h4 className="text-sm font-semibold text-[#F1F7F6] group-hover:text-[#00DF81] transition-colors">
                      {m.title}
                    </h4>
                    <p className="text-xs text-[#AACBC4] flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5 text-[#00DF81] shrink-0" />
                      <span className="truncate max-w-md">{m.location}</span>
                    </p>
                  </div>
                  <div className="p-2 rounded-lg bg-[#032221] text-[#AACBC4] group-hover:text-[#00DF81] group-hover:translate-x-1 transition-all">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
              ))}
            </div>
          </BentoCard>
        </div>

        {/* Right Column: High-Risk Items & Regional Telemetry (5 cols) */}
        <div className="col-span-12 lg:col-span-5 space-y-5">
          
          {/* Urgent Issues & Escalations */}
          <BentoCard
            title="Critical Issues & Field Friction"
            eyebrow="Rapid Response Desk"
            icon={<AlertOctagon className="w-4 h-4 text-[#E05252]" />}
            action={
              <Button variant="ghost" size="sm" onClick={() => navigate('/issues')}>
                Issues Hub
              </Button>
            }
          >
            <div className="space-y-3">
              {issues.slice(0, 3).map((issue) => (
                <div
                  key={issue.id}
                  onClick={() => navigate(`/issues/${issue.id}`)}
                  className="p-3.5 rounded-xl bg-[#06302B]/60 hover:bg-[#08453A] border border-[#AACBC4]/15 hover:border-[#E05252]/40 transition-all cursor-pointer space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <Badge
                      variant={issue.priority === 'critical' ? 'danger' : issue.priority === 'high' ? 'warning' : 'neutral'}
                      size="sm"
                    >
                      {issue.priority.toUpperCase()} PRIORITY
                    </Badge>
                    <span className="text-[10px] text-[#707D7D] font-mono">{issue.status.toUpperCase()}</span>
                  </div>
                  <p className="text-xs font-semibold text-[#F1F7F6] line-clamp-1">{issue.title}</p>
                  <p className="text-[11px] text-[#AACBC4] line-clamp-2">{issue.description}</p>
                  <div className="flex items-center justify-between text-[10px] text-[#707D7D] pt-1 border-t border-[#AACBC4]/10">
                    <span>{issue.location}</span>
                    <span>Assigned: {issue.assignedTo}</span>
                  </div>
                </div>
              ))}
            </div>
          </BentoCard>

          {/* Regional Mobilization Progress */}
          <BentoCard
            title="Regional Field Density"
            eyebrow="Voter Outreach by County"
            icon={<TrendingUp className="w-4 h-4 text-[#00DF81]" />}
          >
            <div className="space-y-3.5 text-xs">
              {[
                { county: 'Kiambu County', target: '85,000', reached: '68,420', pct: 80 },
                { county: 'Nairobi (Eastlands)', target: '120,000', reached: '94,200', pct: 78 },
                { county: 'Nakuru County', target: '65,000', reached: '49,800', pct: 76 },
                { county: 'Mombasa / Coast', target: '50,000', reached: '36,150', pct: 72 },
                { county: 'Machakos / Eastern', target: '45,000', reached: '29,400', pct: 65 },
              ].map((r) => (
                <div key={r.county} className="space-y-1.5">
                  <div className="flex justify-between font-medium">
                    <span className="text-[#F1F7F6]">{r.county}</span>
                    <span className="text-[#00DF81]">{r.reached} / {r.target} ({r.pct}%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#032221] overflow-hidden border border-[#AACBC4]/15">
                    <div
                      className="h-full bg-gradient-to-r from-[#03624C] via-[#00DF81] to-[#2CC295] rounded-full transition-all duration-500"
                      style={{ width: `${r.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </BentoCard>

          {/* Live Immutable Audit Stream Snippet */}
          <BentoCard
            title="Recent Command Audit Stream"
            eyebrow="Cryptographic Ledger"
            icon={<ShieldCheck className="w-4 h-4 text-[#00DF81]" />}
            action={
              <Button variant="ghost" size="sm" onClick={() => navigate('/settings/audit')}>
                Full Audit
              </Button>
            }
          >
            <div className="space-y-2 text-xs">
              {auditLogs.slice(0, 3).map((log) => (
                <div key={log.id} className="p-2.5 rounded-lg bg-[#032221]/80 border border-[#AACBC4]/10 space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-[#F1F7F6]">{log.actorName}</span>
                    <span className="text-[10px] text-[#707D7D] font-mono">{log.domain}</span>
                  </div>
                  <p className="text-[11px] text-[#AACBC4]">{log.action}: <strong className="text-[#F1F7F6]">{log.targetName}</strong></p>
                </div>
              ))}
            </div>
          </BentoCard>

        </div>
      </div>
    </div>
  );
};
