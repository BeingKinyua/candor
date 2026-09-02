import React from 'react';
import {
  Radio,
  Camera,
  FileCheck,
  AlertTriangle,
  Plus,
  Sparkles,
  ArrowUpRight,
  TrendingUp,
  Clock,
  Layers,
  CheckCircle2,
} from 'lucide-react';
import { useNavigation } from '@/src/lib/router/navigationContext';
import { useAuth } from '@/src/lib/auth/authContext';
import { campaignStore } from '@/src/lib/services/store';
import { MetricCard, BentoCard } from '@/src/components/ui/Cards';
import { Button, Badge } from '@/src/components/ui/Controls';

export const FieldDashboardView: React.FC = () => {
  const { navigate, openAiDrawer } = useNavigation();
  const { can } = useAuth();
  const submissions = campaignStore.getSubmissions();

  const pendingCount = submissions.filter((s) => s.status === 'pending_review').length;
  const approvedCount = submissions.filter((s) => s.status === 'approved').length;
  const duplicateAlerts = submissions.filter((s) => s.possibleDuplicate?.isDuplicate).length;

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-mono tracking-widest text-[#00DF81] uppercase font-semibold">
              Ground Intelligence
            </span>
          </div>
          <h1 className="font-serif-heading text-2xl md:text-3xl font-semibold text-[#F1F7F6]">
            Field Operations & Form Digitization
          </h1>
          <p className="text-xs md:text-sm text-[#AACBC4] mt-0.5">
            Turn physical paper sign-ups, voter pledge sheets, and grievance slips into verified digital intelligence.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="ai"
            size="sm"
            onClick={() => openAiDrawer('Summarize field capture accuracy and top duplicate alerts across all wards')}
            icon={<Sparkles className="w-3.5 h-3.5 text-[#00DF81]" />}
          >
            AI Field Audit
          </Button>

          {can('field:capture') && (
            <>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigate('/field/capture/digital')}
                icon={<Plus className="w-3.5 h-3.5" />}
              >
                Fast Digital Form
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate('/field/capture')}
                icon={<Camera className="w-3.5 h-3.5" />}
              >
                Camera Scanner (OCR)
              </Button>
            </>
          )}
        </div>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Pending Verification"
          value={pendingCount}
          change={`${duplicateAlerts} Potential Duplicate`}
          changeType={pendingCount > 0 ? 'neutral' : 'positive'}
          subtext="Awaiting human sign-off"
          icon={<Clock className="w-5 h-5 text-[#E5A93C]" />}
          onClick={() => navigate('/field/submissions')}
        />

        <MetricCard
          label="Approved & Ingested"
          value={approvedCount}
          change="97.6% OCR Confidence"
          changeType="positive"
          subtext="Integrated into directory"
          icon={<CheckCircle2 className="w-5 h-5 text-[#00DF81]" />}
        />

        <MetricCard
          label="Active Field Cells"
          value="6 Counties"
          change="34 Sub-counties"
          changeType="positive"
          subtext="Nakuru, Kiambu, Nairobi..."
          icon={<Radio className="w-5 h-5" />}
        />

        <MetricCard
          label="Duplicate Safeguard"
          value={`${duplicateAlerts} Flags`}
          change="100% Intercepted"
          changeType="positive"
          subtext="Zero dirty voter records"
          icon={<AlertTriangle className="w-5 h-5 text-[#00DF81]" />}
        />
      </div>

      {/* Active Workstation Trigger Banner */}
      <div className="p-6 rounded-3xl glass-panel-elevated border border-[#00DF81]/30 bg-gradient-to-r from-[#002DF8]/20 via-[#03624C]/60 to-[#032221] shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-left">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#00DF81]/20 text-[#00DF81] text-xs font-semibold border border-[#00DF81]/30">
            <Camera className="w-3.5 h-3.5" />
            <span>High-Speed Optical Document Capture</span>
          </div>
          <h3 className="font-serif-heading text-xl md:text-2xl font-semibold text-[#F1F7F6]">
            Digitize Paper Registration Sheets in Under 60 Seconds
          </h3>
          <p className="text-xs md:text-sm text-[#AACBC4] max-w-xl leading-relaxed">
            Our multi-layer OCR automatically detects voter IDs, phone numbers, and constituency locations with handwriting boundary extraction. Human verification ensures zero dirty data.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
          <Button
            variant="primary"
            size="lg"
            onClick={() => navigate('/field/capture')}
            icon={<Camera className="w-4 h-4" />}
          >
            Launch Camera Scanner
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate('/field/submissions')}
          >
            Open Verification Queue ({pendingCount})
          </Button>
        </div>
      </div>

      {/* Recent Submissions Queue */}
      <BentoCard
        title="Field Ingestion Batches & Submissions"
        eyebrow="Verification Queue"
        icon={<Layers className="w-4 h-4" />}
        action={
          <Button variant="ghost" size="sm" onClick={() => navigate('/field/submissions')}>
            View Full Queue
          </Button>
        }
      >
        <div className="space-y-3">
          {submissions.map((sub) => (
            <div
              key={sub.id}
              onClick={() => navigate(`/field/submissions/${sub.id}`)}
              className="p-4 rounded-xl bg-[#06302B]/60 hover:bg-[#08453A] border border-[#AACBC4]/15 hover:border-[#00DF81]/40 transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-3 group"
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <Badge variant={sub.status === 'approved' ? 'success' : sub.status === 'rejected' ? 'danger' : 'warning'}>
                    {sub.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                  <span className="font-mono text-xs text-[#00DF81]">{sub.batchNumber}</span>
                  <span className="text-xs text-[#AACBC4]">&bull; {sub.formType}</span>
                </div>

                <p className="text-sm font-semibold text-[#F1F7F6]">
                  {sub.location.ward}, {sub.location.constituency} ({sub.location.county})
                </p>

                <p className="text-xs text-[#707D7D]">
                  Captured by <strong className="text-[#AACBC4]">{sub.capturedBy}</strong> &bull; {sub.capturedAt.split('T')[0]}
                </p>
              </div>

              {sub.possibleDuplicate?.isDuplicate && (
                <div className="p-2 rounded-lg bg-[#E5A93C]/15 border border-[#E5A93C]/30 text-xs text-[#E5A93C] flex items-center space-x-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Possible Duplicate Detected</span>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" className="group-hover:bg-[#00DF81] group-hover:text-[#032221]">
                  Verify Record
                </Button>
              </div>
            </div>
          ))}
        </div>
      </BentoCard>
    </div>
  );
};
