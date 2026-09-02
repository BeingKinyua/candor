import React, { useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Sparkles,
  Maximize2,
  ZoomIn,
  ShieldCheck,
  Edit2,
  Lock,
  Layers,
} from 'lucide-react';
import { useNavigation } from '@/src/lib/router/navigationContext';
import { useAuth } from '@/src/lib/auth/authContext';
import { campaignStore } from '@/src/lib/services/store';
import { Button, Badge, Input } from '@/src/components/ui/Controls';
import { GlassCard } from '@/src/components/ui/Cards';
import { Modal } from '@/src/components/ui/Feedback';

export const VerificationDetailView: React.FC<{ submissionId: string }> = ({ submissionId }) => {
  const { navigate, openAiDrawer } = useNavigation();
  const { can, user } = useAuth();
  const [activeFieldId, setActiveFieldId] = useState<string | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const sub = campaignStore.getSubmission(submissionId);

  if (!sub) {
    return (
      <div className="p-8 text-center space-y-4">
        <p className="text-[#AACBC4]">Field submission not found.</p>
        <Button variant="primary" onClick={() => navigate('/field/submissions')}>
          Back to Queue
        </Button>
      </div>
    );
  }

  const [fields, setFields] = useState(sub.extractedFields);

  const handleFieldChange = (fieldId: string, newVal: string) => {
    setFields((prev) =>
      prev.map((f) => (f.id === fieldId ? { ...f, value: newVal } : f))
    );
  };

  const handleApprove = () => {
    campaignStore.verifySubmission(sub.id, 'approved');
    navigate('/field/submissions');
  };

  const handleReject = (e: React.FormEvent) => {
    e.preventDefault();
    campaignStore.verifySubmission(sub.id, 'rejected', rejectReason || 'Incomplete or unreadable slip');
    setShowRejectModal(false);
    navigate('/field/submissions');
  };

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/field/submissions')}
          className="flex items-center space-x-2 text-xs text-[#AACBC4] hover:text-[#00DF81] transition-colors cursor-pointer hover:cursor-pointer px-3 py-1.5 rounded-full hover:bg-[#08453A]/50"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Verification Queue</span>
        </button>

        <div className="flex items-center space-x-2">
          <Button
            variant="ai"
            size="sm"
            onClick={() => openAiDrawer(`Analyze OCR confidence & duplicate likelihood for batch ${sub.batchNumber}`)}
            icon={<Sparkles className="w-3.5 h-3.5 text-[#00DF81]" />}
          >
            AI Document Audit
          </Button>

          {sub.status === 'pending_review' && can('field:verify') && (
            <>
              <Button
                variant="danger"
                size="sm"
                onClick={() => setShowRejectModal(true)}
                icon={<XCircle className="w-3.5 h-3.5" />}
              >
                Reject Batch
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleApprove}
                icon={<CheckCircle2 className="w-3.5 h-3.5" />}
              >
                Approve & Ingest
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Main Split-Screen Workstation */}
      <div className="grid grid-cols-12 gap-6">
        
        {/* Left Side: Original Document Viewer (6 cols) */}
        <div className="col-span-12 lg:col-span-6 space-y-4">
          <GlassCard elevated className="space-y-3 p-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#AACBC4]/15 text-xs text-[#AACBC4]">
              <span className="font-semibold text-[#F1F7F6] flex items-center space-x-1.5">
                <Layers className="w-3.5 h-3.5 text-[#00DF81]" />
                <span>Original Camera Capture</span>
              </span>
              <span className="font-mono text-[11px]">{sub.batchNumber}</span>
            </div>

            <div className="relative rounded-2xl overflow-hidden bg-[#000] border border-[#AACBC4]/20 aspect-[4/5] flex items-center justify-center">
              {sub.originalImageUrl ? (
                <img
                  src={sub.originalImageUrl}
                  alt="Scanned slip"
                  className="w-full h-full object-cover filter contrast-125"
                />
              ) : (
                <div className="text-center text-xs text-[#AACBC4]">
                  Digital Native Entry (No raw photo required)
                </div>
              )}

              {/* Highlighted Bounding Boxes */}
              {fields.map((f) => {
                if (!f.boundingBox) return null;
                const isSelected = activeFieldId === f.id;
                return (
                  <div
                    key={f.id}
                    onClick={() => setActiveFieldId(f.id)}
                    style={{
                      left: `${f.boundingBox.x}%`,
                      top: `${f.boundingBox.y}%`,
                      width: `${f.boundingBox.width}%`,
                      height: `${f.boundingBox.height}%`,
                    }}
                    className={`absolute rounded cursor-pointer transition-all border-2 ${
                      isSelected
                        ? 'border-[#00DF81] bg-[#00DF81]/25 ring-2 ring-[#00DF81]'
                        : 'border-[#E5A93C]/70 bg-[#E5A93C]/10 hover:border-[#00DF81]'
                    }`}
                    title={`${f.label}: ${f.value}`}
                  />
                );
              })}
            </div>

            <div className="p-3 rounded-xl bg-[#032221]/80 text-[11px] text-[#AACBC4] flex items-center justify-between border border-[#AACBC4]/10">
              <span>Click bounding boxes on image to highlight corresponding extracted field.</span>
              <span className="text-[#00DF81] font-mono">100% Zoom</span>
            </div>
          </GlassCard>
        </div>

        {/* Right Side: Extracted Fields & Human Verification Form (6 cols) */}
        <div className="col-span-12 lg:col-span-6 space-y-4">
          <GlassCard elevated className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#AACBC4]/15">
              <div>
                <h3 className="font-serif-heading text-lg font-semibold text-[#F1F7F6]">
                  Extracted Structured Fields
                </h3>
                <p className="text-xs text-[#AACBC4]">Review OCR confidence and correct any handwriting misreads.</p>
              </div>
              <Badge variant={sub.status === 'approved' ? 'success' : sub.status === 'rejected' ? 'danger' : 'warning'}>
                {sub.status.toUpperCase()}
              </Badge>
            </div>

            {/* Duplicate Safeguard Alert Box */}
            {sub.possibleDuplicate?.isDuplicate && (
              <div className="p-4 rounded-xl bg-[#E5A93C]/15 border border-[#E5A93C]/35 space-y-2">
                <div className="flex items-center space-x-2 text-[#E5A93C] text-xs font-semibold">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>Duplicate Record Conflict Detected</span>
                </div>
                <p className="text-xs text-[#F1F7F6] leading-relaxed">
                  Matched existing contact: <strong>{sub.possibleDuplicate.matchedPersonName}</strong>
                </p>
                <p className="text-[11px] text-[#AACBC4]">{sub.possibleDuplicate.reason}</p>
                <div className="pt-1 flex items-center space-x-2">
                  <button
                    onClick={() => sub.possibleDuplicate?.matchedPersonId && navigate(`/people/${sub.possibleDuplicate.matchedPersonId}`)}
                    className="text-[11px] text-[#00DF81] hover:underline font-semibold"
                  >
                    View existing contact profile &rarr;
                  </button>
                </div>
              </div>
            )}

            {/* Editable Fields */}
            <div className="space-y-3.5 max-h-[480px] overflow-y-auto pr-1">
              {fields.map((field) => {
                const isSelected = activeFieldId === field.id;
                return (
                  <div
                    key={field.id}
                    onFocus={() => setActiveFieldId(field.id)}
                    className={`p-3.5 rounded-xl border transition-all ${
                      isSelected
                        ? 'border-[#00DF81] bg-[#08453A]/70 shadow-md'
                        : 'border-[#AACBC4]/20 bg-[#032221]/70'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-semibold text-[#F1F7F6]">{field.label}</label>
                      <div className="flex items-center space-x-2">
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                            field.confidence > 0.9
                              ? 'bg-[#00DF81]/20 text-[#00DF81]'
                              : field.confidence > 0.75
                              ? 'bg-[#E5A93C]/20 text-[#E5A93C]'
                              : 'bg-[#E05252]/20 text-[#E05252]'
                          }`}
                        >
                          {Math.round(field.confidence * 100)}% Confidence
                        </span>
                      </div>
                    </div>

                    <input
                      value={field.value}
                      onChange={(e) => handleFieldChange(field.id, e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-[#032221] border border-[#AACBC4]/25 text-sm text-[#F1F7F6] focus:outline-none focus:border-[#00DF81]"
                    />

                    {field.validationWarning && (
                      <p className="text-[11px] text-[#E5A93C] mt-1.5 flex items-center space-x-1">
                        <AlertTriangle className="w-3 h-3 shrink-0" />
                        <span>{field.validationWarning}</span>
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Ingestion Gate Controls */}
            {sub.status === 'pending_review' && (
              <div className="pt-4 border-t border-[#AACBC4]/15 flex items-center justify-between">
                <span className="text-[11px] text-[#707D7D]">
                  Approving creates or merges contact in {sub.location.county} directory.
                </span>

                <div className="flex items-center space-x-2">
                  <Button variant="danger" size="sm" onClick={() => setShowRejectModal(true)}>
                    Reject
                  </Button>
                  <Button variant="primary" size="sm" onClick={handleApprove}>
                    Approve & Ingest
                  </Button>
                </div>
              </div>
            )}
          </GlassCard>
        </div>
      </div>

      {/* Reject Reason Modal */}
      <Modal
        isOpen={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        title="Reject Field Submission"
        subtitle={`Batch ID: ${sub.batchNumber}`}
      >
        <form onSubmit={handleReject} className="space-y-4">
          <p className="text-xs text-[#AACBC4]">
            Specify the reason for rejection (e.g. illegible handwriting, duplicate fraud, missing required phone number).
          </p>
          <Input
            label="Rejection Reason *"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="e.g. Unreadable handwriting in national ID field"
            required
          />
          <div className="flex justify-end space-x-2 pt-4 border-t border-[#AACBC4]/15">
            <Button variant="ghost" type="button" onClick={() => setShowRejectModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" type="submit">
              Confirm Rejection
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
