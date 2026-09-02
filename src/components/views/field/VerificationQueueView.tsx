import React, { useState } from 'react';
import {
  FileCheck,
  Search,
  Filter,
  ArrowLeft,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sparkles,
  Layers,
} from 'lucide-react';
import { useNavigation } from '@/src/lib/router/navigationContext';
import { useAuth } from '@/src/lib/auth/authContext';
import { campaignStore } from '@/src/lib/services/store';
import { Button, Badge, Input } from '@/src/components/ui/Controls';

export const VerificationQueueView: React.FC = () => {
  const { navigate, openAiDrawer } = useNavigation();
  const { can } = useAuth();
  const [filter, setFilter] = useState<'all' | 'pending_review' | 'approved' | 'rejected'>('pending_review');
  const [search, setSearch] = useState('');

  const submissions = campaignStore.getSubmissions();

  const filtered = submissions.filter((s) => {
    const matchesFilter = filter === 'all' || s.status === filter;
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      s.batchNumber.toLowerCase().includes(q) ||
      s.location.county.toLowerCase().includes(q) ||
      s.location.constituency.toLowerCase().includes(q) ||
      s.capturedBy.toLowerCase().includes(q) ||
      s.formType.toLowerCase().includes(q);

    return matchesFilter && matchesSearch;
  });

  const pendingCount = submissions.filter((s) => s.status === 'pending_review').length;

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-mono tracking-widest text-[#00DF81] uppercase font-semibold">
              Quality Assurance & Integrity Gate
            </span>
          </div>
          <h1 className="font-serif-heading text-2xl md:text-3xl font-semibold text-[#F1F7F6]">
            Field Verification Workstation
          </h1>
          <p className="text-xs md:text-sm text-[#AACBC4] mt-0.5">
            Audit scanned physical forms, resolve duplicate flags, and approve records into the master campaign database.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="ai"
            size="sm"
            onClick={() => openAiDrawer('Perform duplicate risk audit across all pending field batches')}
            icon={<Sparkles className="w-3.5 h-3.5 text-[#00DF81]" />}
          >
            AI Batch Telemetry
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="glass-panel rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-3 border border-[#AACBC4]/20">
        <div className="w-full md:w-80">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search batch, location, mobilizer..."
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>

        <div className="flex items-center space-x-2 w-full md:w-auto">
          {[
            { id: 'pending_review', label: `Pending Human Review (${pendingCount})`, isAlert: pendingCount > 0 },
            { id: 'approved', label: `Approved (${submissions.filter((s) => s.status === 'approved').length})` },
            { id: 'rejected', label: `Rejected (${submissions.filter((s) => s.status === 'rejected').length})` },
            { id: 'all', label: `All Batches (${submissions.length})` },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setFilter(t.id as any)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all ${
                filter === t.id
                  ? 'bg-[#00DF81]/15 text-[#00DF81] border border-[#00DF81]/30'
                  : 'text-[#AACBC4] hover:bg-[#08453A]/40'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Submissions List */}
      <div className="space-y-3.5">
        {filtered.map((sub) => (
          <div
            key={sub.id}
            onClick={() => navigate(`/field/submissions/${sub.id}`)}
            className="glass-panel rounded-2xl p-5 border border-[#AACBC4]/20 hover:border-[#00DF81]/40 transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 group"
          >
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  variant={
                    sub.status === 'approved'
                      ? 'success'
                      : sub.status === 'rejected'
                      ? 'danger'
                      : 'warning'
                  }
                >
                  {sub.status.replace('_', ' ').toUpperCase()}
                </Badge>
                <span className="font-mono text-xs font-semibold text-[#00DF81]">{sub.batchNumber}</span>
                <span className="text-xs text-[#AACBC4]">&bull; {sub.formType}</span>
              </div>

              <h3 className="font-serif-heading text-base font-semibold text-[#F1F7F6]">
                {sub.location.ward}, {sub.location.constituency} ({sub.location.county})
              </h3>

              <div className="flex flex-wrap items-center gap-4 text-xs text-[#AACBC4]">
                <span>Captured by: <strong className="text-[#F1F7F6]">{sub.capturedBy}</strong></span>
                <span>&bull;</span>
                <span className="text-[#707D7D] font-mono">{sub.capturedAt.split('T')[0]}</span>
                {sub.extractedFields.length > 0 && (
                  <>
                    <span>&bull;</span>
                    <span>{sub.extractedFields.length} extracted fields</span>
                  </>
                )}
              </div>

              {sub.possibleDuplicate?.isDuplicate && (
                <div className="p-2 rounded-lg bg-[#E5A93C]/15 border border-[#E5A93C]/30 text-xs text-[#E5A93C] flex items-center space-x-1.5 w-fit">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>Duplicate candidate detected: <strong>{sub.possibleDuplicate.matchedPersonName}</strong></span>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              <Button variant="outline" size="sm" className="group-hover:bg-[#00DF81] group-hover:text-[#032221]">
                Launch Side-by-Side Review
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
